import React, { useState, useEffect } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Box, ThemeProvider, Grid, List, ListItem, Typography, Paper } from "@mui/material";
import theme from "../../../theme/theme";
import { useNavigate } from "react-router-dom";

export default function HappinessMatrixWidget(props) {
  console.log("In HappinessMatrixWidget");
  const navigate = useNavigate();
  const chartWidth = 400;
  const chartHeight = 350;
  const chartMargin = { top: 20, right: 30, bottom: -10, left: -30 };
  // const { page, setIndex, contactDetails, happinessData } = props;
  // const { page, setIndex, happinessData, data, dataSetter, cashflowData, contactDetails, cashflowDetails, cashflowDetailsByProperty, cashflowDetailsByPropertyByMonth } = props;
  const { page, setIndex, happinessData, dataforhappiness, data = [], dataSetter, contactDetails } = props;

  useEffect(() => {
    console.log("HappinessMatrixWidget - happinessData:", happinessData);
  }, [happinessData]);

  console.log("HappinessMatrixWidget - data -", data, typeof data);
  // console.log("HappinessMatrixWidget - dataforhappiness -", dataforhappiness, typeof dataforhappiness);

  // console.log("HappinessMatrixWidget - happinessData -", happinessData, typeof happinessData);
  // console.log("HappinessMatrixWidget - happinessData2 -", happinessData?.delta_cashflow);
  // console.log("HappinessMatrixWidget - happinessData3 -", happinessData?.delta_cashflow.result);

  // data =
  // contactDetails =
  let cashflowData = happinessData?.delta_cashflow.result;
  let cashflowDetails = happinessData?.delta_cashflow_details?.result;
  let cashflowDetailsByProperty = happinessData?.delta_cashflow_details_by_property?.result;
  let cashflowDetailsByPropertyByMonth = happinessData?.delta_cashflow_details_by_property_by_month?.result;

  console.log("HappinessMatrixWidget - cashflowData -", cashflowData);
  console.log("HappinessMatrixWidget - cashflowDetails -", cashflowDetails);
  console.log("HappinessMatrixWidget - cashflowDetailsByProperty -", cashflowDetailsByProperty);
  console.log("HappinessMatrixWidget - cashflowDetailsByPropertyByMonth -", cashflowDetailsByPropertyByMonth);

  let [shifted_data, shift] = useState(JSON.parse(JSON.stringify(data)));
  // let [shifted_data, shift] = useState([...data]);


  const [pointsToPlot, setPointsToPlot] = useState([]);

  // useEffect(() => {
  //   console.log(" HappinessMatrixWidget - pointsToPlot - ", pointsToPlot);
  // }, [pointsToPlot]);

  // Function to check if two points overlap
  function overlap(owner1, owner2, margin = 5) {
    const { vacancy_perc: x1, delta_cashflow_perc: y1 } = owner1;
    const { vacancy_perc: x2, delta_cashflow_perc: y2 } = owner2;
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance < margin;
  }

  // Function to adjust points
  function adjustPoints(owners, margin = 10) {
    for (let i = 0; i < owners.length; i++) {
      for (let j = i + 1; j < owners.length; j++) {
        while (overlap(owners[i], owners[j], margin)) {
          // Move points slightly in both x and y directions
          owners[j].vacancy_perc -= Math.random() * (2 * margin) - margin;
          owners[j].delta_cashflow_perc -= Math.random() * (2 * margin) - margin;
        }
      }
    }
    return owners;
  }

  //  Adjust points before rendering
  useEffect(() => {
    shift(adjustPoints(shifted_data));
  }, []);

  function getPoints(data) {
    console.log("In getPoints: ", data);
    console.log("Type of data: ", typeof data);
    console.log("Is data an array: ", Array.isArray(data));

    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data)
      return;
    }

    const points = [];
    data?.forEach((owner) => {
      console.log("In get points: ", owner.vacancy_perc, owner.delta_cashflow_perc);
      let x = Number(owner.vacancy_perc);
      let y = Number(owner.delta_cashflow_perc);

      let pointObject = {
        x: x,
        y: -y,
        ...owner,
      };
      // console.log("getPoints - owner - ", owner.name)
      // console.log("getPoints - pointObject - ", pointObject);

      points.push(pointObject);
    });

    // console.log("getPoints - points - ", points);
    setPointsToPlot(points);
  }

  useEffect(() => {
    getPoints(props.data);
  }, [props.data]);

  const axisLabelStyle = {
    fontFamily: "Source Sans Pro",
    color: "#160449",
    fontWeight: "bold",
  };

  const [clickedIndex, setClickedIndex] = useState(null);
  const [hiddenPoints, setHiddenPoints] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  console.log("In HappinessMatrixWidget clickedIndex: ", clickedIndex);

  useEffect(() => {
    // console.log("hiddenPoints - ", hiddenPoints);
  }, [hiddenPoints]);

  useEffect(() => {
    // console.log("shifted_data - ", shifted_data);
  }, [shifted_data]);

  const handlePointClick = (payload) => {
    let { index } = payload;
    // console.log("handlePointClick - payload - ", payload);
    if (clickedIndex === index) {
      // setHiddenPoints((prevHiddenPoints) => [...prevHiddenPoints, index]);
    } else {
      setClickedIndex(index);
      let owner = data.find((o) => o.index === index);
      // dataSetter(owner);
    }
    setTooltipVisible(true);
  };

  const handleShowAllPoints = () => {
    setHiddenPoints([]);
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={0}
        style={{
          // margin: '50p', // Add margin here
          borderRadius: "10px",
          backgroundColor: theme.palette.primary.main,
          height: 450,
          [theme.breakpoints.down("sm")]: {
            width: "80%",
          },
          [theme.breakpoints.up("sm")]: {
            width: "50%",
          },
        }}
      >
        <Grid container style={{ paddingTop: "10px" }}>
          <Grid item xs={12} sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: "10px" }}>
            <Typography variant="h5" sx={{ fontSize: page === "OwnerContactDetails" ? "35px" : "24px", fontWeight: "bold", color: "#160449" }}>
              Happiness Matrix
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ backgroundColor: page === "OwnerContactDetails" ? "#D6D5DA" : "", borderRadius: "15px" }}>
            <ResponsiveContainer width="100%" height={380}>
              <ScatterChart
                // width={chartWidth}
                // height={chartHeight}
                margin={chartMargin}
                onClick={() => setTooltipVisible(!tooltipVisible)}
              >
                {/* <CartesianGrid /> */}

                <YAxis
                  type="number"
                  dataKey="y"
                  name="Delta Cashflow"
                  axisLine={false}
                  tickLine={false}
                  style={axisLabelStyle}
                  // tick={{ transform: 'translate(10, 0)' }}
                  // label={{
                  //   value: "Delta Cashflow",
                  //   angle: -90,
                  //   position: "insideRight",
                  //   dx: -10,
                  //   dy: -50,
                  //   style: axisLabelStyle,
                  //   fill: "#160449",
                  // }}
                  domain={[-1.1, 0.1]}
                  // ticks={[-1.1, -0.5, 0.1]}
                  tick={false}
                />

                <XAxis
                  type="number"
                  dataKey="x"
                  name="Vacancies"
                  axisLine={false}
                  tickLine={false}
                  style={axisLabelStyle}
                  // tick={{ transform: 'translate(0, 0)' }}
                  // label={{
                  //   value: "Vacancies",
                  //   position: "insideBottom",
                  //   dy: -5,
                  //   dx: 0,
                  //   style: axisLabelStyle,
                  //   fill: "#160449",
                  // }}
                  domain={[-100, 0]}
                  // ticks={[-100, -50, 0]} // Add this line
                  tick={false}
                />

                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ payload }) => {
                    if (payload && payload.length && tooltipVisible) {
                      const dataPoint = payload[0].payload;
                      return (
                        <div style={{ backgroundColor: "white", padding: "10px", border: "1px solid #ccc" }}>
                          <p>
                            <strong>Name:</strong> {dataPoint.name}
                          </p>
                          <p>
                            <strong>Delta Cashflow:</strong> {dataPoint.delta_cashflow}
                          </p>
                          <p>
                            <strong>Vacancies:</strong> {dataPoint.vacancy_num}
                          </p>
                          <p>
                            <strong>x - vacancy_perc:</strong> {dataPoint.x}
                          </p>
                          <p>
                            <strong>y - delta_cashflow_perc:</strong> {dataPoint.y}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* <Scatter
                  name="A school"
                  data={shifted_data}
                  shape={(props) => (
                    <CustomImage
                      {...props}
                      onClick={() => handlePointClick(props.payload)}
                      isClicked={props.payload.index === clickedIndex}
                      isVisible={!hiddenPoints.includes(props.payload.index)}
                    />
                  )}
                >
                  {shifted_data.map((point, index) => (
                    !hiddenPoints.includes(index) && (
                      <Scatter
                        key={`hidden-${index}`}
                        data={[point]}
                        shape={(props) => (
                          <CustomImage
                            {...props}
                            isClicked={false}
                            isVisible={false}
                          />
                        )}
                      />
                    )
                  ))}
                </Scatter> */}

                <Scatter
                  name="happiness_matrix"
                  data={pointsToPlot}
                  fill="#8884d8"
                  shape={(props) => (
                    <CustomImage
                      {...props}
                      onClick={() => handlePointClick(props.payload)}
                      data={data}
                      happinessData={happinessData}
                      page={page}
                      contactDetails={contactDetails}
                      setIndex={setIndex}
                      cashflowDetails={cashflowDetails}
                      cashflowDetailsByProperty={cashflowDetailsByProperty}
                      cashflowDetailsByPropertyByMonth={cashflowDetailsByPropertyByMonth}
                      cashflowData={cashflowData}
                      isClicked={props.payload.index === clickedIndex}
                      isVisible={!hiddenPoints.includes(props.payload.index)}
                    />
                  )}
                />

                <ReferenceLine y={-0.5} stroke="#000000" strokeDasharray="3 3" />

                <ReferenceLine x={-50} stroke="#000000" strokeDasharray="3 3" />

                <ReferenceLine
                  segment={[
                    { x: -100, y: -1.1 },
                    { x: 0, y: 0.1 },
                  ]}
                  stroke="#000000"
                  strokeWidth={1}
                  ifOverflow="hidden"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
}

const CustomImage = (props) => {
  // console.log("In CustomImage");
  const navigate = useNavigate();
  const {
    cx,
    cy,
    payload,
    onClick,
    isClicked,
    isVisible,
    index,
    cashflowData,
    data,
    page,
    setIndex,
    contactDetails,
    cashflowDetails,
    cashflowDetailsByProperty,
    cashflowDetailsByPropertyByMonth,
    happinessData,
  } = props;

  const [isClickedState, setIsClickedState] = useState(isClicked);
  
  // useEffect(() => {
  //   console.log("isClickedState - ", isClickedState);
  // }, [isClickedState]);

  // console.log("CustomImage - props - ", props);
  if (!isVisible) {
    return null;
  }

  const diameter = 30;
  const outlineWidth = isClicked ? 4 : 2;

  const handleClick = (payload) => {
    console.log("input to  handleClick: ", payload);
    setIsClickedState(true);
    // console.log("CustomImage - handeClick");
    if (onClick) {
      onClick(payload); // Call the passed onClick function
    }
    // console.log("CustomImage - handleClick - payload - ", payload);
    if (page === "OwnerContactDetails") {
      const idx = contactDetails.findIndex((contact) => contact.owner_uid === payload?.owner_uid);
      setIndex(idx);
      return;
    }

    navigate(`/ownerContactDetailsHappinessMatrix`, {
      state: {
        ownerUID: payload.owner_uid,
        navigatingFrom: "HappinessMatrixWidget",
        index: index,
			  // ownerUID: ownerData,
			  // navigatingFrom: "PropertyNavigator",
			  // index: index,
			  // happinessMatrixData: dataforhappiness,
			  // happinessData: happinessData,
        happinessMatrixData: data,
        happinessData: happinessData,
      },
    });
  };

  return (
    // <g onClick={() => onClick(payload.name)}>
    <g onClick={() => handleClick(payload)}>
      <foreignObject x={cx - diameter / 2} y={cy - diameter / 2} width={diameter} height={diameter}>
        {![null, undefined, ""].includes(payload?.photo) ? (
          <img
            src={payload.photo}
            alt="scatter-image"
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", filter: isClickedState ? "brightness(0.7)" : "none" }}
          />
        ) : (
          <AccountCircleIcon
            sx={{
              color: payload.color,
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              borderWidth: outlineWidth,
              borderStyle: "solid",
              filter: isClickedState ? "brightness(0.7)" : "none",
            }}
          />
        )}
      </foreignObject>
      {payload?.photo && <circle cx={cx} cy={cy} r={diameter / 2 + outlineWidth / 2} fill="none" stroke={payload.color} strokeWidth={outlineWidth} />}
    </g>
  );
};
