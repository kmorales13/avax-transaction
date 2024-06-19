import { Button, Stack, Typography } from "@mui/material"
import { injected } from "wagmi/connectors"
import { useAccount, useConnect } from "wagmi"
import { BaseError } from "viem"

function ConnectWallet() {
  const { connect: connectWallet, error: connectError } = useConnect()
  const { isConnected } = useAccount()

  if (isConnected) return null // do not render if wallet is connected

  // handle wallet connection
  function handleConnect() {
    connectWallet({ connector: injected() })
  }

  return (
    <Stack className="connect-wallet">
      <Typography variant="subtitle1">Wallet Not Connected</Typography>
      <Typography variant="caption">Connect with your wallet to use all the features Core has to offer!</Typography>
      <Button className="connect-button" onClick={handleConnect}>Connect Wallet to Transact</Button>
      {connectError && (
        <Typography color="error" mt={1} fontSize={12}>
          {(connectError as BaseError).shortMessage}
        </Typography>
      )}
    </Stack>
  )
}

export default ConnectWallet
