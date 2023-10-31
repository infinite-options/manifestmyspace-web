import { Box, ThemeProvider, createTheme } from '@mui/system';
import ProfileImg from '../Images/PMProfileImagePlaceholder.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";

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
        console.log("TENANT PROFILE USE EFFECT")
        setShowSpinner(true);
        axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/tenantProfile/${getProfileId()}`)
            .then((res) => {
                // console.log(res.data.Profile.result[0]);
                setProfileData(res.data.Profile.result[0]);
                setAdultTenantData(JSON.parse(res.data.Profile.result[0].tenant_adult_occupants));
                setChildTenantData(JSON.parse(res.data.Profile.result[0].tenant_children_occupants));
                setPetTenantData(JSON.parse(res.data.Profile.result[0].tenant_pet_occupants));
                setVehicleTenantData(JSON.parse(res.data.Profile.result[0].tenant_vehicle_info));
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
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: 'background.blue',
                    padding: '2%',
                    minHeight: '80px',
                    boxShadow: '0px 4px 4px #00000032',
                }}>
                    <Box sx={{
                        marginLeft: '0px',
                        marginRight: 'auto',
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={()=>{navigate('/settingsTenant')}}>
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.9838 2.54161C14.0711 2.71093 14.0928 2.92777 14.1361 3.36144C14.2182 4.1823 14.2593 4.59274 14.4311 4.81793C14.649 5.10358 15.0034 5.25038 15.3595 5.20248C15.6402 5.16472 15.9594 4.90352 16.5979 4.38113C16.9352 4.10515 17.1038 3.96716 17.2853 3.90918C17.5158 3.83555 17.7652 3.84798 17.9872 3.94419C18.162 4.01994 18.3161 4.17402 18.6243 4.4822L19.5178 5.37567C19.8259 5.68385 19.98 5.83794 20.0558 6.01275C20.152 6.23478 20.1644 6.48415 20.0908 6.71464C20.0328 6.89612 19.8948 7.06478 19.6188 7.4021C19.0964 8.0406 18.8352 8.35984 18.7975 8.64056C18.7496 8.99662 18.8964 9.35102 19.182 9.56893C19.4072 9.74072 19.8176 9.78176 20.6385 9.86385C21.0722 9.90722 21.2891 9.92891 21.4584 10.0162C21.6734 10.1272 21.841 10.3123 21.9299 10.5373C22 10.7145 22 10.9324 22 11.3682V12.6319C22 13.0676 22 13.2855 21.93 13.4626C21.841 13.6877 21.6734 13.8729 21.4583 13.9838C21.289 14.0711 21.0722 14.0928 20.6386 14.1361L20.6386 14.1361C19.818 14.2182 19.4077 14.2592 19.1825 14.4309C18.8967 14.6489 18.7499 15.0034 18.7979 15.3596C18.8357 15.6402 19.0968 15.9593 19.619 16.5976C19.8949 16.9348 20.0328 17.1034 20.0908 17.2848C20.1645 17.5154 20.152 17.7648 20.0558 17.9869C19.98 18.1617 19.826 18.3157 19.5179 18.6238L18.6243 19.5174C18.3162 19.8255 18.1621 19.9796 17.9873 20.0554C17.7652 20.1516 17.5159 20.164 17.2854 20.0904C17.1039 20.0324 16.9352 19.8944 16.5979 19.6184L16.5979 19.6184C15.9594 19.096 15.6402 18.8348 15.3595 18.7971C15.0034 18.7492 14.649 18.896 14.4311 19.1816C14.2593 19.4068 14.2183 19.8173 14.1362 20.6383C14.0928 21.0722 14.0711 21.2891 13.9837 21.4585C13.8728 21.6735 13.6877 21.8409 13.4628 21.9299C13.2856 22 13.0676 22 12.6316 22H11.3682C10.9324 22 10.7145 22 10.5373 21.9299C10.3123 21.841 10.1272 21.6734 10.0162 21.4584C9.92891 21.2891 9.90722 21.0722 9.86385 20.6385C9.78176 19.8176 9.74072 19.4072 9.56892 19.182C9.35101 18.8964 8.99663 18.7496 8.64057 18.7975C8.35985 18.8352 8.04059 19.0964 7.40208 19.6189L7.40206 19.6189C7.06473 19.8949 6.89607 20.0329 6.71458 20.0908C6.4841 20.1645 6.23474 20.152 6.01272 20.0558C5.8379 19.9801 5.6838 19.826 5.37561 19.5178L4.48217 18.6243C4.17398 18.3162 4.01988 18.1621 3.94414 17.9873C3.84794 17.7652 3.8355 17.5159 3.90913 17.2854C3.96711 17.1039 4.10511 16.9352 4.3811 16.5979C4.90351 15.9594 5.16471 15.6402 5.20247 15.3594C5.25037 15.0034 5.10357 14.649 4.81792 14.4311C4.59273 14.2593 4.1823 14.2182 3.36143 14.1361C2.92776 14.0928 2.71093 14.0711 2.54161 13.9838C2.32656 13.8728 2.15902 13.6877 2.07005 13.4627C2 13.2855 2 13.0676 2 12.6318V11.3683C2 10.9324 2 10.7144 2.07008 10.5372C2.15905 10.3123 2.32654 10.1272 2.54152 10.0163C2.71088 9.92891 2.92777 9.90722 3.36155 9.86384H3.36155H3.36156C4.18264 9.78173 4.59319 9.74068 4.81842 9.56881C5.10395 9.35092 5.2507 8.99664 5.20287 8.64066C5.16514 8.35987 4.90385 8.04052 4.38128 7.40182C4.10516 7.06435 3.96711 6.89561 3.90914 6.71405C3.83557 6.48364 3.848 6.23438 3.94413 6.01243C4.01988 5.83754 4.17403 5.68339 4.48233 5.37509L5.37565 4.48177L5.37566 4.48177C5.68385 4.17357 5.83795 4.01947 6.01277 3.94373C6.23478 3.84753 6.48414 3.8351 6.71463 3.90872C6.89612 3.9667 7.06481 4.10472 7.4022 4.38076C8.04061 4.9031 8.35982 5.16427 8.64044 5.20207C8.99661 5.25003 9.35113 5.10319 9.56907 4.81742C9.74077 4.59227 9.78181 4.18195 9.86387 3.36131C9.90722 2.92776 9.9289 2.71098 10.0162 2.5417C10.1271 2.32658 10.3123 2.15898 10.5374 2.07001C10.7145 2 10.9324 2 11.3681 2H12.6318C13.0676 2 13.2855 2 13.4627 2.07005C13.6877 2.15902 13.8728 2.32656 13.9838 2.54161ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#F2F2F2" />
                        </svg>
                    </Box>

                    <Box sx={{
                        color: 'text.secondary',
                        fontSize: '18px',
                        fontWeight: 'bold',
                    }}>
                        Tenant Profile
                    </Box>
                    <Box sx={{
                        marginLeft: 'auto',
                        marginRight: '0px%',
                        width: 24,
                        height: 24,
                    }}></Box>
                </Box>
                <Box sx={{
                    position: 'relative',
                    bottom: '90px',
                    padding: '25px',
                }}>
                    <Box sx={{
                        height: '121px',
                        width: '121px',
                        backgroundColor: '#bbb',
                        borderRadius: '50%',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        boxShadow: '0px 4px 4px #00000032'
                    }}>
                        <img src={ProfileImg} alt='Profile' style={{
                            height: '121px',
                            width: '121px',
                        }} />
                    </Box>
                    <Box sx={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}>
                        <TextBox>
                            {`${profileData.tenant_first_name} ${profileData.tenant_last_name}`}
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
                            <TextBox fontSize={'16px'} fontWeight={'bold'} decoration={'underline'}>
                                {profileData.tenant_email}
                            </TextBox>
                            <TextBox fontSize={'12px'}>
                                Email
                            </TextBox>
                            <TextBox fontSize={'16px'} fontWeight={'bold'}>
                                {profileData.tenant_phone_number}
                            </TextBox>
                            <TextBox fontSize={'12px'}>
                                Phone Number
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
                                        {profileData.tenant_current_salary}
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
                                        {profileData.tenant_current_job_company}
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
                                        {profileData.tenant_address}
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
                                        {`${profileData.tenant_city}/${profileData.tenant_state}`}
                                    </Box>
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
                                        {profileData.tenant_salary_frequency}
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
                                        {profileData.tenant_current_job_title}
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
                                        {profileData.tenant_unit}
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
                                        {profileData.tenant_zip}
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
                                    <FlexBox direction="column">
                                        <Box sx={{
                                            fontSize: '13px',
                                        }}>
                                            {adultTenantData?.length ?? 0} Adults
                                        </Box>
                                        <Box sx={{
                                            fontSize: '13px',
                                            color: '#160449',
                                        }}>
                                            {adultTenantData?.map((adult) => (
                                                <Box>
                                                    {`${adult.name} | ${adult.relationship} | DOB: ${adult.dob}`}
                                                </Box>
                                            ))}
                                        </Box>
                                        <Box sx={{
                                            fontSize: '13px',
                                        }}>
                                            {childTenantData?.length ?? 0} Child
                                        </Box>
                                        <Box sx={{
                                            fontSize: '13px',
                                            color: '#160449',
                                        }}>
                                            {childTenantData?.map((child) => (
                                                <Box>
                                                    {`${child.name} | ${child.relationship} | DOB: ${child.dob}`}
                                                </Box>
                                            ))}
                                        </Box>
                                        <Box sx={{
                                            fontSize: '13px',
                                        }}>
                                            {petTenantData?.length ??  0} Pets
                                        </Box>
                                        <Box sx={{
                                            fontSize: '13px',
                                            color: '#160449',
                                        }}>
                                            {petTenantData?.map((pet) => (
                                                <Box>
                                                    {`${pet.name} | ${pet.type} | ${pet.weight} lbs`}
                                                </Box>
                                            ))}
                                        </Box>
                                        <Box sx={{
                                            fontSize: '13px',
                                        }}>
                                            {vehicleTenantData?.length ?? 0} Vehicles
                                        </Box>
                                        <Box sx={{
                                            fontSize: '13px',
                                            color: '#160449',
                                        }}>
                                            {vehicleTenantData?.map((vehicle) => (
                                                <Box>
                                                    {`${vehicle.make} ${vehicle.model} ${vehicle.year} | ${vehicle.license} | ${vehicle.state}`}
                                                </Box>
                                            ))}
                                        </Box>
                                    </FlexBox>
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
                                    {profileData.tenant_ssn}
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