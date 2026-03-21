import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 3000;

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
          company: body.company || null,
          agentType: body.agentType,
          message: body.message || null,
        },
      });
      return { success: true, id: entry.id };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: "email" }),
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
