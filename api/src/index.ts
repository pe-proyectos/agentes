import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 3000;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || "";
const resend = new Resend(process.env.RESEND_API_KEY || "");

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

const AGENT_TYPE_LABELS: Record<string, string> = {
  "atencion-cliente": "Atención al Cliente",
  "ventas": "Ventas y Prospección",
  "reservas": "Reservas y Citas",
  "cobranzas": "Cobranzas",
  "soporte": "Soporte Técnico",
  "custom": "Agente Personalizado",
};

async function sendWelcomeEmail(entry: { name: string; email: string; phone?: string | null; agentType: string }) {
  if (!process.env.RESEND_API_KEY) return;
  const firstName = entry.name.split(" ")[0];
  const agentLabel = AGENT_TYPE_LABELS[entry.agentType] || entry.agentType;
  const whatsappLink = "https://wa.me/51987654321?text=" + encodeURIComponent(`Hola, me registré en AGENTES para ${agentLabel}. Mi nombre es ${entry.name}.`);

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:16px;overflow:hidden;border:1px solid #222;">

<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#111 0%,#1a1a1a 100%);padding:40px 40px 30px;text-align:center;border-bottom:2px solid #25D366;">
  <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">AGENTES</h1>
  <p style="margin:4px 0 0;font-size:13px;color:#25D366;letter-spacing:2px;text-transform:uppercase;">by Luminari</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:40px;">
  <h2 style="margin:0 0 20px;font-size:22px;color:#ffffff;">¡Hola ${firstName}! 👋</h2>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#cccccc;">
    Recibimos tu solicitud para implementar un agente de IA en tu negocio. ¡Estamos emocionados de ayudarte a automatizar y escalar!
  </p>

  <!-- Agent type card -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr><td style="background:#1a1a1a;border:1px solid #25D366;border-radius:12px;padding:20px;">
    <p style="margin:0 0 4px;font-size:12px;color:#25D366;text-transform:uppercase;letter-spacing:1px;">Agente solicitado</p>
    <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">🤖 ${agentLabel}</p>
  </td></tr>
  </table>

  <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#cccccc;">
    <strong style="color:#ffffff;">¿Qué sigue?</strong> Un especialista de nuestro equipo se pondrá en contacto contigo dentro de las próximas <strong style="color:#25D366;">24 horas</strong> por WhatsApp para coordinar una demo personalizada.
  </p>

  <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#cccccc;">
    Además, tendrás acceso a una <strong style="color:#25D366;">prueba gratuita de 3 días</strong> para que veas los resultados antes de comprometerte.
  </p>

  <!-- CTA Button -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
  <tr><td align="center">
    <a href="${whatsappLink}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 32px;border-radius:8px;">
      💬 Escríbenos por WhatsApp
    </a>
  </td></tr>
  </table>

  <p style="margin:0;font-size:14px;line-height:1.6;color:#888888;">
    Si tienes alguna pregunta mientras tanto, no dudes en responder a este correo o escribirnos directamente por WhatsApp.
  </p>
</td></tr>

<!-- Footer -->
<tr><td style="padding:24px 40px;border-top:1px solid #222;text-align:center;">
  <p style="margin:0;font-size:12px;color:#555555;">
    © 2026 Luminari · agentes.luminari.agency
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`;

  try {
    console.log(`📧 Attempting to send welcome email to ${entry.email} (API key present: ${!!process.env.RESEND_API_KEY})`);
    const result = await resend.emails.send({
      from: "AGENTES by Luminari <noreply@luminari.agency>",
      to: entry.email,
      subject: "🚀 ¡Recibimos tu solicitud! — AGENTES by Luminari",
      html,
    });
    console.log(`✉️ Welcome email sent to ${entry.email}`, JSON.stringify(result));
  } catch (e) {
    console.error("Resend email error:", e);
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
      // Fire-and-forget but log errors
      notifyDiscord(entry).catch(e => console.error("Discord notify failed:", e));
      sendWelcomeEmail(entry).catch(e => console.error("Welcome email failed:", e));
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
  .delete("/waitlist/:id", async ({ params, headers }) => {
    const token = headers["x-admin-token"];
    if (token !== process.env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    await prisma.waitlistEntry.delete({ where: { id: params.id } });
    return { success: true };
  })
  .get("/waitlist/stats", async ({ headers }) => {
    const token = headers["x-admin-token"];
    if (token !== process.env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const total = await prisma.waitlistEntry.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await prisma.waitlistEntry.count({ where: { createdAt: { gte: today } } });
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const weekCount = await prisma.waitlistEntry.count({ where: { createdAt: { gte: weekAgo } } });
    const byAgent = await prisma.waitlistEntry.groupBy({ by: ["agentType"], _count: true, orderBy: { _count: { agentType: "desc" } } });
    return { total, today: todayCount, week: weekCount, byAgent };
  })
  .listen(PORT);

console.log(`🚀 Agentes API running on port ${PORT}`);
