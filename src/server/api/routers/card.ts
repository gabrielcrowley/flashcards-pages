import { router, procedure } from "../trpc";
import { z } from "zod";

export const cardRouter = router({
  createCard: procedure
    .input(
      z.object({ front: z.string(), back: z.string(), deckId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const createCard = ctx.prisma.card.create({
        data: {
          front: input.front,
          back: input.back,
          deckId: input.deckId,
        },
      });

      return createCard;
    }),

  deleteCard: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.card.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
