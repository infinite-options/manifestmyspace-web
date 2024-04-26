import { Box } from "@mui/system";
import { getStatusColor } from "./RentComponents";
import { Typography } from "@material-ui/core";

export function BackIcon(props) {
  return (
    <Box
      sx={{
        marginRight: "10px",
      }}
    >
      <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 7L1.58579 8.41421L0.171572 7L1.58579 5.58579L3 7ZM8 20C6.89543 20 6 19.1046 6 18C6 16.8954 6.89543 16 8 16L8 20ZM6.58579 13.4142L1.58579 8.41421L4.41421 5.58579L9.41421 10.5858L6.58579 13.4142ZM1.58579 5.58579L6.58579 0.585787L9.41421 3.41421L4.41421 8.41421L1.58579 5.58579ZM3 5L13.5 5L13.5 9L3 9L3 5ZM13.5 20L8 20L8 16L13.5 16L13.5 20ZM21 12.5C21 16.6421 17.6421 20 13.5 20L13.5 16C15.433 16 17 14.433 17 12.5L21 12.5ZM13.5 5C17.6421 5 21 8.35786 21 12.5L17 12.5C17 10.567 15.433 9 13.5 9L13.5 5Z"
          fill="#3D5CAC"
        />
      </svg>
    </Box>
  );
}

export function RentDetailNavbarTab(props) {
  const color = props.style;
  const update = props.update;
  const title = props.title;

  return (
    <Box
      sx={{
        width: "20%",
        height: "60px",
        borderRadius: "10px",
        boxShadow: "0px 4px 4px #00000040",
        backgroundColor: color,
        display: "flex", // Added for centering
        justifyContent: "center", // Center content horizontally
      }}
      onClick={() => update()}
    >
      <Typography style={{ color: "#FFFFFF" }}>{title}</Typography>
    </Box>
  );
}

const StatusText = (status) => {
  switch (status) {
    case "UNPAID":
      return "Not Paid";
    case "PAID PARTIALLY":
      return "Paid Partially";
    case "PAID LATE":
      return "Paid Late";
    case "PAID":
      return "Paid On Time";
    case "VACANT":
      return "Vacant";
    default:
      return "";
  }
};

export function RentDetailBody(props) {
  console.log("In RentDetailBody props", props);
  let [rentDetailsData, propertyID, index, propertyStatus] = props.data;
  console.log("In RentDetailBody actual rentDetailsData", rentDetailsData);
  //   console.log("In RentDetailBody actual image", rentDetailsData.property_favorite_image);
  const [decrementIndex, incrementIndex] = props.updator;
  const [getProperties] = props.methods;
  const property = getProperties(propertyStatus)[index];

  const uid = property?.property_uid;
  if (Array.isArray(rentDetailsData)) rentDetailsData = rentDetailsData.filter((rent_detail) => rent_detail.property_uid === uid);
  let due_amount = rentDetailsData[0]?.pur_amount_due; //?? 0
  let due_date;

  try {
    due_date = rentDetailsData[0]?.pur_due_date;
  } catch (e) {
    due_date = "";
  }

  function calculateDaysDifference(inputDate) {
    // Parse the input date string
    try {
      const inputDateObj = new Date(inputDate);

      // Current date
      const currentDate = new Date();

      // Calculate the difference in milliseconds
      const timeDifference = currentDate - inputDateObj;

      // Convert milliseconds to days
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      return daysDifference;
    } catch (e) {
      return "";
    }
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };
  const thStyle = {
    fontWeight: "inherit",
  };

  function formatDate(inputDate) {
    if (!inputDate) {
      return "";
    }
    const year = inputDate.substring(0, 4);
    const month = inputDate.substring(5, 7);
    const day = inputDate.substring(8, 10);

    return `${month}/${day}/${year}`;
  }

  function parseImageData(data) {
    if (data === undefined) {
      return;
    }
    const s = data.indexOf("http");
    const l = data.indexOf('"', s);
    const imageString = data.slice(s, l);
    return imageString;
  }

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "10px",
        boxShadow: "0px 4px 4px #00000040",
        backgroundColor: "#FFFFFF",
        bottom: "30px",

        color: "#160449",
        fontWeight: "600",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "20px",
          borderRadius: "10px 10px 0px 0px",
          backgroundColor: getStatusColor(propertyStatus),
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "15px",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <Box
          onClick={() => {
            decrementIndex();
          }}
        >
          <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.5 16.5L4.08579 15.0858L2.67157 16.5L4.08579 17.9142L5.5 16.5ZM26.125 18.5C27.2296 18.5 28.125 17.6046 28.125 16.5C28.125 15.3954 27.2296 14.5 26.125 14.5V18.5ZM12.3358 6.83579L4.08579 15.0858L6.91421 17.9142L15.1642 9.66421L12.3358 6.83579ZM4.08579 17.9142L12.3358 26.1642L15.1642 23.3358L6.91421 15.0858L4.08579 17.9142ZM5.5 18.5H26.125V14.5H5.5V18.5Z"
              fill="#160449"
            />
          </svg>
        </Box>
        <Box>
          {getProperties(propertyStatus).length > 0 ? (
            <>
              {index + 1} of {getProperties(propertyStatus).length} {StatusText(propertyStatus)}
            </>
          ) : (
            <>None</>
          )}
        </Box>
        <Box
          onClick={() => {
            incrementIndex();
          }}
        >
          <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M27.5 16.5L28.9142 17.9142L30.3284 16.5L28.9142 15.0858L27.5 16.5ZM6.875 14.5C5.77043 14.5 4.875 15.3954 4.875 16.5C4.875 17.6046 5.77043 18.5 6.875 18.5L6.875 14.5ZM20.6642 26.1642L28.9142 17.9142L26.0858 15.0858L17.8358 23.3358L20.6642 26.1642ZM28.9142 15.0858L20.6642 6.83579L17.8358 9.66421L26.0858 17.9142L28.9142 15.0858ZM27.5 14.5L6.875 14.5L6.875 18.5L27.5 18.5L27.5 14.5Z"
              fill="#160449"
            />
          </svg>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          padding: "20px",
          justifyContent: "space-evenly",
        }}
      >
        <Box
          sx={{
            minWidth: "130px",
            height: "130px",
            marginRight: "20px",
            backgroundColor: "grey",
          }}
        >
          {getProperties(propertyStatus).length > 0 ? (
            <img
              //   src={property.property_favorite_image}
              src={rentDetailsData.property_favorite_image}
              alt="Property Img"
              style={{
                width: "130px",
                height: "130px",
              }}
            />
          ) : (
            <></>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              fontSize: "18px",
              textDecoration: "underline",
            }}
          >
            <div>
              {getProperties(propertyStatus).length > 0 &&
                `${property.property_address}, ${property.property_unit !== null && property.property_unit !== "" ? property.property_unit + "," : ""} ${property.property_city} ${
                  property.property_state
                } ${property.property_zip}`}
            </div>
            <div>{getProperties(propertyStatus).length > 0 && `${property?.property_uid}`}</div>
          </Box>

          <Box
            sx={{
              marginBottom: "0px",
              marginTop: "auto",
              fontSize: "14px",
            }}
          >
            <Box>{getProperties(propertyStatus).length > 0 && (due_amount === null ? "Vacant" : `$ ${due_amount}`)}</Box>
            <Box>{getProperties(propertyStatus).length > 0 && (due_date ? `due ${due_date.replaceAll("-", "/")}` : "No Due Date")}</Box>
            <Box>{getProperties(propertyStatus).length > 0 && (due_date ? `${calculateDaysDifference(due_date)} Days Overdue` : "Not Overdue")}</Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          fontSize: "13px",
          fontWeight: "600",
          color: "#3D5CAC",
        }}
      >
        <Box
          sx={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#160449",
          }}
        >
          Rent History
        </Box>
        <table style={tableStyle}>
          <tr style={{ "border-bottom": "1px solid #3D5CAC" }}>
            <th style={thStyle}>Month</th>
            <th style={thStyle}>Paid</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Rent Status</th>
            <th style={thStyle}>Fees</th>
          </tr>
          {rentDetailsData.length > 0 &&
            rentDetailsData.map((rentDetails, i) => {
              console.log("In map: ", rentDetails);
              let image = rentDetails.property_favorite_image;
              console.log("In map image: ", rentDetails.property_favorite_image);
              {
                /* let month = rentDetails.cf_month;
                        let paid = rentDetails.payment_date !== null ? (
                            formatDate(rentDetails.payment_date) !== '' ? formatDate(rentDetails.payment_date).slice(0, 5) : '-'
                        ) : '-';
                        let amount = rentDetails.pay_amount !== null ? '$' + rentDetails.pay_amount : '-';
                        let payment_status = rentDetails.payment_status;

                        let id = rentDetails.property_id;
                        let fee = '';
                        for (let i = 0; i < rentDetailsData.length; i++) {
                            const prop2 = rentDetailsData[i];
                            if (prop2.purchase_type !== 'RENT' && prop2.property_id === id && prop2.cf_month === month && prop2.cf_year === rentDetails.cf_year) {
                                fee = '+$' + prop2.pur_amount_due;
                            }
                        }  */
              }
              let month = rentDetails?.cf_month || 0; //These fields need revision
              let payment_date = rentDetails?.payment_date ?? "";
              let paid;
              if (payment_date === "") {
                paid = "-";
              } else {
                const [payment_month, payment_day] = payment_date.split("-");
                paid = `${payment_month}/${payment_day}`;
              }
              let amount = `\$${rentDetails?.total_paid ?? 0}`;
              let rent_status = rentDetails?.purchase_status || "No rent_status ";
              let fees = rentDetails?.total_late_fees ?? 0;
              let paid_fees = rentDetails?.total_late_fees_paid ?? 0;

              return (
                <>
                  {
                    <>
                      <PropertyRow key={rentDetailsData.rent_detail_index} data={{ month, paid, amount, rent_status, fees, paid_fees }} />
                    </>
                  }
                </>
              );
            })}
        </table>
      </Box>
    </Box>
  );
}
function PropertyRow(props) {
  const { month, paid, amount, rent_status, fees, paid_fees } = props.data;
  const tdStyle = {
    textAlign: "center",
  };
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  function getMonthAbbreviation(m) {
    if (m !== undefined) {
      return months[m - 1];
    } else {
      console.log("ERROR: Month value is", m);
      return "Invalid Month";
    }
  }

  return (
    <tr>
      <th style={tdStyle}>{getMonthAbbreviation(month)}</th>
      <th style={tdStyle}>{paid ?? ""}</th>
      <th style={tdStyle}>{amount}</th>
      <th style={tdStyle}>
        <PropertyStatus data={rent_status} />
      </th>
      <th style={{ ...tdStyle, color: paid_fees < fees ? "#A52A2A" : "inherit" }}>{fees || ""}</th>
    </tr>
  );
}
function PropertyStatus(props) {
  const rent_status = props.data;
  const color = rent_status !== null ? getStatusColor(rent_status) : "#FFFFF";
  return (
    <Box
      sx={{
        backgroundColor: color,
        color: "#FFFFFF",
        textAlign: "left",
        paddingLeft: "5px",
      }}
    >
      {StatusText(rent_status)}
    </Box>
  );
}
