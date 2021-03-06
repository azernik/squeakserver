import React, { useState } from "react";
import {
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Box,
  Link,
} from "@material-ui/core";
import { MoreVert as MoreIcon } from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import classnames from "classnames";

import LockIcon from '@material-ui/icons/Lock';
import DownloadIcon from '@material-ui/icons/CloudDownload';

// styles
import useStyles from "./styles";

import Widget from "../../components/Widget";

import moment from 'moment';

export default function SentPayment({
  sentPayment,
  ...props
}) {
  var classes = useStyles();

  const history = useHistory();

  const goToSqueakPage = (hash) => {
    history.push("/app/squeak/" + hash);
  };

  const goToPeerPage = (id) => {
    history.push("/app/Peer/" + id);
  };

  const goToLightningNodePage = (pubkey, host, port) => {
      console.log("Go to lightning node for pubkey: " + pubkey);
      if (pubkey && host && port) {
        history.push("/app/lightningnode/" + pubkey + "/" + host + "/" + port);
      } else if (pubkey && host) {
        history.push("/app/lightningnode/" + pubkey + "/" + host);
      } else {
        history.push("/app/lightningnode/" + pubkey);
      }
  };

  const onSqueakClick = (event) => {
    event.preventDefault();
    var hash = sentPayment.getSqueakHash();
    console.log("Handling squeak click for hash: " + hash);
    if (goToSqueakPage) {
      goToSqueakPage(hash);
    }
  }

  const onPeerClick = (event) => {
    event.preventDefault();
    const peerId = getPeerId();
    if (peerId == null) {
      return;
    }
    console.log("Handling peer click for peerId: " + peerId);
    goToPeerPage(peerId);
  }

  const onLightningNodeClick = (event) => {
    event.preventDefault();
    var nodePubkey = sentPayment.getNodePubkey();
    console.log("Handling lightning node click for nodePubkey: " + nodePubkey);
    if (goToLightningNodePage) {
      goToLightningNodePage(nodePubkey);
    }
  }

  const getPeerId = () => {
    if (!sentPayment.getHasPeer()) {
      return null;
    }
    const peer = sentPayment.getPeer();
    return peer.getPeerId();
  }

  const getPeerDisplay = () => {
    if (!sentPayment.getHasPeer()) {
      return "Unknown peer";
    }
    const peer = sentPayment.getPeer();
    const peerName = peer.getPeerName();
    const peerId = peer.getPeerId();
    return peerName ? peerName : peerId;
  }

  function PeerDisplay() {
    if (sentPayment.getHasPeer()) {
      return HasPeerDisplay(sentPayment.getPeer());
    } else {
      return HasNoPeerDisplay();
    }
  }

  function HasPeerDisplay(peer) {
    const peerId = peer.getPeerId();
    const peerName = peer.getPeerName();
    const peerDisplayName = peerName ? peerName : peerId;
    return (
      <Link href="#"
        onClick={onPeerClick}
        >{peerDisplayName}
      </Link>
    )
  }

  function HasNoPeerDisplay() {
    return (
      <>
        Unknown Peer
      </>
    )
  }

  console.log(sentPayment);
  return (
    <Box
      p={1}
      m={0}
      style={{ backgroundColor: "lightgray" }}
      >
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
                <Box fontWeight="fontWeightBold">
                  {sentPayment.getPriceMsat()} msats
                </Box>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              {moment(sentPayment.getTimeS() * 1000).format("DD MMM YYYY hh:mm a")}
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              Squeak hash:
                <Link href="#"
                  onClick={onSqueakClick}
                  >
                  <span> </span>{sentPayment.getSqueakHash()}
                  </Link>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              Peer: {PeerDisplay()}
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              Lightning node:
                <Link href="#"
                  onClick={onLightningNodeClick}
                  >
                  <span> </span>{sentPayment.getNodePubkey()}
                </Link>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              Valid:
                <span> </span>{sentPayment.getValid().toString()}
            </Grid>
          </Grid>
    </Box>
  )
}
