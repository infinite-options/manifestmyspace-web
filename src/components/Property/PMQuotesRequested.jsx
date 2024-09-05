import {
  ThemeProvider,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Stack,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import refundIcon from "./refundIcon.png";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import APIConfig from "../../utils/APIConfig";
import useMediaQuery from "@mui/material/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@mui/material/Backdrop";
import Documents from "../Leases/Documents";


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#D6D5DA",
      borderRadius: 10,
      height: 30,
      marginBlock: 10,
      paddingBottom: "15px",
    },
  },
}));

export default function PMQuotesRequested(props) {
  const location = useLocation();
  let navigate = useNavigate();
  const { getProfileId } = useUser();
  const PMQuotesDetails = props;
  const handleBackClick = props.handleBackClick;
  const classes = useStyles();
  
  const [contracts, setContracts] = useState([]);
  const refreshContracts = props.refreshContracts;  
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const property = PMQuotesDetails.propertyData;
  const propertyId = property[PMQuotesDetails.index]?.property_uid;
  const index = PMQuotesDetails.index;
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const statusColor = ["#3D5CAC", "#160449"];
  const [tabStatus, setTabStatus] = useState(0);
  const [activeContracts, setActiveContracts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [conflictingContract, setConflictingContract] = useState(null);
  const [newContract, setNewContract] = useState(null);

  function getColor(status) {
    return statusColor[status];
  }

  useEffect(() => {
    const validContracts = getActiveContracts(contracts);
    setActiveContracts(validContracts);
  }, [contracts]);

  useEffect(() => {    
    
    const contractsData = props.contracts?.filter(
      (contract) => contract.property_id === propertyId
    );
    setContracts(contractsData);
  }, [props.contracts]);

  function getActiveContracts(contracts) {
    return contracts?.filter((contract) => contract.contract_status === "ACTIVE");
  }

  useEffect(() => {
    const getContractsForOwner = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`${APIConfig.baseURL.dev}/contracts/${getProfileId()}`);
        const contractsResponse = await response.json();
        const contractsData = contractsResponse.result.filter(
          (contract) => contract.property_id === propertyId
        );
        setContracts(contractsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    getContractsForOwner();
  }, [refresh]);

  function displayPMQuotesRequested() {
    return (
      <div>
        {contracts?.length > 0 ? (
          contracts.map((contract) => {
            if (contract.contract_status === "SENT") {
              return (
                <div key={contract.contract_uid}>
                  <DocumentCard data={contract} />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ padding: "8px" }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        background: "#A52A2A",
                        color: theme.palette.background.default,
                        width: "40%",
                        height: "85%",
                        borderRadius: "10px",
                        fontSize: "10px",
                      }}
                      onClick={() => handleDecline(contract)}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        background: "#76B148",
                        color: theme.palette.background.default,
                        width: "40%",
                        height: "85%",
                        borderRadius: "10px",
                        fontSize: "10px",
                      }}
                      onClick={() => handleAccept(contract)}
                    >
                      Accept
                    </Button>
                  </Stack>
                </div>
              );
            }
            if (
              contract.contract_status === "WITHDRAW" ||
              contract.contract_status === "REJECTED"
            ) {
              return (
                <div key={contract.contract_uid}>
                  <p>This contract is withdrawn/rejected</p>
                </div>
              );
            }
            if (contract.contract_status === "NEW") {
              return (
                <div key={contract.contract_uid}>
                  <DocumentCard data={contract} />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ padding: "8px" }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        background: "#A52A2A",
                        color: theme.palette.background.default,
                        width: "40%",
                        height: "85%",
                        borderRadius: "10px",
                        fontSize: "10px",
                      }}
                      onClick={async () => {
                        await handleStatusChange(contract, "CANCELLED");
                        // setTimeout(() => {
                        //   setRefresh(!refresh);
                        // }, 100);
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </div>
              );
            }
            return null;
          })
        ) : (
          <div>No Requested Contract Quotes</div>
        )}
      </div>
    );
  }

  function displayActiveContracts() {
    return (
      <div>
        {activeContracts?.length > 0 ? (
          activeContracts.map((contract, index) => (
            <div key={index}>
              <DocumentCard data={contract} />
              {/* <p>{contract.contract_uid}</p> */}
            </div>
          ))
        ) : (
          <div>No active contracts</div>
        )}
      </div>
    );
  }

  function handleAccept(obj) {
    try {
      const newContractStart = new Date(obj.contract_start_date);
      const newContractEnd = new Date(obj.contract_end_date);
      const newPropertyId = obj.property_id;

      for (let i = 0; i < activeContracts.length; i++) {
        const existingContract = activeContracts[i];

        if (existingContract.property_id === newPropertyId) {
          const existingContractStart = new Date(existingContract.contract_start_date);
          const existingContractEnd = new Date(existingContract.contract_end_date);

          if (
            (newContractStart <= existingContractEnd && newContractStart >= existingContractStart) ||
            (newContractEnd <= existingContractEnd && newContractEnd >= existingContractStart) ||
            (newContractStart <= existingContractStart && newContractEnd >= existingContractEnd)
          ) {
            setConflictingContract(existingContract);
            setNewContract(obj);
            setDialogOpen(true);
            return;
          }
        }
      }

      const formData = new FormData();
      formData.append("contract_uid", obj.contract_uid);
      formData.append("contract_status", "ACTIVE");

      fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts`, {
        method: "PUT",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          } else {
            console.log("Data added successfully");
            refreshContracts();            
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } catch (error) {
      console.error(error);
    }
    // setRefresh(!refresh);
    setTabStatus(1);    
  }

  function handleDecline(obj) {
    
    try {
      const formData = new FormData();
      formData.append("contract_uid", obj.contract_uid);
      formData.append("contract_status", "REJECTED");

      axios
        .put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts", formData)
        .then((response) => {
          console.log("PUT result", response);
          refreshContracts();
        })
        .catch((error) => {
          console.error("There was a problem with the decline operation:", error);
        });
    } catch (error) {
      console.error(error);
    }
    
  }

  const handleStatusChange = async (obj, status) => {
    try {
      const formData = new FormData();
      formData.append("contract_uid", obj.contract_uid);
      formData.append("contract_status", status);

      axios
        .put("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/contracts", formData)
        .then((response) => {
          console.log("PUT result", response);
          refreshContracts();
        })
        .catch((error) => {
          console.error("There was a problem with the status change operation:", error);
        });
    } catch (error) {
      console.error(error);
    }    
  };

  const viewAllProperties = () => {
    if (isDesktop) {
      handleBackClick();
    } else {
      navigate(-1);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setConflictingContract(null);
    setNewContract(null);
  };

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color='inherit' />
        </Backdrop> ) :(
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          minHeight: "100vh",
          marginTop: theme.spacing(2),
        }}
      >
        <Paper
          sx={{
            margin: "30px",
            backgroundColor: theme.palette.primary.main,
            width: "100%",
            paddingTop: "10px",
          }}
        >
          <Stack direction="column" justifyContent="center" alignItems="center" sx={{ paddingBottom: "0px" }}>
            <Box direction="row" justifyContent="center" alignItems="center">
              <Typography
                sx={{
                  color: theme.typography.primary.black,
                  fontWeight: theme.typography.primary.fontWeight,
                  fontSize: theme.typography.largeFont,
                }}
              >
                Search for Properties Manager
              </Typography>
            </Box>
            <Box position="absolute" right={30}>
              <Button>
                <SearchIcon />
              </Button>
            </Box>
          </Stack>
          <Stack direction="column" justifyContent="center" alignItems="center">
            <Box onClick={viewAllProperties}>
              <Button
                sx={{
                  textTransform: "none",
                  color: theme.typography.common.blue,
                  fontWeight: theme.typography.common.fontWeight,
                  fontSize: "16px",
                  "&:hover, &:focus, &:active": { background: theme.palette.primary.main },
                }}
              >
                <img src={refundIcon} style={{ width: "25px", height: "25px", margin: "5px" }} />
                <Typography>Return to Viewing All Properties</Typography>
              </Button>
            </Box>
          </Stack>
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                borderBottom: 0,
                width: "95%",
              }}
            >
              <Tabs
                variant="fullWidth"
                value={tabStatus}
                onChange={(e) => console.log(e)}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "transparent",
                    border: "0px",
                    minWidth: "5px",
                    height: "10px",
                    padding: "0px",
                  },
                }}
                sx={{
                  [theme.breakpoints.up("sm")]: {
                    height: "5px",
                  },
                }}
              >
                <Tab
                  sx={{
                    backgroundColor: statusColor[0],
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    height: "10%",
                    minWidth: "5px",
                    padding: "0px",
                    "&.Mui-selected": {
                      color: "#FFFFFF",
                    },
                    "&.MuiTab-root": {
                      color: "#FFFFFF",
                    },
                    textTransform: "none",
                  }}
                  onClick={() => setTabStatus(0)}
                  label="Quotes Requested"
                />
                <Tab
                  sx={{
                    backgroundColor: statusColor[1],
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    height: "10%",
                    minWidth: "5px",
                    padding: "0px",
                    "&.Mui-selected": {
                      color: "#FFFFFF",
                    },
                    "&.MuiTab-root": {
                      color: "#FFFFFF",
                    },
                    textTransform: "none",
                  }}
                  onClick={() => setTabStatus(1)}
                  label="Active Contracts"
                />
              </Tabs>
              <Box
                sx={{
                  backgroundColor: getColor(tabStatus),
                  height: "15px",
                }}
              ></Box>
            </Box>
          </Stack>
          <Stack direction="column" justifyContent="center" alignItems="center">
            <Box
              sx={{
                borderBottom: 0,
                width: "95%",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "0px 0px 10px 10px",
                  bottom: "40px",
                }}
              >
                <Box
                  sx={{
                    padding: "15px",
                  }}
                >
                  {loading ? (
                    <CircularProgress />
                  ) : tabStatus === 0 ? (
                    displayPMQuotesRequested()
                  ) : (
                    displayActiveContracts()
                  )}
                </Box>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Box>)}

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: theme.typography.common.blue }}>
          CONFLICTING CONTRACTS
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}>
            <Box sx={{ width: "45%", padding: 2, backgroundColor: theme.palette.background.paper, borderRadius: "10px" }}>
              <Typography sx={{ fontWeight: "bold", marginBottom: 2, color: theme.typography.common.blue }}>
                PropertyManager
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography  sx={{ fontWeight: "bold", marginBottom: 2, color: theme.typography.common.blue }}>
                    Contract Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={conflictingContract?.contract_name}
                    variant="filled"
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ marginBottom: 2 }}
                    className={classes.root}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: "bold", marginBottom: 2, color: theme.typography.common.blue }}>
                    Start Date
                  </Typography>
                  <TextField
                    fullWidth
                    value={conflictingContract?.contract_start_date}
                    variant="filled"
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ marginBottom: 2 }}
                    className={classes.root}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography  sx={{ fontWeight: "bold", marginBottom: 2, color: theme.typography.common.blue }}>
                    End Date
                  </Typography>
                  <TextField
                    fullWidth
                    value={conflictingContract?.contract_end_date}
                    variant="filled"
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ marginBottom: 2 }}
                    className={classes.root}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography  sx={{ fontWeight: "bold", marginBottom: 2, color: theme.typography.common.blue }}>
                    Status
                  </Typography>
                  <TextField
                    fullWidth
                    value={conflictingContract?.contract_status}
                    variant="filled"
                    InputProps={{
                      readOnly: true,
                    }}
                    className={classes.root}
                  />
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
              <Button fullWidth variant='contained' color='primary'  onClick={() => {
                  navigate("/ownerContacts");
                }} sx={{ mb: 2, backgroundColor: "#3D5CAC" }}>
             <Typography sx={{ fontWeight: "bold", color: "#FFFFFF", textTransform: "none" }}>Contact PM</Typography>
             </Button>
              </Stack>
            </Box>

            <Box sx={{ width: "45%", padding: 2, backgroundColor: theme.palette.background.paper, borderRadius: "10px" }}>
              <Typography sx={{ fontWeight: "bold", marginBottom: 2, color: theme.typography.common.blue }}>
                PropertyManager
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography  sx={{ fontWeight: "bold", marginBottom: 2, color: theme.typography.common.blue }}>
                    Contract Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={newContract?.contract_name}
                    variant="filled"
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ marginBottom: 2 }}
                    className={classes.root}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography  sx={{ fontWeight: "bold", marginBottom: 2, color: theme.typography.common.blue }}>
                    Start Date
                  </Typography>
                  <TextField
                    fullWidth
                    value={newContract?.contract_start_date}
                    variant="filled"
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ marginBottom: 2 }}
                    className={classes.root}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography  sx={{ fontWeight: "bold", marginBottom: 2, color: theme.typography.common.blue }}>
                    End Date
                  </Typography>
                  <TextField
                    fullWidth
                    value={newContract?.contract_end_date}
                    variant="filled"
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ marginBottom: 2 }}
                    className={classes.root}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography  sx={{ fontWeight: "bold", marginBottom: 2, color: theme.typography.common.blue }}>
                    Status
                  </Typography>
                  <TextField
                    fullWidth
                    value={newContract?.contract_status}
                    variant="filled"
                    InputProps={{
                      readOnly: true,
                    }}
                    className={classes.root}
                  />
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                <Button fullWidth variant='contained'   onClick={() => {
                    handleDecline(newContract);
                    handleDialogClose(); // Optional: Close dialog after rejecting
                    // setRefresh(!refresh); // Optional: Refresh contracts list
                  }} sx={{ mb: 2, backgroundColor: "#A52A2A" }}>
             <Typography sx={{ fontWeight: "bold", color: "#FFFFFF", textTransform: "none" }}>Decline</Typography>
             </Button>
                <Button fullWidth variant='contained' color='primary'  onClick={() => {
                  navigate("/ownerContacts");
                }} sx={{ mb: 2, backgroundColor: "#3D5CAC" }}>
             <Typography sx={{ fontWeight: "bold", color: "#FFFFFF", textTransform: "none" }}>Contact PM</Typography>
             </Button>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button  variant='contained' color='primary' onClick={handleDialogClose}  sx={{ mb: 2, backgroundColor: "#3D5CAC" }}>
             <Typography sx={{ fontWeight: "bold", color: "#FFFFFF", textTransform: "none" }}>Close</Typography>
          </Button>
        </DialogActions>
      </Dialog>

    </ThemeProvider>
  );
}

function DocumentCard(props) {
  const data = props.data;
  console.log("---dhyey--- data -", data);
  const [fees, setFees] = useState(JSON.parse(data.contract_fees) ? JSON.parse(data.contract_fees) : []);
  const [contractDocuments, setContractDocuments] = useState(JSON.parse(data.contract_documents)?JSON.parse(data.contract_documents) : [])

  let navigate = useNavigate();

  const getContractDocumentLink = () => {
    const documents = JSON.parse(data.contract_documents);
    if (documents === null || documents === undefined) return null;
    const contractDocument = documents.find((doc) => doc.type === "contract");
    return contractDocument ? contractDocument.link : "";
  };

  const contractDocumentLink = getContractDocumentLink();

  useEffect(() => {
    const getBusinessProfileFees = async () => {
      try {
        const response = await fetch(`${APIConfig.baseURL.dev}/businessProfile`, {
          method: "GET",
        });
        const responseData = await response.json();
        if (
          responseData.result.business_services_fees !== null &&
          responseData.result[0].business_services_fees !== undefined
        ) {
          setFees(JSON.parse(responseData.result[0].business_services_fees));
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    if (data.contract_status === "NEW") {
      getBusinessProfileFees(data);
    }
  }, []);

  const textStyle = {
    textTransform: "none",
    color: theme.typography.propertyPage.color,
    fontWeight: theme.typography.light.fontWeight,
    fontSize: theme.typography.secondaryFont,
  };

  return (
    <Box
      sx={{
        backgroundColor: "#D6D5DA",
        borderRadius: "10px",
        padding: "5px",
        marginBottom: "10px",
        fontSize: "13px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "26px" }}>
          {data.business_name}
        </Typography>
      </Box>
      <Box>
        <Typography sx={textStyle}>
          Area of service: {data.city} +-{data.miles} miles
        </Typography>
      </Box>
      <Box>
        <Typography sx={textStyle}>Status: {data.contract_status}</Typography>
      </Box>
      <Box>
        <Typography sx={textStyle}>Contract ID: {data.contract_uid}</Typography>
      </Box>

      <Box>
        <Typography sx={textStyle}>Estimated Fees</Typography>
      </Box>

      {data !== null ? (
        data.contract_status === "NEW" ? (
          fees?.map((fee, index) => <FeesTextCard key={index} fee={fee} />)
        ) : fees.length !== 0 ? (
          <>
          {/* <Box sx={{marginLeft: '10px', }}>
            {
              JSON.parse(data.contract_fees)?.map((fee, index) => (
                <Typography sx={textStyle}>
                  <FeesTextCard key={index} fee={fee} />
                </Typography>
              ))}
          </Box> */}
            <FeesDataGrid data={JSON.parse(data?.contract_fees)} />
          </>
        ) : (
          // <Box width={'100%'} height={'100px'}>
          //     <Typography sx={textStyle}>
          //       <b>No fees</b>
          //     </Typography>
          // </Box>
          <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '7px',
                width: '100%',
                height:"100px"
              }}
            >
              <Typography
                sx={{
                  color: "#A9A9A9",
                  fontWeight: theme.typography.primary.fontWeight,
                  fontSize: "15px",
                }}
              >
                No Fees
              </Typography>
            </Box>
        )
      ) : (
        <Typography sx={textStyle}>No data available</Typography>
      )}

      {data.contract_status !== "NEW" ? 
      (<Box marginLeft={"5px"}>
        <Documents isEditable={false} isAccord={false} documents={contractDocuments} setDocuments={setContractDocuments} customName={"Attached Documents"}/>
      </Box>) : <></>}

    </Box>
  );
}

export const FeesDataGrid = ({ data, isDeleteable=false, handleDeleteFee}) => {
  const columns = isDeleteable ? [
    {
      field: "frequency",
      headerName: "Frequency",
      flex:1,
      renderHeader: (params) => <strong>{params.colDef.headerName}</strong>,
    },
    {
      field: "fee_name",
      headerName: "Name",
      flex:1,
      renderHeader: (params) => <strong>{params.colDef.headerName}</strong>,
    },
    {
      field: "charge",
      headerName: "Charge",
      flex:1,
      renderHeader: (params) => <strong>{params.colDef.headerName}</strong>,
      renderCell: (params) => {
        const feeType = params.row?.fee_type;
        const charge = params.value;

        return (
          <Typography>
            {feeType === "PERCENT" ? `${charge}%` : feeType === "FLAT-RATE" ? `$${charge}` : charge}
          </Typography>
        );
      },
    },
    {
      field: "of",
      headerName: "Of",
      flex:1,
      renderHeader: (params) => <strong>{params.colDef.headerName}</strong>,
      renderCell: (params) => {
        const feeType = params.row?.fee_type;
        const of = params.value;
        return <Typography>{of === null || of === undefined || of === "" ? feeType === "FLAT-RATE" ? "FLAT-RATE" : `-` : `${of}`}</Typography>;
      },
    },
    {
      field: "actions",
      headerName: "",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={(e) => handleDeleteFee(params.row.id, e)}>
            <DeleteIcon sx={{ fontSize: 20, color: '#3D5CAC' }} />
          </IconButton>
        </Box>
      ),
    },
  ] : [
    {
      field: "frequency",
      headerName: "Frequency",
      flex:1,
      renderHeader: (params) => <strong>{params.colDef.headerName}</strong>,
    },
    {
      field: "fee_name",
      headerName: "Name",
      flex:1,
      renderHeader: (params) => <strong>{params.colDef.headerName}</strong>,
    },
    {
      field: "charge",
      headerName: "Charge",
      flex:1,
      renderHeader: (params) => <strong>{params.colDef.headerName}</strong>,
      renderCell: (params) => {
        const feeType = params.row?.fee_type;
        const charge = params.value;

        return (
          <Typography>
            {feeType === "PERCENT" ? `${charge}%` : feeType === "FLAT-RATE" ? `$${charge}` : charge}
          </Typography>
        );
      },
    },
    {
      field: "of",
      headerName: "Of",
      flex:1,
      renderHeader: (params) => <strong>{params.colDef.headerName}</strong>,
      renderCell: (params) => {
        const feeType = params.row?.fee_type;
        const of = params.value;

        return <Typography>{of === null || of === undefined ? feeType === "FLATE-RATE" ? "FLATE-RATE" : `-` : `${of}`}</Typography>;
      },
    },
  ];


  // Adding a unique id to each row using map if the data doesn't have an id field
  const rowsWithId = data.map((row, index) => ({
    ...row,
    id: row.id ? index : index,
  }));

  // console.log("-- inside fee data grid - ", rowsWithId);

  return (
    <DataGrid
      rows={rowsWithId}
      columns={columns}
      sx={{
        // minHeight:"100px",
        // height:"100px",
        // maxHeight:"100%",
        marginTop: "10px",
      }}
      autoHeight
      rowHeight={50} 
      hideFooter={true}
    />
  );
};

function FeesTextCard(props) {
  const textStyle = {
    textTransform: "none",
    color: theme.typography.propertyPage.color,
    fontWeight: theme.typography.light.fontWeight,
    fontSize: theme.typography.mediumFont,
  };

  let fee = props.fee;

  function displayFee() {
    if (fee.fee_type === "%" || fee.fee_type === "PERCENT") {
      return (
        <Typography sx={textStyle}>
          <b>{fee.frequency}</b> - {fee.fee_name}: {fee.charge} % of {fee.of}           
        </Typography>
      );
    } else if (fee.fee_type === "$") {
      return (
        <Typography sx={textStyle}>
          {fee.fee_name} : {fee.fee_type}
          {fee.charge} of {fee.of} <b>{fee.frequency}</b>
        </Typography>
      );
    } else if (fee.fee_type === "FLAT-RATE") {
      const type = "$";
      return (
        <Typography sx={textStyle}>
          <b>{fee.frequency}</b> - {fee.fee_name} : {type} {fee.charge}           
        </Typography>
      );
    } else {
      return (
        <Typography sx={textStyle}>
          {fee.fee_name}: {fee.charge} of {fee.of} <b>{fee.frequency}</b>
        </Typography>
      );
    }
  }

  return displayFee();
}
