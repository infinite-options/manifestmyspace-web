import theme from '../../theme/theme';
import Home_fill from '../../images/Home_fill.png';
import Bell_fill from '../../images/Bell_fill.png';
import User_fill from '../../images/User_fill.png';
import dark_User_fill from '../../images/User_fill_dark.png';
import comment_fill from '../../images/comment_fill.png';
import phone_fill from '../../images/phone_fill.svg';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid, Box, ThemeProvider, Typography, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext'

export default function UserNavBar(props){
  const navigate = useNavigate();

 const { selectedRole, isLoggedIn, getProfileId } = useUser();  

 let computedWidth = props.isMobile ? "100%" : "40%"
 const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
 
 const getHomeButtonNav = () => {
    // console.log("selectedRole ",selectedRole);
    switch (selectedRole) {
    case 'OWNER':
        return '/ownerDashboard';
    case 'MANAGER':
        return '/managerDashboard';
    case 'TENANT':
        return '/tenantDashboard';
    case 'MAINTENANCE':
        return '/maintenanceDashboard2';
    case 'PM_EMPLOYEE':
        return '/managerDashboard';
    case 'MAINT_EMPLOYEE':
        return '/maintenanceDashboard2';
    default:
        return '/';
    }
};
const getProfileButtonNav = () => {
  console.log("nn selectedRole",selectedRole)

  return '/profileEditor'
    switch (selectedRole) {
      case 'OWNER':
        return '/ownerProfile';
      case 'MANAGER':
        return '/pmProfile';
      case 'TENANT':
        return '/tenantProfile';
      case 'MAINTENANCE':
        return '/maintenanceProfile';
      case 'PM_EMPLOYEE':
        return '/pmProfile';
      case 'MAINT_EMPLOYEE':
          return '/maintenanceProfile';
      default:
        return '/';
    }
};
const getCommentButtonNav = () => {
    switch (selectedRole) {
      case 'OWNER':
        return '/referUser';
      case 'MANAGER':
        return '/referUser';
      case 'TENANT':
        return '/referUser';
      case 'MAINTENANCE':
        return '/referUser';
      case 'PM_EMPLOYEE':
        return '/referUser';
      case 'MAINT_EMPLOYEE':
        return '/referUser';
      default:
        return '/';
    }
};

const getPhoneButtonNav = () => {
  switch (selectedRole) {
    case 'OWNER':
      return '/ownerContacts';
    case 'MANAGER':
      return '/PMContacts';
    case 'TENANT':
      return '/tenantContacts';
    case 'MAINTENANCE':
      return '/maintenanceContacts';
    case 'PM_EMPLOYEE':
      return '/PMContacts';
    case 'MAINT_EMPLOYEE':
      return '/maintenanceContacts';
    default:
      return '/';
  }
};

  return (
    <Grid
      container
      justify="right"
      alignItems="right"
      style={{
        width: computedWidth,
      }}
    >
      <Grid item xs={3}>
        <Box 
          onClick={()=>{navigate(getHomeButtonNav())}}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <img
              src={Home_fill}
              alt="Home Icon"
              style={{ display: 'block', margin: '0 5px', cursor: 'pointer' }}
              
            />
            {isDesktop && (
              <Typography              
                style={{ cursor: 'pointer', marginLeft: '0px', fontWeight: 'bold', }}
              >
                Dashboard
              </Typography>
            )}
        </Box>
      </Grid>
      <Grid item xs={3}>
        <Box 
          onClick={()=>{if (getProfileId()) navigate(getProfileButtonNav())}}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img
            src={getProfileId() ? User_fill : dark_User_fill }
            alt="User Icon"
            style={{ display: 'block', margin: '0 5px', cursor: 'pointer' }}                        
          />
          {isDesktop && (
            <Typography              
              style={{ cursor: 'pointer', marginLeft: '0px', fontWeight: 'bold', }}
            >
              Profile
            </Typography>
          )}
        </Box>
      </Grid>
      <Grid item xs={3}>
        <Box 
          onClick={()=>{navigate("/announcements")}}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img
            src={Bell_fill}
            alt="Bell Icon"
            style={{ display: 'block', margin: '0 5px', cursor: 'pointer' }}            
          />
          {isDesktop && (
            <Typography              
              style={{ cursor: 'pointer', marginLeft: '0px', fontWeight: 'bold', }}
            >
              Alerts
            </Typography>
          )}
        </Box>
      </Grid>      
      {
        (
          <Grid item xs={3}>
            <Box 
              onClick={()=>{navigate(getPhoneButtonNav())}}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img
                src={phone_fill}
                alt="Phone Icon"
                style={{ display: 'block', margin: '0 5px', cursor: 'pointer' }}                
              />
              {isDesktop && (
                <Typography              
                  style={{ cursor: 'pointer', marginLeft: '0px', fontWeight: 'bold', }}
                >
                  Contacts
                </Typography>
              )}
            </Box>
          </Grid>
        )
        // : (
        //   <Grid item xs={3}>
        //     <img
        //       src={comment_fill}
        //       alt="Comment Icon"
        //       style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
        //       onClick={()=>{navigate(getCommentButtonNav())}}
        //     />
        //   </Grid>
        // )
      }
      
    </Grid>
  )
}