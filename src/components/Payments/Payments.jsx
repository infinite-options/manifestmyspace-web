import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, ThemeProvider, Paper, Button, Typography, Stack, Grid, TextField, IconButton, Divider, Checkbox } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../theme/theme";
import { alpha, makeStyles } from "@material-ui/core/styles";
import axios, { all } from "axios";
import { useUser } from "../../contexts/UserContext";
import StripePayment from "../Settings/StripePayment";
import BackIcon from "./backIcon.png";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";

const useStyles = makeStyles((theme) => ({
  input: {
    background: "#000000",
  },
}));

export default function Payments(props) {
  console.log("In Payments.jsx");
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getProfileId, roleName } = useUser();
  const [paymentDueResult, setPaymentDueResult] = useState([]);
  const [paidItems, setPaidItems] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [paymentNotes, setPaymentNotes] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [isHeaderChecked, setIsHeaderChecked] = useState(true);

  // useEffect(() => {
  //   console.log("paymentDueResult - ", paymentDueResult);
  // }, [paymentDueResult]);
  
  const [paymentData, setPaymentData] = useState({
    currency: "usd",
    //customer_uid: '100-000125', // customer_uid: user.user_uid currently gives error of undefined
    customer_uid: getProfileId(),
    // customer_uid: user.user_uid,
    // business_code: "IOTEST",
    business_code: paymentNotes,
    item_uid: "320-000054",
    // payment_summary: {
    //     total: "0.0"
    // },
    balance: "0.0",
    purchase_uids: [],
  });

  // useEffect(() => {
  //   console.log("Payments component - total - ", total);
  // }, [total]);

  // useEffect(() => {
  //   console.log("Payments component - paymentData - ", paymentData);
  // }, [paymentData]);


  // function formatDate(date) {
  //   if (date === null || date === undefined) {
  //     return "";
  //   }
  //   var splitDate = date.split("-"); 
  //   console.log("Split Date: ", splitDate)
  //   var month = splitDate[1];
  //   var day = splitDate[2];
  //   var year = splitDate[0].slice(-2);
  //   return month + "-" + day + "-" + year;
  // }

  function totalPaidUpdate(paidItems) {
    var total = 0;
    for (const item of paidItems) {
      total += parseFloat(item.pur_amount_due);
    }
    setTotalPaid(total);
  }

  function totalBillUpdateLogic(selectedItems, paymentData) {
    // console.log("--DEBUG-- payment Data", paymentData)
    var total = 0;

    let purchase_uid_mapping = [];

    for (const item of selectedItems) {
      // console.log("item in loop", item)
      if (item.selected) {
        let paymentItemData = paymentData.find((element) => element.purchase_uid === item.id); // Use item.purchase_uid for comparison
        purchase_uid_mapping.push({ purchase_uid: item.id, pur_amount_due: paymentItemData.pur_amount_due });
        // console.log("payment item data", paymentItemData);
        total += parseFloat(paymentItemData.pur_amount_due);
      }
    }

    setTotal(total);
    setPaymentData((prevPaymentData) => ({
      ...prevPaymentData,
      balance: total.toFixed(2),
      purchase_uids: purchase_uid_mapping,
    }));
  }

  const handleSelectAllButton = () => {
    const newSelectedItems = selectedItems.map((item) => ({
      ...item,
      selected: !isHeaderChecked,
    }));

    setSelectedItems(newSelectedItems);
    setIsHeaderChecked(!isHeaderChecked);

    // console.log("newSelectedItems", newSelectedItems)

    totalBillUpdateLogic(newSelectedItems, paymentDueResult);
  };

  // Update total and selectedItems when a checkbox is clicked
  const handleCheckboxChange = (index) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = [...prevSelectedItems];
      const currentItem = newSelectedItems[index];

      currentItem.selected = !currentItem.selected;
      newSelectedItems[index] = currentItem;

      const allSelected = newSelectedItems.every((item) => item.selected);

      if (allSelected) {
        setIsHeaderChecked(true);
      } else {
        setIsHeaderChecked(false);
      }

      totalBillUpdateLogic(newSelectedItems, paymentDueResult);

      return newSelectedItems;
    });
  };

  const fetchPaymentsData = async () => {
    console.log("In fetchPaymensData");
    setShowSpinner(true);
    try {
      const res = await axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/paymentStatus/${getProfileId()}`);
      const paymentStatusData = res.data.PaymentStatus.result;
      const paidStatusData = res.data.PaidStatus.result;

      setPaymentDueResult(paymentStatusData);
      setPaidItems(paidStatusData);

      // console.log("--> paymentStatusData", paymentStatusData);
      // console.log("--> paidStatusData", paidStatusData);

      // initialize selectedItems as a list of objects with keys id (string) and selected (bool)
      var initialSelectedItems = [];
      if (location.state && location.state.maintenanceItem) {
        const maintenanceItemNav = location.state.maintenanceItem;
        console.log("--> maintenanceItemNav", maintenanceItemNav);
        //make the purchase_uid of the maintenance item selected
        initialSelectedItems = paymentStatusData.map((item) => ({
          id: item.purchase_uid,
          details: item,
          quote_id: item.bill_maintenance_quote_id,
          selected: item.purchase_uid === maintenanceItemNav.purchase_uid,
        }));
      } else {
        console.log("--> maintenanceItemNav is undefined");
        initialSelectedItems = paymentStatusData.map((item) => ({
          id: item.purchase_uid,
          details: item,
          quote_id: item.bill_maintenance_quote_id,
          selected: true,
        }));
      }

      setSelectedItems(initialSelectedItems);

      totalBillUpdateLogic(initialSelectedItems, paymentStatusData);
      totalPaidUpdate(paidStatusData);

      // console.log("--> initialSelectedItems", initialSelectedItems);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
    setShowSpinner(false);
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const handlePaymentNotesChange = (event) => {
    setPaymentNotes(event.target.value);
  };

  const API_CALL = "https://huo8rhh76i.execute-api.us-west-1.amazonaws.com/dev/api/v2/createEasyACHPaymentIntent";

  const handleStripePayment = async (e) => {
    setShowSpinner(true);
    console.log("Stripe Payment");
    try {
      // Update paymentData with the latest total value
      const updatedPaymentData = {
        ...paymentData,
        business_code: paymentNotes,
        payment_summary: {
          total: total.toFixed(2), // Format the total as a string with 2 decimal places
        },
      };

      console.log("Updated Payment Data: ", updatedPaymentData);

      //const stripe = await stripePromise;
      const response = await fetch(API_CALL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPaymentData),
      });
      const checkoutURL = await response.text();
      //console.log(response.text());
      window.location.href = checkoutURL;
    } catch (error) {
      console.log(error);
    }
    setShowSpinner(false);
  };

  // Define the CSS style for the selected checkbox
  const selectedCheckboxStyle = {
    color: theme.palette.custom.bgBlue, // Change the color of the tick (checked icon)
    borderColor: "black", // Change the border color
    "&.Mui-checked": {
      color: "gray",
      borderColor: "black",
    },
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Paper
          component={Stack}
          direction="column"
          justifyContent="center"
          style={{
            justifyContent: "center",
            width: "100%", // Take up full screen width
            marginTop: "20px", // Set the margin to 20px
            marginBottom: "40px",
          }}
        >
          <Box component="span" display="flex" justifyContent="center" alignItems="center" position="relative">
            <Typography
              sx={{
                justifySelf: "center",
                color: theme.typography.primary.black,
                fontWeight: theme.typography.primary.fontWeight,
                fontSize: theme.typography.largeFont,
              }}
            >
              {roleName()} Payments
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              color: "#160449",
              paddingTop: "10px",
            }}
          >
            <Box
              sx={{
                height: "30px",
                width: "30px",
                backgroundColor: "#bbb",
                borderRadius: "50%",
                // marginRight: "10px",
              }}
              onClick={() => {
                console.log("Navigate to Property or Tenant Profile");
              }}
            ></Box>
            <Box
              sx={{
                fontSize: "11px",
                fontWeight: "600",
              }}
            ></Box>
          </Box>

          <Paper
            style={{
              margin: "25px",
              padding: "20px",
              backgroundColor: theme.palette.primary.main,
              height: "25%",
              [theme.breakpoints.down("sm")]: {
                width: "80%",
              },
              [theme.breakpoints.up("sm")]: {
                width: "50%",
              },
            }}
          >
            <Stack direction="row" justifyContent="left" m={2}>
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>Balance</Typography>
            </Stack>
            <Stack direction="row" justifyContent="center" m={2}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <Typography sx={{ marginLeft: "20px", color: theme.typography.common.blue, fontWeight: theme.typography.primary.fontWeight, fontSize: "26px" }}>
                    ${total.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    sx={{
                      backgroundColor: "#3D5CAC",
                      borderRadius: "10px",
                      color: "#FFFFFF",
                      width: "100%",
                    }}
                    onClick={() => {
                      paymentData.business_code = paymentNotes;
                      console.log("In Payments.jsx and passing paymentData to SelectPayment.jsx: ", paymentData);
                      navigate("/selectPayment", {
                        state: { paymentData, total, selectedItems: selectedItems },
                      });
                    }}
                  >
                    <Typography
                      variant="outlined"
                      style={{
                        textTransform: "none",
                        color: "#FFFFFF",
                        fontSize: "18px",
                        fontFamily: "Source Sans Pro",
                        fontWeight: "600",
                      }}
                    >
                      Select Payment
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Stack>

            <Stack
              direction="row"
              justifyContent="center"
              m={2}
              sx={{
                paddingTop: "25px",
                paddingBottom: "15px",
              }}
            >
              <TextField variant="filled" fullWidth={true} multiline={true} value={paymentNotes} onChange={handlePaymentNotesChange} label="Payment Notes" />
            </Stack>
          </Paper>
          <Paper
            style={{
              margin: "25px",
              padding: 20,
              backgroundColor: theme.palette.primary.main,
              height: "25%",
            }}
          >
            <Stack direction="row" justifyContent="left">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                Balance Details
              </Typography>
            </Stack>
            <Stack>
              <BalanceDetailsTable data={paymentDueResult} total={total} setTotal={setTotal} setPaymentData={setPaymentData} setSelectedItems={setSelectedItems}/>
            </Stack>
          </Paper>
          <Paper
            style={{
              margin: "25px",
              padding: 20,
              backgroundColor: theme.palette.primary.main,
              height: "25%",
            }}
          >
            <Stack direction="row" justifyContent="left">
              <Typography sx={{ color: theme.typography.primary.black, fontWeight: theme.typography.primary.fontWeight, fontSize: theme.typography.largeFont }}>
                30 Day Payment History
              </Typography>
            </Stack>

            <Stack sx={{ paddingTop: "10px" }}>
              <Grid container alignItems="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={2}>
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.medium.fontWeight,
                      fontSize: theme.typography.mediumFont,
                      fontFamily: "Source Sans Pro",
                    }}
                  >
                    Date
                  </Typography>
                </Grid>
                <Grid item xs={3} alignItems="left">
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.medium.fontWeight,
                      fontSize: theme.typography.mediumFont,
                      fontFamily: "Source Sans Pro",
                    }}
                  >
                    Description
                  </Typography>
                </Grid>

                <Grid item xs={3} alignItems="left">
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.medium.fontWeight,
                      fontSize: theme.typography.mediumFont,
                      fontFamily: "Source Sans Pro",
                    }}
                  >
                    Address
                  </Typography>
                </Grid>

                <Grid item xs={1} alignItems="center">
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.medium.fontWeight,
                      fontSize: theme.typography.mediumFont,
                      fontFamily: "Source Sans Pro",
                    }}
                  >
                    Unit
                  </Typography>
                </Grid>

                <Grid item xs={1} alignItems="center">
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.medium.fontWeight,
                      fontSize: theme.typography.smallFont,
                      fontFamily: "Source Sans Pro",
                    }}
                  >
                    Method
                  </Typography>
                </Grid>
                <Grid item xs={2} alignItems="center">
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.medium.fontWeight,
                      fontSize: theme.typography.mediumFont,
                      fontFamily: "Source Sans Pro",
                    }}
                  >
                    Amount
                  </Typography>
                </Grid>
              </Grid>
              <Divider light />

              {paidItems.length > 0 &&
                paidItems.map((item, index) => (
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignItems="center" key={index} sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
                    <Grid item xs={2} alignItems="center">
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.medium.fontWeight,
                          fontSize: theme.typography.smallFont,
                          fontFamily: "Source Sans Pro",
                        }}
                      >
                        {/* {formatDate(item.payment_date)} */}
                        {(item.payment_date)}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} alignItems="center">
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.medium.fontWeight,
                          fontSize: theme.typography.smallFont,
                          fontFamily: "Source Sans Pro",
                        }}
                      >
                        {item.pur_description}
                      </Typography>
                    </Grid>

                    <Grid item xs={3} alignItems="center">
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.medium.fontWeight,
                          fontSize: theme.typography.smallFont,
                          fontFamily: "Source Sans Pro",
                        }}
                      >
                        {item.property_address}
                      </Typography>
                    </Grid>

                    <Grid item xs={1} alignItems="center">
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.medium.fontWeight,
                          fontSize: theme.typography.smallFont,
                          fontFamily: "Source Sans Pro",
                        }}
                      >
                        {item.property_unit}
                      </Typography>
                    </Grid>

                    <Grid item xs={1} alignItems="center">
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.medium.fontWeight,
                          fontSize: theme.typography.smallFont,
                          fontFamily: "Source Sans Pro",
                        }}
                      >
                        {item.payment_type}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} alignItems="right">
                      <Typography
                        sx={{
                          color: theme.typography.primary.black,
                          fontWeight: theme.typography.medium.fontWeight,
                          fontSize: theme.typography.smallFont,
                          fontFamily: "Source Sans Pro",
                        }}
                      >
                        $ {item.pur_amount_due}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              <Divider light />
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignItems="center" sx={{ paddingTop: "15px" }}>
                <Grid item xs={1} alignItems="center"></Grid>
                <Grid item xs={9} alignItems="center">
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.medium.fontWeight,
                      fontSize: theme.typography.smallFont,
                      fontFamily: "Source Sans Pro",
                    }}
                  >
                    Total Paid
                  </Typography>
                </Grid>

                <Grid item xs={2} alignItems="right">
                  <Typography
                    sx={{
                      color: theme.typography.primary.black,
                      fontWeight: theme.typography.medium.fontWeight,
                      fontSize: theme.typography.smallFont,
                      fontFamily: "Source Sans Pro",
                    }}
                  >
                    $ {totalPaid.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Paper>
      </ThemeProvider>
    </>
  );
}

function BalanceDetailsTable(props) {
  console.log("In BalanceDetailTable");
  const [data, setData]  = useState(props.data);      
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);  
  const [paymentDueResult, setPaymentDueResult] = useState([]);

  useEffect(() => {
    setData(props.data);
  }, [props.data]); 

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedRows(data.map((row) => row.purchase_uid));
      setPaymentDueResult(data.map((item) => ({
        ...item, pur_amount_due : parseFloat(item.pur_amount_due)
      })));
    }
  }, [data]);

  useEffect(() => {    
    var total = 0;

    let purchase_uid_mapping = [];

    for (const item of selectedRows) {
      // console.log("item in loop", item)
    
        let paymentItemData = paymentDueResult.find((element) => element.purchase_uid === item); 
        purchase_uid_mapping.push({ purchase_uid: item, pur_amount_due: paymentItemData.pur_amount_due.toFixed(2) });
        // console.log("payment item data", paymentItemData);
        total += parseFloat(paymentItemData.pur_amount_due);    
    }
    // console.log("selectedRows useEffect - total - ", total);
    // console.log("selectedRows useEffect - purchase_uid_mapping - ", purchase_uid_mapping);
    props.setTotal(total);
    props.setPaymentData((prevPaymentData) => ({
      ...prevPaymentData,
      balance: total.toFixed(2),
      purchase_uids: purchase_uid_mapping,
    }));
    
  }, [selectedRows]);

  useEffect(() => {
    console.log("selectedPayments - ", selectedPayments);
    props.setSelectedItems(selectedPayments)
  }, [selectedPayments]);



  const columnsList = [
    {
      field: "pur_description",
      headerName: "Description",
      flex: 2,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },
    {
      field: "property_address",
      headerName: "Address",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },
    {
      field: "property_unit",
      headerName: "Unit",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },

    {
      field: "pur_due_date",
      headerName: "Due Date",
      flex: 1,
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>{params.value}</Box>,
    },

    {
      field: "pur_amount_due",
      headerName: "Amount",
      flex: 1,
      headerStyle: {
        fontWeight: "bold", // Apply inline style to the header cell
      },
      renderCell: (params) => <Box sx={{ fontWeight: "bold" }}>$ {params.value}</Box>,
    },
  ];
  
  const handleSelectionModelChange = (newRowSelectionModel) => {   
    console.log("newRowSelectionModel - ", newRowSelectionModel);
    
    const addedRows = newRowSelectionModel.filter(rowId => !selectedRows.includes(rowId));    
    const removedRows = selectedRows.filter(rowId => !newRowSelectionModel.includes(rowId));
    
    if (addedRows.length > 0) {
        // console.log("Added rows: ", addedRows);
        let newPayments = []
        addedRows.forEach((item, index) => {
          const addedPayment = paymentDueResult.find((row) => row.purchase_uid === addedRows[index]);
          // setCurrentTotal(prevTotal => prevTotal + addedPayment.pur_amount_due);
          newPayments.push(addedPayment)
        })
        
        // console.log("newPayments - ", newPayments);
        setSelectedPayments((prevState) => {
          return [...prevState, ...newPayments]
        });        
    }
    
    if (removedRows.length > 0) {
        // console.log("Removed rows: ", removedRows);
        let removedPayments = []
        removedRows.forEach((item, index) => {
          let removedPayment = paymentDueResult.find((row) => row.purchase_uid === removedRows[index]);
          // setCurrentTotal(prevTotal => prevTotal - removedPayment.pur_amount_due);
          removedPayments.push(removedPayment)
        })
        // console.log("removedPayments - ", removedPayments);        
        setSelectedPayments(prevState => prevState.filter(payment => !removedRows.includes(payment.purchase_uid)));
    }
    setSelectedRows(newRowSelectionModel);
  };


  if (paymentDueResult.length > 0) {    
    // console.log("Passed Data ", paymentDueResult);
    return (
      <>
        <DataGrid
          rows={paymentDueResult}
          columns={columnsList}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          getRowId={(row) => row.purchase_uid}
          pageSizeOptions={[10, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleSelectionModelChange}
          onRowClick={(row) => {
            {
              console.log("Row =", row);
            }
            // handleOnClickNavigateToMaintenance(row);
          }}
          //   onRowClick={(row) => handleOnClickNavigateToMaintenance(row)}
        />
        {/* {selectedRows.length > 0 && (
          <div>Total selected amount: ${selectedRows.reduce((total, rowId) => total + parseFloat(paymentDueResult.find((row) => row.purchase_uid === rowId).pur_amount_due), 0)}</div>
        )} */}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignItems="center" sx={{ paddingTop: "15px" }}>
          <Grid item xs={1} alignItems="center"></Grid>
          <Grid item xs={9} alignItems="center">
            <Typography
              sx={{
                color: theme.typography.primary.black,
                fontWeight: theme.typography.medium.fontWeight,
                fontSize: theme.typography.smallFont,
                fontFamily: "Source Sans Pro",
              }}
            >
              Total
            </Typography>
          </Grid>
          <Grid item xs={2} alignItems="right">
            <Typography
              sx={{
                color: theme.typography.primary.black,
                fontWeight: theme.typography.medium.fontWeight,
                fontSize: theme.typography.smallFont,
                fontFamily: "Source Sans Pro",
              }}
            >
              $ {selectedRows.reduce((total, rowId) => total + paymentDueResult.find((row) => row.purchase_uid === rowId).pur_amount_due, 0)}
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  } else {
    return <></>;
  }
}
