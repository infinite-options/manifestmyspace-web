import {
	ThemeProvider,
	Typography,
	Box,
	Tabs,
	Tab,
	Paper,
	Card,
	CardHeader,
	Slider,
	Stack,
	Button,
	Grid,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import theme from '../../../theme/theme';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ChatIcon from '@mui/icons-material/Chat';
import CancelButton from '../MaintenanceComponents/CancelButton';
import CompleteButton from '../MaintenanceComponents/CompleteButton';
import RequestMoreInfo from '../Worker/RequestMoreInfo';
import AlertMessage from '../AlertMessage';
import DateTimePickerModal from '../../DateTimePicker';
import { useUser } from '../../../contexts/UserContext';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TenantProfileLink from '../../Maintenance/MaintenanceComponents/TenantProfileLink';
import OwnerProfileLink from '../../Maintenance/MaintenanceComponents/OwnerProfileLink';
import useMediaQuery from '@mui/material/useMediaQuery';
import APIConfig from '../../../utils/APIConfig';

export default function NewRequestAction({ maintenanceItem, navigateParams, quotes }) {
	const navigate = useNavigate();
	const { maintenanceRoutingBasedOnSelectedRole, getProfileId } = useUser();
	const [schedulerDate, setSchedulerDate] = useState();
	const [showRequestMoreInfo, setShowRequestMoreInfo] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showMessage, setShowMessage] = useState(false);
	const [message, setMessage] = useState('');
	const [showSpinner, setShowSpinner] = useState(false);
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	function handleNavigateToQuotesRequested() {
		if (isMobile) {
			navigate('/quoteRequest', {
				state: {
					maintenanceItem,
					navigateParams,
				},
			});
		} else {
			if (maintenanceItem && navigateParams) {
				try {
					const maintenanceItemStr = JSON.stringify(maintenanceItem);
					const navigateParamsStr = JSON.stringify(navigateParams);

					console.log('Storing data in sessionStorage: ', navigateParams);

					// Save data to sessionStorage
					sessionStorage.setItem('maintenanceItem', maintenanceItemStr);
					sessionStorage.setItem('navigateParams', navigateParamsStr);
					sessionStorage.setItem('selectedRequestIndex', navigateParams.maintenanceRequestIndex);
					sessionStorage.setItem('selectedStatus', navigateParams.status);
					sessionStorage.setItem('desktopView', 'true');
					window.dispatchEvent(new Event('storage'));
					setTimeout(() => {
						window.dispatchEvent(new Event('maintenanceRequestSelected'));
					}, 0);
				} catch (error) {
					console.error('Error setting sessionStorage: ', error);
				}
			} else {
				console.error('maintenanceItem or navigateParams is undefined');
			}
		}
	}

	async function handleSubmit(maintenanceItemUID, date, time) {
		const changeMaintenanceRequestStatus = async () => {
			setShowSpinner(true);
			const formData = new FormData();
			formData.append('maintenance_request_uid', maintenanceItemUID);
			formData.append('maintenance_scheduled_date', date);
			formData.append('maintenance_scheduled_time', time);
			formData.append('maintenance_request_status', 'SCHEDULED');
			if (!maintenanceItem.maint_business_uid) {
				formData.append('maintenance_assigned_business', getProfileId());
			}
			try {
				const response = await fetch(`${APIConfig.baseURL.dev}/maintenanceRequests`, {
					method: 'PUT',
					body: formData,
				});
			} catch (error) {
				console.log('error', error);
			}
			setShowSpinner(false);
		};
		await changeMaintenanceRequestStatus();
		navigate(maintenanceRoutingBasedOnSelectedRole());
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
			}}
		>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Card
				sx={{
					backgroundColor: theme.palette.primary.main,
					boxShadow: 'none',
					elevation: '0',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'left',
					justifyContent: 'left',
					padding: '0px',
				}}
			>
				<Stack
					direction="row"
					justifyContent="center"
					alignItems="center"
					spacing={23} // Adjusted spacing to fit more buttons
					sx={{ marginTop: theme.spacing(2), padding: theme.spacing(2) }}
				>
					<Button
						variant="contained"
						sx={{
							backgroundColor: '#a7b8e6',
							color: '#160449',
							textTransform: 'none',
							fontWeight: 'bold',
							borderRadius: '8px',
							width: '160px', // Set a fixed width
							height: '120px', // Set a fixed height
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center',
							padding: '10px', // Add padding to ensure text wrapping
							boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
							whiteSpace: 'normal', // Allow text to wrap
							'&:hover': {
								backgroundColor: '#a7b8e6',
							},
						}}
						onClick={() => setShowRequestMoreInfo(true)}
					>
						Ask For Details
					</Button>
					<RequestMoreInfo showRequestMoreInfo={showRequestMoreInfo} setShowRequestMoreInfo={setShowRequestMoreInfo} maintenanceItem={maintenanceItem}/>
                
					<Button
						variant="contained"
						sx={{
							backgroundColor: '#FFC614',
							color: '#160449',
							textTransform: 'none',
							fontWeight: 'bold',
							borderRadius: '8px',
							width: '160px', // Set a fixed width
							height: '120px', // Set a fixed height
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center',
							padding: '10px', // Add padding to ensure text wrapping
							boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
							whiteSpace: 'normal', // Allow text to wrap
							'&:hover': {
								backgroundColor: '#FFC614',
							},
						}}
						onClick={() => setShowModal(true)}
					>
						Schedule
					</Button>
					<Button
						variant="contained"
						sx={{
							backgroundColor: '#F87C7A',
							color: '#160449',
							textTransform: 'none',
							fontWeight: 'bold',
							borderRadius: '8px',
							width: '160px', // Set a fixed width
							height: '120px', // Set a fixed height
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center',
							padding: '10px', // Add padding to ensure text wrapping
							boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
							whiteSpace: 'normal', // Allow text to wrap
							'&:hover': {
								backgroundColor: '#F87C7A',
							},
						}}
						onClick={() => handleNavigateToQuotesRequested()}
					>
						Request Quotes
					</Button>
					<Button
						variant="contained"
						sx={{
							backgroundColor: '#FF8A00',
							color: '#160449',
							textTransform: 'none',
							fontWeight: 'bold',
							borderRadius: '8px',
							width: '160px', // Set a fixed width
							height: '120px', // Set a fixed height
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center',
							padding: '10px', // Add padding to ensure text wrapping
							boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
							whiteSpace: 'normal', // Allow text to wrap
							'&:hover': {
								backgroundColor: '#FF8A00',
							},
						}}
					>
						Close Ticket
					</Button>
				</Stack>{' '}
			</Card>
			<AlertMessage showMessage={showMessage} setShowMessage={setShowMessage} message={message} />
			<DateTimePickerModal
				setOpenModal={setShowModal}
				open={showModal}
				maintenanceItem={maintenanceItem}
				date={''}
				time={''}
				handleSubmit={handleSubmit}
			/>
		</Box>
	);
}
