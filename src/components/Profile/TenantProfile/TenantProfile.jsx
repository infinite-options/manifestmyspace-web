import { Box, ThemeProvider, createTheme } from '@mui/system';
import ProfileImg from '../Images/PMProfileImagePlaceholder.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import Setting_fill from "../../../images/Setting_fill.png";

const theme = createTheme({
    palette: {
        background: {
            basic: '#000000',
            gray: '#F2F2F2',
            blue: '#3D5CAC'
        },
        text: {
            primary: '#3D5CAC',
            secondary: '#F2F2F2',
        },
    },
});
function TenantProfile() {
    const { getProfileId } = useUser();
    const navigate = useNavigate()
    const [profileData, setProfileData] = useState([]);
    const [adultTenantData, setAdultTenantData] = useState([]);
    const [childTenantData, setChildTenantData] = useState([]);
    const [petTenantData, setPetTenantData] = useState([]);
    const [vehicleTenantData, setVehicleTenantData] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    useEffect(() => {
        setShowSpinner(true);
        axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/profile/${getProfileId()}`)
            .then((res) => {
                // console.log(res.data.Profile.result[0]);
                setProfileData(res.data.result[0]);
                setAdultTenantData(JSON.parse(res.data.result[0].tenant_adult_occupants));
                setChildTenantData(JSON.parse(res.data.result[0].tenant_children_occupants));
                setPetTenantData(JSON.parse(res.data.result[0].tenant_pet_occupants));
                setVehicleTenantData(JSON.parse(res.data.result[0].tenant_vehicle_info));
                setShowSpinner(false);
            });
    }, []);
    // console.log(adultTenantData, childTenantData, petTenantData, vehicleTenantData);
    return (
        <>
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showSpinner}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        <ThemeProvider theme={theme}>
            <Box sx={{
                "font-family": 'Source Sans Pro',
                color: 'text.primary',
            }}>
                <div>
                    <Box 
                        sx={{
                            width:'80px',
                            height:'80px',
                            marginTop: '10px', 
                            marginRight: '5px', 
                            padding: '1px', 
                            pointerEvents: 'none' // Disable pointer events on the Box
                        }}
                    >
                        <img 
                            src={Setting_fill} 
                            alt="settings"
                            onClick={(e) => {navigate('/settingsTenant', {state: {tenant_data: profileData}})}}
                            style={{ pointerEvents: 'auto' }} // Enable pointer events on the img
                        /> 
                    </Box>
                </div>

                <Box sx={{
                    position: 'relative',
                    bottom: '90px',
                    padding: '25px',
                    marginTop: '70px',
                }}>
                    {profileData.tenant_photo_url !== null ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '121px',
                                width: '121px',
                                backgroundColor: '#bbb',
                                borderRadius: '50%',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                boxShadow: '0px 4px 4px #00000032'
                            }}
                        >
                            <img
                                src={profileData.tenant_photo_url}
                                alt="Profile"
                                style={{
                                    borderRadius: '50%',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </Box>
                    ) : (
                        <Box sx={{
                            justifySelf: 'center',
                            height: '121px',
                            width: '121px',
                            backgroundColor: '#bbb',
                            borderRadius: '50%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            boxShadow: '0px 4px 4px #00000032'
                        }}>
                            
                        </Box>
                    )}
            </Box>
            <Box sx={{
                    position: 'relative',
                    bottom: '90px',
                    padding: '25px',
            }}>
                <Box sx={{
                    position: 'relative',
                    bottom: '90px',
                    padding: '25px',
                }}>
                    

                    
                    <Box sx={{
                        marginLeft: '0px',
                        marginRight: 'auto',
                        marginBottom:'20px'
                    }}>


                    </Box>
                    
                    <Box sx={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}>
                      
                        <TextBox>
                            {`${profileData?.tenant_first_name} ${profileData?.tenant_last_name}`}
                        </TextBox>
                    </Box>
                    <Box sx={{
                        fontSize: '14px',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                            <Box>
                                Owner
                            </Box>
                            <Box sx={{
                                marginLeft: '10px',
                                marginRight: '10px',
                            }}>
                                &#x2022;
                            </Box>
                            <Box sx={{
                                fontWeight: 'bold',
                            }}>
                                Tenant
                            </Box>
                            <Box sx={{
                                marginLeft: '10px',
                                marginRight: '10px',
                            }}>
                                &#x2022;
                            </Box>
                            <Box>
                                Manager
                            </Box>
                        </Box>
                    </Box>
                    <GrayBox>
                        <FlexBox direction="column">
                        <TextBox fontSize={'12px'}>
                                Email
                            </TextBox>

                            <TextBox fontSize={'16px'} fontWeight={'bold'} decoration={'underline'}>
                                {profileData?.tenant_email? profileData?.tenant_email : "-"}
                            </TextBox>
                            
                            <TextBox fontSize={'12px'}>
                                Phone Number
                            </TextBox>

                            <TextBox fontSize={'16px'} fontWeight={'bold'}>
                                {profileData?.tenant_phone_number? profileData?.tenant_phone_number : "-"}
                            </TextBox>
                            
                        </FlexBox>
                    </GrayBox>
                    <GrayBox>
                        <FlexBox direction="column">
                            <TextBox fontSize={'16px'} fontWeight={'bold'}>
                                Personal Information
                            </TextBox>
                            <FlexBox direction="row">
                                <Box sx={{
                                    display: 'inline-block',
                                    textAlign: 'left',
                                }}>
                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        Current Salary
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                        {profileData?.tenant_current_salary ? profileData.tenant_current_salary : "-"}
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        Company Name
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                        {profileData?.tenant_current_job_company ? profileData.tenant_current_job_company : "-"}
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        Current Address
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                        {profileData?.tenant_address ? profileData.tenant_address : '-' }
                                    </Box>
                                    <Box sx={{
                                    display: 'inline-block',
                                    textAlign: 'left',
                                }}>
                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        City/ State
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                        {`${profileData?.tenant_city? profileData?.tenant_city : "- "}/${profileData?.tenant_state? profileData?.tenant_state : " -"}`}
                                    </Box>

                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        {adultTenantData?.length ?? 0} Adults
                                    </Box>

                                    {adultTenantData?.map((adult) => (
                                        <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                                    {`${adult?.name} | ${adult?.relationship} | DOB: ${adult?.dob}`}
                                                </Box>
                                            ))}

                                   
                                   

                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        {childTenantData?.length ?? 0} Child
                                    </Box>
                                    {childTenantData?.map((child) => (
                                        <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                                    {`${child.name} | ${child.relationship} | DOB: ${child.dob}`}
                                                </Box>
                                            ))}

                                   
                                       
                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        {petTenantData?.length ??  0} Pets
                                    </Box>
                                    
                                        {petTenantData?.map((pet) => (
                                            <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                                    {`${pet.name} | ${pet.type} | ${pet.weight} lbs`}
                                                </Box>
                                            ))}
                               
                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        {vehicleTenantData?.length ?? 0} Vehicles
                                    </Box>
                                    


                                    {vehicleTenantData?.map((vehicle) => (
                                        <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                                    {`${vehicle.make} ${vehicle.model} ${vehicle.year} | ${vehicle.license} | ${vehicle.state}`}
                                                </Box>
                                            ))}  
                                        
                                        
                                        
                                            
                                        
                                 
                                    
                                    

                                </Box>
                                </Box>
                                <Box sx={{
                                    display: 'inline-block',
                                    textAlign: 'left',
                                }}>
                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        Salary Frequency
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                        {profileData?.tenant_salary_frequency ? profileData.tenant_salary_frequency : '-'}                                                                                
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        Job Title
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                        {profileData?.tenant_current_job_title ? profileData.tenant_current_job_title : "-"}
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        Unit #
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                        {profileData?.tenant_unit? profileData.tenant_unit : "-"}
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                    }}>
                                        Zip Code
                                    </Box>
                                  <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                        marginBottom: '7px', 
                                    }}>
                                        {profileData?.tenant_zip? profileData.tenant_zip : "-"}
                                    </Box>
                                </Box>
                            </FlexBox>
                            
                            <Box sx={{
                                textAlign: 'center',
                            }}>
                                <Box sx={{
                                    display: 'inline-block',
                                    textAlign: 'left',
                                }}>
                                    
                                </Box>
                            </Box>
                        </FlexBox>
                    </GrayBox>
                    <GrayBox>
                        <FlexBox direction="column">
                            <TextBox fontSize={'16px'} fontWeight={'bold'}>
                                Lease Details
                            </TextBox>
                            <FlexBox direction="row">
                                <Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                    }}>
                                        Lease Start Date
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                    }}>
                                        12/07/22
                                    </Box>
                                </Box>
                                <Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                    }}>
                                        Lease End Date
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                    }}>
                                        12/07/24
                                    </Box>
                                </Box>
                            </FlexBox>
                            <FlexBox direction="row">
                                <Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                    }}>
                                        Monthly Rent
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                    }}>
                                        $1,300
                                    </Box>
                                </Box>
                                <Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                    }}>
                                        Rent Frequency
                                    </Box>
                                    <Box sx={{
                                        fontSize: '13px',
                                        color: '#160449',
                                    }}>
                                        Monthly
                                    </Box>
                                </Box>
                            </FlexBox>
                        </FlexBox>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'left',
                            alignItems: 'center',
                        }}>
                            <Box sx={{
                                margin: '5px',
                            }}>
                                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8 0V4.8898L7.99999 4.94421C7.99991 5.36828 7.99983 5.7804 8.04553 6.12032C8.09705 6.50352 8.22257 6.9408 8.58579 7.30401C8.949 7.66723 9.38628 7.79275 9.76948 7.84427C10.1094 7.88997 10.5215 7.88989 10.9456 7.88981H10.9456L11 7.8898H16V13.7796C16 16.5635 16 17.9555 15.1213 18.8203C14.2426 19.6851 12.8284 19.6851 10 19.6851H6C3.17157 19.6851 1.75736 19.6851 0.87868 18.8203C0 17.9555 0 16.5635 0 13.7796V5.90554C0 3.12164 0 1.72969 0.87868 0.864847C1.75736 0 3.17157 0 6 0H8ZM10 0.00454802V4.8898C10 5.38947 10.0021 5.66363 10.0277 5.85382L10.0287 5.86111L10.036 5.86211C10.2262 5.88768 10.5003 5.8898 11 5.8898H15.995C15.9843 5.49341 15.9511 5.22903 15.8478 4.98335C15.6955 4.6216 15.4065 4.33712 14.8284 3.76816L12.1716 1.15313C11.5935 0.584169 11.3045 0.299689 10.9369 0.149844C10.684 0.0467413 10.4116 0.0145801 10 0.00454802ZM4 10.8268C4 10.2745 4.44772 9.82683 5 9.82683L11 9.82683C11.5523 9.82683 12 10.2745 12 10.8268C12 11.3791 11.5523 11.8268 11 11.8268L5 11.8268C4.44772 11.8268 4 11.3791 4 10.8268ZM5 13.7639C4.44772 13.7639 4 14.2116 4 14.7639C4 15.3161 4.44772 15.7639 5 15.7639H9C9.55228 15.7639 10 15.3161 10 14.7639C10 14.2116 9.55229 13.7639 9 13.7639H5Z" fill="#3D5CAC" />
                                </svg>
                            </Box>
                            <Box>
                                View Lease
                            </Box>
                        </Box>
                    </GrayBox>
                    <GrayBox>
                        <FlexBox direction="row">
                            <Box>
                                <TextBox fontSize={'16px'} fontWeight={'bold'}>
                                    {"*********" ?? profileData?.tenant_ssn}
                                </TextBox>
                                <TextBox fontSize={'12px'}>
                                    SSN
                                </TextBox>
                            </Box>
                            <Box>
                                <TextBox fontSize={'16px'} fontWeight={'bold'}>
                                    No EIN Provided
                                </TextBox>
                                <TextBox fontSize={'12px'}>
                                    EIN
                                </TextBox>
                            </Box>
                        </FlexBox>
                    </GrayBox>
                    <Box sx={{
                        borderRadius: "10px",
                        boxShadow: '0px 4px 4px #00000032'
                    }}>
                        <GrayBox>
                            <Box onClick={()=>{navigate('/tenantProfileEdit')}}>
                            <TextBox fontSize={'15px'} fontWeight={'bold'}>
                                Edit Profile and Password
                            </TextBox>
                            </Box>
                        </GrayBox>
                    </Box>
                </Box>
            </Box>
          </Box>
        </ThemeProvider>
        </>
    );
}

function GrayBox(props) {
    return (
        <Box sx={{
            backgroundColor: 'background.gray',
            borderRadius: "10px",
            marginTop: "18px",
            padding: '6px',
        }}>
            {props.children}
        </Box>
    );
}

function FlexBox(props) {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: props.direction,
            justifyContent: 'space-evenly',
        }}>
            {props.children}
        </Box>
    );
}

function TextBox(props) {
    return (
        <Box sx={{
            display: "flex",
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontSize: props.fontSize,
            fontWeight: props.fontWeight,
            textDecoration: props.decoration,
        }}>
            {props.children}
        </Box>
    );
}
export default TenantProfile;
