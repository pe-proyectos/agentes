import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 3000;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || "";

async function notifyDiscord(entry: { name: string; email: string; phone?: string | null; company?: string | null; agentType: string; message?: string | null }) {
  if (!DISCORD_WEBHOOK) return;
  try {
    const fields = [
      { name: "👤 Nombre", value: entry.name, inline: true },
      { name: "📧 Email", value: entry.email, inline: true },
      { name: "🤖 Agente", value: entry.agentType, inline: true },
    ];
    if (entry.phone) fields.push({ name: "📱 WhatsApp", value: entry.phone, inline: true });
    if (entry.company) fields.push({ name: "🏢 Empresa", value: entry.company, inline: true });
    if (entry.message) fields.push({ name: "💬 Mensaje", value: entry.message, inline: false });
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "🚀 Nuevo lead en AGENTES",
          color: 0x25D366,
          fields,
          timestamp: new Date().toISOString(),
        }],
      }),
    });
  } catch (e) {
    console.error("Discord webhook error:", e);
  }
}

const app = new Elysia({ prefix: "/api" })
  .use(cors())
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .post(
    "/waitlist",
    async ({ body }) => {
      const entry = await prisma.waitlistEntry.create({
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone || null,
          company: body.company || null,
          agentType: body.agentType,
          message: body.message || null,
        },
      });
      notifyDiscord(entry);
      return { success: true, id: entry.id };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: "email" }),
        phone: t.Optional(t.String()),
        company: t.Optional(t.String()),
        agentType: t.String({ minLength: 1 }),
        message: t.Optional(t.String()),
      }),
    }
  )
  .get("/waitlist", async ({ headers }) => {
    const token = headers["x-admin-token"];
    if (token !== process.env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const entries = await prisma.waitlistEntry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { entries, total: entries.length };
  })
  .listen(PORT);

console.log(`🚀 Agentes API running on port ${PORT}`);
