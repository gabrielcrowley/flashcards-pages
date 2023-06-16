import { z } from "zod";
import { router, procedure } from "../trpc";

export const deckRouter = router({
  getAll: procedure.query(({ ctx }) => {
    return ctx.prisma.deck.findMany();
  }),
});
