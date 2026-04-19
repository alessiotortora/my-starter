import { protectedProcedure, publicProcedure } from "../middleware/procedures";
import {
  create,
  getById,
  listMine,
  listPublished,
  remove,
  update,
} from "../services/posts";

export const postsRouter = {
  posts: {
    listPublished: publicProcedure.posts.listPublished.handler(({ context }) =>
      listPublished(context.db)
    ),

    listMine: protectedProcedure.posts.listMine.handler(({ context }) =>
      listMine(context.db, context.session.user.id)
    ),

    get: publicProcedure.posts.get.handler(({ context, input }) =>
      getById(context.db, input.id, context.session?.user.id)
    ),

    create: protectedProcedure.posts.create.handler(({ context, input }) =>
      create(context.db, context.session.user.id, input)
    ),

    update: protectedProcedure.posts.update.handler(({ context, input }) =>
      update(context.db, context.session.user.id, input)
    ),

    delete: protectedProcedure.posts.delete.handler(({ context, input }) =>
      remove(context.db, context.session.user.id, input.id)
    ),
  },
};
