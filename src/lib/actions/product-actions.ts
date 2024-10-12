'use server';

import { revalidatePath } from 'next/cache';
import { ActionResponse } from '.';
import prisma from '../prisma';
import { ProductFormInput, ProductFormSchema } from '../validators/auth';
import { connect } from 'http2';

export async function getProducts(args: {
	cursor?: string;
	take: number;
	skip: number;
	orderBy: {
		createdAt: 'asc' | 'desc';
	};
}) {
	try {
		const { take, skip, orderBy } = args;
		const products = await prisma.products.findMany({
			...(args.cursor && { cursor: { id: args.cursor } }),
			take,
			orderBy,
			include: {
				category: {
					select: {
						name: true,
					},
				},
				images: {
					select: {
						url: true,
					},
					take: 2,
				},
				subcategory: {
					select: {
						name: true,
					},
				},
			},
		});
		return products;
	} catch (error) {
		console.error(error);
		return [];
	}
}
export type ProductsType = Awaited<ReturnType<typeof getProducts>>;
export async function getProductData(productId?: string) {
	try {
		if (!productId) return null;
		const product = await prisma.products.findUnique({
			where: { id: productId },
			include: {
				category: {
					select: { name: true },
				},
				images: {
					select: { url: true },
					take: 2,
				},
				subcategory: {
					select: {
						name: true,
					},
				},
				features: {
					select: {
						name: true,
						content: true,
						id: true,
					},
				},
				specs: {
					select: {
						name: true,
						content: true,
						id: true,
					},
				},
			},
		});
		return product;
	} catch (error) {
		console.log(error);
		return null;
	}
}
export type ProductType = Awaited<ReturnType<typeof getProductData>>;

export async function createProduct(
	_: any,
	data: ProductFormInput
): Promise<ActionResponse<ProductFormInput>> {
	try {
		const parsed = ProductFormSchema.safeParse(data);
		if (!parsed.success) {
			const err = parsed.error.flatten();
			return {
				fieldError: {
					name: err.fieldErrors.name?.[0],
					description: err.fieldErrors.description?.[0],
					category: err.fieldErrors.category?.[0],
					images: err.fieldErrors.images?.[0],
					features: err.fieldErrors.features?.[0],
				},
			};
		}
		const {
			id,
			images,
			name,
			description,
			subCategory,
			features,
			specs,
			category,
		} = data;
		if (id) {
			await prisma.products.update({
				where: {
					id,
				},
				data: {
					name,
					description,
					category: {
						connect: {
							name: category,
						},
					},
					...(subCategory
						? {
								subcategory: {
									connect: {
										name: subCategory,
									},
								},
						  }
						: {}),
					...(images?.length
						? {
								images: {
									connectOrCreate: images.map(({ url }) => ({
										where: {
											url,
										},
										create: {
											url,
										},
									})),
								},
						  }
						: {}),
					...(features?.length
						? {
								features: {
									connectOrCreate: features.map(({ name, content, id }) => ({
										where: {
											id,
										},
										create: {
											name,
											content,
										},
									})),
								},
						  }
						: {}),
					...(specs?.length
						? {
								specs: {
									connectOrCreate: specs.map(({ name, content, id }) => ({
										where: {
											id,
										},
										create: {
											name,
											content,
										},
									})),
								},
						  }
						: {}),
				},
			});
			return {
				data: true,
			};
		} else {
			await prisma.products.create({
				data: {
					name,
					description,
					category: {
						connect: {
							name: category,
						},
					},
					...(subCategory
						? {
								subcategory: {
									connect: {
										name: subCategory,
									},
								},
						  }
						: {}),
					...(images
						? {
								images: {
									createMany: {
										data: images.map(({ url }) => ({ url })),
									},
								},
						  }
						: {}),
					...(features?.length
						? {
								features: {
									createMany: {
										data: features.map(({ name, content }) => ({
											name,
											content,
										})),
									},
								},
						  }
						: {}),
					...(specs?.length
						? {
								specs: {
									createMany: {
										data: specs.map(({ name, content }) => ({
											name,
											content,
										})),
									},
								},
						  }
						: {}),
				},
			});
			return {
				data: true,
			};
		}
	} catch (error) {
		console.log(error);
		return {
			formError: 'Error occurred',
		};
	}
}

export async function deleteProduct(productId: string) {
	try {
		if (!productId) return false;
		await prisma.products.delete({
			where: { id: productId },
		});
		revalidatePath('/admin/products');
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}