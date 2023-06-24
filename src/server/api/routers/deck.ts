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
      const deck = await ctx.prisma.deck.findUnique({
        where: {
          id: input.id,
        },
        include: {
          cards: {
            orderBy: {
              front: "asc",
            },
          },
        },
      });
      return deck;
    }),

  createDeck: procedure
    .input(z.object({ name: z.string(), desc: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const createDeck = await ctx.prisma.deck.create({
        data: {
          name: input.name,
          description: input.desc,
        },
      });

      return createDeck;
    }),

  editDeck: procedure
    .input(z.object({ name: z.string(), desc: z.string(), deckId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const editDeck = await ctx.prisma.deck.update({
        where: {
          id: input.deckId,
        },
        data: {
          name: input.name,
          description: input.desc,
        },
      });

      return editDeck;
    }),

  deleteDeck: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.card.deleteMany({
        where: {
          deckId: input.id,
        },
      });

      await ctx.prisma.deck.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
