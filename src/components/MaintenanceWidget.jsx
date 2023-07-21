import "../../css/maintenance.css";
function MaintenanceWidjet() {
    const colors = ['#B62C2A', '#D4736D', '#DEA19C', '#92A9CB', '#6788B3','#173C8D'];
    const requests = ['New Requests', 'Quotes Requested', 'Quotes Accepted', 'Scheduled', 'Completed', 'Paid'];
    return(
        <div className="mt-widget-main">
            <div className="mt-widget-requests-container">
                <div className="mt-widget-requests-title-container">
                    <h2 className="mt-widget-title">Maintenance</h2>
                </div>
                <div id="mt-all-requests">
                    <ul className="mt-widget-requests">
                        {requests.map((req, index) => (
                            <li key={index} style={{ backgroundColor: colors[index], color: '#FFFFFF'}}>
                                {req}
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
            <div className="mt-prop-widget-container">
                <h2 className="mt-prop-widget-title"> Property Rent</h2>
                <img className="cf-widget-graph"></img>
                <ul>
                    <li> not paid</li>
                    <li> paid partially </li>
                    <li> paid late </li>
                    <li> vacant </li>
                    <li> paid on time </li>
                </ul>
            </div>  
        </div>
    )
}

export default MaintenanceWidjet;