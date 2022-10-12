export interface CreateReceiptRequest {
  receiptName: string
  purchaseDate: string
  amount: number
  category?: string,
  canBeExpensed: boolean
}
