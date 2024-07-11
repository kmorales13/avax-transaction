import { formatUnits } from "viem"
import type React from "react"
import { type ReactElement, useMemo, useState } from "react"
import type { GetBalanceReturnType } from "wagmi/actions"
import type { BaseError } from "wagmi"

interface AmountInputProps {
	amount: string
	balance: GetBalanceReturnType | undefined
	balanceLoading?: boolean
	balanceError?: BaseError
	onChange: (amount: string, isValid: boolean) => void
	selectComponent: ReactElement
}

function AmountInput({
	amount,
	balance,
	balanceLoading,
	balanceError,
	onChange,
	selectComponent,
}: AmountInputProps) {
	const [error, setError] = useState(false)
	const parsedBalance = useMemo(
		() =>
			balance
				? Number.parseFloat(formatUnits(balance.value, balance.decimals))
				: -1,
		[balance],
	)

	function updateValue(value: string) {
		// only allow positive numbers with decimals
		if (/^\d*\.?\d*$/.test(value)) {
			const amountValue = Number.parseFloat(value)
			const valid = amountValue > 0 && amountValue <= parsedBalance
			setError(!!value && !valid)
			onChange(value, valid)
		}
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		updateValue(value)
	}

	function handleSetMax() {
		if (balance) {
			updateValue(parsedBalance.toString())
		}
	}

	return (
		<label className="form-control w-full focus:outline-none">
			<div className="label">
				<span className="label-text">Amount</span>
				<span className="label-text-alt">
					{balanceLoading ? (
						<span className="loading loading-spinner loading-xs" />
					) : balance ? (
						<span>
							Balance: {parsedBalance} {balance.symbol}
						</span>
					) : balanceError ? (
						<span className="text-error">{balanceError.shortMessage}</span>
					) : null}
				</span>
			</div>

			<label className="input input-bordered flex items-center gap-2 px-0 max-w-full">
				{selectComponent}
				<input
					className={`grow min-w-0 focus:outline-none ${error && "input-error"}`}
					name="amount"
					placeholder="0.0"
					value={amount}
					onChange={handleChange}
					disabled={!balance}
					autoComplete="off"
				/>
				<button
					className="btn btn-link"
					type="button"
					onClick={handleSetMax}
					disabled={!balance}
				>
					Max
				</button>
			</label>

			<div className="label">
				<span
					className={`label-text-alt text-xs text-error ${error ? "visible" : "invisible"}`}
				>
					Invalid amount or exceeds balance
				</span>
			</div>
		</label>
	)
}

export default AmountInput
