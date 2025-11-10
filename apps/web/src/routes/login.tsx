import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LoginForm } from "../components/login-form";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/login")({
	component: Login,
});

function Login() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

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
		<div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
			<div className="w-full max-w-md">
				<LoginForm onSubmit={handleSubmit} error={error} loading={loading} />
			</div>
		</div>
	);
}
