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

  editCard: procedure
    .input(
      z.object({ front: z.string(), back: z.string(), cardId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const editCard = await ctx.prisma.card.update({
        where: {
          id: input.cardId,
        },
        data: {
          front: input.front,
          back: input.back,
        },
      });

      return editCard;
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
