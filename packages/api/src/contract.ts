import { oc } from "@orpc/contract";
import { z } from "zod";

export const contract = {
  health: oc
    .route({ method: "GET", path: "/health" })
    .output(z.object({ status: z.string(), timestamp: z.string() })),
};
