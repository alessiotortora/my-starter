import { createApp } from "./app";

const app = createApp();

export default {
  port: Number(process.env.PORT),
  fetch: app.fetch,
};
