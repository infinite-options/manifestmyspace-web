export default function Status({colorStatus, maintenanceRequestCounts }){
    // console.log("status maintenanceRequestCounts", maintenanceRequestCounts)
    // console.log("status colorStatus", colorStatus)
    return(
        <div id="mt-all-requests">
            <ul className="mt-widget-requests">
                {colorStatus.map((item, index) => 
                    <li key={index} style={{ backgroundColor: item.color, color: '#FFFFFF', fontFamily: 'Source Sans Pro', fontSize: '13px', fontWeight:600 }}>
                        {item.status} <span style={{float: "right"}}>{maintenanceRequestCounts[item.mapping] ? maintenanceRequestCounts[item.mapping] : "0" }</span>
                    </li>
                )}
            </ul>
        </div>
    )
}