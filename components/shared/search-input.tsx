'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useClickAway, useDebounce } from 'react-use';
import { Api } from '@/services/api-client';

import { Search } from 'lucide-react';
import { Input } from '../ui';
import Link from 'next/link';
import { Product } from '@prisma/client';

interface Props {
	className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [focused, setFocused] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const clickAwayRef = useRef(null);

	useClickAway(clickAwayRef, () => {
		setFocused(false);
	});

	// TODO: отображать рекомендации при пустом поиске
	useDebounce(
		() => {
			searchQuery.trim().length > 0
				? Api.products
						.search(searchQuery)
						.then((items) => setProducts(items))
				: null;

			if (searchQuery.trim().length == 0) {
				setProducts([]);
			}
		},
		250,
		[searchQuery]
	);

	const onClickProduct = () => {
		setFocused(false);
		setSearchQuery('');
		setProducts([]);
	};

	return (
		<>
			{/* TODO: Убрать из DOM когда нет стейта */}
			<div
				className={cn(
					'fixed top-0 left-0 bottom-0 right-0 z-30 bg-black/50 transition-all duration-200 opacity-0 invisible',
					focused && 'visible opacity-100 '
				)}
			/>

			<div
				ref={clickAwayRef}
				className={cn(
					'flex rounded-2xl flex-1 justify-between relative h-11 z-30',
					className
				)}>
				<Search className='absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400' />
				<Input
					className='rounded-2xl outline-none w-full bg-gray-100 pl-11'
					type='text'
					placeholder='Найти...'
					onFocus={() => setFocused(true)}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>

				{products.length > 0 && (
					<div
						className={cn(
							'absolute w-full bg-white rounded-xl py-2 top-14 shadow-md transition-all duration-200 invisible opacity-0 z-30',
							focused && 'visible opacity-100 top-12'
						)}>
						{products.map((product) => (
							<Link
								onClick={onClickProduct}
								key={product.id}
								href={`/product/${product.id}`}
								className='flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10'>
								<img
									src={product.imageUrl}
									alt={product.name}
									className='rounded-sm h-8 w-8'
								/>
								<span>{product.name}</span>
							</Link>
						))}
					</div>
				)}
			</div>
		</>
	);
};
