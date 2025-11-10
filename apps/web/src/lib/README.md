# oRPC + TanStack Query Integration Guide

## Setup: Avoiding Query Key Conflicts

When creating TanStack Query utils, you can specify a `path` option to avoid key conflicts when you have multiple clients. This is especially useful in monorepos or when merging multiple routers.

### Why Use `path`?

TanStack Query uses query keys to identify and cache queries. If you have multiple clients (e.g., `userClient`, `postClient`), they might generate conflicting keys. The `path` option prefixes all query keys with a unique identifier.

```ts
// lib/orpc.ts
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

// Without path (default - uses router structure)
export const orpc = createTanstackQueryUtils(client);

// With path (recommended for multiple clients)
const userORPC = createTanstackQueryUtils(userClient, {
  path: ['user']
});

const postORPC = createTanstackQueryUtils(postClient, {
  path: ['post']
});

// Merge them if needed
export const orpc = {
  user: userORPC,
  post: postORPC,
};
```

**When to use `path`:**
- ✅ You have multiple separate clients/routers
- ✅ You're merging clients from different packages
- ✅ You want explicit namespace control

**When you don't need `path`:**
- ✅ Single router/client (like our current setup)
- ✅ Router already has nested structure (e.g., `router.post.list`, `router.user.profile`)

## How It Works

The `orpc` client is **isomorphic** - it automatically uses the right implementation based on where your code runs:

### Automatic Behavior

When you use `useQuery(orpc.healthCheck.queryOptions())`:

1. **During SSR (Server-Side Rendering)**:
   - Uses `.server()` implementation
   - Direct function call to `appRouter.healthCheck()`
   - ✅ No HTTP request
   - ✅ Fast, same process
   - ✅ Data included in initial HTML

2. **On Client (Browser)**:
   - Uses `.client()` implementation  
   - HTTP request to `http://localhost:3000/rpc`
   - ✅ Network call
   - ✅ Works after page loads

## When to Use Server-Side Fetching

### ✅ Use Server-Side (SSR) For:

1. **Initial Page Data** - Data needed for first render
   ```tsx
   // This will fetch on server during SSR
   const { data } = useQuery(orpc.posts.list.queryOptions());
   ```

2. **SEO-Critical Content** - Content that search engines need
   ```tsx
   // Blog posts, product pages, etc.
   const { data } = useQuery(orpc.blog.getPost.queryOptions({ id }));
   ```

3. **Public Data** - Data that doesn't require authentication
   ```tsx
   // Health checks, public announcements, etc.
   const { data } = useQuery(orpc.healthCheck.queryOptions());
   ```

4. **User-Specific Data (with session)** - If you have session context
   ```tsx
   // Dashboard data, user profile (if session available on server)
   const { data } = useQuery(orpc.user.profile.queryOptions());
   ```

### ✅ Use Client-Side For:

1. **User Interactions** - Data triggered by user actions
   ```tsx
   const mutation = useMutation(orpc.user.updateProfile.mutationOptions());
   // Triggered by button click
   ```

2. **Real-Time Updates** - Data that changes frequently
   ```tsx
   // Polling, live updates
   const { data } = useQuery({
     ...orpc.notifications.list.queryOptions(),
     refetchInterval: 5000,
   });
   ```

3. **Private/Authenticated Data** - That requires fresh tokens
   ```tsx
   // Data that needs current auth state
   const { data } = useQuery(orpc.user.settings.queryOptions());
   ```

## How to Control Server vs Client

### Default Behavior (Recommended)

Just use `useQuery` - it automatically:
- Fetches on server during SSR
- Uses cached data on client (if available)
- Refetches on client if needed

```tsx
// Automatically uses server during SSR, client after
const { data } = useQuery(orpc.healthCheck.queryOptions());
```

### Force Client-Side Only

If you want to skip SSR and only fetch on client:

```tsx
const { data } = useQuery({
  ...orpc.healthCheck.queryOptions(),
  enabled: typeof window !== "undefined", // Only run on client
});
```

### Force Server-Side Only (Prefetch)

For data that should only be fetched on server:

```tsx
// In a route loader or server component
import { getQueryClient } from "../lib/hydration";
import { orpc } from "../lib/orpc";

const queryClient = getQueryClient();
await queryClient.prefetchQuery(orpc.healthCheck.queryOptions());
```

### Manual Server-Side Fetch

For explicit server-side fetching (e.g., in route loaders):

```tsx
// This uses the server client directly
import { client } from "../lib/orpc";

// Direct call - no HTTP, runs on server
const data = await client.healthCheck();
```

## Complete Example: Posts CRUD Operations

Here's a comprehensive example showing how to implement a full CRUD interface for posts using oRPC and TanStack Query.

### Router Setup (Server-Side)

```ts
// packages/api/src/index.ts
export const appRouter = {
  post: {
    // Get all posts
    list: publicProcedure
      .input(z.object({ 
        limit: z.number().optional().default(10),
        offset: z.number().optional().default(0),
      }))
      .handler(async ({ input }) => {
        // Fetch posts from database
        return { posts: [...], total: 100 };
      }),

    // Get single post
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .handler(async ({ input }) => {
        // Fetch post from database
        return { id: input.id, title: "...", content: "..." };
      }),

    // Create post (mutation)
    create: protectedProcedure
      .input(z.object({ 
        title: z.string(),
        content: z.string(),
      }))
      .handler(async ({ input, context }) => {
        // Create post in database
        return { id: "123", ...input, authorId: context.session.user.id };
      }),

    // Update post (mutation)
    update: protectedProcedure
      .input(z.object({ 
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
      }))
      .handler(async ({ input }) => {
        // Update post in database
        return { id: input.id, ...input };
      }),

    // Delete post (mutation)
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .handler(async ({ input }) => {
        // Delete post from database
        return { success: true };
      }),
  },
};
```

### Client-Side Usage Examples

#### 1. Get All Posts (Query)

```tsx
// components/posts-list.tsx
import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/orpc";

export function PostsList() {
  const { data, isLoading, error } = useQuery(
    orpc.post.list.queryOptions({
      input: { limit: 10, offset: 0 },
    })
  );

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Posts ({data?.total})</h2>
      <ul>
        {data?.posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### 2. Get Single Post (Query)

```tsx
// routes/posts.$id.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/orpc";

export const Route = createFileRoute("/posts/$id")({
  component: PostDetail,
});

function PostDetail() {
  const { id } = Route.useParams();
  
  const { data: post, isLoading } = useQuery(
    orpc.post.get.queryOptions({ input: { id } })
  );

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

#### 3. Create Post (Mutation with Auto-Refetch)

```tsx
// components/create-post-form.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/orpc";
import { useState } from "react";

export function CreatePostForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createPost = useMutation(
    orpc.post.create.mutationOptions({
      onSuccess: () => {
        // Option 1: Invalidate and refetch all posts
        queryClient.invalidateQueries({
          queryKey: orpc.post.list.key(),
        });

        // Option 2: Invalidate specific query with input
        queryClient.invalidateQueries({
          queryKey: orpc.post.list.queryKey({ 
            input: { limit: 10, offset: 0 } 
          }),
        });

        // Option 3: Optimistically update the cache
        queryClient.setQueryData(
          orpc.post.list.queryKey({ input: { limit: 10, offset: 0 } }),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              posts: [
                { id: "new", title, content, createdAt: new Date() },
                ...old.posts,
              ],
              total: old.total + 1,
            };
          }
        );

        // Reset form
        setTitle("");
        setContent("");
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({ title, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post content"
        required
      />
      <button type="submit" disabled={createPost.isPending}>
        {createPost.isPending ? "Creating..." : "Create Post"}
      </button>
      {createPost.error && (
        <div>Error: {createPost.error.message}</div>
      )}
    </form>
  );
}
```

#### 4. Update Post (Mutation)

```tsx
// components/edit-post-form.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/orpc";

export function EditPostForm({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const updatePost = useMutation(
    orpc.post.update.mutationOptions({
      onSuccess: (updatedPost) => {
        // Invalidate the list to refetch
        queryClient.invalidateQueries({
          queryKey: orpc.post.list.key(),
        });

        // Update the specific post in cache
        queryClient.setQueryData(
          orpc.post.get.queryKey({ input: { id: postId } }),
          updatedPost
        );
      },
    })
  );

  const handleSubmit = (data: { title?: string; content?: string }) => {
    updatePost.mutate({ id: postId, ...data });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit({
        title: formData.get("title") as string,
        content: formData.get("content") as string,
      });
    }}>
      {/* Form fields */}
      <button type="submit" disabled={updatePost.isPending}>
        Update Post
      </button>
    </form>
  );
}
```

#### 5. Delete Post (Mutation)

```tsx
// components/delete-post-button.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/orpc";

export function DeletePostButton({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const deletePost = useMutation(
    orpc.post.delete.mutationOptions({
      onSuccess: () => {
        // Remove from list cache
        queryClient.setQueryData(
          orpc.post.list.queryKey({ input: { limit: 10, offset: 0 } }),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              posts: old.posts.filter((p) => p.id !== postId),
              total: old.total - 1,
            };
          }
        );

        // Remove the individual post from cache
        queryClient.removeQueries({
          queryKey: orpc.post.get.queryKey({ input: { id: postId } }),
        });

        // Or invalidate all post queries
        queryClient.invalidateQueries({
          queryKey: orpc.post.key(),
        });
      },
    })
  );

  return (
    <button
      onClick={() => deletePost.mutate({ id: postId })}
      disabled={deletePost.isPending}
    >
      {deletePost.isPending ? "Deleting..." : "Delete Post"}
    </button>
  );
}
```

#### 6. Using Query Keys for Manual Cache Management

```tsx
// components/posts-manager.tsx
import { useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/orpc";

export function PostsManager() {
  const queryClient = useQueryClient();

  // Invalidate all post queries
  const refreshAllPosts = () => {
    queryClient.invalidateQueries({
      queryKey: orpc.post.key(),
    });
  };

  // Invalidate only list queries
  const refreshPostList = () => {
    queryClient.invalidateQueries({
      queryKey: orpc.post.list.key(),
    });
  };

  // Invalidate only mutation-related queries
  const refreshMutations = () => {
    queryClient.invalidateQueries({
      queryKey: orpc.post.key({ type: "mutation" }),
    });
  };

  // Prefetch a post
  const prefetchPost = async (id: string) => {
    await queryClient.prefetchQuery(
      orpc.post.get.queryOptions({ input: { id } })
    );
  };

  // Get cached data without fetching
  const getCachedPost = (id: string) => {
    return queryClient.getQueryData(
      orpc.post.get.queryKey({ input: { id } })
    );
  };

  return (
    <div>
      <button onClick={refreshAllPosts}>Refresh All</button>
      <button onClick={refreshPostList}>Refresh List</button>
      <button onClick={() => prefetchPost("123")}>Prefetch Post</button>
    </div>
  );
}
```

#### 7. SSR Prefetching Example

```tsx
// routes/posts.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getQueryClient, HydrateClient } from "../lib/hydration";
import { orpc } from "../lib/orpc";

export const Route = createFileRoute("/posts")({
  loader: async () => {
    const queryClient = getQueryClient();
    
    // Prefetch posts on server
    await queryClient.prefetchQuery(
      orpc.post.list.queryOptions({ input: { limit: 10, offset: 0 } })
    );
    
    return { queryClient };
  },
  component: PostsPage,
});

function PostsPage() {
  const { queryClient } = Route.useLoaderData();
  const { data } = useQuery(
    orpc.post.list.queryOptions({ input: { limit: 10, offset: 0 } })
  );

  return (
    <HydrateClient client={queryClient}>
      <div>
        <h1>Posts</h1>
        {data?.posts.map((post) => (
          <div key={post.id}>{post.title}</div>
        ))}
      </div>
    </HydrateClient>
  );
}
```

## Examples

### Example 1: Public Blog Post (SSR)

```tsx
// routes/blog.$id.tsx
export const Route = createFileRoute("/blog/$id")({
  component: BlogPost,
});

function BlogPost() {
  const { id } = Route.useParams();
  
  // Automatically fetches on server during SSR
  const { data: post } = useQuery(
    orpc.blog.getPost.queryOptions({ id })
  );
  
  return <article>{post?.title}</article>;
}
```

### Example 2: User Dashboard (SSR with Session)

```tsx
// routes/dashboard.tsx
function Dashboard() {
  // Fetches on server if session available, otherwise on client
  const { data: stats } = useQuery(
    orpc.user.getStats.queryOptions()
  );
  
  return <div>Stats: {stats?.total}</div>;
}
```

### Example 3: Real-Time Notifications (Client Only)

```tsx
// components/notifications.tsx
function Notifications() {
  // Only fetches on client, polls every 5 seconds
  const { data } = useQuery({
    ...orpc.notifications.list.queryOptions(),
    refetchInterval: 5000,
    enabled: typeof window !== "undefined", // Client only
  });
  
  return <div>{data?.length} notifications</div>;
}
```

### Example 4: Form Submission (Client Mutation)

```tsx
// components/user-form.tsx
function UserForm() {
  const mutation = useMutation(
    orpc.user.updateProfile.mutationOptions()
  );
  
  const handleSubmit = (data) => {
    // Always runs on client
    mutation.mutate(data);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Query and Mutation Keys Reference

oRPC provides several key helpers for cache management:

### Key Types

```ts
// Partial matching key - for invalidating groups of queries
orpc.post.key()                    // All post queries
orpc.post.key({ type: 'query' })   // Only query operations
orpc.post.key({ type: 'mutation' }) // Only mutation operations

// Full matching keys - for specific queries
orpc.post.list.queryKey({ input: { limit: 10 } })
orpc.post.get.queryKey({ input: { id: '123' } })
orpc.post.create.mutationKey()
orpc.post.update.mutationKey()
```

### Common Patterns

```tsx
const queryClient = useQueryClient();

// Invalidate all queries for a resource
queryClient.invalidateQueries({
  queryKey: orpc.post.key(),
});

// Invalidate specific query
queryClient.invalidateQueries({
  queryKey: orpc.post.list.queryKey({ input: { limit: 10 } }),
});

// Update cache directly
queryClient.setQueryData(
  orpc.post.get.queryKey({ input: { id: '123' } }),
  newPostData
);

// Remove from cache
queryClient.removeQueries({
  queryKey: orpc.post.get.queryKey({ input: { id: '123' } }),
});

// Prefetch data
await queryClient.prefetchQuery(
  orpc.post.get.queryOptions({ input: { id: '123' } })
);
```

## Key Takeaways

1. **Default is best** - Just use `useQuery()` and let it handle SSR automatically
2. **Server-side is automatic** - During SSR, it uses direct function calls
3. **Client-side is automatic** - After hydration, it uses HTTP requests
4. **Same code, different execution** - The isomorphic client handles it
5. **No manual switching needed** - `createIsomorphicFn()` does the magic
6. **Use query keys** - Leverage `.key()`, `.queryKey()`, and `.mutationKey()` for cache management
7. **Invalidate on mutations** - Always invalidate or update cache after mutations to keep UI in sync

## Debugging

To see which implementation is being used:

```tsx
// Check in your component
console.log("Environment:", typeof window !== "undefined" ? "CLIENT" : "SERVER");
```

- **SERVER** = Direct function call (no HTTP)
- **CLIENT** = HTTP request to `/rpc`

