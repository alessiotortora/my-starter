import { oc } from "@orpc/contract";
import { z } from "zod";

const postBase = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  published: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const publishedPost = postBase.extend({
  author: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().nullable(),
  }),
});

export const postsContract = {
  posts: {
    listPublished: oc
      .route({ method: "GET", path: "/posts" })
      .output(z.array(publishedPost)),

    listMine: oc
      .route({ method: "GET", path: "/posts/mine" })
      .output(z.array(postBase)),

    get: oc
      .route({ method: "GET", path: "/posts/{id}" })
      .input(z.object({ id: z.string().uuid() }))
      .output(publishedPost),

    create: oc
      .route({ method: "POST", path: "/posts" })
      .input(
        z.object({
          title: z.string().min(1).max(200),
          content: z.string().nullable().optional(),
          published: z.boolean().optional(),
        })
      )
      .output(postBase),

    update: oc
      .route({ method: "PATCH", path: "/posts/{id}" })
      .input(
        z.object({
          id: z.string().uuid(),
          title: z.string().min(1).max(200).optional(),
          content: z.string().nullable().optional(),
          published: z.boolean().optional(),
        })
      )
      .output(postBase),

    delete: oc
      .route({ method: "DELETE", path: "/posts/{id}" })
      .input(z.object({ id: z.string().uuid() }))
      .output(z.object({ id: z.string().uuid() })),
  },
};
