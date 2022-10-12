export interface UpdateReceiptRequest {
  receiptName: string
  amount: number
  canBeExpensed: boolean
  category?: string
  purchaseDate: string
}