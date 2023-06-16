import { z } from 'zod';
import { procedure, router } from '../trpc';

export const appRouter = router({
  hello : procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `Hello ${opts.input.text}`,
      };
    }),
});

// Export the type definition of the API
export type AppRouter = typeof appRouter;