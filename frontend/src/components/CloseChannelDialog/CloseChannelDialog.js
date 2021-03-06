import React, {useState, useEffect} from 'react';
import {
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Box,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import { MoreVert as MoreIcon } from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

import Widget from "../../components/Widget";
import SqueakThreadItem from "../../components/SqueakThreadItem";

import {
  lndCloseChannelRequest,
} from "../../squeakclient/requests"


export default function CloseChannelDialog({
  open,
  txId,
  outputIndex,
  handleClose,
  ...props
}) {
  var classes = useStyles();
  const history = useHistory();

  var [amount, setAmount] = useState(0);

  const resetFields = () => {
    setAmount(0);
  };

  const handleChangeAmount = (event) => {
    setAmount(event.target.value);
  };

  const handleResponse = (response) => {
    // TODO: handle streaming response.
    // TODO: go to channel page instead of showing alert.
  };

  const handleErr = (err) => {
    alert('Error closing channel: ' + err);
  };

  const closeChannel = (txId, outputIndex) => {
    lndCloseChannelRequest(txId, outputIndex, handleResponse, handleErr);
  };

  function handleSubmit(event) {
    event.preventDefault();
    console.log( 'txId:', txId);
    console.log( 'outputIndex:', outputIndex);
    closeChannel(txId, outputIndex);
    handleClose();
  }

  function TxIdInput() {
    return (
      <TextField
        id="txid-textarea"
        label="TxId"
        required
        autoFocus
        value={txId}
        fullWidth
        inputProps={{
           readOnly: true,
        }}
      />
    )
  }

  function OutputIndexInput() {
    return (
      <TextField
        id="outputindex-textarea"
        label="Output Index"
        required
        autoFocus
        value={outputIndex}
        fullWidth
        inputProps={{
           readOnly: true,
        }}
      />
    )
  }

  function LocalFundingAmountInput() {
    return (
      <TextField
        id="amount-textarea"
        label="Local Funding Amount"
        required
        autoFocus
        value={amount}
        onChange={handleChangeAmount}
        fullWidth
        inputProps={{ maxLength: 64 }}
      />
    )
  }

  function CancelButton() {
    return (
      <Button
        onClick={handleClose}
        variant="contained"
        color="secondary"
      >
        Cancel
      </Button>
    )
  }

  function CloseChannelButton() {
    return (
      <Button
       type="submit"
       variant="contained"
       color="primary"
       className={classes.button}
       >
       Close Channel
       </Button>
    )
  }

  return (
    <Dialog open={open} onEnter={resetFields} onClose={handleClose} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Close Channel</DialogTitle>
  <form className={classes.root} onSubmit={handleSubmit} noValidate autoComplete="off">
  <DialogContent>
    {TxIdInput()}
  </DialogContent>
  <DialogContent>
    {OutputIndexInput()}
  </DialogContent>
  <DialogActions>
    {CancelButton()}
    {CloseChannelButton()}
  </DialogActions>
  </form>
    </Dialog>
  )
}
