import { healthContract } from "./health";
import { postsContract } from "./posts";

export const contract = {
  ...healthContract,
  ...postsContract,
};
