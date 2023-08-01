const propertyRentStatus = [{status:"Not Paid", color:"#A52A2A"},
                            {status:"Paid Partially", color:"#FF8A00"},
                            {status:"Paid Late", color:"#FFC614"},
                            {status:"Paid On Time", color:"#3D5CAC"},
                            {status:"Vacant", color:"#160449"},
                        ];
const getStatusColor = (status) => {
    for (let i = 0; i < propertyRentStatus.length; i++) {
        if(propertyRentStatus[i].status.toUpperCase() === status.toUpperCase()) {
            return propertyRentStatus[i].color;
        }
    }
    return "#FFFFFF";
};

export {getStatusColor};