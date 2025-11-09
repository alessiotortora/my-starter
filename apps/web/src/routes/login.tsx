import { Button } from "@repo/ui/components/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/login")({
	component: Login,
});

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const result = await authClient.signIn.email({
				email,
				password,
			});

			if (result.error) {
				setError(result.error.message || "Failed to sign in");
			} else {
				navigate({ to: "/dashboard" });
			}
		} catch (_err) {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4">
			<div className="w-full max-w-md space-y-6 rounded-lg border p-8">
				<h1 className="text-center font-bold text-2xl">Sign In</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="email" className="block font-medium text-sm">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full rounded-md border px-3 py-2 text-sm"
							placeholder="you@example.com"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="password" className="block font-medium text-sm">
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full rounded-md border px-3 py-2 text-sm"
							placeholder="••••••••"
						/>
					</div>

					{error && (
						<div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
							{error}
						</div>
					)}

					<Button type="submit" disabled={loading} className="w-full">
						{loading ? "Signing in..." : "Sign In"}
					</Button>
				</form>

				<div className="text-center text-sm">
					Don't have an account?{" "}
					<a href="/signup" className="text-primary hover:underline">
						Sign up
					</a>
				</div>
			</div>
		</div>
	);
}
