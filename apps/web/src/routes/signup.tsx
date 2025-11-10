import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SignupForm } from "../components/signup-form";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/signup")({
	component: SignUp,
});

function SignUp() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			const result = await authClient.signUp.email({
				name,
				email,
				password,
			});

			if (result.error) {
				setError(result.error.message || "Failed to sign up");
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
				<SignupForm onSubmit={handleSubmit} error={error} loading={loading} />
			</div>
		</div>
	);
}
