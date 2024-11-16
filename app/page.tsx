import { prisma } from '@/prisma/prisma-client';

import {
	Container,
	Filters,
	ProductsGroupList,
	Title,
	TopBar,
} from '@/components/shared';

export default async function Home() {
	const categories = await prisma.category.findMany({
		include: {
			products: {
				include: {
					productVariants: true,
					ingredients: true,
				},
			},
		},
	});

	return (
		<>
			<Container className='mt-10'>
				<Title
					text='Пиццы'
					size='lg'
					className='font-extrabold'
				/>
			</Container>

			<TopBar
				categories={categories.filter(
					(category) => category.products.length > 0
				)}
			/>

			<Container className='mt-10 pb-14'>
				<div className='flex gap-[80px]'>
					{/* Filtration */}
					<div className='w-[250px]'>
						<Filters />
					</div>

					{/* List of Items */}
					<div className='flex-1'>
						<div className='flex flex-col gap-16'>
							{categories.map(
								(category) =>
									category.products.length > 0 && (
										<ProductsGroupList
											key={category.id}
											title={category.name}
											categoryId={category.id}
											products={category.products}
										/>
									)
							)}
						</div>
					</div>
				</div>
			</Container>
		</>
	);
}
