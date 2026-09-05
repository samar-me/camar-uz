import { Telegraf, Markup } from "telegraf";
import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.BOT_TOKEN || "8370052596:AAHe8G4B5DYDCEs3b66-TeQ-wvgq61pZ-vs";
const bot = new Telegraf(token);

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

function readContent(): any {
  try {
    const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading content.json:", err);
    return null;
  }
}

function saveContent(data: any) {
  try {
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8");
    // Auto-commit & push to GitHub so Vercel updates automatically
    syncToGithub();
    return true;
  } catch (err) {
    console.error("Error writing content.json:", err);
    return false;
  }
}

async function syncToGithub() {
  const ghToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "samar-me/camar-uz";

  // If GITHUB_TOKEN is present, use GitHub REST API directly (works 100% on Render without git cli/ssh)
  if (ghToken) {
    try {
      const fileUrl = `https://api.github.com/repos/${repo}/contents/data/content.json`;
      const currentRes = await fetch(fileUrl, {
        headers: {
          Authorization: `Bearer ${ghToken}`,
          "User-Agent": "Samar-Portfolio-Bot",
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!currentRes.ok) {
        console.error("Failed to fetch file SHA from GitHub:", await currentRes.text());
        return;
      }

      const currentData: any = await currentRes.json();
      const sha = currentData.sha;
      const contentBase64 = Buffer.from(fs.readFileSync(CONTENT_PATH, "utf-8")).toString("base64");

      const updateRes = await fetch(fileUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${ghToken}`,
          "User-Agent": "Samar-Portfolio-Bot",
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "chore(cms): update portfolio content via telegram bot",
          content: contentBase64,
          sha: sha,
          branch: "main",
        }),
      });

      if (updateRes.ok) {
        console.log("✅ Successfully updated content.json on GitHub via API!");
      } else {
        console.error("❌ GitHub API update failed:", await updateRes.text());
      }
    } catch (err: any) {
      console.error("GitHub API sync error:", err.message);
    }
  } else {
    // Local fallback: git cli
    exec(
      'git add data/content.json && git commit -m "chore(cms): update portfolio content via telegram bot" && git push origin main',
      { cwd: process.cwd() },
      (error, stdout) => {
        if (error) {
          console.log("Git sync error (local):", error.message);
        } else {
          console.log("Git sync successful (local):", stdout);
        }
      }
    );
  }
}

// User edit sessions: chat_id -> state
const sessions: Record<number, { step: string; temp?: any }> = {};

// ── MAIN MENU ────────────────────────────────────────────────────────────────
function getMainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("👤 Profil ma'lumotlari", "menu_profile")],
    [Markup.button.callback("🚀 Loyihalarni boshqarish", "menu_projects")],
    [Markup.button.callback("📜 Sertifikatlarni boshqarish", "menu_certs")],
    [Markup.button.callback("🧭 Sayohat (Timeline)", "menu_journey")],
    [Markup.button.callback("🔄 Vercel / GitHub bilan sinxronlash", "menu_sync")],
  ]);
}

bot.start(async (ctx) => {
  delete sessions[ctx.chat.id];
  await ctx.reply(
    `👋 Salom, Samar!\n\nBu sizning portfoliongizni boshqarish uchun shaxsiy admin-botingiz.\n\nQaysi bo'limni o'zgartirmoqchisiz? Quyidagi menyudan tanlang:`,
    getMainMenu()
  );
});

// ── PROFILE MENU ─────────────────────────────────────────────────────────────
bot.action("menu_profile", async (ctx) => {
  try {
    await ctx.answerCbQuery();
  } catch (e) {}
  const content = readContent();
  const p = content?.profile || {};
  await ctx.editMessageText(
    `👤 <b>Profil ma'lumotlari:</b>\n\n` +
      `<b>Ism:</b> ${p.name || ""}\n` +
      `<b>Kasb:</b> ${p.role || ""}\n` +
      `<b>Bio:</b> ${p.bio || ""}\n` +
      `<b>Manzil:</b> ${p.location || ""}\n` +
      `<b>Telegram:</b> ${p.contacts?.telegram?.username || ""}\n` +
      `<b>Instagram:</b> ${p.contacts?.instagram?.username || ""}\n` +
      `<b>Email:</b> ${p.contacts?.email || ""}\n` +
      `<b>Telefon:</b> ${p.contacts?.phone || ""}\n\n` +
      `Nimani o'zgartirmoqchisiz?`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("✏️ Ismni o'zgartirish", "edit_name")],
        [Markup.button.callback("✏️ Kasbni o'zgartirish", "edit_role")],
        [Markup.button.callback("✏️ Bioni o'zgartirish", "edit_bio")],
        [Markup.button.callback("✏️ Telefonni o'zgartirish", "edit_phone")],
        [Markup.button.callback("✏️ Emailni o'zgartirish", "edit_email")],
        [Markup.button.callback("✏️ «Haqimda» matnini tahrirlash", "edit_about")],
        [Markup.button.callback("⬅️ Bosh menyu", "menu_main")],
      ]),
    }
  );
});

// Profile Actions
bot.action("edit_name", async (ctx) => {
  sessions[ctx.chat.id] = { step: "waiting_name" };
  await ctx.reply("Yangi ismingizni yuboring:");
});

bot.action("edit_role", async (ctx) => {
  sessions[ctx.chat.id] = { step: "waiting_role" };
  await ctx.reply("Yangi kasb/yo'nalishingizni yuboring (masalan: Full-Stack Developer):");
});

bot.action("edit_bio", async (ctx) => {
  sessions[ctx.chat.id] = { step: "waiting_bio" };
  await ctx.reply("Chap tarafdagi qisqa bio matnini yuboring:");
});

bot.action("edit_phone", async (ctx) => {
  sessions[ctx.chat.id] = { step: "waiting_phone" };
  await ctx.reply("Yangi telefon raqamingizni yuboring (masalan: +998 90 123 45 67):");
});

bot.action("edit_email", async (ctx) => {
  sessions[ctx.chat.id] = { step: "waiting_email" };
  await ctx.reply("Yangi emailingizni yuboring:");
});

bot.action("edit_about", async (ctx) => {
  sessions[ctx.chat.id] = { step: "waiting_about" };
  await ctx.reply("«Haqimda» bo'limi uchun yangi matnni yuboring (har bir xatboshini yangi qatordan yozing):");
});

// ── PROJECTS MENU ────────────────────────────────────────────────────────────
bot.action("menu_projects", async (ctx) => {
  try {
    await ctx.answerCbQuery();
  } catch (e) {}
  const content = readContent();
  const list = content?.projects || [];

  const buttons = list.map((p: any) => [
    Markup.button.callback(`🗑 O'chirish: ${p.title}`, `del_proj_${p.id}`),
  ]);
  buttons.push([Markup.button.callback("➕ Yangi loyiha qo'shish", "add_project")]);
  buttons.push([Markup.button.callback("⬅️ Bosh menyu", "menu_main")]);

  let msg = `🚀 <b>Loyihalar ro'yxati (${list.length} ta):</b>\n\n`;
  list.forEach((p: any, i: number) => {
    msg += `${i + 1}. <b>${p.title}</b> (${p.subtitle})\n   Status: ${p.status}\n   Havola: ${p.link || "yo'q"}\n\n`;
  });

  await ctx.editMessageText(msg, {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard(buttons),
  });
});

bot.action("add_project", async (ctx) => {
  if (ctx.chat) sessions[ctx.chat.id] = { step: "proj_title" };
  await ctx.reply(
    "Yangi loyiha sarlavhasini kiriting (masalan: SavdoAI):"
  );
});

// Delete project handler
bot.action(/del_proj_(.+)/, async (ctx) => {
  const id = ctx.match[1];
  const content = readContent();
  content.projects = (content.projects || []).filter((p: any) => p.id !== id);
  saveContent(content);
  await ctx.answerCbQuery("Loyiha o'chirildi!");
  await ctx.reply("✅ Loyiha o'chirildi va sayt yangilandi!", getMainMenu());
});

// ── CERTIFICATES MENU ────────────────────────────────────────────────────────
bot.action("menu_certs", async (ctx) => {
  try {
    await ctx.answerCbQuery();
  } catch (e) {}
  const content = readContent();
  const list = content?.certificates || [];

  const buttons = list.map((c: any) => [
    Markup.button.callback(`🗑 O'chirish: ${c.title.substring(0, 24)}...`, `del_cert_${c.id}`),
  ]);
  buttons.push([Markup.button.callback("➕ Yangi sertifikat qo'shish", "add_cert")]);
  buttons.push([Markup.button.callback("⬅️ Bosh menyu", "menu_main")]);

  let msg = `📜 <b>Sertifikatlar ro'yxati (${list.length} ta):</b>\n\n`;
  list.forEach((c: any, i: number) => {
    msg += `${i + 1}. <b>${c.title}</b>\n   Tashkilot: ${c.issuer}\n   Sana: ${c.date}\n\n`;
  });

  await ctx.editMessageText(msg, {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard(buttons),
  });
});

bot.action("add_cert", async (ctx) => {
  if (ctx.chat) sessions[ctx.chat.id] = { step: "cert_title" };
  await ctx.reply("Sertifikat nomini kiriting (masalan: Web Development Certificate):");
});

bot.action(/del_cert_(.+)/, async (ctx) => {
  const id = ctx.match[1];
  const content = readContent();
  content.certificates = (content.certificates || []).filter((c: any) => c.id !== id);
  saveContent(content);
  await ctx.answerCbQuery("Sertifikat o'chirildi!");
  await ctx.reply("✅ Sertifikat o'chirildi va sayt yangilandi!", getMainMenu());
});

// ── JOURNEY MENU ─────────────────────────────────────────────────────────────
bot.action("menu_journey", async (ctx) => {
  try {
    await ctx.answerCbQuery();
  } catch (e) {}
  const content = readContent();
  const list = content?.journey || [];

  const buttons: any[] = [];
  list.forEach((j: any, idx: number) => {
    const label = (j.date || j.year) + ": " + j.title.substring(0, 16);
    buttons.push([
      Markup.button.callback(`✏️ Tahrirlash: ${label}...`, `edit_jour_${idx}`),
      Markup.button.callback(`🗑 O'chirish`, `del_jour_${idx}`),
    ]);
  });
  buttons.push([Markup.button.callback("➕ Yangi bosqich qo'shish", "add_journey")]);
  buttons.push([Markup.button.callback("⬅️ Bosh menyu", "menu_main")]);

  let msg = `🧭 <b>Sayohat & Estaliklar (${list.length} ta):</b>\n\n`;
  list.forEach((j: any, i: number) => {
    msg += `${i + 1}. <b>${j.date || j.year}:</b> ${j.title}\n   ${j.description}\n`;
    if (j.media) msg += `   📷 Media: ${j.media}\n`;
    msg += `\n`;
  });

  await ctx.editMessageText(msg, {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard(buttons),
  });
});

bot.action("add_journey", async (ctx) => {
  sessions[ctx.chat.id] = { step: "jour_year" };
  await ctx.reply("Yilni kiriting (masalan: 2026):");
});

bot.action(/edit_jour_(\d+)/, async (ctx) => {
  try {
    await ctx.answerCbQuery();
  } catch (e) {}
  const idx = parseInt(ctx.match[1], 10);
  const content = readContent();
  const item = content?.journey?.[idx];
  if (!item) return ctx.reply("Bunday bosqich topilmadi.");

  await ctx.editMessageText(
    `✏️ <b>Tanlangan estalik:</b>\n\n` +
      `<b>Sana:</b> ${item.date || item.year}\n` +
      `<b>Sarlavha:</b> ${item.title}\n` +
      `<b>Tavsif:</b> ${item.description}\n` +
      `<b>Rasm/Video:</b> ${item.media || "yo'q"}\n\n` +
      `Nimani tahrirlamoqchisiz?`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📅 Sanani o'zgartirish", `edj_date_${idx}`)],
        [Markup.button.callback("🏷 Sarlavhani o'zgartirish", `edj_title_${idx}`)],
        [Markup.button.callback("📝 Tavsifni o'zgartirish", `edj_desc_${idx}`)],
        [Markup.button.callback("📷 Rasm / Video havolasini o'zgartirish", `edj_media_${idx}`)],
        [Markup.button.callback("⬅️ Ortga", "menu_journey")],
      ]),
    }
  );
});

bot.action(/edj_date_(\d+)/, async (ctx) => {
  const idx = parseInt(ctx.match[1], 10);
  if (ctx.chat) sessions[ctx.chat.id] = { step: `waiting_edj_date_${idx}` };
  await ctx.reply("Yangi sanani kiriting (masalan: 2024 Oktabr yoki 24.10.2026):");
});

bot.action(/edj_title_(\d+)/, async (ctx) => {
  const idx = parseInt(ctx.match[1], 10);
  if (ctx.chat) sessions[ctx.chat.id] = { step: `waiting_edj_title_${idx}` };
  await ctx.reply("Yangi sarlavhani kiriting:");
});

bot.action(/edj_desc_(\d+)/, async (ctx) => {
  const idx = parseInt(ctx.match[1], 10);
  if (ctx.chat) sessions[ctx.chat.id] = { step: `waiting_edj_desc_${idx}` };
  await ctx.reply("Yangi batafsil tavsifni yozing:");
});

bot.action(/edj_media_(\d+)/, async (ctx) => {
  const idx = parseInt(ctx.match[1], 10);
  if (ctx.chat) sessions[ctx.chat.id] = { step: `waiting_edj_media_${idx}` };
  await ctx.reply("Yangi rasm yoki video havolasini yuboring (yoki «yo'q» deb yozing):");
});

bot.action(/del_jour_(\d+)/, async (ctx) => {
  const idx = parseInt(ctx.match[1], 10);
  const content = readContent();
  if (content.journey && content.journey[idx]) {
    content.journey.splice(idx, 1);
    saveContent(content);
  }
  await ctx.answerCbQuery("Bosqich o'chirildi!");
  await ctx.reply("✅ Sayohat bosqichi o'chirildi!", getMainMenu());
});

// ── SYNC ACTION ──────────────────────────────────────────────────────────────
bot.action("menu_sync", async (ctx) => {
  await ctx.answerCbQuery("GitHub & Vercel bilan sinxronlanmoqda...");
  syncToGithub();
  await ctx.reply("🚀 O'zgarishlar GitHub'ga yuklanmoqda va Vercel avtomatik yangilanadi!", getMainMenu());
});

// ── BACK TO MAIN ─────────────────────────────────────────────────────────────
bot.action("menu_main", async (ctx) => {
  delete sessions[ctx.chat.id];
  await ctx.editMessageText("Boshqaruv menyusi:", getMainMenu());
});

// ── TEXT INPUT MESSAGE HANDLER ───────────────────────────────────────────────
bot.on("text", async (ctx) => {
  const session = sessions[ctx.chat.id];
  if (!session) {
    return ctx.reply("Menyudan bo'limni tanlang:", getMainMenu());
  }

  const text = ctx.message.text.trim();
  const content = readContent();

  switch (session.step) {
    // Profile Updates
    case "waiting_name":
      content.profile.name = text;
      saveContent(content);
      delete sessions[ctx.chat.id];
      await ctx.reply(`✅ Ism muvaffaqiyatli yangilandi: *${text}*`, {
        parse_mode: "Markdown",
        ...getMainMenu(),
      });
      break;

    case "waiting_role":
      content.profile.role = text;
      saveContent(content);
      delete sessions[ctx.chat.id];
      await ctx.reply(`✅ Kasb yangilandi: *${text}*`, {
        parse_mode: "Markdown",
        ...getMainMenu(),
      });
      break;

    case "waiting_bio":
      content.profile.bio = text;
      saveContent(content);
      delete sessions[ctx.chat.id];
      await ctx.reply(`✅ Bio yangilandi: *${text}*`, {
        parse_mode: "Markdown",
        ...getMainMenu(),
      });
      break;

    case "waiting_phone":
      content.profile.contacts.phone = text;
      content.profile.contacts.phoneRaw = text.replace(/[^0-9+]/g, "");
      saveContent(content);
      delete sessions[ctx.chat.id];
      await ctx.reply(`✅ Telefon raqami yangilandi: *${text}*`, {
        parse_mode: "Markdown",
        ...getMainMenu(),
      });
      break;

    case "waiting_email":
      content.profile.contacts.email = text;
      saveContent(content);
      delete sessions[ctx.chat.id];
      await ctx.reply(`✅ Email yangilandi: *${text}*`, {
        parse_mode: "Markdown",
        ...getMainMenu(),
      });
      break;

    case "waiting_about":
      content.profile.aboutParagraphs = text.split("\n").filter((p) => p.trim().length > 0);
      saveContent(content);
      delete sessions[ctx.chat.id];
      await ctx.reply(`✅ «Haqimda» matni muvaffaqiyatli yangilandi!`, getMainMenu());
      break;

    // Add Project Steps
    case "proj_title":
      sessions[ctx.chat.id] = { step: "proj_subtitle", temp: { title: text, id: text.toLowerCase().replace(/[^a-z0-9]/g, "-") } };
      await ctx.reply("Loyiha qisqa tavsifi / yo'nalishini kiriting (masalan: Restoran avtomatlashtirish tizimi):");
      break;

    case "proj_subtitle":
      session.temp.subtitle = text;
      sessions[ctx.chat.id] = { step: "proj_desc", temp: session.temp };
      await ctx.reply("Batafsil tavsifini yozing (nima vazifa bajaradi):");
      break;

    case "proj_desc":
      session.temp.description = text;
      sessions[ctx.chat.id] = { step: "proj_link", temp: session.temp };
      await ctx.reply("Loyihaning jonli havolasini kiriting (masalan: https://mening-loyiham.uz yoki «yo'q» deb yozing):");
      break;

    case "proj_link":
      session.temp.link = text.toLowerCase() === "yo'q" ? null : text;
      sessions[ctx.chat.id] = { step: "proj_tags", temp: session.temp };
      await ctx.reply("Texnologik teglarni vergul bilan kiriting (masalan: Next.js, TypeScript, AI):");
      break;

    case "proj_tags":
      session.temp.tags = text.split(",").map((t) => t.trim()).filter(Boolean);
      session.temp.image = "/restnova-preview.svg";
      session.temp.status = "Live";
      content.projects.push(session.temp);
      saveContent(content);
      delete sessions[ctx.chat.id];
      await ctx.reply(`🎉 *${session.temp.title}* loyihasi muvaffaqiyatli qo'shildi va saytga chiqarildi!`, {
        parse_mode: "Markdown",
        ...getMainMenu(),
      });
      break;

    // Add Certificate Steps
    case "cert_title":
      sessions[ctx.chat.id] = { step: "cert_issuer", temp: { title: text, id: "cert-" + Date.now() } };
      await ctx.reply("Sertifikatni bergan tashkilotni kiriting (masalan: IT Park, Digital.uz):");
      break;

    case "cert_issuer":
      session.temp.issuer = text;
      sessions[ctx.chat.id] = { step: "cert_date", temp: session.temp };
      await ctx.reply("Berilgan sanani kiriting (masalan: 2026 Avgust):");
      break;

    case "cert_date":
      session.temp.date = text;
      session.temp.location = "O'zbekiston";
      sessions[ctx.chat.id] = { step: "cert_desc", temp: session.temp };
      await ctx.reply("Sertifikat haqida qisqacha ma'lumot yozing:");
      break;

    case "cert_desc":
      session.temp.description = text;
      sessions[ctx.chat.id] = { step: "cert_url", temp: session.temp };
      await ctx.reply("Sertifikat PDF / Rasm havolasini kiriting (yoki «yo'q» deng):");
      break;

    case "cert_url":
      session.temp.fileUrl = text.toLowerCase() === "yo'q" ? "#" : text;
      session.temp.tags = ["Sertifikat", "Yutuq"];
      content.certificates.push(session.temp);
      saveContent(content);
      delete sessions[ctx.chat.id];
      await ctx.reply(`🎉 *${session.temp.title}* sertifikati muvaffaqiyatli qo'shildi!`, {
        parse_mode: "Markdown",
        ...getMainMenu(),
      });
      break;

    // Add Journey Steps
    case "jour_year":
      sessions[ctx.chat.id] = { step: "jour_title", temp: { date: text, year: text } };
      await ctx.reply("Ushbu bosqich / estalik sarlavhasini kiriting (masalan: Qarshi Milliy AI Hakatonida ishtirok):");
      break;

    case "jour_title":
      session.temp.title = text;
      sessions[ctx.chat.id] = { step: "jour_desc", temp: session.temp };
      await ctx.reply("Ushbu voqea haqida batafsil tavsif yozing:");
      break;

    case "jour_desc":
      session.temp.description = text;
      sessions[ctx.chat.id] = { step: "jour_media", temp: session.temp };
      await ctx.reply("Estalik uchun rasm yoki video havolasini yuboring (masalan: https://... yoki «yo'q» deb yozing):");
      break;

    case "jour_media":
      if (text.toLowerCase() !== "yo'q" && text.startsWith("http")) {
        session.temp.media = text;
        session.temp.mediaType = text.endsWith(".mp4") || text.includes("video") ? "video" : "image";
      }
      content.journey.push(session.temp);
      saveContent(content);
      delete sessions[ctx.chat.id];
      await ctx.reply(`🎉 Yangi estalik / sayohat bosqichi muvaffaqiyatli qo'shildi!`, getMainMenu());
      break;

    default:
      // Check dynamic journey edit steps: waiting_edj_[field]_[idx]
      if (session.step.startsWith("waiting_edj_")) {
        const parts = session.step.replace("waiting_edj_", "").split("_");
        const field = parts[0];
        const idx = parseInt(parts[1], 10);
        if (content.journey && content.journey[idx]) {
          if (field === "date") {
            content.journey[idx].date = text;
            content.journey[idx].year = text;
          } else if (field === "title") {
            content.journey[idx].title = text;
          } else if (field === "desc") {
            content.journey[idx].description = text;
          } else if (field === "media") {
            if (text.toLowerCase() === "yo'q") {
              delete content.journey[idx].media;
              delete content.journey[idx].mediaType;
            } else {
              content.journey[idx].media = text;
              content.journey[idx].mediaType = text.endsWith(".mp4") || text.includes("video") ? "video" : "image";
            }
          }
          saveContent(content);
          delete sessions[ctx.chat.id];
          await ctx.reply("✅ Estalik muvaffaqiyatli tahrirlandi va yangilandi!", getMainMenu());
          break;
        }
      }

      delete sessions[ctx.chat.id];
      await ctx.reply("Menyudan kerakli amalni tanlang:", getMainMenu());
      break;
  }
});

// Health check HTTP server for Render Web Service
const PORT = process.env.PORT || 3001;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Samar Portfolio Telegram CMS Bot is alive & running 24/7!\n");
});

server.listen(PORT, () => {
  console.log(`📡 Health-check server listening on port ${PORT}`);
});

// Launch bot
bot.launch().then(() => {
  console.log("🚀 Telegram CMS Bot ishga tushdi!");
}).catch((err) => {
  console.error("Bot launch error:", err);
});

process.once("SIGINT", () => {
  server.close();
  bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
  server.close();
  bot.stop("SIGTERM");
});
