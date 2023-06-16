import { deckRouter } from "./routers/deck";
import { router } from "./trpc";

// Primary router on the server where all other routers are included
export const appRouter = router({
  deck: deckRouter,
});

// Export the type definition of the API
export type AppRouter = typeof appRouter;
