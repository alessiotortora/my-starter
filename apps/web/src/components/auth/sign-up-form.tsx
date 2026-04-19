import { signUp } from "@repo/auth/client";
import { Button } from "@repo/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { Spinner } from "@repo/ui/components/spinner";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export function SignUpForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        const { error } = await signUp.email({ name, email, password });
        setPending(false);
        if (error) {
          toast.error(error.message ?? "Could not create account");
          return;
        }
        toast.success("Account created. Check your email to verify.");
        navigate({ to: "/dashboard" });
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="signup-name">Name</FieldLabel>
          <Input
            autoComplete="name"
            id="signup-name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
            value={name}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-email">Email</FieldLabel>
          <Input
            autoComplete="email"
            id="signup-email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-password">Password</FieldLabel>
          <Input
            autoComplete="new-password"
            id="signup-password"
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            value={password}
          />
        </Field>
        <Button disabled={pending} type="submit">
          {pending && <Spinner data-icon="inline-start" />}
          Create account
        </Button>
      </FieldGroup>
    </form>
  );
}
