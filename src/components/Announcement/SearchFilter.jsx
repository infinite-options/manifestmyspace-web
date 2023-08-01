
function SearchFilter(props) {
    return(
        <div className="search-filter-container">
            <div className="search-filter-keyword-search">
                <label>
                    keyword Search: <input type="text"/> 
                </label>
            </div>
            <div className="search-filter-from">
                <label>
                    From: <input type="text"/> 
                </label>
            </div>
            <div className="search-filter-option">
                <div className="search-filter-option-time">
                    Anytime
                </div>
                <div className="search-filter-option-date">
                    Date
                </div>
                <div className="search-filter-option-attachment">
                    <label>
                        Has attachments <input type="checkbox"/>
                    </label>
                </div>
            </div>
            <button className="search-filter-button">
                Search
            </button>
        </div>
    );
}

export default SearchFilter;