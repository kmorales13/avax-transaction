import { render, screen, fireEvent } from "@testing-library/react"
import AmountInput from "./AmountInput"
import { describe, it, vi, beforeEach, expect } from "vitest"
import { GetBalanceReturnType } from "wagmi/actions"
import { formatUnits } from "viem"

vi.mock("viem", () => ({
  formatUnits: vi.fn(),
}))

describe("AmountInput", () => {
  const mockOnChange = vi.fn()

  const balance: GetBalanceReturnType = {
    value: BigInt(1000000000000000000),
    decimals: 18,
    formatted: "1.0",
    symbol: "TOKEN"
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(formatUnits).mockReturnValue("1.0")
  })

  it("does not display error message with valid amount", () => {
    render(<AmountInput amount="" balance={balance} onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText("0.0")

    fireEvent.change(input, { target: { value: "0.5" } })

    expect(mockOnChange).toHaveBeenCalledWith("0.5", true)
    expect(screen.queryByText("Invalid amount or exceeds balance")).not.toBeInTheDocument()
  })

  it("does display error message with invalid amount", () => {
    render(<AmountInput amount="" balance={balance} onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText("0.0")

    fireEvent.change(input, { target: { value: "1.5" } })

    expect(mockOnChange).toHaveBeenCalledWith("1.5", false)
    expect(screen.getByText("Invalid amount or exceeds balance")).toBeInTheDocument()
  })

  it("handles setting max value", () => {
    render(<AmountInput amount="" balance={balance} onChange={mockOnChange} />)
    const button = screen.getByText("Max")
    fireEvent.click(button)

    expect(mockOnChange).toHaveBeenCalledWith("1", true)
  })

  it("disables input and max button when balance is undefined", () => {
    render(<AmountInput amount="" balance={undefined} onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText("0.0")
    const button = screen.getByText("Max")

    expect(input).toBeDisabled()
    expect(button).toBeDisabled()
  })
})
