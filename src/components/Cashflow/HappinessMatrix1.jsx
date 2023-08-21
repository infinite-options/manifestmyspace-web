import React, { useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Line, ReferenceLine, ComposedChart } from "recharts";
import { Component } from "react";
import {Paper} from "@mui/material";
// import CustomDot from "./CustomDot";
// import getClickedPoint from "./getClickedPoint";

const data = [
  { x: 0, y: 0, image: 'https://www.google.com/search?sca_esv=557804163&sxsrf=AB5stBg-wFIGtaAS_-qr_7k4f-sT7WLMFQ:1692289219403&q=svg+image&tbm=isch&source=lnms&sa=X&ved=2ahUKEwizhJ7OjOSAAxWrNzQIHeIXCyIQ0pQJegQICBAB&biw=1600&bih=801&dpr=1.8#imgrc=CgkZMhsew5HKtM' },
  { x: 50, y: 200, image: 'https://www.google.com/search?sca_esv=557804163&sxsrf=AB5stBg-wFIGtaAS_-qr_7k4f-sT7WLMFQ:1692289219403&q=svg+image&tbm=isch&source=lnms&sa=X&ved=2ahUKEwizhJ7OjOSAAxWrNzQIHeIXCyIQ0pQJegQICBAB&biw=1600&bih=801&dpr=1.8#imgrc=CgkZMhsew5HKtM' },
  { x: 70, y: 100, image: 'https://www.google.com/search?sca_esv=557804163&sxsrf=AB5stBg-wFIGtaAS_-qr_7k4f-sT7WLMFQ:1692289219403&q=svg+image&tbm=isch&source=lnms&sa=X&ved=2ahUKEwizhJ7OjOSAAxWrNzQIHeIXCyIQ0pQJegQICBAB&biw=1600&bih=801&dpr=1.8#imgrc=CgkZMhsew5HKtM' },
  { x: 170, y: 300, image: 'https://www.google.com/search?sca_esv=557804163&sxsrf=AB5stBg-wFIGtaAS_-qr_7k4f-sT7WLMFQ:1692289219403&q=svg+image&tbm=isch&source=lnms&sa=X&ved=2ahUKEwizhJ7OjOSAAxWrNzQIHeIXCyIQ0pQJegQICBAB&biw=1600&bih=801&dpr=1.8#imgrc=CgkZMhsew5HKtM' },
  { x: 140, y: 250, image: 'https://www.google.com/search?sca_esv=557804163&sxsrf=AB5stBg-wFIGtaAS_-qr_7k4f-sT7WLMFQ:1692289219403&q=svg+image&tbm=isch&source=lnms&sa=X&ved=2ahUKEwizhJ7OjOSAAxWrNzQIHeIXCyIQ0pQJegQICBAB&biw=1600&bih=801&dpr=1.8#imgrc=CgkZMhsew5HKtM' },
  { x: 150, y: 400, image: 'https://www.google.com/search?sca_esv=557804163&sxsrf=AB5stBg-wFIGtaAS_-qr_7k4f-sT7WLMFQ:1692289219403&q=svg+image&tbm=isch&source=lnms&sa=X&ved=2ahUKEwizhJ7OjOSAAxWrNzQIHeIXCyIQ0pQJegQICBAB&biw=1600&bih=801&dpr=1.8#imgrc=CgkZMhsew5HKtM' },
  { x: 110, y: 280, image: 'https://www.google.com/search?sca_esv=557804163&sxsrf=AB5stBg-wFIGtaAS_-qr_7k4f-sT7WLMFQ:1692289219403&q=svg+image&tbm=isch&source=lnms&sa=X&ved=2ahUKEwizhJ7OjOSAAxWrNzQIHeIXCyIQ0pQJegQICBAB&biw=1600&bih=801&dpr=1.8#imgrc=CgkZMhsew5HKtM' },
  { x: 500, y: 500, image: 'https://www.google.com/search?sca_esv=557804163&sxsrf=AB5stBg-wFIGtaAS_-qr_7k4f-sT7WLMFQ:1692289219403&q=svg+image&tbm=isch&source=lnms&sa=X&ved=2ahUKEwizhJ7OjOSAAxWrNzQIHeIXCyIQ0pQJegQICBAB&biw=1600&bih=801&dpr=1.8#imgrc=CgkZMhsew5HKtM' },

];

const CustomImageDot = (props) => {
    const { cx, cy, image } = props;
    return <image x={cx - 10} y={cy - 10} width={20} height={20} xlinkHref={image} />;
};
  
// const CustomImageDot = () => (
//     <defs>
//       {data.map((entry, index) => (
//         <pattern
//           key={`pattern-${index}`}
//           id={`pattern-${index}`}
//           x="0"
//           y="0"
//           patternUnits="userSpaceOnUse"
//           width="20"
//           height="20"
//         >
//           <image href={entry.image} x="0" y="0" width="20" height="20" />
//         </pattern>
//       ))}
//     </defs>
//   );
  
export default function HappinessMatrix(props){
  const [selectedPoint, setSelectedPoint] = useState({ x: 70, y: 100 });
  const testline = [{ x: 0, y: 300 }, { x: 20, y: 0 }]
//   function handleMouseDown(e) {
//     const { chartX, chartY } = e || {};
//     const clickedPoint = getClickedPoint(chartX, chartY, data);
//     if (clickedPoint) {
//       setSelectedPoint(clickedPoint);
//     }
//   }

  return (
    <ResponsiveContainer>
        {/* <ComposedChart margin={{ top: 20, right: -10, left: -10, bottom: 5 }}> */}
      <ScatterChart
        // width={400}
        // height={400}
        // margin={{ top: 50 }}
        // onMouseDown={handleMouseDown}
      >
        <XAxis
        //   axisLine={false}
        //   tick={false}
          type="number"
          dataKey="x"
        //   domain={["0", "500"]}
          domain={["0", "dataMax + 20"]}
        />
        <YAxis
        //   yAxisId="left"
        //   axisLine={false}
        //   tick={false}
          type="number"
          dataKey="y"
        //   domain={["0", "500"]}
          domain={["0", "dataMax + 20"]}
        />
        <ReferenceLine 
            segment={[
                  { 
                    x: 0,
                    y: 0
                  },
                  { 
                    x: 500, 
                    y: 500 
                  }]}
            stroke="#000000"
            strokeWidth={2}
            ifOverflow="extendDomain" />
        <ReferenceLine y={200} strokeDasharray="3 3" stroke='#000000' strokeWidth={1} ifOverflow="extendDomain"/>
        <ReferenceLine dataKey="x" x={100} strokeDasharray="3 3" stroke='#000000' strokeWidth={1} ifOverflow="extendDomain"/>
        <Scatter
          data={data}
          shape={<CustomImageDot />}
        //   shape={<CustomDot selectedPoint={selectedPoint} />}
        // {...data.map((entry, index) => (
        //     <Scatter
        //       key={`dot-${index}`}
        //       data={[entry]}
        //       fill={`url(#pattern-${index})`}
        //     />
        //   ))}
        >
        </Scatter>
        {/* <Line type="linear" data={testline} dataKey="y" stroke="#000000" dot={false} strokeWidth={2} /> */}
      </ScatterChart>
      {/* </ComposedChart> */}
    </ResponsiveContainer>
  );
}
