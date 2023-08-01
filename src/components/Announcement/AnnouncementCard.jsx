
function AnnouncementCard(props) {
    const data = props.data;
    const pm_info = data.pm_details[0];
    function getDateText(date_announcement) {
        // Format: "2023-05-23 15:30:55"
        const date = date_announcement.substring(0, date_announcement.indexOf(' '));
        const date_list = date.split('-');
        const year = getYearText(date_list[0]);
        const month = getMonthText(date_list[1]);
        const day = date_list[2];

        function getYearText(year) {
            return year.substring(2);
        }
        function getMonthText(month) {
            switch (month) {
                case "01":
                    return "Jan"
                case "02":
                    return "Feb"
                case "03":
                    return "Mar"
                case "04":
                    return "Apr"
                case "05":
                    return "May"
                case "06":
                    return "Jun"
                case "07":
                    return "Jul"
                case "08":
                    return "Aug"
                case "09":
                    return "Sep"
                case "10":
                    return "Oct"
                case "11":
                    return "Nov"
                case "12":
                    return "Dec"
                default:
                    return "N/A";
            }
        }
        return month + " " + day + ", " + year;
    }
    const dateText = getDateText(data.date_announcement);
    return (
        <div className="announcement-list-card">
            <div className="announcement-list-card-text-container">
                <div className="announcement-list-card-text-from">
                    {"From: " + pm_info.business_name}
                </div>
                <div className="announcement-list-card-text-contents">
                    {data.announcement_title}
                </div>
                <div className="announcement-list-card-text-date">
                    {"Added: " + dateText}
                </div>
            </div>
            <div className="announcement-list-card-options">
                <div className="announcement-list-card-picture">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.66667 28C5.93334 28 5.30534 27.7387 4.78267 27.216C4.26 26.6933 3.99911 26.0658 4 25.3333V6.66667C4 5.93334 4.26134 5.30534 4.784 4.78267C5.30667 4.26 5.93422 3.99911 6.66667 4H25.3333C26.0667 4 26.6947 4.26134 27.2173 4.784C27.74 5.30667 28.0009 5.93422 28 6.66667V25.3333C28 26.0667 27.7387 26.6947 27.216 27.2173C26.6933 27.74 26.0658 28.0009 25.3333 28H6.66667ZM8 22.6667H24L19 16L15 21.3333L12 17.3333L8 22.6667Z" fill="black" fill-opacity="0.5" />
                    </svg>
                </div>
                <div className="announcement-list-card-checkbox">
                    <input type="checkbox" />
                </div>
            </div>
        </div>
    );
}

export default AnnouncementCard;