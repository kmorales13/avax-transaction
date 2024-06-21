import { injected } from "wagmi/connectors"
import { useAccount, useConnect } from "wagmi"
import type { BaseError } from "viem"

function ConnectWallet() {
	const { connect: connectWallet, error: connectError } = useConnect()
	const { isConnected } = useAccount()

	if (isConnected) return null // do not render if wallet is connected

	// handle wallet connection
	function handleConnect() {
		connectWallet({ connector: injected() })
	}

	return (
		<div className="card w-full bg-base-100 outline">
			<div className="card-body p-4 text-center">
				<h3 className="font-semibold">Wallet Not Connected</h3>
				<span className="text-sm">
					Connect with your wallet to use all the features Core has to offer!
				</span>
				<button
					className="btn btn-primary btn-xs"
					type="button"
					onClick={handleConnect}
				>
					Connect Wallet to Transact
				</button>
				<span
					className={`label-text-alt text-xs text-error ${connectError ? "visible" : "invisible"}`}
				>
					{(connectError as BaseError)?.shortMessage}
				</span>
			</div>
		</div>
	)
}

export default ConnectWallet
