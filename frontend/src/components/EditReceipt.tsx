import * as React from 'react'
import Auth from '../auth/Auth'
import {
  Button,
  Divider,
  Grid,
  Header,
  Input,
  Loader
} from 'semantic-ui-react'
import { History } from 'history'
import { getReceipts, patchReceipt } from '../api/receipt-api'
import { Receipt } from '../types/Receipt'

interface EditReceiptProps {
  match: {
    params: {
      receiptId: string
    }
  }
  auth: Auth
  history: History
}

interface EditReceiptProps {
  match: {
    params: {
      receiptId: string
    }
  }
  auth: Auth
}

interface ReceiptsState {
  currentReceipt: Receipt
  ReceiptName: string
  ReceiptDate: string
  ReceiptAmount: number
  ReceiptCategory: string
  ReceiptCanBeExpensed: boolean
  loadingReceipts: boolean
}

export class EditReceipt extends React.PureComponent<EditReceiptProps, ReceiptsState> {

  state: ReceiptsState = {
    currentReceipt : {
      receiptId: '',
      userId: '',
      receiptName: '',
      purchaseDate: '',
      createdAt: '',
      canBeExpensed: false,
      amount: 0,
      category: '',
      attachmentUrl: ''
    },
    ReceiptName: '',
    ReceiptDate: '',
    ReceiptAmount: 0,
    ReceiptCategory: 'Business',
    ReceiptCanBeExpensed: false,
    loadingReceipts: true
  }
  async componentDidMount() {
    try {
      const receipts: Receipt[] = await getReceipts(this.props.auth.getIdToken())
      // Filter array for the receipt with the matching receiptId and return object
      const currentReceipt = receipts.filter(receipt => receipt.receiptId === this.props.match.params.receiptId)[0]

      this.setState({
        currentReceipt,
        ReceiptName: currentReceipt.receiptName,
        ReceiptDate: currentReceipt.purchaseDate,
        ReceiptAmount: currentReceipt.amount,
        ReceiptCategory: currentReceipt.category ? currentReceipt.category : 'Other',
        ReceiptCanBeExpensed: currentReceipt.canBeExpensed,
        loadingReceipts: false
      })
    }
 catch (e) {
      alert(`Failed to fetch receipts: ${(e as Error).message}`)
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ReceiptName: event.target.value })
  }

  handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ReceiptDate: event.target.value })
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ReceiptAmount: parseInt(event.target.value) })
  }

  handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ ReceiptCategory: event.target.value })
  }

  handleExpenseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ReceiptCanBeExpensed: event.target.checked })
  }

  onReceiptUpdate = async () => {
    try {
      const updatedReceipt = await patchReceipt(this.props.auth.getIdToken(), this.props.match.params.receiptId, {
        receiptName: this.state.ReceiptName,
        purchaseDate: this.state.ReceiptDate,
        amount: this.state.ReceiptAmount,
        category: this.state.ReceiptCategory,
        canBeExpensed: this.state.ReceiptCanBeExpensed
      })
      alert('Receipt updated')
      // Return to home page
      this.props.history.push(`/`)

    }
      catch (e) {
        alert(`Failed to update receipt: ${(e as Error).message}`)
      }
    }

  render() {
    return (
      <div>
        <Header as="h1">Receipts</Header>

        {this.renderCreateReceiptInput()}
      </div>
    )
  }

  renderCreateReceiptInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          Receipt Name:
          <Input
            fluid
            actionPosition="left"
            placeholder="Business meal at the Cheesecake Factory"
            onChange={this.handleNameChange}
            value={this.state.ReceiptName || ''}
          />
          Amount Spent (USD):
          <Input
            placeholder="Amount spent"
            fluid
            actionPosition="left"
            value={this.state.ReceiptAmount || ''}
            onChange={this.handleAmountChange}
          />
          Category:
          <select 
              value={this.state.ReceiptCategory || "Business"}  
              onChange={this.handleCategoryChange}
              style={{ padding: '5px', margin: '5px' }}
            >
            <option value="Business">Business</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
          Can Be Expensed? 
          <Input
            type="checkbox"
            checked={this.state.ReceiptCanBeExpensed}
            onChange={this.handleExpenseChange}
            style={{ padding: '5px', margin: '5px' }}
          />
          <br/>
          Purchase Date (DD-MM-YYYY):
          <Input
            placeholder="Purchase Date"
            fluid
            actionPosition="left"
            value={this.state.ReceiptDate || ''}
            onChange={this.handleDateChange}
          />
          <Button 
            color="teal"
            style={{ color: 'white' }}
            text="Upload Receipt"
            onClick={this.onReceiptUpdate}
            title="Create New Receipt"
          >Update Receipt</Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
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
}