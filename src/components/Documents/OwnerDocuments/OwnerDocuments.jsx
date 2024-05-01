import { Box, ThemeProvider, createTheme } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const theme = createTheme({
  palette: {
    background: {
      basic: "#000000",
      gray: "#F2F2F2",
      blue: "#3D5CAC",
    },
    text: {
      blue: "#3D5CAC",
      gray: "#F2F2F2",
      darkblue: "#160449",
    },
  },
});

function OwnerDocuments() {
  const statusList = ["Applications", "Leases", "Agreements", "Notices", "Contracts"];
  const statusColor = ["#A52A2A", "#FF8A00", "#FFC614", "#3D5CAC", "#160449"];
  const [tabStatus, setTabStatus] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const { getProfileId } = useUser();
  const navigate = useNavigate();
  function navigateTo(url) {
    navigate(url);
  }
  function getColor(status) {
    return statusColor[status];
  }

  const [documentsData, setDocumentsData] = useState([]);
  useEffect(() => {
    setShowSpinner(true);
    axios
      .get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/documents/${getProfileId()}`)
      // axios.get(`http://localhost:4000/documents/${getProfileId()}`)
      .then((res) => {
        // console.log(res.data);
        setDocumentsData(res.data.Documents.result);
        setShowSpinner(false);
      });
  }, []);

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            fontFamily: "Source Sans Pro",
            color: "text.darkblue",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.gray",
              borderRadius: "10px",
              padding: "10px",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  width: "14px",
                  height: "14px",
                }}
              ></Box>
              <Box
                sx={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "text.darkblue",
                }}
              >
                Documents
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => navigateTo("/ownerUploadDocuments")}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2L9 16" stroke="#160449" strokeWidth="3" strokeLinecap="round" />
                  <path d="M16 9L2 9" stroke="#160449" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                color: "text.blue",
                fontWeight: "bold",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    borderStyle: "solid",
                    borderColor: "#3D5CAC",
                    borderRadius: "10px",
                    marginRight: "2px",
                  }}
                >
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: "top" }}>
                    <path
                      d="M5.20833 14.5833L8.60809 17.1331C9.03678 17.4547 9.64272 17.3811 9.98205 16.9664L18.75 6.25"
                      stroke="#3D5CAC"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </Box>
                <Box>Show Expired</Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    marginRight: "2px",
                  }}
                >
                  Select Property
                </Box>
                <Box>
                  <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.49423 10.97C5.20833 11.6165 5.20833 12.3519 5.20833 13.8228V18.4166C5.20833 20.4594 5.20833 21.4807 5.81853 22.1153C6.37694 22.6961 7.24682 22.7454 8.89583 22.7495V17.3333C8.89583 16.2201 9.77331 15.25 10.9375 15.25H14.0625C15.2267 15.25 16.1042 16.2201 16.1042 17.3333V22.7495C17.7532 22.7454 18.6231 22.6961 19.1815 22.1153C19.7917 21.4807 19.7917 20.4594 19.7917 18.4166V13.8228C19.7917 12.3519 19.7917 11.6165 19.5058 10.97C19.2199 10.3236 18.683 9.84493 17.6091 8.88768L16.5674 7.9591C14.6265 6.22888 13.656 5.36377 12.5 5.36377C11.344 5.36377 10.3735 6.22888 8.43255 7.9591L7.39089 8.88768C6.31705 9.84493 5.78013 10.3236 5.49423 10.97ZM14.1042 22.7499V17.3333C14.1042 17.2974 14.091 17.2737 14.0782 17.2604C14.0719 17.2538 14.067 17.2512 14.0653 17.2505L14.0652 17.2504C14.0644 17.2501 14.0642 17.25 14.0625 17.25H10.9375C10.9358 17.25 10.9355 17.2501 10.9348 17.2504L10.9347 17.2505C10.933 17.2512 10.9281 17.2538 10.9218 17.2604C10.909 17.2737 10.8958 17.2974 10.8958 17.3333V22.7499H14.1042Z"
                      fill="#3D5CAC"
                    />
                  </svg>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                color: "#F2F2F2",
                fontWeight: "bold",
                fontSize: "10px",
                textAlign: "center",
              }}
            >
              <NavTab color={statusColor[0]}>
                <Box onClick={() => setTabStatus(0)}>{statusList[0]}</Box>
              </NavTab>
              <NavTab color={statusColor[1]}>
                <Box onClick={() => setTabStatus(1)}>{statusList[1]}</Box>
              </NavTab>
              <NavTab color={statusColor[2]}>
                <Box onClick={() => setTabStatus(2)}>{statusList[2]}</Box>
              </NavTab>
              <NavTab color={statusColor[3]}>
                <Box onClick={() => setTabStatus(3)}>{statusList[3]}</Box>
              </NavTab>
              <NavTab color={statusColor[4]}>
                <Box onClick={() => setTabStatus(4)}>{statusList[4]}</Box>
              </NavTab>
            </Box>
            <Box
              sx={{
                position: "relative",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                bottom: "40px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: getColor(tabStatus),
                  height: "14px",
                  borderRadius: "9px 9px 0px 0px",
                }}
              ></Box>
              <Box
                sx={{
                  padding: "13px",
                }}
              >
                {documentsData.map((document) => {
                  const address = document.property_address;
                  const unit = document.property_unit;
                  let start_date = "";
                  let end_date = "";
                  let docs = [];
                  switch (statusList[tabStatus]) {
                    case "Leases":
                      if (document.lease_documents !== null) {
                        docs = JSON.parse(document.lease_documents);
                        start_date = document.lease_start;
                        end_date = document.lease_end;
                      }
                      break;
                    case "Contracts":
                      if (document.contract_documents !== null) {
                        docs = JSON.parse(document.contract_documents);
                        start_date = document.contract_start_date;
                        end_date = document.contract_end_date;
                      }
                      break;
                    default:
                      break;
                  }
                  return (
                    <>
                      {docs.map((doc) => (
                        <DocumentCard document={doc} data={[address, unit, start_date, end_date]} />
                      ))}
                    </>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}

function NavTab(props) {
  const color = props.color;
  return (
    <Box
      sx={{
        backgroundColor: color,
        width: "20%",
        height: "60px",
        borderRadius: "10px",
      }}
    >
      <Box
        sx={{
          marginTop: "5px",
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}

function DocumentCard(props) {
  const document = props.document;
  const [address, unit, start_date, end_date] = props.data;
  const navigate = useNavigate();

  function downloadDocument(url) {
    window.open(url, "_newtab");
  }
  function navigateToDocument(url, link) {
    navigate(url, {
      state: {
        link: link,
      },
    });
  }
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
        <Box
          sx={{
            fontWeight: "bold",
          }}
        >
          {document.name}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              marginRight: "3px",
            }}
            onClick={() => {
              downloadDocument(document.link);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7 10.5L2.625 6.125L3.85 4.85625L6.125 7.13125V0H7.875V7.13125L10.15 4.85625L11.375 6.125L7 10.5ZM1.75 14C1.26875 14 0.856626 13.8285 0.513626 13.4855C0.170626 13.1425 -0.000581848 12.7307 1.48557e-06 12.25V9.625H1.75V12.25H12.25V9.625H14V12.25C14 12.7312 13.8285 13.1434 13.4855 13.4864C13.1425 13.8294 12.7307 14.0006 12.25 14H1.75Z"
                fill="#3D5CAC"
              />
            </svg>
          </Box>
          <Box
            onClick={() => {
              navigateToDocument("/ownerDocumentsPDF", document.link);
            }}
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.5 10.625C9.67361 10.625 10.625 9.67361 10.625 8.5C10.625 7.32639 9.67361 6.375 8.5 6.375C7.32639 6.375 6.375 7.32639 6.375 8.5C6.375 9.67361 7.32639 10.625 8.5 10.625Z"
                fill="#3D5CAC"
              />
              <path
                d="M16.4369 8.31938C15.812 6.70313 14.7273 5.30539 13.3167 4.29892C11.9062 3.29245 10.2316 2.72137 8.5 2.65625C6.7684 2.72137 5.09383 3.29245 3.68326 4.29892C2.2727 5.30539 1.18796 6.70313 0.563124 8.31938C0.520925 8.43609 0.520925 8.56391 0.563124 8.68062C1.18796 10.2969 2.2727 11.6946 3.68326 12.7011C5.09383 13.7075 6.7684 14.2786 8.5 14.3438C10.2316 14.2786 11.9062 13.7075 13.3167 12.7011C14.7273 11.6946 15.812 10.2969 16.4369 8.68062C16.4791 8.56391 16.4791 8.43609 16.4369 8.31938ZM8.5 11.9531C7.81704 11.9531 7.14941 11.7506 6.58155 11.3712C6.01368 10.9917 5.57109 10.4524 5.30973 9.82145C5.04837 9.19048 4.97999 8.49617 5.11322 7.82633C5.24646 7.15649 5.57534 6.5412 6.05827 6.05827C6.5412 5.57534 7.15649 5.24647 7.82633 5.11323C8.49617 4.97999 9.19048 5.04837 9.82145 5.30973C10.4524 5.57109 10.9917 6.01368 11.3712 6.58155C11.7506 7.14941 11.9531 7.81704 11.9531 8.5C11.9517 9.41539 11.5875 10.2929 10.9402 10.9402C10.2929 11.5875 9.41539 11.9517 8.5 11.9531Z"
                fill="#3D5CAC"
              />
            </svg>
          </Box>
        </Box>
      </Box>
      <Box>{`${address}, ${unit}`}</Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        <Box>Created: {start_date}</Box>
        <Box>By: Doolittle Managements</Box>
        <Box>Expires: {end_date}</Box>
        <Box>For: Kim Gordon</Box>
      </Box>
    </Box>
  );
}
export default OwnerDocuments;
