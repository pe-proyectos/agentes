FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

COPY prisma ./prisma
RUN bunx prisma generate

COPY src ./src

EXPOSE 3000
CMD ["sh", "-c", "bunx prisma db push --skip-generate && bun run src/index.ts"]
