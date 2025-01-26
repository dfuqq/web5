'use client';

import React from 'react';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

interface Props {
	onChange?: (value?: string) => void;
}

export const CheckoutAddressInput: React.FC<Props> = ({ onChange }) => {
	return (
		<AddressSuggestions
			token={String(process.env.DADATA_API_TOKEN)}
			onChange={(data) => onChange?.(data?.value)}
		/>
	);
};
