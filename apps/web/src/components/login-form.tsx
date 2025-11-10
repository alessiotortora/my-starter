import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";
import { Link } from "@tanstack/react-router";

export function LoginForm({
	className,
	onSubmit,
	error,
	loading,
	...props
}: Omit<React.ComponentProps<"div">, "onSubmit"> & {
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
	error?: string | null;
	loading?: boolean;
}) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="m@example.com"
									required
									disabled={loading}
								/>
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<button
										type="button"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</button>
								</div>
								<Input
									id="password"
									name="password"
									type="password"
									required
									disabled={loading}
								/>
							</Field>
							{error && (
								<Field>
									<FieldError>{error}</FieldError>
								</Field>
							)}
							<Field>
								<Button type="submit" disabled={loading} className="w-full">
									{loading ? "Signing in..." : "Login"}
								</Button>
								<FieldDescription className="text-center">
									Don&apos;t have an account?{" "}
									<Link to="/signup" className="underline underline-offset-4">
										Sign up
									</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
