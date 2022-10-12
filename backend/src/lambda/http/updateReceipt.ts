import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateReceipt } from '../../businessLogic/receipts'
import { UpdateReceiptRequest } from '../../requests/UpdateReceiptRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const receiptId = event.pathParameters.receiptId
    const updatedReceipt: UpdateReceiptRequest = JSON.parse(event.body)
  
    const userId = getUserId(event)
    await updateReceipt(
      userId,
      receiptId,
      updatedReceipt
    )

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
    })
  )
