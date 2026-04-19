import { createApiClient } from "@repo/api/client";
import { ENV } from "varlock/env";

const { client, orpc } = createApiClient(ENV.BETTER_AUTH_URL);

export { client, orpc };
