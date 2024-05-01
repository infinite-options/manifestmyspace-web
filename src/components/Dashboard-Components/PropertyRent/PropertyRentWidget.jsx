import { PieChart, Pie, Legend, Cell } from "recharts";
import { Chart } from "react-google-charts";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useUser } from "../../../contexts/UserContext.jsx";

export default function PropertyRentWidget(props) {
  console.log("In Property Rent Widget ");
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

  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    const status = data.find((item) => item.fill === color)?.rent_status;
    const num = data.find((item) => item.fill === color)?.number;
    return (
      <span style={{ color: "#160449", fontFamily: "Source Sans Pro", fontSize: "18px" }}>
        {num} {status}
      </span>
    );
  };

  return (
    <Box
      style={{
        backgroundColor: "#F5F5F5",
        marginTop: "30px",
        width: "42.75%",
        height: "392px",
        borderRadius: "10px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <h2 className="mt-widget-title"> Property Rent</h2>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PieChart width={200} height={200}>
          <Legend
            height={36}
            iconType="circle"
            layout="vertical"
            verticalAlign="bottom"
            iconSize={15}
            padding={5}
            formatter={renderColorfulLegendText}
            onClick={() => navigate("/pmRent")}
          />
          <Pie
            data={data}
            cx={100}
            cy={80}
            innerRadius={45}
            outerRadius={60}
            paddingAngle={0}
            dataKey="number"
            filter="url(#shadow)"
            onClick={() => navigate(propertyRoutingBasedOnSelectedRole())}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={3} />
            ))}
          </Pie>
          <text
            x={100}
            y={78}
            textAnchor="middle"
            dominantBaseline="middle"
            cursor="pointer"
            style={{
              fontFamily: "Source Sans Pro",
              fontSize: "14px",
              fill: "#160449",
              fontWeight: "600",
            }}
            onClick={() => navigate(propertyRoutingBasedOnSelectedRole())}
          >
            View all {totalPropertiesCount}
            <tspan x={105} y={98}>
              properties
            </tspan>
          </text>
        </PieChart>
      </Box>
    </Box>
  );
}
