# AVAX Web3 Transaction App

This example application allows users to send AVAX and USDC tokens on the Avalanche Fuji testnet. Built with `React` and leveraging the power of `wagmi`, this app offers a seamless way to connect your wallet and perform transactions. Here's a quick rundown of the codebase and the approach I took.

## Overview

The app is structured into several key components:

- **AddressInput**: Captures and validates Ethereum addresses.
- **AmountInput**: Allows users to input the amount they wish to send, with validation against their balance.
- **SendTransaction**: The main feature component, handling the logic for sending transactions.
- **ConnectWallet**: Manages wallet connections.
- **LastTransaction**: Displays the status of the most recent transaction.

## Key Features

1. **Wallet Connection**: Users can connect their wallets using the `ConnectWallet` component, which utilizes the `wagmi` library for easy integration with `Core Wallet`.

2. **Address and Amount Validation**: The `AddressInput` and `AmountInput` components ensure users provide valid input before proceeding with a transaction. Address validation uses the `isAddress` function, while amount validation checks against the user's balance.

3. **Transaction Management**: The `SendTransaction` component orchestrates the transaction process, from selecting the token (AVAX or USDC) to sending the transaction and handling the response. It also displays the last transaction's status using the `LastTransaction` component.

4. **React Query Integration**: The app uses `@tanstack/react-query` for managing server state, ensuring smooth and efficient data fetching and synchronization.

## Challenges and Considerations

### Address Validation

Validating Ethereum addresses is straightforward, but ensuring that users provide the correct format and a valid address is crucial for preventing transaction errors.

### Balance Handling

Fetching and displaying accurate balances required careful handling of asynchronous data. Using `useEffect` to refetch balances and handle updates helped manage this smoothly.

### Transaction Confirmation

Tracking the status of transactions until they are confirmed or fail was a bit tricky. The `useWaitForTransactionReceipt` hook from `wagmi` played a key role in simplifying this process.

### User Experience

Providing a seamless and intuitive user experience was a primary goal. Ensuring real-time feedback on transaction status and input validation helps users feel confident in their actions.

## How to Run

1. **Install dependencies**:
   ```bash
   npm install
2. **Start the development server**:
   ```bash
   npm run dev
3. **Connect your wallet**: 
Ensure you have `Core Wallet` installed and connected to the Avalanche Fuji testnet.
4. **Transact**: 
Input the recipient address, select the token and amount, and hit send!