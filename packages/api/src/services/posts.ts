import { ORPCError } from "@orpc/server";
import type { Database } from "@repo/db";
import { posts, user } from "@repo/db";
import { and, desc, eq } from "drizzle-orm";

export interface CreatePostInput {
  content?: string | null;
  published?: boolean;
  title: string;
}

export interface UpdatePostInput {
  content?: string | null;
  id: string;
  published?: boolean;
  title?: string;
}

export async function listPublished(db: Database) {
  const rows = await db
    .select({
      id: posts.id,
      userId: posts.userId,
      title: posts.title,
      content: posts.content,
      published: posts.published,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      author: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
    })
    .from(posts)
    .innerJoin(user, eq(posts.userId, user.id))
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt));

  return rows;
}

export function listMine(db: Database, userId: string) {
  return db
    .select()
    .from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt));
}

export async function getById(db: Database, id: string, viewerUserId?: string) {
  const [row] = await db
    .select({
      id: posts.id,
      userId: posts.userId,
      title: posts.title,
      content: posts.content,
      published: posts.published,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      author: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
    })
    .from(posts)
    .innerJoin(user, eq(posts.userId, user.id))
    .where(eq(posts.id, id))
    .limit(1);

  if (!row) {
    throw new ORPCError("NOT_FOUND");
  }

  if (!row.published && row.userId !== viewerUserId) {
    throw new ORPCError("NOT_FOUND");
  }

  return row;
}

export async function create(
  db: Database,
  userId: string,
  input: CreatePostInput
) {
  const [row] = await db
    .insert(posts)
    .values({
      userId,
      title: input.title,
      content: input.content ?? null,
      published: input.published ?? false,
    })
    .returning();

  if (!row) {
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Failed to create post",
    });
  }

  return row;
}

export async function update(
  db: Database,
  userId: string,
  input: UpdatePostInput
) {
  await assertOwnership(db, input.id, userId);

  const { id, ...patch } = input;

  const [row] = await db
    .update(posts)
    .set(patch)
    .where(and(eq(posts.id, id), eq(posts.userId, userId)))
    .returning();

  if (!row) {
    throw new ORPCError("NOT_FOUND");
  }

  return row;
}

export async function remove(db: Database, userId: string, id: string) {
  await assertOwnership(db, id, userId);

  const [row] = await db
    .delete(posts)
    .where(and(eq(posts.id, id), eq(posts.userId, userId)))
    .returning({ id: posts.id });

  if (!row) {
    throw new ORPCError("NOT_FOUND");
  }

  return row;
}

export async function assertOwnership(
  db: Database,
  postId: string,
  userId: string
) {
  const [row] = await db
    .select({ userId: posts.userId })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (!row) {
    throw new ORPCError("NOT_FOUND");
  }

  if (row.userId !== userId) {
    throw new ORPCError("FORBIDDEN");
  }
}
