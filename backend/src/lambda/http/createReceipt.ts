import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateReceiptRequest } from '../../requests/CreateReceiptRequest'
import { getUserId } from '../utils';
import { createReceipt } from '../../businessLogic/receipts'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newReceipt: CreateReceiptRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const item = await createReceipt(
      userId,
      newReceipt.receiptName,
      newReceipt.purchaseDate,
      newReceipt.amount,
      newReceipt.category
    )

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item
      })
    } 
  }
)

handler.use(
  cors({
    credentials: true,
  })
)
