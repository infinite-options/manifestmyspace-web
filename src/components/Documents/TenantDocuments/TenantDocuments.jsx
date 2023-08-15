import { Box } from '@mui/system';
import axios from 'axios';
import { useEffect, useState } from 'react';

function TenantDoucments() {

    const [documentsData, setDocumentsData] = useState([]);
    useEffect(() => {
        axios.get('https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/tenantDocuments/350-000001')
            .then((res) => {
                console.log(res.data);
                setDocumentsData(res.data.Documents);
            });
    }, []);
    return (
        <Box sx={{
            fontFamily: 'Source Sans Pro',
            padding: '30px',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                color: '#160449',
            }}>
                <Box>
                    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.2963 0.75C8.2963 0.335786 8.63208 0 9.0463 0H18.213C18.6272 0 18.963 0.335786 18.963 0.75V1.02778C18.963 1.44199 18.6272 1.77778 18.213 1.77778H9.0463C8.63208 1.77778 8.2963 1.44199 8.2963 1.02778V0.75ZM0 7.86111C0 7.4469 0.335786 7.11111 0.75 7.11111H18.213C18.6272 7.11111 18.963 7.4469 18.963 7.86111V8.13889C18.963 8.5531 18.6272 8.88889 18.213 8.88889H0.75C0.335786 8.88889 0 8.5531 0 8.13889V7.86111ZM0.75 14.2222C0.335786 14.2222 0 14.558 0 14.9722V15.25C0 15.6642 0.335787 16 0.750001 16H9.91667C10.3309 16 10.6667 15.6642 10.6667 15.25V14.9722C10.6667 14.558 10.3309 14.2222 9.91667 14.2222H0.75Z" fill="#160449" />
                    </svg>
                </Box>
                <Box sx={{
                    fontSize: '25px',
                    fontWeight: 'bold',
                }}>
                    Documents
                </Box>
                <Box>

                </Box>
            </Box>
            <Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#160449',
                }}>
                    <Box sx={{
                        height: '30px',
                        width: '30px',
                        backgroundColor: '#bbb',
                        borderRadius: '50%',
                        marginRight: '5px',
                    }}>

                    </Box>
                    <Box sx={{
                        fontSize: '11px',
                        fontWeight: '600',
                    }}>
                        103 N. Abel St unit #104
                    </Box>
                </Box>
            </Box>
            <hr />
            <Box sx={{
                backgroundColor: '#F2F2F2',
                borderRadius: '10px',

            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '10px',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '10px',
                    }}>
                        <Box sx={{
                            marginRight: '4px',
                        }}>
                            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.4509 3.324L11.0343 2.5365C9.79042 1.84575 9.1685 1.5 8.49984 1.5C7.83117 1.5 7.20925 1.845 5.96542 2.5365L5.73805 2.66325L12.0585 6.4875L14.9032 4.98C14.4456 4.431 13.7075 4.02075 12.4509 3.3225V3.324ZM15.4047 5.973L12.5728 7.473V9.75C12.5728 9.89918 12.5168 10.0423 12.4172 10.1477C12.3175 10.2532 12.1824 10.3125 12.0415 10.3125C11.9006 10.3125 11.7655 10.2532 11.6659 10.1477C11.5662 10.0423 11.5103 9.89918 11.5103 9.75V8.03475L9.03109 9.34725V16.428C9.53967 16.2937 10.1184 15.9727 11.0343 15.4635L12.4509 14.676C13.9745 13.8293 14.7367 13.4062 15.1603 12.645C15.5832 11.8845 15.5832 10.9373 15.5832 9.045V8.95725C15.5832 7.5375 15.5832 6.6495 15.4047 5.973ZM7.96859 16.428V9.348L1.595 5.973C1.4165 6.6495 1.4165 7.5375 1.4165 8.95575V9.0435C1.4165 10.9373 1.4165 11.8845 1.83938 12.645C2.26296 13.4062 3.02513 13.83 4.54875 14.6768L5.96542 15.4635C6.8813 15.9727 7.46 16.2937 7.96859 16.428ZM2.0965 4.98075L8.49984 8.37075L10.916 7.092L4.62171 3.2835L4.54875 3.324C3.29288 4.0215 2.55409 4.43175 2.0965 4.9815V4.98075Z" fill="#3D5CAC" />
                            </svg>
                        </Box>
                        <Box sx={{
                            color: '#3D5CAC',
                            fontSize: '14px',
                            fontWeight: '600',
                        }}>
                            Request to Renew Lease
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        backgroundColor: '#3D5CAC',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px',
                        padding: '10px',
                        marginLeft: 'auto',
                        marginRight: '0px',
                    }}>
                        <Box sx={{
                            marginRight: '10px',
                        }}>
                            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.71429 6.85714H0V5.14286H4.71429V0H6.28571V5.14286H11V6.85714H6.28571V12H4.71429V6.85714Z" fill="white" />
                            </svg>
                        </Box>
                        <Box sx={{
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 'bold',
                        }}>
                            Upload Documents
                        </Box>
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <Box sx={{
                        borderBottomStyle: 'solid',
                        borderWidth: '2px',
                        borderColor: '#00000032',
                        color: '#00000032',
                        width: '50%',
                        fontWeight: '600',
                        fontSize: '15px',
                        textAlign: 'center',
                    }}>
                        Need Action
                    </Box>
                    <Box sx={{
                        borderBottomStyle: 'solid',
                        borderWidth: '2px',
                        borderColor: '#160449',
                        color: '#160449',
                        width: '50%',
                        fontWeight: '700',
                        fontSize: '15px',
                        textAlign: 'center',
                    }}>
                        Documents
                    </Box>
                </Box>
                {documentsData.map((document) => {
                    const docs = JSON.parse(document.tenant_documents);
                    return (
                        <>
                            {docs.map((doc) => (
                                <DocumentCard data={{ title: doc.name, date: doc.created_date }} />
                            ))}
                        </>
                    );
                })}

            </Box>
        </Box>
    )
}

function DocumentCard(props) {
    const title = props.data.title;
    const date = props.data.date;
    
    function parseDate(data) {
        const dateList = data.split('-');
        function getMonth(num) {
            const months = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];

            const index = parseInt(num, 10) - 1;

            if (index >= 0 && index < months.length) {
                return months[index];
            } else {
                return 'N/A';
            }
        }
        return [getMonth(dateList[1]), dateList[2], dateList[0].slice(2)]
    }
    let [month, day, year] = ['-', '-', '-'];
    if (date !== null) {
        [month, day, year] = parseDate(date);
    }

    return (
        <Box sx={{
            backgroundColor: '#D9D9D9',
            boxShadow: '0px 1px 4px #00000019',
            marginBottom: '7px',
            padding: '10px',
        }}>
            <Box sx={{
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#160449',
            }}>
                {title}
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <Box>
                    Added: {`${month} ${day}, ${year}`}
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <Box sx={{
                        marginRight: '7px',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" fill="#3D5CAC" />
                            <path d="M19.3375 9.7875C18.6024 7.88603 17.3262 6.24164 15.6667 5.05755C14.0072 3.87347 12.0372 3.20161 9.99998 3.125C7.9628 3.20161 5.99272 3.87347 4.33323 5.05755C2.67374 6.24164 1.39758 7.88603 0.662478 9.7875C0.612833 9.92482 0.612833 10.0752 0.662478 10.2125C1.39758 12.114 2.67374 13.7584 4.33323 14.9424C5.99272 16.1265 7.9628 16.7984 9.99998 16.875C12.0372 16.7984 14.0072 16.1265 15.6667 14.9424C17.3262 13.7584 18.6024 12.114 19.3375 10.2125C19.3871 10.0752 19.3871 9.92482 19.3375 9.7875ZM9.99998 14.0625C9.19649 14.0625 8.41105 13.8242 7.74297 13.3778C7.0749 12.9315 6.5542 12.297 6.24672 11.5547C5.93924 10.8123 5.85879 9.99549 6.01554 9.20745C6.17229 8.4194 6.55921 7.69553 7.12736 7.12738C7.69551 6.55923 8.41938 6.17231 9.20742 6.01556C9.99547 5.85881 10.8123 5.93926 11.5546 6.24674C12.297 6.55422 12.9314 7.07492 13.3778 7.743C13.8242 8.41107 14.0625 9.19651 14.0625 10C14.0608 11.0769 13.6323 12.1093 12.8708 12.8708C12.1093 13.6323 11.0769 14.0608 9.99998 14.0625Z" fill="#3D5CAC" />
                        </svg>
                    </Box>
                    <Box>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.979 19.804 4.587 19.412C4.195 19.02 3.99934 18.5493 4 18V15H6V18H18V15H20V18C20 18.55 19.804 19.021 19.412 19.413C19.02 19.805 18.5493 20.0007 18 20H6Z" fill="#3D5CAC" />
                        </svg>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
export default TenantDoucments;