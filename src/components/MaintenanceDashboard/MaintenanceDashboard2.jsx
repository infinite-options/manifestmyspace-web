import {
	Button,
	Box,
	ThemeProvider,
	Grid,
	Paper,
	Stack,
	Typography,
	Container,
	Backdrop,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { ReactComponent as HomeIcon } from '../../images/home_icon.svg';
import { ReactComponent as CalendarIcon } from '../../images/calendar_icon.svg';
import { useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import theme from '../../theme/theme';
import { useUser } from '../../contexts/UserContext';
import APIConfig from '../../utils/APIConfig';
import Chart from 'react-apexcharts';
import WorkerMaintenanceStatusTable from '../Maintenance/Worker/WorkerMaintenanceStatusTable';
import { format, isEqual, isAfter, parseISO } from 'date-fns';
import useSessionStorage from '../Maintenance/useSessionStorage';
import WorkerMaintenanceRequestDetail from '../Maintenance/Worker/WorkerMaintenanceRequestDetail';

export default function MaintenanceDashboard2() {
	const { user, getProfileId } = useUser();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const [showSpinner, setShowSpinner] = useState(false);
	const [maintenanceRequests, setMaintenanceRequests] = useState({});
	const [graphData, setGraphData] = useState([]);
	const [cashflowData, setcashflowData] = useState([]);
	const [revenueData, setrevenueData] = useState([]);
	const [todayData, settodayData] = useState([]);
	const [nextScheduleData, setnextScheduleData] = useState([]);

	const [workerMaintenanceView, setWorkerMaintenanceView] = useSessionStorage('workerMaintenanceView', false);
	const [showMaintenanceDetail, setShowMaintenanceDetail] = useState(workerMaintenanceView);
  useEffect(() => {
		const getMaintenanceData = async () => {
			setShowSpinner(true);
			console.log('---getProfileId()---', getProfileId());
			//const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/${getProfileId()}`);

			const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/600-000012`);
			const data = await response.json();

			const currentActivities = data.CurrentActivities?.result ?? [];
			const CurrentQuotes = data.CurrentQuotes?.result ?? [];

			const currentgraphData = [
				{
					'Quotes Requested': [],
					'Quotes Submitted': [],
					'Quotes Accepted': [],
					Scheduled: [],
					Finished: [],
					Paid: [],
				},
			];
			currentActivities
				.map((item) => {
					const statusMapping = theme.colorStatusMM.find(
						(statusObj) => statusObj.mapping === item.maintenance_status
					);
					if (statusMapping) {
						currentgraphData[0][statusMapping.status].push({
							value: item.num,
							label: statusMapping.status,
							color: statusMapping.color,
						});
					}
					return null;
				})
				.filter((item) => item !== null);

			const maintainance_info = {
				REQUESTED: [],
				SUBMITTED: [],
				ACCEPTED: [],
				SCHEDULED: [],
				FINISHED: [],
				PAID: [],
			};

			currentActivities.forEach((item) => {
				const status = item.maintenance_status;
				if (maintainance_info[status]) {
					const maintenanceInfo = JSON.parse(item.maintenance_request_info);
					const mergedItems = maintenanceInfo.map((info) => ({
						maintenance_status: status,
						...info,
					}));
					maintainance_info[status].push(...mergedItems);
				}
			});

			await setMaintenanceRequests(maintainance_info);

			const today = new Date().toISOString().split('T')[0];

			const parseDate = (dateString) => {
				const [month, day, year] = dateString.split('-');
				return `${year}-${month}-${day}`;
			};
			// Filter the data
			const currentDateData = maintainance_info.SCHEDULED.filter(
				(item) => parseDate(item.maintenance_scheduled_date) === today
			);

			let filteredTodayData = [];
			let filteredData = [];

			if (currentDateData.length > 0) {
				filteredTodayData = currentDateData;
			} else {
				filteredData = maintainance_info.SCHEDULED.filter((item) => {
					return isAfter(parseISO(parseDate(item.maintenance_scheduled_date)), parseISO(today));
				}).sort(
					(a, b) =>
						new Date(parseDate(a.maintenance_scheduled_date)) -
						new Date(parseDate(b.maintenance_scheduled_date))
				);
			}

			const fixedOrder = [
				{ label: 'Quotes Requested', color: '#DB9687' },
				{ label: 'Quotes Submitted', color: '#CEA892' },
				{ label: 'Quotes Accepted', color: '#BAAC7A' },
				{ label: 'Scheduled', color: '#D4C28D' },
				{ label: 'Finished', color: '#598A96' },
				{ label: 'Paid', color: '#6B8E23' },
			];

			const sortedData = fixedOrder.map((status) => {
				const statusData = currentgraphData[0][status.label];
				return statusData.length > 0 ? statusData[0] : { value: 0, label: status.label, color: status.color }; // default color if no data
			});
			await setGraphData(sortedData);
			await setcashflowData(currentActivities);
			await setrevenueData(CurrentQuotes);
			await settodayData(filteredTodayData);
			await setnextScheduleData(filteredData);
			setShowSpinner(false);
		};

		getMaintenanceData();
	}, []);

	useEffect(() => {
		const handleWorkerMaintenanceRequestSelected = () => {
			setShowMaintenanceDetail(true);
		};

		window.addEventListener('workermaintenanceRequestSelected', handleWorkerMaintenanceRequestSelected);

		return () => {
			window.removeEventListener('workermaintenanceRequestSelected', handleWorkerMaintenanceRequestSelected);
		};
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Container maxWidth="lg" sx={{ paddingTop: '10px', paddingBottom: '50px' }}>
				<Grid container rowSpacing={2} columnSpacing={10}>
					<Grid item xs={12}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: isMobile ? 'column' : 'row',
								justifyContent: isMobile ? 'center' : 'left',
								paddingLeft: '10px',
								paddingRight: '10px',
								alignText: 'center',
								alignContent: 'center',
							}}
						>
							<Typography
								sx={{
									fontSize: { xs: '22px', sm: '28px', md: '32px' },
									fontWeight: '600',
								}}
							>
								Welcome, {user.first_name}.
							</Typography>
						</Box>
					</Grid>
					
							<Grid item xs={12} md={4}>
								<WorkOrdersWidget
									maintenanceRequests={maintenanceRequests}
									todayData={todayData}
									nextScheduleData={nextScheduleData}
								/>
							</Grid>
							<Grid container item xs={12} md={8} columnSpacing={6} rowGap={4}>
							{showMaintenanceDetail ? (
							<WorkerMaintenanceRequestDetail
								maintenance_request_index={sessionStorage.getItem('workerselectedRequestIndex')}
								propstatus={sessionStorage.getItem('workerselectedStatus')}
								propmaintenanceItemsForStatus={JSON.parse(sessionStorage.getItem('workermaintenanceItemsForStatus'))}
								alldata={JSON.parse(sessionStorage.getItem('workerallMaintenanceData'))}
								maintenance_request_uid={sessionStorage.getItem('workermaintenance_request_uid')}
							/>
						) : (
							<>
								<Grid item xs={12} sx={{ backgroundColor: '#F2F2F2', borderRadius: '10px', height: '400px' }}>
									<Stack
										direction="row"
										justifyContent="center"
										width="100%"
										sx={{ marginBottom: '15px', marginTop: '15px' }}
									>
										<Typography variant="h5" sx={{ fontWeight: 'bold', color: '#160449' }}>
											Current Activity
										</Typography>
									</Stack>
									<Grid container spacing={2}>
										<Grid item xs={12} md={6} sx={{ marginBottom: '0px', marginTop: '0px' }}>
											<RadialBarChart data={graphData} />
										</Grid>
											<Grid item xs={12} md={6} sx={{ marginBottom: '15px', marginTop: '25px' }}>
											<MaintenanceCashflowWidget data={cashflowData}></MaintenanceCashflowWidget>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} sx={{ backgroundColor: '#F2F2F2', borderRadius: '10px', height: '600px' }}>
									<Stack
										direction="row"
										justifyContent="center"
										width="100%"
										sx={{ marginBottom: '15px', marginTop: '15px' }}
									>
										<Typography variant="h5" sx={{ fontWeight: 'bold', color: '#160449' }}>
											Revenue
										</Typography>
									</Stack>
									<RevenueTable data={revenueData}></RevenueTable>
								</Grid>
							</>
						)}
            </Grid>
				</Grid>
			</Container>
		</ThemeProvider>
	);
}

const WorkOrdersWidget = ({ maintenanceRequests, todayData, nextScheduleData }) => {
	const [showSpinner, setShowSpinner] = useState(false);
	const convertTimeTo12HourFormat = (time) => {
		const [hours, minutes] = time.split(':');
		const date = new Date();
		date.setHours(hours);
		date.setMinutes(minutes);

		return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
	};

  const colors = ['#B33A3A', '#FFAA00', '#FFC107'];

	return (
		<ThemeProvider theme={theme}>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Container sx={{ height: '100%', backgroundColor: '#F2F2F2', borderRadius: '10px', padding: '5px' }}>
				<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
					<Grid container item xs={12} rowSpacing={0} sx={{ marginTop: '15px' }}>
						<Stack direction="row" justifyContent="center" width="100%" sx={{ marginBottom: '0px' }}>
							<Typography variant="h5" sx={{ fontWeight: 'bold', color: '#160449' }}>
								Work Orders
							</Typography>
						</Stack>
						<Grid item container xs={12}>
							<Grid
								item
								xs={6}
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
								}}
							>
								<Button
									variant="outlined"
									id="revenue"
									style={{
										color: '#3D5CAC',
										fontSize: '13px',
										marginBottom: '10px',
										borderRadius: '5px',
									}}
								>
									<CalendarIcon
										stroke="#3D5CAC"
										width="20"
										height="20"
										style={{ marginRight: '4px' }}
									/>
									Last 30 days
								</Button>
							</Grid>
							<Grid
								item
								xs={6}
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'flex-end',
									alignItems: 'flex-start',
								}}
							>
								<Button
									variant="outlined"
									id="revenue"
									style={{
										color: '#3D5CAC',
										fontSize: '13px',
										marginBottom: '10px',
										borderRadius: '5px',
									}}
								>
									<HomeIcon fill="#3D5CAC" width="15" height="15" style={{ marginRight: '4px' }} />
									Select Property
								</Button>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<WorkOrdersAccordion maintenanceRequests={maintenanceRequests} />
						</Grid>
						<Grid item xs={12} sx={{ padding: '20px 0px 20px 0px' }}>
							<Paper
								elevation={0}
								style={{
									borderRadius: '5px',
									backgroundColor: '#FFFFFF',
									height: 240,
									width: '90%',
									margin: 'auto',
								}}
							>
								<Grid item xs={12}>
									<Typography
										align="center"
										sx={{ fontSize: '24px', fontWeight: 'bold', color: '#160449' }}
									>
										Work Orders Today
									</Typography>
									{todayData.length === 0 ? (
										<Typography
											align="center"
											sx={{ fontSize: '20px', fontWeight: 'bold', color: '#3D5CAC' }}
										>
											None
										</Typography>
									) : (
										todayData.map((row, index) => {
											const formattedTime = convertTimeTo12HourFormat(
												row.maintenance_scheduled_time
											);
											return (
												<Box
													key={index}
													sx={{
														display: 'flex',
														flexDirection: 'column',
														backgroundColor: colors[index % colors.length], // Use the desired background color
														color: 'white', // Use the desired text color
														borderRadius: '10px',
														marginBottom: 2,
														boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow for better appearance
													}}
												>
													<Box
														sx={{
															display: 'flex',
															flexDirection: 'row',
															justifyContent: 'flex-start',
															alignItems: 'center',
														}}
													>
														<Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
															{formattedTime}
														</Typography>
														<Box
															sx={{
																display: 'flex',
																flexDirection: 'column',
																maxWidth: 'calc(100% - 4rem)', // Adjust based on the layout needs

																overflow: 'hidden',
																textOverflow: 'ellipsis',
																marginLeft: 1,
															}}
														>
															<Typography sx={{ marginLeft: 6, fontSize: '0.8rem' }}>
																<strong>Address:</strong> {row.property_address},{' '}
																{row.property_city}, {row.property_state}{' '}
																{row.property_zip}
															</Typography>
															<Typography
																sx={{ marginLeft: 6, marginTop: 1, fontSize: '0.8rem' }}
															>
																<strong>Issue:</strong> {row.maintenance_title}
															</Typography>
														</Box>
													</Box>
												</Box>
											);
										})
									)}
								 {nextScheduleData.length > 0 && (
                    <>
                      <Typography align="left" sx={{ fontSize: '20px', fontWeight: 'bold', color: '#3D5CAC' }}>
                        Next Appointment: {nextScheduleData[0].maintenance_scheduled_date}
                      </Typography>
                      {nextScheduleData.map((row, index) => {
                        const formattedTime = convertTimeTo12HourFormat(row.maintenance_scheduled_time);
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              backgroundColor: colors[index % colors.length], // Use the desired background color
                              color: 'white', // Use the desired text color
                              borderRadius: '10px',
                              marginBottom: 2,
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow for better appearance
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                              }}
                            >
                              <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                {formattedTime}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  maxWidth: 'calc(100% - 4rem)', // Adjust based on the layout needs
  
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  marginLeft: 1,
                                }}
                              >
                                <Typography sx={{ marginLeft: 6, fontSize: '0.8rem' }}>
                                  <strong>Address:</strong> {row.property_address},{' '}
                                  {row.property_city}, {row.property_state}{' '}
                                  {row.property_zip}
                                </Typography>
                                <Typography
                                  sx={{ marginLeft: 6, marginTop: 1, fontSize: '0.8rem' }}
                                >
                                  <strong>Issue:</strong> {row.maintenance_title}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                    </>
                  )}
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</ThemeProvider>
	);
};

const WorkOrdersAccordion = ({ maintenanceRequests }) => {
	const colorStatus = theme.colorStatusMM;
	const [query, setQuery] = useState('');

	function handleFilter(filterString, searchArray) {
		let filteredArray = [];
		if (filterString === 'All' || filterString === '') {
			filteredArray = searchArray;
		} else {
			filteredArray = searchArray.filter((item) => item.maintenance_title === filterString);
		}
		return filteredArray;
	}

	return (
		<>
			<Grid item xs={12} sx={{ width: '90%', margin: 'auto' }}>
				{colorStatus.map((item, index) => {
					let mappingKey = item.mapping;
					let maintenanceArray = maintenanceRequests[mappingKey] || [];
					let filteredArray = handleFilter(query, maintenanceRequests[mappingKey]);

					return (
						<WorkerMaintenanceStatusTable
							key={index}
							status={item.status}
							color={item.color}
							maintenanceItemsForStatus={maintenanceArray}
							allMaintenanceData={maintenanceRequests}
							maintenanceRequestsCount={maintenanceArray}
						/>
					);
				})}
			</Grid>
		</>
	);
};

const RadialBarChart = ({ data }) => {
	const originalValues = data.map((d) => d.value);

	const maxSeriesValue = Math.max(...data.map((d) => d.value));
	const series = data.map((d) => (d.value / maxSeriesValue) * 100);
	const labels = data.map((d) => d.label);
	const colors = data.map((d) => d.color);

	const options = {
		series: series,
		chart: {
			height: 390,
			type: 'radialBar',
		},
		plotOptions: {
			radialBar: {
				offsetY: 0,
				startAngle: 0,
				endAngle: 270,
				hollow: {
					margin: 5,
					size: '30%',
					background: 'transparent',
					image: undefined,
				},
				dataLabels: {
					name: {
						show: false,
					},
					value: {
						show: false,
					},
				},
				barLabels: {
					enabled: true,
					useSeriesColors: true,
					margin: 8,
					fontSize: '15px',
					formatter: function (seriesName, opts) {
						return seriesName + ':  ' + originalValues[opts.seriesIndex];
					},
				},
			},
		},
		colors: colors,
		labels: labels,
		responsive: [
			{
				breakpoint: 480,
				options: {
					legend: {
						show: false,
					},
				},
			},
		],
	};

	return <Chart options={options} series={series} type="radialBar" height={390} />;
};

const MaintenanceCashflowWidget = ({ data }) => {
	let submitted = 0;
	let accepted = 0;
	let scheduled = 0;
	let finished = 0;

	data.forEach((item) => {
		if (item.total_estimate !== null) {
			switch (item.maintenance_status) {
				case 'SUBMITTED':
					submitted += item.total_estimate;
					break;
				case 'ACCEPTED':
					accepted += item.total_estimate;
					break;
				case 'SCHEDULED':
					scheduled += item.total_estimate;
					break;
				case 'FINISHED':
					finished += item.total_estimate;
					break;
				default:
					break;
			}
		}
	});

	return (
		<Grid
			item
			xs={11}
			sx={{
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#F2F2F2',
			}}
		>
			<Grid container direction="column" columnGap={1} rowGap={5}>
				<Grid
					item
					xs={10}
					sx={{
						backgroundColor: '#CEA892',
						textTransform: 'none',
						borderRadius: '10px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography
						sx={{ color: '#FFFFFF', fontWeight: theme.typography.primary.fontWeight, fontSize: '16px' }}
					>
						Quotes Submitted Cashflow
					</Typography>
					<Typography
						sx={{ color: '#FFFFFF', fontWeight: theme.typography.primary.fontWeight, fontSize: '20px' }}
					>
						${submitted}
					</Typography>
				</Grid>
				<Grid
					item
					xs={10}
					sx={{
						backgroundColor: '#BAAC7A',
						textTransform: 'none',
						borderRadius: '10px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography
						sx={{ color: '#FFFFFF', fontWeight: theme.typography.primary.fontWeight, fontSize: '16px' }}
					>
						Quotes Accepted Cashflow
					</Typography>
					<Typography
						sx={{ color: '#FFFFFF', fontWeight: theme.typography.primary.fontWeight, fontSize: '20px' }}
					>
						${accepted}
					</Typography>
				</Grid>

				<Grid
					item
					xs={10}
					sx={{
						backgroundColor: '#959A76',
						textTransform: 'none',
						borderRadius: '10px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography
						sx={{ color: '#FFFFFF', fontWeight: theme.typography.primary.fontWeight, fontSize: '16px' }}
					>
						Quotes Scheduled Cashflow
					</Typography>
					<Typography
						sx={{ color: '#FFFFFF', fontWeight: theme.typography.primary.fontWeight, fontSize: '20px' }}
					>
						${scheduled}
					</Typography>
				</Grid>

				<Grid
					item
					xs={10}
					sx={{
						backgroundColor: '#598A96',
						textTransform: 'none',
						borderRadius: '10px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography
						sx={{ color: '#FFFFFF', fontWeight: theme.typography.primary.fontWeight, fontSize: '16px' }}
					>
						Quotes Finished Cashflow
					</Typography>
					<Typography
						sx={{ color: '#FFFFFF', fontWeight: theme.typography.primary.fontWeight, fontSize: '20px' }}
					>
						${finished}
					</Typography>
				</Grid>
			</Grid>
		</Grid>
	);
};

const RevenueTable = ({ data }) => {
  console.log('---inside RevenueTable---', data);
	return (
		<Box sx={{ backgroundColor: '#F2F2F2', borderRadius: '10px', p: 3 }}>
			<TableContainer
				component={Paper}
				sx={{
					borderRadius: '10px',
					maxHeight: '500px', // Adjust the height as needed
					maxWidth: '100%', // Adjust the width as needed
					overflowX: 'scroll',
					overflowY: 'auto',
				}}
			>
				<Table>
					<TableHead>
						<TableRow sx={{ borderBottom: '1px solid #4A4A4A', backgroundColor: '#F2F2F2' }}>
							<TableCell
								sx={{
									position: 'sticky',
									top: 0,
									backgroundColor: '#F2F2F2',
									borderBottom: '1px solid #4A4A4A',
									zIndex: 1,
									padding: '10px 20px',
									whiteSpace: 'nowrap',
								}}
							>
								<Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3D5CAC' }}>
									{' '}
									QuoteID
								</Typography>
							</TableCell>
							<TableCell
								sx={{
									position: 'sticky',
									top: 0,
									backgroundColor: '#F2F2F2',
									borderBottom: '1px solid #4A4A4A',
									zIndex: 1,
									padding: '10px 20px',
									whiteSpace: 'nowrap',
								}}
							>
								<Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3D5CAC' }}>
									BusinessID
								</Typography>
							</TableCell>
							<TableCell
								sx={{
									position: 'sticky',
									top: 0,
									backgroundColor: '#F2F2F2',
									borderBottom: '1px solid #4A4A4A',
									zIndex: 1,
									padding: '10px 20px',
									whiteSpace: 'nowrap',
								}}
							>
								<Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3D5CAC' }}>
									Business Name
								</Typography>
							</TableCell>
              <TableCell
								sx={{
									position: 'sticky',
									top: 0,
									backgroundColor: '#F2F2F2',
									borderBottom: '1px solid #4A4A4A',
									zIndex: 1,
									padding: '10px 20px',
									whiteSpace: 'nowrap',
								}}
							>
								<Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3D5CAC' }}>
									Status
								</Typography>
							</TableCell>
							<TableCell
								sx={{
									position: 'sticky',
									top: 0,
									backgroundColor: '#F2F2F2',
									borderBottom: '1px solid #4A4A4A',
									zIndex: 1,
									padding: '10px 20px',
									whiteSpace: 'nowrap',
								}}
							>
								<Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3D5CAC' }}>
									Maintenance Description
								</Typography>
							</TableCell>
							<TableCell
								sx={{
									position: 'sticky',
									top: 0,
									backgroundColor: '#F2F2F2',
									borderBottom: '1px solid #4A4A4A',
									zIndex: 1,
									padding: '10px 20px',
									whiteSpace: 'nowrap',
								}}
							>
								<Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3D5CAC' }}>
									Property Address
								</Typography>
							</TableCell>
							<TableCell
								sx={{
									position: 'sticky',
									top: 0,
									backgroundColor: '#F2F2F2',
									borderBottom: '1px solid #4A4A4A',
									zIndex: 1,
									padding: '10px 20px',
									whiteSpace: 'nowrap',
								}}
							>
								<Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3D5CAC' }}>
									Due Date
								</Typography>
							</TableCell>
							<TableCell
								sx={{
									position: 'sticky',
									top: 0,
									backgroundColor: '#F2F2F2',
									borderBottom: '1px solid #4A4A4A',
									zIndex: 1,
									padding: '10px 20px',
									whiteSpace: 'nowrap',
								}}
							>
								<Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3D5CAC' }}>
									Amount
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody sx={{ backgroundColor: '#F2F2F2' }}>
						{data.map((row, index) => (
							<TableRow key={index} sx={{ borderBottom: '1px solid #4A4A4A' }}>
								<TableCell sx={{ whiteSpace: 'nowrap', padding: '10px 20px' }}>
									<Typography sx={{ color: '#160449' }}>{row.maintenance_quote_uid}</Typography>
								</TableCell>

								<TableCell sx={{ whiteSpace: 'nowrap', padding: '10px 20px' }}>
									<Typography sx={{ color: '#160449' }}>{row.business_uid}</Typography>
								</TableCell>
								<TableCell sx={{ whiteSpace: 'nowrap', padding: '10px 20px' }}>
									<Typography sx={{ color: '#160449' }}>{row.business_name}</Typography>
								</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', padding: '10px 20px' }}>
									<Typography sx={{ color: '#160449' }}>{row.maintenance_status}</Typography>
								</TableCell>
								<TableCell sx={{ whiteSpace: 'nowrap', padding: '10px 20px' }}>
									<Typography sx={{ color: '#160449' }}>{row.maintenance_title}</Typography>
								</TableCell>
								<TableCell sx={{ whiteSpace: 'nowrap', padding: '10px 20px' }}>
									<Typography sx={{ color: '#160449' }}>
										{row.property_address}, {row.property_city}, {row.property_state}{' '}
										{row.property_zip}
									</Typography>
								</TableCell>
								<TableCell sx={{ whiteSpace: 'nowrap', padding: '10px 20px' }}>
									<Typography sx={{ color: '#160449' }}>
										{row.maintenance_scheduled_date && row.maintenance_scheduled_date !== 'null'
											? row.maintenance_scheduled_date
											: 'N/A'}
									</Typography>
								</TableCell>
								<TableCell sx={{ whiteSpace: 'nowrap', padding: '10px 20px' }}>
									<Typography sx={{ color: '#160449' }}>{row.quote_total_estimate}</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};
