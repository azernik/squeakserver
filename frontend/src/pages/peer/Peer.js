import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Switch,
  Button,
} from "@material-ui/core";

// styles
import useStyles from "./styles";

// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import DeletePeerDialog from "../../components/DeletePeerDialog";

import {
  getPeerRequest,
  setPeerDownloadingRequest,
  setPeerUploadingRequest,
} from "../../squeakclient/requests"



export default function PeerPage() {
  var classes = useStyles();
  const { id } = useParams();
  const [peer, setPeer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getSqueakPeer = (id) => {
    getPeerRequest(id, setPeer);
  };
  const setDownloading = (id, downloading) => {
    setPeerDownloadingRequest(id, downloading, () => {
      getSqueakPeer(id);
    });
  };
  const setUploading = (id, uploading) => {
    setPeerUploadingRequest(id, uploading, () => {
      getSqueakPeer(id);
    });
  };

  useEffect(()=>{
    getSqueakPeer(id)
  },[id]);

  const handleClickOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    console.log("deleteDialogOpen: " + deleteDialogOpen);
  };

  const handleCloseDeleteDialog = () => {
     setDeleteDialogOpen(false);
  };

  const handleSettingsDownloadingChange = (event) => {
    console.log("Downloading changed for peer id: " + id);
    console.log("Downloading changed to: " + event.target.checked);
    setDownloading(id, event.target.checked);
  };

  const handleSettingsUploadingChange = (event) => {
    console.log("Uploading changed for peer id: " + id);
    console.log("Uploading changed to: " + event.target.checked);
    setUploading(id, event.target.checked);
  };

  function NoPeerContent() {
    return (
      <p>
        No peer loaded
      </p>
    )
  }

  function PeerContent() {
    return (
      <>
        <p>
          Peer name: {peer.getPeerName()}
        </p>
        {PeerSettingsForm()}
        {DeletePeerButton()}
      </>
    )
  }

  function PeerSettingsForm() {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Peer settings</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={peer.getDownloading()} onChange={handleSettingsDownloadingChange} />}
            label="Downloading"
          />
          <FormControlLabel
            control={<Switch checked={peer.getUploading()} onChange={handleSettingsUploadingChange} />}
            label="Uploading"
          />
        </FormGroup>
      </FormControl>
    )
  }

  function DeletePeerButton() {
    return (
      <>
      <Grid item xs={12}>
        <div className={classes.root}>
          <Button
            variant="contained"
            onClick={() => {
              handleClickOpenDeleteDialog();
            }}>Delete Peer
          </Button>
        </div>
      </Grid>
      </>
    )
  }

  function DeletePeerDialogContent() {
    return (
      <>
        <DeletePeerDialog
          open={deleteDialogOpen}
          handleClose={handleCloseDeleteDialog}
          peer={peer}
          ></DeletePeerDialog>
      </>
    )
  }

  return (
    <>
      <PageTitle title={'Peer: ' + (peer ? peer.getPeerName() : null)} />
      <div>
      {peer
        ? PeerContent()
        : NoPeerContent()
      }
      </div>
      {DeletePeerDialogContent()}
    </>
  );
}
