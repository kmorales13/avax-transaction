import React, { useMemo, useState } from "react"
import { Button, TextField } from "@mui/material"
import { GetBalanceReturnType } from "wagmi/actions"
import { formatUnits } from "viem"

interface AmountInputProps {
  amount: string
  balance: GetBalanceReturnType | undefined
  onChange: (amount: string, isValid: boolean) => void
}

function AmountInput({ amount, balance, onChange }: AmountInputProps) {
  const [error, setError] = useState(false)
  const maxBalance = useMemo(() => balance ? parseFloat(formatUnits(balance.value, balance.decimals)) : -1, [balance?.value])

  function updateValue(value: string) {
    // only allow positive numbers with decimals
    if (/^\d*\.?\d*$/.test(value)) { 
      const amountValue = parseFloat(value)
      const valid = amountValue > 0 && amountValue <= maxBalance
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
      updateValue(maxBalance.toString())
    }
  }

  return (
    <TextField
      className="amount-input"
      name="amount"
      placeholder="0.0"
      value={amount}
      onChange={handleChange}
      error={error}
      helperText={error && "Invalid amount or exceeds balance"}
      disabled={!balance}
      autoComplete="off"
      fullWidth
      InputProps={{
        endAdornment: <Button onClick={handleSetMax} disabled={!balance}>Max</Button>,
      }}
    />
  )
}

export default AmountInput
