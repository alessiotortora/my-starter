import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@repo/ui/components/empty";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Spinner } from "@repo/ui/components/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreatePostDialog } from "@/components/posts/create-post-dialog";
import { orpc } from "@/lib/orpc";

export function PostsPanel() {
  const queryClient = useQueryClient();

  const listMineKey = orpc.posts.listMine.queryKey();
  const listPublishedKey = orpc.posts.listPublished.queryKey();

  const postsQuery = useQuery(orpc.posts.listMine.queryOptions());

  const deleteMutation = useMutation(
    orpc.posts.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: listMineKey });
        queryClient.invalidateQueries({ queryKey: listPublishedKey });
        toast.success("Post deleted");
      },
      onError: (error) => toast.error(error.message ?? "Could not delete post"),
    })
  );

  return (
    <Card>
      <CardHeader className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <CardTitle>Your posts</CardTitle>
          <CardDescription>
            Drafts stay private. Published posts show on the public feed.
          </CardDescription>
        </div>
        <CreatePostDialog />
      </CardHeader>
      <CardContent>
        {postsQuery.isPending && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {postsQuery.isError && (
          <p className="text-destructive text-sm">
            Could not load posts: {postsQuery.error.message}
          </p>
        )}

        {postsQuery.data && postsQuery.data.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No posts yet</EmptyTitle>
              <EmptyDescription>
                Create your first post to get started.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreatePostDialog />
            </EmptyContent>
          </Empty>
        )}

        {postsQuery.data && postsQuery.data.length > 0 && (
          <ul className="flex flex-col gap-3">
            {postsQuery.data.map((post) => (
              <li
                className="flex items-start justify-between gap-3 rounded-md border p-3"
                key={post.id}
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{post.title}</p>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  {post.content && (
                    <p className="line-clamp-2 text-muted-foreground text-sm">
                      {post.content}
                    </p>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger
                    disabled={deleteMutation.isPending}
                    render={<Button size="sm" variant="outline" />}
                  >
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove "{post.title}". This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate({ id: post.id })}
                      >
                        {deleteMutation.isPending && (
                          <Spinner data-icon="inline-start" />
                        )}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
