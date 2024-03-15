import { calculateAge } from "../utils/helper"; 
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from 'react-router-dom';

function AnnouncementCard(props) {
    const { user, selectedRole, selectRole, Name } = useUser();
    const data = props.data;
    const isContract=props?.isContract
    const navigate = useNavigate();


    const handleAnnouncements = (data) => {
        console.log("Handling ann "+selectedRole+" "+data.announcement_sender)
    };
    return (
        <div className="announcement-list-card" onClick={()=>{console.log('IIIIIIIIIIIIIIII')}}>
            <div className="announcement-list-card-text-container">
                <div className="announcement-list-card-text-from">
                    {"From: " + data.announcement_sender}
                </div>
                <div className="announcement-list-card-text-contents">
                    {data.announcement_title}
                </div>
                <div className="announcement-list-card-text-date">
                    {"Added: " + calculateAge(data.announcement_date)}
                </div>
            </div>
            <div className="announcement-list-card-options">
                
                <div className="announcement-list-card-picture" onClick={(e)=>{
                    if (isContract){
                        e.stopPropagation();
                        navigate("/propertyContract",{state: {announcementData: data}});
                    }
                }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.66667 28C5.93334 28 5.30534 27.7387 4.78267 27.216C4.26 26.6933 3.99911 26.0658 4 25.3333V6.66667C4 5.93334 4.26134 5.30534 4.784 4.78267C5.30667 4.26 5.93422 3.99911 6.66667 4H25.3333C26.0667 4 26.6947 4.26134 27.2173 4.784C27.74 5.30667 28.0009 5.93422 28 6.66667V25.3333C28 26.0667 27.7387 26.6947 27.216 27.2173C26.6933 27.74 26.0658 28.0009 25.3333 28H6.66667ZM8 22.6667H24L19 16L15 21.3333L12 17.3333L8 22.6667Z" fill="black" fill-opacity="0.5" />
                    </svg>
                </div>
                <div className="announcement-list-card-checkbox" onClick={(e)=>{
                        e.stopPropagation();
                }}>
                    <input type="checkbox" />
                </div>
            </div>
        </div>
    );
}

export default AnnouncementCard;