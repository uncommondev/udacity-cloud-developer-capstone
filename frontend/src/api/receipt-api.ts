import { apiEndpoint } from '../config'
import { Receipt } from '../types/Receipt';
import { CreateReceiptRequest } from '../types/CreateReceiptRequest';
import Axios from 'axios'
import { UpdateReceiptRequest } from '../types/UpdateReceiptRequest';

export async function getReceipts(idToken: string): Promise<Receipt[]> {

  const response = await Axios.get(`${apiEndpoint}/receipts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  return response.data.items
}

export async function createReceipt(
  idToken: string,
  newReceipt: CreateReceiptRequest
): Promise<Receipt> {
  console.dir(newReceipt)
  const response = await Axios.post(`${apiEndpoint}/receipts`,  JSON.stringify(newReceipt), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchReceipt(
  idToken: string,
  receiptId: string,
  updatedReceipt: UpdateReceiptRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/receipts/${receiptId}`, JSON.stringify(updatedReceipt), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteReceipt(
  idToken: string,
  receiptId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/receipts/${receiptId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  receiptId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/receipts/${receiptId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
