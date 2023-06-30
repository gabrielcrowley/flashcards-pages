import { z } from "zod";
import { router, publicProcedure, privateProcedure } from "../trpc";

export const deckRouter = router({
  getListInfo: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.deck.findMany({
      where: {
        userId: ctx.userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        userId: true,
        _count: {
          select: { cards: true },
        },
      },
    });
  }),

  getDeckById: privateProcedure
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

      if (ctx.userId == deck?.userId) {
        return deck;
      }
      return null;
    }),

  createDeck: privateProcedure
    .input(z.object({ name: z.string(), desc: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const createDeck = await ctx.prisma.deck.create({
        data: {
          name: input.name,
          description: input.desc,
          userId: ctx.userId,
        },
      });

      return createDeck;
    }),

  editDeck: privateProcedure
    .input(
      z.object({
        name: z.string(),
        desc: z.string(),
        deckId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId != input.userId) return null;

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

  deleteDeck: privateProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId != input.userId) return null;

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
