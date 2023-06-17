import { z } from "zod";
import { router, procedure } from "../trpc";

export const deckRouter = router({
  getAllInfo: procedure.query(({ ctx }) => {
    return ctx.prisma.deck.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: { cards: true },
        },
      },
    });
  }),

  getDeckById: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.deck.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
