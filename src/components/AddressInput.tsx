import { useState } from "react"
import { isAddress } from "viem/utils"

import type React from "react"
import type { Address } from "viem"

interface AddressInputProps {
	address: Address | undefined
	onChange: (address: Address, isValid: boolean) => void
}

function AddressInput({ address, onChange }: AddressInputProps) {
	const [error, setError] = useState(false)

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.value as Address
		const valid = isAddress(value)
		setError(!!value && !valid)
		onChange(value, valid)
	}

	return (
		<label className="form-control w-full">
			<div className="label">
				<span className="label-text">Send To</span>
			</div>
			<input
				className={`input input-bordered w-full ${error && "input-error"}`}
				type="text"
				name="address"
				value={address || ""}
				placeholder="Enter 0x Address"
				onChange={handleChange}
				autoComplete="off"
			/>
			<div className="label">
				<span
					className={`label-text-alt text-xs text-error ${error ? "visible" : "invisible"}`}
				>
					Invalid Ethereum address
				</span>
			</div>
		</label>
	)
}

export default AddressInput
