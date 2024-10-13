import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import prisma from '@/lib/prisma';
import { uniqueId } from '@/lib/utils';
import ProductCard from '../components/product-card';

interface Props {
	params: {
		subCategory: string;
	};
}
async function SubCategory({ params }: Props) {
	const { subCategory } = params;
	const data = await prisma.productSubCategories.findUnique({
		where: {
			slug: subCategory,
		},
		select: {
			name: true,
			slug: true,
			category: {
				select: {
					name: true,
					slug: true,
					products: {
						select: {
							id: true,
							name: true,
						},
						take: 6,
					},
				},
			},
			products: {
				select: {
					id: true,
					name: true,
					description: true,
					images: {
						select: {
							url: true,
						},
						take: 1,
					},
					category: {
						select: {
							name: true,
							slug: true,
						},
					},
					subcategory: {
						select: {
							name: true,
							slug: true,
						},
					},
				},
			},
		},
	});
	return (
		<div>
			<Breadcrumb className="px-4 sm:px-12 py-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink
							className="text-sm font-medium text-green-500"
							href="/">
							Home
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator className=" text-green-500 font-bold" />
					<BreadcrumbItem>
						<BreadcrumbLink
							className="text-sm font-medium text-green-500"
							href="/products">
							Products
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator className=" text-green-500 font-bold" />
					<BreadcrumbItem>
						<BreadcrumbLink
							className="text-sm font-medium text-green-500"
							href={`/products/${data?.category.slug}`}>
							{data?.category.name}
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator className=" text-green-500 font-bold" />
					<BreadcrumbItem>
						<BreadcrumbPage className="text-sm text-gray-500 font-normal  capitalize">
							{subCategory}
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			{data ? (
				<div className="grid gap-8">
					<div className="px-4 sm:px-12 pt-10 pb-5">
						<h2 className="text-xl sm:text-4xl text-center sm:text-start capitalize text-black font-bold">
							{data.name}
						</h2>
					</div>
					<div className="px-4 sm:px-12  space-y-3">
						<div className="py-2 px-2 bg-gray-300 flex justify-between">
							<h3 className="text-base font-medium">Recent products</h3>
						</div>
						<div className="grid sm:grid-cols-3 gap-4">
							{data.products.map((p) => (
								<ProductCard key={uniqueId()} {...p} />
							))}
						</div>
					</div>
				</div>
			) : (
				<div className="flex justify-center items-center h-96">
					<h4 className="text-xl">Sub category not found! </h4>
				</div>
			)}
		</div>
	);
}

export default SubCategory;
