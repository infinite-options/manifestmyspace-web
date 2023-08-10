import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function PMUploadDocuments(props) {
    const navigate = useNavigate();
    function navigateTo(url) {
        navigate(url);
    }

    return (
        <Box sx={{
            backgroundColor: '#D6D5DA',
            borderRadius: '10px',
            fontFamily: 'Source Sans Pro',
            color: '#3D5CAC',
            fontSize: '14px',
            padding: '15px',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Box sx={{
                    width: '20px',
                    height: '20px',
                }} />
                <Box sx={{
                    color: '#160449',
                    fontWeight: 'bold',
                    fontSize: '20px',
                }}>
                    Upload Document
                </Box>
                <Box onClick={()=>navigateTo('/pmDocuments')}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5L5 15" stroke="#3D5CAC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M5 5L15 15" stroke="#3D5CAC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </Box>
            </Box>
            <Box>
                <Box sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginTop: '10px',
                    marginBottom: '5px',
                }}>
                    Type
                </Box>
                <Box sx={{
                    backgroundColor: '#F2F2F2',
                    borderRadius: '10px',
                    padding: '5px',
                    paddingLeft: '10px',
                }}>
                    Select Type
                </Box>
            </Box>
            <Box>
                <Box sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginTop: '10px',
                    marginBottom: '5px',
                }}>
                    Title
                </Box>
                <Box sx={{
                    backgroundColor: '#F2F2F2',
                    borderRadius: '10px',
                    padding: '5px',
                    paddingLeft: '10px',
                }}>
                    Add title
                </Box>
            </Box>
            <Box>
                <Box sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginTop: '10px',
                    marginBottom: '5px',
                }}>
                    Date Created
                </Box>
                <Box sx={{
                    backgroundColor: '#F2F2F2',
                    borderRadius: '10px',
                    padding: '5px',
                    paddingLeft: '10px',
                }}>
                    mm/dd/yyyy
                </Box>
            </Box>
            <Box>
                <Box sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginTop: '10px',
                    marginBottom: '5px',
                }}>
                    Property
                </Box>
                <Box sx={{
                    backgroundColor: '#F2F2F2',
                    borderRadius: '10px',
                    padding: '5px',
                    paddingLeft: '10px',
                }}>
                    Select property
                </Box>
            </Box>
            <Box>
                <Box sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginTop: '10px',
                    marginBottom: '5px',
                }}>
                    Owner
                </Box>
                <Box sx={{
                    backgroundColor: '#F2F2F2',
                    borderRadius: '10px',
                    padding: '5px',
                    paddingLeft: '10px',
                }}>
                    Select tenant
                </Box>
            </Box>
            <Box>
                <Box sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginTop: '10px',
                    marginBottom: '5px',
                }}>
                    Tenant
                </Box>
                <Box sx={{
                    backgroundColor: '#F2F2F2',
                    borderRadius: '10px',
                    padding: '5px',
                    paddingLeft: '10px',
                }}>
                    Select tenant
                </Box>
            </Box>
            <Box>
                <Box sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginTop: '10px',
                    marginBottom: '5px',
                }}>
                    Description
                </Box>
                <Box sx={{
                    backgroundColor: '#F2F2F2',
                    borderRadius: '10px',
                    padding: '5px',
                    paddingLeft: '10px',
                }}>
                    Add description
                </Box>
            </Box>

            <Box sx={{
                borderStyle: 'dashed',
                borderColor: '#3D5CAC',
                borderRadius: '5px',
                borderWidth: '1px',

                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '15px',
                marginTop: '15px',
                marginBottom: '15px',
            }}>
                <Box>
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5 19.5L22.5 19.5" stroke="#3D5CAC" stroke-width="3" stroke-linecap="round" />
                        <path d="M13.5 13.5L19.5 13.5" stroke="#3D5CAC" stroke-width="3" stroke-linecap="round" />
                        <path d="M13.5 25.5L19.5 25.5" stroke="#3D5CAC" stroke-width="3" stroke-linecap="round" />
                        <path d="M28.5 19.5V25.5C28.5 28.3284 28.5 29.7426 27.6213 30.6213C26.7426 31.5 25.3284 31.5 22.5 31.5H13.5C10.6716 31.5 9.25736 31.5 8.37868 30.6213C7.5 29.7426 7.5 28.3284 7.5 25.5V10.5C7.5 7.67157 7.5 6.25736 8.37868 5.37868C9.25736 4.5 10.6716 4.5 13.5 4.5H16.5" stroke="#3D5CAC" stroke-width="3" />
                        <path d="M27 4.5L27 13.5" stroke="#3D5CAC" stroke-width="3" stroke-linecap="round" />
                        <path d="M31.5 9L22.5 9" stroke="#3D5CAC" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </Box>
                <Box sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginLeft: '25px',
                }}>
                    Add Files
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',

                backgroundColor: '#9EAED6',
                borderRadius: '5px',    
                boxShadow: '0px 4px 4px #00000032',
            }}>
                <Box>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
                        <path d="M9 2L9 16" stroke="#160449" stroke-width="3" stroke-linecap="round" />
                        <path d="M16 9L2 9" stroke="#160449" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </Box>
                <Box sx={{
                    fontWeight: '600',
                    fontSize: '20px',
                    marginLeft: '10px',
                }}>
                    Document
                </Box>
            </Box>

        </Box>
    )
}
export default PMUploadDocuments;