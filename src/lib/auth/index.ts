import { Lucia, TimeSpan } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { User, PrismaClient } from '@prisma/client';
import { env } from '@/env';

const client = new PrismaClient();
const adapter = new PrismaAdapter(client.authSession, client.user);

export const lucia = new Lucia(adapter, {
	getUserAttributes: (attributes) => {
		return {
			id: attributes.id,
			email: attributes.email,
			emailVerified: attributes.emailVerified,
			createdAt: attributes.createdAt,
			updatedAt: attributes.updatedAt,
		};
	},
	sessionExpiresIn: new TimeSpan(30, 'd'),
	sessionCookie: {
		name: 'session',
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			secure: env.NODE_ENV === 'production',
		},
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
// @typescript-eslint/no-empty-object-type
interface DatabaseSessionAttributes {}
// @typescript-eslint/no-empty-object-type
interface DatabaseUserAttributes extends Omit<User, 'password'> {}
