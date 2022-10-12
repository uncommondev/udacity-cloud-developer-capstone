export interface UpdateReceiptRequest {
  receiptName: string
  purchaseDate: string
  canBeExpensed: boolean
  amount: number
  category: string
}