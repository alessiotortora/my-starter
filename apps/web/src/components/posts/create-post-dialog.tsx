import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { Spinner } from "@repo/ui/components/spinner";
import { Switch } from "@repo/ui/components/switch";
import { Textarea } from "@repo/ui/components/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { orpc } from "@/lib/orpc";

export function CreatePostDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const listMineKey = orpc.posts.listMine.queryKey();
  const listPublishedKey = orpc.posts.listPublished.queryKey();

  const createMutation = useMutation(
    orpc.posts.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: listMineKey });
        queryClient.invalidateQueries({ queryKey: listPublishedKey });
        toast.success("Post created");
        resetForm();
        setOpen(false);
      },
      onError: (error) => toast.error(error.message ?? "Could not create post"),
    })
  );

  function resetForm() {
    setTitle("");
    setContent("");
    setPublished(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createMutation.mutate({
      title,
      content: content.length > 0 ? content : null,
      published,
    });
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button size="sm" />}>New post</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
          <DialogDescription>
            Give it a title and body. You can save as draft or publish right
            away.
          </DialogDescription>
        </DialogHeader>
        <form id="create-post-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="post-title">Title</FieldLabel>
              <Input
                id="post-title"
                maxLength={200}
                onChange={(e) => setTitle(e.target.value)}
                required
                value={title}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="post-content">Content</FieldLabel>
              <Textarea
                id="post-content"
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                value={content}
              />
              <FieldDescription>
                Optional. Leave empty for a title-only post.
              </FieldDescription>
            </Field>
            <Field orientation="horizontal">
              <Switch
                checked={published}
                id="post-published"
                onCheckedChange={setPublished}
              />
              <FieldLabel htmlFor="post-published">Publish now</FieldLabel>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            disabled={createMutation.isPending}
            form="create-post-form"
            type="submit"
          >
            {createMutation.isPending && <Spinner data-icon="inline-start" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
