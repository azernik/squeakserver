import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {
    Grid,
    Button,
    Paper,
    Tabs,
    Tab,
    AppBar,
    Box,
    Typography,
  } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import FormLabel from "@material-ui/core/FormLabel";

// styles
import {makeStyles} from '@material-ui/core/styles';

// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import Table from "../dashboard/components/Table/Table";
import ReceivedPayment from "../../components/ReceivedPayment";


// data
import mock from "../dashboard/mock";

import {
  getReceivedPaymentsRequest,
} from "../../squeakclient/requests"

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

export default function ReceivedPayments() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [receivedPayments, setReceivedPayments] = useState([]);
  const history = useHistory();

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const loadReceivedPayments = () => {
    getReceivedPaymentsRequest((receivedPaymentsReply) => {
      setReceivedPayments(receivedPaymentsReply.getReceivedPaymentsList());
    });
  };

  useEffect(() => {
    loadReceivedPayments();
  }, []);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div>{children}</div>
        )}
      </div>
    );
  }

  function PaymentsTabs() {
    return (
      <>
      <AppBar position="static" color="default">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Received Payments" {...a11yProps(0)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {ReceivedPaymentsContent()}
      </TabPanel>
      </>
    )
  }

  function ReceivedPaymentsContent() {
    console.log("receivedPayments: " + receivedPayments);
    return (
      <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget disableWidgetMenu>
          <div>
          {receivedPayments.map(receivedPayment =>
            <Box
              p={1}
              key={receivedPayment.getReceivedPaymentId()}
              >
            <ReceivedPayment
              receivedPayment={receivedPayment}>
            </ReceivedPayment>
            </Box>
          )}
          </div>
          </Widget>
        </Grid>
      </Grid>
      </>
    )
  }

  return (
    <>
     < PageTitle title = "Payments" />
     {PaymentsTabs()}
   < />);
}
