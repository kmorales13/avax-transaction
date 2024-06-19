import { useEffect, useMemo, useState } from "react"
import { BaseError, useAccount, useBalance, useWaitForTransactionReceipt } from "wagmi"
import { Address, formatUnits } from "viem"
import {
  Box,
  Container,
  Typography,
  Tab,
  Tabs,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  CircularProgress,
  Stack} from "@mui/material"
import { USDC_TOKEN_ADDRESS } from "../../lib/usdc"
import { useTransaction } from "../../hooks/useTransaction"
import AddressInput from "../../components/AddressInput"
import AmountInput from "../../components/AmountInput"
import ConnectWallet from "../wallet/ConnectWallet"
import LastTransaction from "../../components/LastTransaction"

import "./SendTransaction.styles.css"

function SendTransaction() {
  const [tokenAddress, setTokenAddress] = useState<Address>()
  const [address, setAddress] = useState<Address>()
  const [isAddressValid, setIsAddressValid] = useState(false)
  const [amount, setAmount] = useState('')
  const [isAmountValid, setIsAmountValid] = useState(false)

  const { address: wallet } = useAccount()
  const { data: balance, isLoading, error: balanceError, refetch: fetchBalance } = useBalance({ address: wallet, token: tokenAddress })
  const { hash: txHash, isPending, isSuccess, error: transactionError, send } = useTransaction()

  // last sent transaction receipt
  const { error: receiptError, isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    })

  useEffect(() => {
    fetchBalance() // refetch balance when transaction status updates

    // if successful, clean form
    if (isSuccess) {
      resetForm()
    }
  }, [transactionError, receiptError, isSuccess, isConfirmed])

  // parse balance value to display
  const balanceValue = useMemo(() =>
    balance ? Number(parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(6)) : undefined,
    [balance?.value])

  function handleAddressChange(address: Address, isValid: boolean) {
    setAddress(address)
    setIsAddressValid(isValid)
  }

  function handleAmountChange(amount: string, isValid: boolean) {
    setAmount(amount)
    setIsAmountValid(isValid)
  }

  function handleChangeToken(event: SelectChangeEvent) {
    setTokenAddress(event.target.value === "AVAX" ? undefined : USDC_TOKEN_ADDRESS)
  }

  async function handleSendTransaction() {
    if (address && amount) {
      send(address, amount, tokenAddress)
    }
  }

  function resetForm() {
    setAddress(undefined)
    setIsAddressValid(false)
    setAmount('')
    setIsAmountValid(false)
  }

  return (
    <Container className="send-transaction" maxWidth="sm">
      <Box>
        <Stack>
          <Tabs className="tabs" value={0} centered>
            <Tab label="Token" />
            <Tab label="Collectible" />
          </Tabs>
        </Stack>

        <Box>
          {/* Address to Send To */}
          <Box>
            <Typography variant="body2">Send To</Typography>
            <AddressInput address={address} onChange={handleAddressChange} />
          </Box>

          <Box>
            {/* Amount to Send */}
            <Stack className="balance-stack">
              <Typography variant="body2">Amount</Typography>
              {wallet && isLoading ? (
                <CircularProgress size={16} />
              ) : balance ? (
                <Typography>
                  Balance: {balanceValue} {balance.symbol}
                </Typography>
              ) : balanceError ? (
                <Typography color="error">{(balanceError as BaseError).shortMessage}</Typography>
              ) : null}
            </Stack>

            {/* Token to Send */}
            <Stack className="amount-stack">
              <Select defaultValue="AVAX" onChange={handleChangeToken} disabled={!wallet} variant="standard" disableUnderline>
                <MenuItem value="AVAX">AVAX</MenuItem>
                <MenuItem value="USDC">USDC</MenuItem>
              </Select>
              <AmountInput amount={amount} balance={balance} onChange={handleAmountChange} />
            </Stack>
          </Box>

          {/* Send Transaction */}
          {balance ? (
            <Button
              className="send-button"
              onClick={handleSendTransaction}
              disabled={!isAddressValid || !isAmountValid || isPending}
            >
              {isPending ? <CircularProgress size={20} /> : `Send ${balance.symbol}`}
            </Button>
          ) : (
            <ConnectWallet />
          )}

          {/* Transaction Errors */}
          {transactionError && (
            <Typography color="error" mt={1} fontSize={12}>
              {(transactionError as BaseError).shortMessage}
            </Typography>
          )}
        </Box>
      </Box>

      {txHash && (
        <LastTransaction
          txHash={txHash}
          isConfirming={isConfirming}
          isConfirmed={isConfirmed}
          receiptError={receiptError}
        />
      )}
    </Container>
  )
}

export default SendTransaction
