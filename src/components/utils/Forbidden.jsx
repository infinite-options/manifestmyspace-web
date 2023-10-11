import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h5">{"Login required"}</Typography>
      <Typography sx={{ my: 2 }}>
        {`You will need to login to view this page.`}
      </Typography>
      <Button
        variant="contained"
        sx={{
          background: "#3D5CAC",
          color: "#FFFFFF",
          borderRadius: "10px",
          textTransform: "none",
        }}
        onClick={() => navigate("/returningUser")}
      >
        {"Go to Login"}
      </Button>
    </Box>
  );
};

export default Forbidden;
