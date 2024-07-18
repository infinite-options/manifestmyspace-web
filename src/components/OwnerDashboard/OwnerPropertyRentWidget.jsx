import { PieChart, Pie, Legend, Cell } from "recharts";
import { Chart } from "react-google-charts";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import { useUser } from "../../contexts/UserContext.jsx";

export default function OwnerPropertyRentWidget(props) {
  console.log("In Owner Property Rent Widget ");
  const navigate = useNavigate();
  const { propertyRoutingBasedOnSelectedRole, user, selectedRole } = useUser();
  // console.log(selectedRole);
  // console.log(props.rentData);

  // console.log("Role: ", user);
  // console.log("Selected Role: ", selectedRole);

  let rentStatusData = props.rentData;

  let unpaidCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "UNPAID") : 0;
  // console.log(unpaidCount);
  unpaidCount = unpaidCount ? unpaidCount.num : 0;

  let partialPaidCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "PAID PARTIALLY") : 0;
  partialPaidCount = partialPaidCount ? partialPaidCount.num : 0;

  let paidLateCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "PAID LATE") : 0;
  paidLateCount = paidLateCount ? paidLateCount.num : 0;

  let paidCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "PAID") : 0;
  paidCount = paidCount ? paidCount.num : 0;

  let vacantCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "VACANT") : 0;
  vacantCount = vacantCount ? vacantCount.num : 0;

  let noManagerCount = rentStatusData ? rentStatusData.find((rs) => rs.rent_status === "NO MANAGER") : 0;
  // console.log(noManagerCount);
  noManagerCount = noManagerCount ? noManagerCount.num : 0;

  // no check if rentSatus does not exist so this could result in a failure
  let totalPropertiesCount = unpaidCount + partialPaidCount + paidLateCount + vacantCount + paidCount + noManagerCount;

  let data = [
    { rent_status: "not paid", number: unpaidCount, fill: "#A52A2A" },
    { rent_status: "paid partially", number: partialPaidCount, fill: "#FF8A00" },
    { rent_status: "paid late", number: paidLateCount, fill: "#FFC85C" },
    { rent_status: "paid on time", number: paidCount, fill: "#3D5CAC" },
    { rent_status: "vacant", number: vacantCount, fill: "#160449" },
  ];

  // Add object conditionally only if selectedRole is "OWNER"
  if (selectedRole === "OWNER") {
    data.push({ rent_status: "no manager", number: noManagerCount, fill: "#111111" });
  }

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    const status = data.find((item) => item.fill === color)?.rent_status;
    const num = data.find((item) => item.fill === color)?.number;
    const capitalizedStatus = status ? capitalizeWords(status) : "";
    return (
      <span style={{ color: "#160449", fontFamily: "Source Sans Pro", fontSize: "18px" }}>
        {num} {capitalizedStatus}
      </span>
    );
  };

  return (
    <Grid container style={{ backgroundColor: "#F2F2F2", borderRadius: "10px", height: "100%" }}>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
        {/* <Typography sx={{fontSize: '25px', fontWeight: 600, paddingTop: '15px',}}> */}
        <Typography variant="h5" sx={{ fontWeight: "bold", paddingTop: "15px", color: "#160449" }}>
          Property Rent
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <PieChart width={400} height={250} margin={{ top: 40, right: 30, left: 50, bottom: 40 }}>
          <Pie
            data={data}
            cx={70}
            cy={78}
            innerRadius={55}
            outerRadius={80}
            paddingAngle={0}
            dataKey="number"
            filter="url(#shadow)"
            onClick={() => navigate(propertyRoutingBasedOnSelectedRole())}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={3} />
            ))}
          </Pie>

          <Legend
            height={36}
            iconType="circle"
            layout="vertical"
            align="right"
            verticalAlign="top"
            iconSize={15}
            padding={5}
            formatter={renderColorfulLegendText}
            onClick={() => navigate("/pmRent")}
          />

{
  totalPropertiesCount > 0 ? (
    <text
      x={120}
      y={113}
      textAnchor="middle"
      dominantBaseline="middle"
      cursor="pointer"
      style={{
        fontFamily: "Source Sans Pro",
        fontSize: "14px",
        fill: "#160449",
        fontWeight: "800",
      }}
      onClick={() => navigate(propertyRoutingBasedOnSelectedRole())}
    >
      View all {totalPropertiesCount}
      <tspan x={120} y={125}>
        properties
      </tspan>
    </text>
  ) : (
    <text
      x={120}
      y={113}
      textAnchor="middle"
      dominantBaseline="middle"
      cursor="pointer"
      style={{
        fontFamily: "Source Sans Pro",
        fontSize: "14px",
        fill: "#160449",
        fontWeight: "800",
      }}
      onClick={() => navigate('/newPropertyForm')}
    >
      Add your first
      <tspan x={120} y={125}>
        property here
      </tspan>
    </text>
  )
}

        </PieChart>
      </Grid>
    </Grid>
  );
}
