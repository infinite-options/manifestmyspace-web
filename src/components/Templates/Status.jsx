export default function Status({colorStatus, maintenanceRequests, selectedRole}){
    console.log("status maintenanceRequests", maintenanceRequests)
    console.log("status colorStatus", colorStatus)
    return(
        <div id="mt-all-requests">
            <ul className="mt-widget-requests">
                {colorStatus.map((item, index) => {
                    let status = item.mapping;
                    if(selectedRole === "OWNER") {
                        if (item.mapping === "NEW REQUEST") status = "NEW";
                        if (item.mapping === "INFO REQUESTED") status = "INFO";
                    }
                    const num = maintenanceRequests[status]
                    return (
                        <li key={index} style={{ backgroundColor: item.color, color: '#FFFFFF', fontFamily: 'Source Sans Pro', fontSize: '12px', fontWeight:600 }}>
                            {item.status} <span style={{float: "right"}}>{num}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}