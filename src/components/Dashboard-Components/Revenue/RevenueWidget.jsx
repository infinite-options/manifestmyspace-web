import { Box, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RevenueWidget({ revenueData }) {
  console.log("In Revenue Widget ", revenueData);

  const navigate = useNavigate();
  const revenue = revenueData?.revenue?.result[0]?.received_expected;
  const expenses = revenueData?.expense?.result[0]?.paid_expected;
  const profit = revenue - expenses;

  return (
    <>
      <Grid container sx={{ backgroundColor: "#f0f0f0", borderRadius: "10px" }}>
        <Grid container item xs={12} md={9} sx={{ padding: "20px" }}>
          <Grid
            item
            xs={12}
            sx={{
              width: "100%",
              backgroundColor: "#160449",
              color: "#FFFFFF",
              fontWeight: "bold",
              marginBottom: "10px",
              borderRadius: "5px",
              padding: "5px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ height: "10%", fontWeight: "bold" }}>Expected Monthly Profit</Typography>
            <Typography sx={{ height: "10%", fontWeight: "bold" }}>{profit.toFixed(2)}</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              width: "100%",
              backgroundColor: "#9EAED6",
              marginBottom: "10px",
              borderRadius: "5px",
              padding: "5px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ height: "10%", fontWeight: "bold" }}>Expected Monthly Revenue</Typography>
            <Typography sx={{ height: "10%", fontWeight: "bold" }}>{revenue}</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ width: "100%", backgroundColor: "#979797", borderRadius: "5px", padding: "5px", display: "flex", flexDirection: "row", justifyContent: "space-between" }}
          >
            <Typography sx={{ height: "10%", fontWeight: "bold" }}>Expected Monthly Expenses</Typography>
            <Typography sx={{ height: "10%", fontWeight: "bold" }}>{expenses}</Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} md={3} direction="row" justifyContent="center" alignItems="center" sx={{ padding: "10px" }}>
          <Grid item xs={6} md={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button
              variant="contained"
              sx={{
                width: "60%",
                // marginTop: '10px',
                backgroundColor: "#A9AAAB",
                color: "#19084B",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#A9AAAB",
                },
              }}
              onClick={() => navigate("/payments")}
            >
              Pay Bills
            </Button>
          </Grid>
          <Grid item xs={6} md={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button
              variant="contained"
              sx={{
                width: "60%",
                // marginTop: '10px',
                backgroundColor: "#A9AAAB",
                color: "#19084B",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#A9AAAB",
                },
              }}
            >
              Transactions!
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
