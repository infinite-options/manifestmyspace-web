import { useNavigate } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { useUser } from "../contexts/UserContext";
import { roleMap } from "./Onboarding/helper";
import { ReactComponent as Logo } from "../images/logo.svg";
import { useCookies } from "react-cookie";
function Header() {
  const { user, selectedRole, selectRole, roleName } = useUser();
  const [cookie, setCookie] = useCookies(["user"]);
  const cookiesData = cookie["user"];
  const userRoles = user ? cookiesData.role.split(",") : [];

  const navigate = useNavigate();

  const handleButtonClick = (role) => {
    selectRole(role);
    const { dashboardUrl } = roleMap[role];
    navigate(dashboardUrl);
  };

  return (
    <>
      <div className="main-header">
        <div className="main-header-title-logo">
          <div className="main-header-title-logo-container">
            <Logo />
          </div>
        </div>

        <AppBar position="static" style={{ backgroundColor: "#3D5CAC" }}>
          <Toolbar
            style={{
              display: "flex",
              // justifyContent: "center",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {userRoles.map((role) => (
              <Button
                key={role}
                color="inherit"
                style={{
                  fontWeight: selectedRole === role ? 800 : 300,
                  fontSize: "15px",
                  fontFamily: "Source Sans 3, sans-serif",
                  margin: "0 18px",
                  textTransform: "none",
                }}
                onClick={() => {
                  handleButtonClick(role);
                }}
              >
                {roleName(role)}
              </Button>
            ))}
          </Toolbar>
        </AppBar>
      </div>
    </>
  );
}

export default Header;
