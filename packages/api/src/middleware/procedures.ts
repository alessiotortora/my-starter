import { implement, ORPCError } from "@orpc/server";
import { contract } from "../contracts";
import type { Context } from "./context";

export const os = implement(contract).$context<Context>();

const requireAuth = os.middleware(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      session: context.session,
    },
  });
});

export const publicProcedure = os;
export const protectedProcedure = os.use(requireAuth);
