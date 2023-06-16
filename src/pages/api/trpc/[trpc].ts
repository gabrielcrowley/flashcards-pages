import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "@/server/api/_app";
import { createTRPCContext } from "@/server/api/trpc";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
