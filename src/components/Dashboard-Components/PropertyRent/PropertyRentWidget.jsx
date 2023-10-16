import { PieChart, Pie, Legend, Cell } from 'recharts';
import { Chart } from "react-google-charts";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from '@mui/material';


export default function PropertyRentWidget(props) {
    const navigate = useNavigate();

    console.log(props)
    let data = props.rentData

    const renderColorfulLegendText = (value, entry) => {
        const { color } = entry;
        const status = data.find(item => item.fill === color)?.rent_status;
        const num = data.find(item => item.fill === color)?.number;
        return <span style={{color: '#160449', fontFamily:'Source Sans Pro', fontSize:'18px' }}>{num} {status}</span>;
    };

    // background-color: var(--light-gray-bg);
    // display: block;
    // /* transform: translateX(5%); */
    // position: relative;
    // border-radius: 10px;
    // margin-top: 30px;
    // height: 392px;
    // width: 42.75%;
    // cursor: pointer;

    return (
        <Box 
            onClick={() => navigate("/ownerRent")}
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: "#F5F5F5",
                marginTop: "30px",
                width: "42.75%",
                height: "400px",
                borderRadius: "10px",
                cursor: "pointer",
                // position: "relative",
            }}
        >
            <h2> Property Rent</h2> 
            <Box 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                }}
            >
                <PieChart width={200} height={200} >
                    <Legend
                        height={36}
                        iconType="circle"
                        layout="vertical"
                        verticalAlign="bottom"
                        iconSize={15}
                        padding={5}
                        formatter={renderColorfulLegendText}
                    />
                    <Pie
                        data={data}
                        cx={100}
                        cy={80}
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={0}
                        dataKey="number"
                    >

                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={3}/>
                        ))}
        
                    </Pie>
                    <text
                        x={100}
                        y={85}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        cursor="pointer"
                        style={{
                            fontFamily: 'Source Sans Pro',
                            fontSize: '14px',
                            fill: '#160449',
                            fontWeight: '600',
                        }}
                        onClick={(e) => { e.stopPropagation(); navigate('/properties') }}
                    >
                        View All {props.totalPropertiesCount}
                        <tspan x={105} y={90}>properties</tspan>
                    </text>
                </PieChart>
            </Box>
        </Box>
    )
}