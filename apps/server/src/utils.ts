import type { Session, User } from "better-auth/types";

export interface Variables {
	user?: User | null;
	session?: Session | null;
}
