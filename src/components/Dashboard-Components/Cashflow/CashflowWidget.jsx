import "../../../css/cashflow.css";

function CashflowWidget(){
    return(
        <div className="cf-widget-main">
            <div className="cf-widget-title-info-container">
                <div className="cf-widget-title-container">
                    <p className="cf-widget-title">March 2023</p>
                </div>
                <div className="cf-widget-info-container">
                    <div className="cf-widget-info-cf">Cashflow
                        <span></span>
                    </div>
                    <div className="cf-widgrt-info-revenue">Revenue
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