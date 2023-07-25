import { Button } from "@mui/material";
import "../../../css/cashflow.css";
import { useNavigate } from "react-router-dom";

function CashflowWidget() {
    const navigate = useNavigate();

    return (
        <div className="cf-widget-main" onClick={()=>navigate('/cashflowOwner')}>
            <div className="cf-widget-title-info-container">
                <div className="cf-widget-title-container">
                    <h2 className="cf-widget-title">March 2023</h2>
                </div>
                <div className="cf-widget-info-container">
                    <div className="cf-widget-info-cf">Cashflow
                        <span></span>
                    </div>
                    <div className="cf-widget-info-revenue">Revenue
                        <span></span>
                    </div>
                    <div className="cf-widget-info-expenses">Expenses 
                        <span></span>
                    </div>
                </div>
            </div>
            <div className="cf-widget-graph-container">
                <p className="cf-widget-graph-title"></p>
                <img className="cf-widget-graph"></img>
            </div>  
        </div>
    )
}

export default CashflowWidget;