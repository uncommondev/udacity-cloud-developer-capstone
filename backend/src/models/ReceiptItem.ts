export interface ReceiptItem {
  userId: string
  receiptId: string
  createdAt: string
  receiptName: string
  purchaseDate: string
  canBeExpensed: boolean
  amount: number
  attachmentUrl?: string
  category?: string
}
