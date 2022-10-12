import { ReceiptAccess } from './receiptAccess'
import { ReceiptItem } from '../models/ReceiptItem'
import { CreateReceiptRequest } from '../requests/CreateReceiptRequest'
import { UpdateReceiptRequest } from '../requests/UpdateReceiptRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('receipts')

export async function getReceiptsForUser(userId: string): Promise<ReceiptItem[]> {
    logger.info('Getting all receipts')
    return ReceiptAccess.getReceiptsForUser(userId)
}

export async function createReceipt(createReceiptRequest: CreateReceiptRequest, userId: string): Promise<ReceiptItem> {
    logger.info('Creating receipt')
    const receiptId = uuid.v4()
    const createdAt = new Date().toISOString()
    const purchaseDate = new Date().toISOString()
    const receiptItem = {
        userId,
        receiptId,
        createdAt,
        purchaseDate,
        amount: 0,
        canBeExpensed: false,
        attachmentUrl: null,
        category: null,
        ...createReceiptRequest
    }
    return ReceiptAccess.createReceiptItem(receiptItem)
}

export async function updateReceipt(updateReceiptRequest: UpdateReceiptRequest, receiptId: string, userId: string): Promise<void> {
    logger.info('Updating receipt')
    return ReceiptAccess.updateReceiptItem(updateReceiptRequest, receiptId, userId)
}

export async function deleteReceipt(receiptId: string, userId: string): Promise<void> {
    logger.info('Deleting receipt')
    return ReceiptAccess.deleteReceiptItem(receiptId, userId)
}

export async function createAttachmentPresignedUrl(receiptId: string, userId: string): Promise<string> {
    logger.info('Creating attachment presigned url')
    return ReceiptAccess.generateUploadUrl(receiptId, userId)
}

export async function getReceipt(receiptId: string, userId: string): Promise<ReceiptItem> {
    logger.info('Getting receipt item')
    return ReceiptAccess.getReceiptItem(receiptId, userId)
}

export async function updateReceiptAttachmentUrl(receiptId: string, userId: string, attachmentUrl: string): Promise<void> {
    logger.info('Updating receipt attachment url')
    return ReceiptAccess.updateReceiptAttachmentUrl(receiptId, userId, attachmentUrl)
}

export async function updateReceiptItem(updateReceiptRequest: UpdateReceiptRequest, receiptId: string, userId: string): Promise<void> {
    logger.info('Updating receipt item')
    return ReceiptAccess.updateReceiptItem(updateReceiptRequest, receiptId, userId)
}

export async function deleteReceiptItem(receiptId: string, userId: string): Promise<void> {
    logger.info('Deleting receipt item')
    return ReceiptAccess.deleteReceiptItem(receiptId, userId)
}

export async function getReceiptItem(receiptId: string, userId: string): Promise<ReceiptItem> {
    logger.info('Getting receipt item')
    return ReceiptAccess.getReceiptItem(receiptId, userId)
}
