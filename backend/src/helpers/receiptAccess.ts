import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ReceiptItem } from '../models/ReceiptItem'
import { UpdateReceiptRequest } from '../requests/UpdateReceiptRequest'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('ReceiptsAccess')

const docClient: DocumentClient = new DocumentClient()
const receiptsTable = process.env.RECEIPTS_TABLE
const indexName = process.env.INDEX_NAME

export class ReceiptAccess {


    static async getReceiptItem(userId: string, receiptId: string): Promise<ReceiptItem> {
        logger.info('getReceiptItem', { userId, receiptId })

        const result = await docClient.get({
            TableName: receiptsTable,
            Key: {
                userId,
                receiptId
            }
        }).promise()

        const item = result.Item
        return item as ReceiptItem
    }

    static async getAllReceipts(): Promise<ReceiptItem[]> {
        logger.info('getAllReceipts')

        const result = await docClient.scan({
            TableName: receiptsTable
        }).promise()

        const items = result.Items
        return items as ReceiptItem[]
    }

    static async getReceiptsForUser(userId: string): Promise<ReceiptItem[]> {
        logger.info('getReceiptsForUser', { userId })
        const result = await docClient.query({
            TableName: receiptsTable,
            IndexName: indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as ReceiptItem[]
    }

    static async createReceiptItem(ReceiptItem: ReceiptItem): Promise<ReceiptItem> {
        logger.info('createReceiptItem', { ReceiptItem })
        await docClient.put({
            TableName: receiptsTable,
            Item: ReceiptItem
        }).promise()

        return ReceiptItem
    }

    static async deleteReceiptItem(userId: string, receiptId: string): Promise<void> {
        logger.info('deleteReceiptItem', { userId, receiptId })
        await docClient.delete({
            TableName: receiptsTable,
            Key: {
                userId,
                receiptId
            }
        }).promise()
    }

    static async updateReceiptItem(receiptUpdate: UpdateReceiptRequest, receiptId: string, userId: string): Promise<void> {
        logger.info('updateReceiptItem', { userId, receiptId, receiptUpdate })
        await docClient.update({
            TableName: receiptsTable,
            Key: {
                userId,
                receiptId
            },
            UpdateExpression: 'set receiptName = :receiptName, purchaseDate = :purchaseDate, canBeExpensed = :canBeExpensed, amount = :amount, category = :category',
            ExpressionAttributeValues: {
                ':receiptName': receiptUpdate.receiptName,
                ':purchaseDate': receiptUpdate.purchaseDate,
                ':canBeExpensed': receiptUpdate.canBeExpensed,
                ':amount': receiptUpdate.amount,
                ':category': receiptUpdate.category
            },
        }).promise()
    }

    static async updateReceiptAttachmentUrl(userId: string, receiptId: string, attachmentUrl: string): Promise<void> {
        logger.info('updateReceiptAttachmentUrl', { userId, receiptId, attachmentUrl })
        await docClient.update({
            TableName: receiptsTable,
            Key: {
                userId,
                receiptId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            }
        }).promise()
    }

    static async generateUploadUrl(userId: string, receiptId: string): Promise<string> {
        logger.info('generateUploadUrl', { userId, receiptId })
        const s3 = new XAWS.S3({ signatureVersion: 'v4' })
        const urlExpiration = process.env.SIGNED_URL_EXPIRATION
        const bucketName = process.env.ATTACHMENT_S3_BUCKET

        const uploadUrl = s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: receiptId,
            Expires: parseInt(urlExpiration)
        })

        await this.updateReceiptAttachmentUrl(userId, receiptId, `https://${bucketName}.s3.amazonaws.com/${receiptId}`)  

        return uploadUrl
    }

    static async getUploadUrl(userId: string, receiptId: string): Promise<string> {
        logger.info('getUploadUrl', { userId, receiptId })
        const s3 = new XAWS.S3({ signatureVersion: 'v4' })
        const urlExpiration = process.env.SIGNED_URL_EXPIRATION
        const bucketName = process.env.ATTACHMENT_S3_BUCKET

        const uploadUrl = s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: receiptId,
            Expires: parseInt(urlExpiration)
        })

        return uploadUrl
    }
}
