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
  lndNewAddressRequest,
} from "../../squeakclient/requests"



export default function ReceiveBitcoinDialog({
  open,
  handleClose,
  ...props
}) {
  var classes = useStyles();
  const history = useHistory();

  var [address, setAddress] = useState('');

  const resetFields = () => {
    setAddress('');
  };

  const handleChangeAddress = (event) => {
    setAddress(event.target.value);
  };

  const getNewAddress = () => {
    lndNewAddressRequest((response) => {
      setAddress(response.getAddress());
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    getNewAddress(address);
    // handleClose();
  }

  function ReceiveBitcoinAddess() {
    return (
      <TextField
        id="standard-textarea"
        label="Address"
        required
        autoFocus
        value={address}
        onChange={handleChangeAddress}
        fullWidth
        inputProps={{
           readOnly: true,
        }}
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

  function RenewAddressButton() {
    return (
      <Button
       type="submit"
       variant="contained"
       color="primary"
       className={classes.button}
       >
       Get New Address
       </Button>
    )
  }

  return (
    <Dialog open={open} onEnter={resetFields} onClose={handleClose} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Receive Bitcoin</DialogTitle>
  <form className={classes.root} onSubmit={handleSubmit} noValidate autoComplete="off">
  <DialogContent>
    {ReceiveBitcoinAddess()}
  </DialogContent>
  <DialogActions>
    {CancelButton()}
    {RenewAddressButton()}
  </DialogActions>
  </form>
    </Dialog>
  )
}
