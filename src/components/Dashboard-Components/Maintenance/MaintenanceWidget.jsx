import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext.jsx";
import Status from "../../Templates/Status";
import theme from "../../../theme/theme";

export default function MaintenanceWidget({ maintenanceData }) {
  const navigate = useNavigate();
  const { maintenanceRoutingBasedOnSelectedRole, user, selectedRole } = useUser();

  // console.log("Role: ", user);
  // console.log("Selected Role: ", selectedRole);

  const [maintenanceRequestCounts, setMaintenanceRequestCounts] = useState({});
  const colorStatus = selectColorStatus();

  // TODO: We need to make the /maintenanceRequests endpoint return the data in the format we need for the Status component
  useEffect(() => {
    const dataObject = {};
    // console.log("maintenanceData", maintenanceData)
    for (const item of maintenanceData) {
      // console.log(item)
      if (!dataObject[item.maintenance_status]) {
        dataObject[item.maintenance_status] = item.num;
      }
    }

    setMaintenanceRequestCounts((prevData) => ({ ...prevData, ...dataObject }));
  }, [maintenanceData]);

  // function routingWithSelectedRole() {
  //   // console.log("routingWithSelectedRole selectedRole", selectedRole)
  //   if (selectedRole === "MANAGER") {
  //     return "/managerMaintenance";
  //   } else if (selectedRole === "OWNER") {
  //     return "/ownerMaintenance";
  //   }
  // }

  function selectColorStatus() {
    // console.log("selectColorStatus selectedRole", selectedRole)
    if (selectedRole === "MANAGER" || selectedRole === "PM_EMPLOYEE") {
      return theme.colorStatusPMO;
    } else if (selectedRole === "OWNER") {
      return theme.colorStatusO;
    }
  }

  return (
    <div className="mt-widget-requests-container" onClick={() => navigate(maintenanceRoutingBasedOnSelectedRole(), { state: { colorStatus, maintenanceRequestCounts } })}>
      <h2 className="mt-widget-title">Maintenance</h2>
      <Status colorStatus={colorStatus} maintenanceRequestCounts={maintenanceRequestCounts} selectedRole={selectedRole} />
    </div>
  );
}
