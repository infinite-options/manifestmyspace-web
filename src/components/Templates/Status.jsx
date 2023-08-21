import { useState } from "react"

export default function Status({colorStatus, maintenanceRequests}){

    console.log("status maintenanceRequests", maintenanceRequests)
    console.log("status colorStatus", colorStatus)
    return(
        <div id="mt-all-requests">
            <ul className="mt-widget-requests">
                {colorStatus.map((item, index) => 
                    <li key={index} style={{ backgroundColor: item.color, color: '#FFFFFF', fontFamily: 'Source Sans Pro', fontSize: '12px', fontWeight:600 }}>
                        {item.status} <span style={{float: "right"}}>{maintenanceRequests[item.mapping]}</span>
                    </li>
                )}
            </ul>
        </div>
    )
}