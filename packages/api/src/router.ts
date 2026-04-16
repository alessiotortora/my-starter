import { implement } from "@orpc/server";
import type { Context } from "./context";
import { contract } from "./contract";

const os = implement(contract).$context<Context>();

export const health = os.health.handler(({ context }) => {
  return context.checkHealth();
});

export const router = os.router({
  health,
});

export type Router = typeof router;
