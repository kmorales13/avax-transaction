import React, { useState } from "react"
import { TextField } from "@mui/material"
import { isAddress } from "viem/utils"
import { Address } from "viem"

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
    <TextField
      className="address-input"
      name="address"
      value={address || ""}
      placeholder="Enter 0x Address"
      onChange={handleChange}
      error={error}
      helperText={error && "Invalid Ethereum address"}
      autoComplete="off"
      fullWidth
    />
  )
}

export default AddressInput
