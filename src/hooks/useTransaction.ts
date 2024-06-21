import { type Address, parseEther, encodeFunctionData, parseUnits } from "viem"
import { USDC_TOKEN_ABI, USDC_TOKEN_DECIMALS } from "../lib/usdc"
import { useSendTransaction } from "wagmi"

export function useTransaction() {
	const {
		data: hash,
		error,
		isPending,
		isSuccess,
		sendTransaction,
	} = useSendTransaction()

	async function send(
		to: Address,
		amount: string,
		tokenAddress: Address | undefined,
	) {
		// prepare transaction config based on token type
		const transactionConfig = tokenAddress
			? {
					to: tokenAddress,
					data: encodeFunctionData({
						// hardcoded for USDC
						abi: USDC_TOKEN_ABI,
						functionName: "transfer",
						args: [to, parseUnits(amount, USDC_TOKEN_DECIMALS)],
					}),
				}
			: {
					to,
					value: parseEther(amount),
				}

		// send transaction using wagmi
		sendTransaction(transactionConfig)
	}

	return { hash, error, isPending, isSuccess, send }
}
