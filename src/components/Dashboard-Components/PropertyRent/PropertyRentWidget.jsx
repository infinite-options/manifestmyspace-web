import { PieChart, Pie, Legend, Cell } from 'recharts';
import { Chart } from "react-google-charts";
import { useLocation, useNavigate } from "react-router-dom";


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

    return (
        <div className="mt-prop-widget-container" onClick={() => navigate("/ownerRent")}>
            <h2 className="mt-prop-widget-title"> Property Rent</h2>
            <div className="mt-prop-widget-graph">
                <PieChart width={200} height={250} >
                    <Legend
                        height={36}
                        iconType="circle"
                        layout="vertical"
                        verticalAlign="bottom"
                        iconSize={5}
                        padding={5}
                        formatter={renderColorfulLegendText}
                    />
                    <Pie
                        data={data}
                        cx={80}
                        cy={100}
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={0}
                        dataKey="number"
                    >
                        
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
        
                    </Pie>
                    <text
                        x={85}
                        y={100}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        cursor="pointer"
                        style={{
                            fontFamily: 'Source Sans Pro',
                            fontSize: '9px',
                            fill: '#160449',
                            fontWeight: '600',
                        }}
                        onClick={(e) => { e.stopPropagation(); navigate('/properties') }}
                    >
                        View All {props.totalPropertiesCount}
                        <tspan x={85} y={110}>properties</tspan>
                    </text>
                </PieChart>
            </div>
        </div>
    )
}