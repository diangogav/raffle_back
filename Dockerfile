FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY .env .
ENV NODE_ENV production

RUN bun install --production

COPY src src
COPY tsconfig.json .

CMD ["bun", "src/index.ts"]

EXPOSE 3000