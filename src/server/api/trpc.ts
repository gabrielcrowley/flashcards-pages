import { TRPCError, initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "../db";
import { getAuth } from "@clerk/nextjs/server";

type CreateContextOptions = Record<string, never>;

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

const createInnerTRPCContext = ({ auth }: AuthContext) => {
  return {
    auth,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return createInnerTRPCContext({ auth: getAuth(opts.req) });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError,
      },
    };
  },
});

export const router = t.router;

export const publicProcedure = t.procedure;

// Auth middleware
const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      userId: ctx.auth.userId,
    },
  });
});

export const privateProcedure = t.procedure.use(isAuthed);
