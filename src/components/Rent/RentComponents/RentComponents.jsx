import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import theme from "../../../theme/theme";
import AllOwnerIcon from "./AllOwnerIcon.png";

export function MainContainer(props) {
  return (
    <Box
      sx={{
        backgroundColor: "#F2F2F2",
        borderRadius: "10px",
        margin: "25px",
        padding: "15px",
        fontFamily: "Source Sans Pro",
      }}
    >
      {props.children}
    </Box>
  );
}

export function RentTitle(props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        color: "#160449",
        fontWeight: "bold",
        fontSize: "20px",
      }}
    >
      <Box
        sx={{
          width: "22px",
          height: "22px",
        }}
      ></Box>
      <Box>{props.children}</Box>
      <Box>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline-block" }}>
          <circle cx="10.0833" cy="10.0833" r="6.41667" stroke="#3D5CAC" strokeWidth="2" />
          <path
            d="M10.0833 7.33337C9.7222 7.33337 9.3646 7.4045 9.03095 7.54271C8.69731 7.68091 8.39415 7.88347 8.13879 8.13883C7.88343 8.39419 7.68087 8.69735 7.54267 9.03099C7.40446 9.36464 7.33333 9.72224 7.33333 10.0834"
            stroke="#3D5CAC"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M18.3333 18.3334L15.5833 15.5834" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </Box>
    </Box>
  );
}

export function ViewOptionContainer(props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {props.children}
    </Box>
  );
}
export function ViewOptionText(props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        marginTop: "5px",
        marginBottom: "5px",

        color: "#3D5CAC",
        fontSize: "14px",
        fontWeight: "bold",
      }}
    >
      {props.children}
    </Box>
  );
}
export function CalendarIcon(props) {
  return (
    <Box
      sx={{
        marginRight: "5px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.125" y="6.25" width="18.75" height="15.625" rx="2" stroke="#3D5CAC" strokeWidth="2" />
        <path
          d="M3.125 10.25C3.125 8.36438 3.125 7.42157 3.71079 6.83579C4.29657 6.25 5.23938 6.25 7.125 6.25H17.875C19.7606 6.25 20.7034 6.25 21.2892 6.83579C21.875 7.42157 21.875 8.36438 21.875 10.25V10.4167H3.125V10.25Z"
          fill="#3D5CAC"
        />
        <path d="M7.29166 3.125L7.29166 6.25" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" />
        <path d="M17.7083 3.125L17.7083 6.25" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </Box>
  );
}
export function OwnerIcon(props) {
  return (
    <Box
      sx={{
        marginRight: "5px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <img src={AllOwnerIcon} alt="Owner Icon" width="25" height="25" />
    </Box>
  );
}
export function HomeIcon(props) {
  return (
    <Box
      sx={{
        marginRight: "5px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.494393 5.97002C0.208496 6.61649 0.208496 7.35194 0.208496 8.82284V13.4166C0.208496 15.4594 0.208496 16.4807 0.81869 17.1153C1.37711 17.6961 2.24699 17.7454 3.896 17.7495V12.3333C3.896 11.2201 4.77348 10.25 5.93766 10.25H9.06266C10.2268 10.25 11.1043 11.2201 11.1043 12.3333V17.7495C12.7533 17.7454 13.6232 17.6961 14.1816 17.1153C14.7918 16.4807 14.7918 15.4594 14.7918 13.4166V8.82284C14.7918 7.35194 14.7918 6.61649 14.5059 5.97002C14.22 5.32355 13.6831 4.84493 12.6093 3.88768L11.5676 2.9591C9.62665 1.22888 8.65618 0.36377 7.50016 0.36377C6.34415 0.36377 5.37367 1.22888 3.43272 2.9591L2.39105 3.88768C1.31721 4.84493 0.78029 5.32355 0.494393 5.97002ZM9.10433 17.7499V12.3333C9.10433 12.2974 9.09116 12.2737 9.0784 12.2604C9.07205 12.2538 9.06712 12.2512 9.06548 12.2505L9.06533 12.2504C9.06461 12.2501 9.06438 12.25 9.06266 12.25H5.93766C5.93595 12.25 5.93571 12.2501 5.935 12.2504L5.93485 12.2505C5.9332 12.2512 5.92828 12.2538 5.92193 12.2604C5.90917 12.2737 5.896 12.2974 5.896 12.3333V17.7499H9.10433Z"
          fill="#3D5CAC"
        />
      </svg>
    </Box>
  );
}

export function ViewAllButton(props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        borderRadius: "10px",
        padding: "5px",
        boxShadow: "0px 4px 4px #00000040",

        backgroundColor: "#9EAED6",
        color: "#160449",
        fontSize: "20px",
        fontWeight: "600",
      }}
    >
      {props.children}
    </Box>
  );
}

const propertyRentStatus = [
  { status: "UNPAID", color: "#A52A2A" },
  { status: "PAID PARTIALLY", color: "#FF8A00" },
  { status: "PAID LATE", color: "#FFC614" },
  { status: "PAID", color: "#3D5CAC" },
  { status: "VACANT", color: "#160449" },
];
export const getStatusColor = (status) => {
  for (let i = 0; i < propertyRentStatus.length; i++) {
    if (propertyRentStatus[i].status?.toUpperCase() === status?.toUpperCase()) {
      return propertyRentStatus[i].color;
    }
  }
  return "#FFFFFF";
};

export function RentAccordionView(props) {
  const rentData = props.data;
  const rentDetailUrl = props.link;
  const [unpaid, setUnpaid] = useState([]);
  const [partial, setPartial] = useState([]);
  const [late, setLate] = useState([]);
  const [paid, setPaid] = useState([]);
  const [vacant, setVacant] = useState([]);
  useEffect(() => {
    if (rentData !== undefined && Object.keys(rentData).length !== 0) {
      setUnpaid(rentData.unpaid);
      setPartial(rentData.partial);
      setLate(rentData.late);
      setPaid(rentData.paid);
      setVacant(rentData.vacant);
    }
  }, [rentData]);

  return (
    <Box
      sx={{
        borderRadius: "10px",
        boxShadow: "0px 4px 4px #00000040",
      }}
    >
      <RentAccordion status={"UNPAID"} data={[rentData, unpaid]} link={rentDetailUrl} />
      <RentAccordion status={"PAID PARTIALLY"} data={[rentData, partial]} link={rentDetailUrl} />
      <RentAccordion status={"PAID LATE"} data={[rentData, late]} link={rentDetailUrl} />
      <RentAccordion status={"PAID"} data={[rentData, paid]} link={rentDetailUrl} />
      <RentAccordion status={"VACANT"} data={[rentData, vacant]} link={rentDetailUrl} />
    </Box>
  );
}

export function RentAccordion(props) {
  const status = props.status;
  const [rentData, properties] = props.data;
  const rentDetailUrl = props.link;
  const StatusText = () => {
    switch (status) {
      case "UNPAID":
        return "Not Paid";
      case "PAID PARTIALLY":
        return "Paid partially";
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
  const navigate = useNavigate();
  function navigateTo(url, index) {
    navigate(url, {
      state: {
        status: status,
        index: index,
        data: rentData,
      },
    });
  }
  return (
    <Accordion theme={theme} style={{ backgroundColor: getStatusColor(status), fontFamily: "Source Sans Pro", color: "#FFFFFF" }}>
      <AccordionSummary
        expandIcon={
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#F2F2F2" strokeWidth="2.5" />
          </svg>
        }
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "95%",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          <Box>{StatusText()}</Box>
          <Box>{properties.length}</Box>
        </Box>
      </AccordionSummary>
      {properties.map((property, index) => {
        const address =
          property.property_address +
          ", " +
          (property.property_unit !== "" ? property.property_unit + ", " : "") +
          property.property_city +
          " " +
          property.property_state +
          " " +
          property.property_zip;
        return (
          <AccordionDetails key={property.property_uid}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "13px",
                fontWeight: "600",
              }}
              onClick={() => {
                navigateTo(rentDetailUrl, index);
              }}
            >
              <Box
                sx={{
                  textDecoration: "underline",
                }}
              >
                {address}
              </Box>
              <Box>${property.pur_amount_due}</Box>
            </Box>
          </AccordionDetails>
        );
      })}
    </Accordion>
  );
}
