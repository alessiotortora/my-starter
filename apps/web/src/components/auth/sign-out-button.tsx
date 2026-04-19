import { authClient } from "@repo/auth/client";
import { Button } from "@repo/ui/components/button";
import { Spinner } from "@repo/ui/components/spinner";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export function SignOutButton() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    const { error } = await authClient.signOut();
    setPending(false);
    if (error) {
      toast.error(error.message ?? "Could not sign out");
      return;
    }
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  return (
    <Button
      disabled={pending}
      onClick={handleClick}
      size="sm"
      variant="outline"
    >
      {pending && <Spinner data-icon="inline-start" />}
      Sign out
    </Button>
  );
}
