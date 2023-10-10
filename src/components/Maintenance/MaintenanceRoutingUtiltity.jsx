import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function RoutingBasedOnSelectedRole(){
    const navigate = useNavigate();
    const { roleName } = useUser();

    const role = roleName()
    console.log("role", role)   

    if (role === "Property Manager"){
           navigate("/managerMaintenance")
      } else if (role === "Property Owner"){
         navigate("/ownerMaintenance")
     } else if (role === "Maintenance"){
         navigate("/workerMaintenance")
     } else if (role === "PM Employee"){
         navigate("/managerMaintenance")
     } else if (role === "Maintenance Employee"){
         navigate("/workerMaintenance")
     } else if (role === "Tenant"){
         navigate("/tenantMaintenance")
     }     
 }