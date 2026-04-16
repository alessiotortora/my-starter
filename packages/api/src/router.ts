import { implement } from "@orpc/server";
import { contract } from "./contract";

const os = implement(contract);

export const health = os.health.handler(() => ({
  status: "ok",
  timestamp: new Date().toISOString(),
}));

export const router = os.router({
  health,
});

export type Router = typeof router;
