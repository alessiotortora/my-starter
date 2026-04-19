import { os } from "../middleware/procedures";
import { healthRouter } from "./health";
import { postsRouter } from "./posts";

export const router = os.router({
  ...healthRouter,
  ...postsRouter,
});

export type Router = typeof router;
