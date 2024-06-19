import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Box } from '@mui/material'
import { Address, BaseError } from 'viem'
import { WaitForTransactionReceiptErrorType } from 'wagmi/actions'
import { truncateAddress } from '../lib/address'

interface LastTransactionProps {
  txHash: Address
  isConfirming: boolean
  isConfirmed: boolean
  receiptError: WaitForTransactionReceiptErrorType | null
}

function LastTransaction({ txHash, isConfirming, isConfirmed, receiptError }: LastTransactionProps) {
  return (
    <TableContainer className="last-container">
      <Typography variant="body2">Last Transaction Sent</Typography>
      <Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tx Hash</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell scope="row">
                {truncateAddress(txHash)}
              </TableCell>
              <TableCell align="right">
                {isConfirming && <Typography variant="caption">Waiting for confirmation...</Typography>}
                {isConfirmed && <Typography variant="caption">Transaction confirmed.</Typography>}
                {receiptError && (
                  <Typography color="error" fontSize={12}>
                    {(receiptError as BaseError).shortMessage}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </TableContainer>
  )
}

export default LastTransaction
