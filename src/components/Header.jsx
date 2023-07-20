function Header(){
    return(
        <>
            <div className="main-header">
                <div className="main-header-title-logo">
                    <div className="main-header-title-logo-container">
                        <div className="main-header-logo">
                            <div className="rectangle-1"></div>
                            <div className="rectangle-2"></div>
                            <div className="rectangle-3"></div>
                            <div className="rectangle-4"></div>
                            <div className="rectangle-5"></div>
                        </div>
                        <h1 className="main-header-title">Manifest
                            <span>buy.sell.rent.manage.finance</span>
                        </h1>
                    </div>
                </div>
                <div className="main-header-redirect-btns">
                    <a href="#" className="main-header-redirect-owner">Property Owner</a>
                    <a href="#" className="main-header-redirect-tenant">Tenent</a>
                </div>

            </div>
        </>
    )
}

export default Header;