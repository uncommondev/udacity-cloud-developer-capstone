import { createLogger } from '../utils/logger'
import { ReceiptItem } from '../models/ReceiptItem'
import { ReceiptAccess } from '../helpers/receiptAccess' 
import { UpdateReceiptRequest } from '../requests/UpdateReceiptRequest'
import * as uuid from 'uuid'

const logger = createLogger('businessLogicreceipts')

export async function getReceipt(
    userId: string,
    receiptId: string
    ): Promise<ReceiptItem> {
    logger.info('getReceipt', { userId, receiptId })
    
    return await ReceiptAccess.getReceiptItem(userId, receiptId)
    }

export async function getReceipts(): Promise<ReceiptItem[]> {
    logger.info('getReceipts')
    
    return await ReceiptAccess.getAllReceipts()
    }


export async function getReceiptsForUser(userId: string): Promise<ReceiptItem[]> {
  logger.info('getReceiptsForUser', { userId })

  const result = await ReceiptAccess.getReceiptsForUser(userId)

  const items = result
  return items as ReceiptItem[]
}

export async function createReceipt(
    userId: string,
    receiptName: string,
    purchaseDate: string,
    amount: number,
    category: string,
    ): Promise<ReceiptItem> {
    const receiptId = uuid.v4()
    
    const newItem = {
        userId,
        receiptId,
        createdAt: new Date().toISOString(),
        receiptName,
        purchaseDate,
        canBeExpensed: false,
        amount,
        attachmentUrl: null,
        category
    }
    
    logger.info('createReceipt', { newItem })
    
    return await ReceiptAccess.createReceiptItem(newItem)
    }

export async function deleteReceipt(
    userId: string,
    receiptId: string
    ): Promise<string> {
    logger.info('deleteReceipt', { userId, receiptId })
    
    await ReceiptAccess.deleteReceiptItem(userId, receiptId)
    
    return 
    }

export async function updateReceipt(
    userId: string,
    receiptId: string,
    updatedReceipt: UpdateReceiptRequest
    ): Promise<ReceiptItem> {
    logger.info('updateReceipt', { userId, receiptId, updatedReceipt })
    
    await ReceiptAccess.updateReceiptItem(updatedReceipt, receiptId, userId)
    
    return 
    }

export async function updateReceiptAttachment(
    userId: string,
    receiptId: string,
    attachmentUrl: string
    ): Promise<ReceiptItem> {
    logger.info('updateReceiptAttachment', { userId, receiptId, attachmentUrl })
    
    await ReceiptAccess.updateReceiptAttachmentUrl(userId, receiptId, attachmentUrl)

    return 
    }

export async function generateUploadUrl(
    userId: string,
    receiptId: string
    ): Promise<string> {
    logger.info('generateUploadUrl', { userId, receiptId })
    
    return await ReceiptAccess.generateUploadUrl(userId, receiptId)
    }

export async function getUploadUrl(
    userId: string,
    receiptId: string
    ): Promise<string> {
    logger.info('getUploadUrl', { userId, receiptId })
    
    return await ReceiptAccess.getUploadUrl(userId, receiptId)
    }
