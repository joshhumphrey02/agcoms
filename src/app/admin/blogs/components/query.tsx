'use server';
import { ActionResponse } from '@/lib/auth/actions';
import prisma from '@/lib/prisma';
// import { validateRequest } from '@/lib/auth/validate-request';
import { PostFormInput, PostFormSchema } from '@/lib/validators/auth';

export async function getBlogs(args: {
	cursor?: string;
	take: number;
	skip: number;
	orderBy: {
		createdAt: 'asc' | 'desc';
	};
}) {
	try {
		const { take, skip, orderBy } = args;
		const blogs = await prisma.blog.findMany({
			select: {
				id: true,
				createdAt: true,
				content: true,
				category: true,
				title: true,
				slug: true,
				images: {
					select: { url: true },
					take: 1,
				},
			},
			...(args.cursor && { cursor: { id: args.cursor } }),
			take,
			orderBy,
		});
		return blogs;
	} catch (error) {
		console.log(error);
		return [];
	}
}
export type BlogsData = Awaited<ReturnType<typeof getBlogs>>;
export async function getPostData(blogId?: string) {
	try {
		if (!blogId) return null;
		const post = await prisma.blog.findUnique({
			where: { id: blogId },
			select: {
				id: true,
				createdAt: true,
				content: true,
				category: {
					select: { name: true },
				},
				title: true,
				slug: true,
				images: {
					select: { url: true, id: true },
					take: 2,
				},
			},
		});
		return post;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export type PostData = Awaited<ReturnType<typeof getPostData>>;

export async function CreatePost(
	_: any,
	form: PostFormInput
): Promise<ActionResponse<PostFormInput>> {
	try {
		// const { user } = await validateRequest();
		// if (!user) {
		// 	return {
		// 		formError: 'User not authenticated',
		// 	};
		// }
		const parsed = PostFormSchema.safeParse(form);
		if (!parsed.success) {
			const err = parsed.error.flatten();
			return {
				fieldError: {
					title: err.fieldErrors.title?.[0],
					content: err.fieldErrors.content?.[0],
					category: err.fieldErrors.category?.[0],
				},
			};
		}
		const { title, content, category, id } = form;

		if (id) {
			await prisma.blog.update({
				where: {
					id,
				},
				data: {
					title,
					content,
					category: {
						connect: { name: category },
					},
				},
			});
			return {
				data: true,
			};
		}
		await prisma.blog.create({
			data: {
				title,
				content,
				category: {
					connect: { name: category },
				},
			},
		});
		return {
			data: true,
		};
	} catch (error) {
		console.log(error);
		return {
			formError: 'Error occuried',
		};
	}
}

export async function DeletePost(postId: string) {
	try {
		await prisma.blog.delete({
			where: { id: postId },
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
