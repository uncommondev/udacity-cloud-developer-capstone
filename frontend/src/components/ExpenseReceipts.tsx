import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Loader
} from 'semantic-ui-react'

import { deleteReceipt, getReceipts,  } from '../api/receipt-api'
import Auth from '../auth/Auth'
import { Receipt } from '../types/Receipt'

interface ReceiptsProps {
  auth: Auth
  history: History
}

interface ReceiptsState {
  receipts: Receipt[]
  newReceiptName: string
  newReceiptDate: string
  newReceiptAmount: number
  newReceiptCategory: string
  newCanReceiptBeExpensed: boolean
  loadingReceipts: boolean
}

export class ExpenseReceipts extends React.PureComponent<ReceiptsProps, ReceiptsState> {
  state: ReceiptsState = {
    receipts: [],
    newReceiptName: '',
    newReceiptDate: '',
    newReceiptAmount: 0,
    newReceiptCategory: 'Business',
    newCanReceiptBeExpensed: false,
    loadingReceipts: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReceiptName: event.target.value })
  }

  handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReceiptDate: event.target.value })
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReceiptAmount: parseInt(event.target.value) })
  }

  handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ newReceiptCategory: event.target.value })
  }

  handleCanReceiptBeExpensedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCanReceiptBeExpensed: event.target.checked })
  }

  onEditButtonClick = (receiptId: string) => {
    this.props.history.push(`/receipts/${receiptId}/edit`)
  }

  onUploadButtonClick = (receiptId: string) => {
    this.props.history.push(`/receipts/${receiptId}/upload`)
  }

  onReceiptDelete = async (receiptId: string) => {
    try {
      await deleteReceipt(this.props.auth.getIdToken(), receiptId)
      this.setState({
        receipts: this.state.receipts.filter(receipt => receipt.receiptId !== receiptId)
      })
    } catch {
      alert('Receipt deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const receipts = await getReceipts(this.props.auth.getIdToken())
      const expenseReceipts = receipts.filter(receipt => receipt.canBeExpensed)
      this.setState({
        receipts: expenseReceipts,
        loadingReceipts: false
      })
    } catch (e) {
      alert(`Failed to fetch receipts: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Receipts That Can Be Expensed</Header>
        {this.renderReceipts()}
      </div>
    )
  }

  renderReceipts() {
    if (this.state.loadingReceipts) {
      return this.renderLoading()
    }

    return this.renderReceiptsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Receipts
        </Loader>
      </Grid.Row>
    )
  }

  renderReceiptsList() {
    return (
      <Grid padded>
        {this.state.receipts.map((receipt, pos) => {
          return (
            <Grid.Row key={receipt.receiptId}>
              <Grid.Column width={10} verticalAlign="middle">
                {receipt.receiptName}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {receipt.purchaseDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
              <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(receipt.receiptId)}
                >
                  <Icon name="edit" />
                </Button>
                <Button
                  icon
                  color="green"
                  onClick={() => this.onUploadButtonClick(receipt.receiptId)}
                >
                  <Icon name="image" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onReceiptDelete(receipt.receiptId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {receipt.attachmentUrl && (
                <Image src={receipt.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}