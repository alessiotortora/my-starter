import { Button } from "@repo/ui/components/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@repo/ui/components/empty";
import { Link } from "@tanstack/react-router";

export function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
			<Empty className="max-w-md">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<span className="text-4xl" aria-hidden="true">
							404
						</span>
					</EmptyMedia>
					<EmptyTitle>Page Not Found</EmptyTitle>
					<EmptyDescription>
						The page you're looking for doesn't exist or has been moved.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button asChild>
						<Link to="/">Go Home</Link>
					</Button>
				</EmptyContent>
			</Empty>
		</div>
	);
}
