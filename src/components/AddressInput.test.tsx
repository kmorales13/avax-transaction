import { render, screen, fireEvent } from "@testing-library/react";
import AddressInput from "./AddressInput";
import { isAddress } from "viem/utils";
import { describe, it, beforeEach, vi, expect } from "vitest";

vi.mock("viem/utils", () => ({
  isAddress: vi.fn(),
}));

describe("AddressInput", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not display error message with valid address", () => {
    vi.mocked(isAddress).mockReturnValue(true);
    render(<AddressInput address={undefined} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText("Enter 0x Address");

    fireEvent.change(input, { target: { value: "0x1234567890abcdef1234567890abcdef12345678" } });

    expect(mockOnChange).toHaveBeenCalledWith("0x1234567890abcdef1234567890abcdef12345678", true);
    expect(screen.queryByText("Invalid Ethereum address")).not.toBeInTheDocument();
  });

  it("does display error message with invalid address", () => {
    vi.mocked(isAddress).mockReturnValue(false);
    render(<AddressInput address={undefined} onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText("Enter 0x Address");

    fireEvent.change(input, { target: { value: "0xInvalidAddress" } });

    expect(mockOnChange).toHaveBeenCalledWith("0xInvalidAddress", false);
    expect(screen.getByText("Invalid Ethereum address")).toBeInTheDocument();
  });
});
