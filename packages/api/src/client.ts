import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { contract } from "./contract";

export function createApiClient(baseUrl: string) {
  const link = new RPCLink({
    url: `${baseUrl}/rpc`,
  });

  const client: ContractRouterClient<typeof contract> = createORPCClient(link);
  const orpc = createTanstackQueryUtils(client);

  return { client, orpc };
}
