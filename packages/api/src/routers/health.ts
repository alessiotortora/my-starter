import { publicProcedure } from "../middleware/procedures";

export const healthRouter = {
  health: publicProcedure.health.handler(({ context }) =>
    context.checkHealth()
  ),
};
