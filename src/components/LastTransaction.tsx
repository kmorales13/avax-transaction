import type { Address, BaseError } from "viem"
import type { WaitForTransactionReceiptErrorType } from "wagmi/actions"
import { truncateAddress } from "../lib/address"

interface LastTransactionProps {
	txHash: Address
	isConfirming: boolean
	isConfirmed: boolean
	receiptError: WaitForTransactionReceiptErrorType | null
}

function LastTransaction({
	txHash,
	isConfirming,
	isConfirmed,
	receiptError,
}: LastTransactionProps) {
	function handleCopyHash() {
		navigator?.clipboard?.writeText(txHash)
	}

	return (
		<div className="mt-8 mb-4">
			<span className="text-sm font-semibold">Last Transaction Sent</span>
			<table className="table table-xs">
				<thead>
					<tr>
						<th>Tx Hash</th>
						<th align="right">Status</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="tooltip tooltip-primary tooltip-bottom" data-tip="Click to copy">
							<span
								className="text-xs link link-hover link-primary"
								onClick={handleCopyHash}
							>
								{truncateAddress(txHash)}
							</span>
						</td>
						<td align="right">
							{isConfirming && (
								<span className="text-xs">Waiting for confirmation...</span>
							)}
							{isConfirmed && (
								<span className="text-xs">Transaction confirmed.</span>
							)}
							{receiptError && (
								<span className="text-error text-xs">
									{(receiptError as BaseError).shortMessage}
								</span>
							)}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

export default LastTransaction
