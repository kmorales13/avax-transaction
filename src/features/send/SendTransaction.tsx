import { type ChangeEvent, useEffect, useState } from "react"
import {
	type BaseError,
	useAccount,
	useBalance,
	useWaitForTransactionReceipt,
} from "wagmi"
import type { Address } from "viem"
import { USDC_TOKEN_ADDRESS } from "../../lib/usdc"
import { useTransaction } from "../../hooks/useTransaction"
import AddressInput from "../../components/AddressInput"
import AmountInput from "../../components/AmountInput"
import ConnectWallet from "../wallet/ConnectWallet"
import LastTransaction from "../../components/LastTransaction"

function SendTransaction() {
	const [tokenAddress, setTokenAddress] = useState<Address>()
	const [address, setAddress] = useState<Address>()
	const [isAddressValid, setIsAddressValid] = useState(false)
	const [amount, setAmount] = useState("")
	const [isAmountValid, setIsAmountValid] = useState(false)

	const { address: wallet } = useAccount()
	const {
		data: balance,
		isLoading: balanceLoading,
		error: balanceError,
		refetch: fetchBalance,
	} = useBalance({ address: wallet, token: tokenAddress })
	const {
		hash: txHash,
		isPending,
		isSuccess,
		error: transactionError,
		send,
	} = useTransaction()

	// last sent transaction receipt
	const {
		error: receiptError,
		isLoading: isConfirming,
		isSuccess: isConfirmed,
	} = useWaitForTransactionReceipt({
		hash: txHash,
	})

	useEffect(() => {
		fetchBalance() // refetch balance when transaction status updates

		// if successful, clean form
		if (isSuccess) {
			resetForm()
		}
	}, [fetchBalance, isSuccess])

	function handleAddressChange(address: Address, isValid: boolean) {
		setAddress(address)
		setIsAddressValid(isValid)
	}

	function handleAmountChange(amount: string, isValid: boolean) {
		setAmount(amount)
		setIsAmountValid(isValid)
	}

	function handleChangeToken(event: ChangeEvent<HTMLSelectElement>) {
		setTokenAddress(
			event.target.value === "AVAX" ? undefined : USDC_TOKEN_ADDRESS,
		)
	}

	async function handleSendTransaction() {
		if (address && amount) {
			send(address, amount, tokenAddress)
		}
	}

	function resetForm() {
		setAddress(undefined)
		setIsAddressValid(false)
		setAmount("")
		setIsAmountValid(false)
	}

	return (
		<div className="bg-neutral rounded-box w-md max-w-full p-4 px-8">
			<div className="flex flex-col justify-center items-center max-w-full">
				{/* Fake Tabs */}
				<div role="tablist" className="tabs tabs-boxed tabs-xs max-w-fit">
					<a
						role="tab"
						className="tab tab-active !rounded-[5px] font-semibold"
						href="#token"
					>
						TOKEN
					</a>
					<a role="tab" className="tab font-semibold" href="#collectible">
						COLLECTIBLE
					</a>
				</div>

				{/* Address to Send To */}
				<AddressInput address={address} onChange={handleAddressChange} />

				{/* Amount to Send */}
				<AmountInput
					amount={amount}
					balance={balance}
					balanceLoading={wallet && balanceLoading}
					balanceError={balanceError as BaseError}
					onChange={handleAmountChange}
					selectComponent={
						<select
							className="select border-none min-h-0 h-[46px] focus:outline-none"
							defaultValue="AVAX"
							onChange={handleChangeToken}
							disabled={!wallet}
						>
							<option>AVAX</option>
							<option>USDC</option>
						</select>
					}
				/>

				{/* Send Transaction */}
				{balance ? (
					<button
						className="btn btn-wide disabled:bg-base-100"
						type="button"
						onClick={handleSendTransaction}
						disabled={!isAddressValid || !isAmountValid || isPending}
					>
						{isPending ? (
							<span className="loading loading-spinner" />
						) : (
							`Send ${balance.symbol}`
						)}
					</button>
				) : (
					<ConnectWallet />
				)}

				{/* Transaction Errors */}
				{transactionError && (
					<span className="text-error mt-1 text-xs">
						{(transactionError as BaseError).shortMessage}
					</span>
				)}
			</div>

			{txHash && (
				<LastTransaction
					txHash={txHash}
					isConfirming={isConfirming}
					isConfirmed={isConfirmed}
					receiptError={receiptError}
				/>
			)}
		</div>
	)
}

export default SendTransaction
