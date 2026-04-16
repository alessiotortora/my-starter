import { oc } from "@orpc/contract";
import { z } from "zod";

const serviceStatus = z.enum(["up", "down"]);

export const contract = {
  health: oc.route({ method: "GET", path: "/health" }).output(
    z.object({
      status: z.enum(["healthy", "degraded"]),
      services: z.object({
        server: serviceStatus,
        database: serviceStatus,
        auth: serviceStatus,
      }),
      timestamp: z.string(),
    })
  ),
};
