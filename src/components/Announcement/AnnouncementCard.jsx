import { calculateAge } from "../utils/helper";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import DefaultProfileImg from "../../images/defaultProfileImg.svg";
import { useEffect, useState, useRef } from "react";

function AnnouncementCard(props) {
  console.log("In Announcements", props);
  const { selectedRole } = useUser();
  const { data, pageToNavigate, navigationParams, sent_or_received, readAllChecked, showCheckbox, checked1, onCloseClick,announcementClosed  } = props;
  const navigate = useNavigate();
  const photoURL = data?.sender_photo_url || data?.receiver_photo_url || DefaultProfileImg;

  const [clicked, setClicked] = useState(false);
  const [isRead, setIsRead] = useState(data.announcement_read !== null);
  // const handleAnnouncements = () => {
  //   console.log("Handling announcement for " + selectedRole + " from " + data.announcement_sender);
  // };

  const [checked, setChecked] = useState(false);
  const cardRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setClicked(false);
      }
    };

    if (readAllChecked) {
      setIsRead(true) 
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };


    
  }, [readAllChecked]);

  // useEffect(() => {
  //   console.log("Inside the use effect of the announcementCarddddddd");
  //   console.log("clicked before setting in useEffect",clicked);
    
  //   setClicked(false);
  //   console.log("clicked after useEffect",clicked)
  //   setChecked(readAllChecked);
  // }, [readAllChecked]);

  const handleAnnouncements = () => {
    console.log("Handling announcement for " + selectedRole + " from " + data.announcement_sender);
    setChecked(true); // Set checkbox to checked state when announcement is handled
    // Add any additional logic for handling announcements here
    
  //   if (!event.target.closest('.announcement-list-card')) {
  //     setClicked(false);
  // }
    setClicked(true); // Set the clicked state to true when the card is clicked
    // if (sent_or_received === "Received" && data.announcement_read !== null) {
    //   setIsRead(true);
    // }
    if (onCloseClick) {
      console.log("printing onCloseClick prop",onCloseClick)
      onCloseClick();
      if (sent_or_received === "Received" && data.announcement_read !== null) {
        setIsRead(true);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
    e.stopPropagation();
  };

  // useEffect(() => {
  //   if (onCloseClick) {
  //     if (sent_or_received === "Received" && data.announcement_read !== null) {
  //       setIsRead(true);
  //     }
  //   }
  // }, [onCloseClick]);


  const getBorderColor = () => {
    // return data.sender_role === 'admin' ? 'blue' : 'green';
    let color = "#3D5CAC";
    const role = data.sender_role ? data.sender_role : data.receiver_role;
    switch (role) {
      case "Tenant":
        color = "#3D5CAC";
        break;
      case "Owner":
        color = "#A52A2A";
        break;
      case "Manager":
        color = "#FFC614";
        break;
      case "Business":
        color = "#FFC614";
        break;
      case "Maintenance":
        color = "#FF8A00";
        break; 
      default:
        color = "#A9AAAB";
        break;
    }

    return color;
  };

  return (
    <div ref={cardRef} className={`announcement-list-card  ${clicked ? "announcement-clicked" : ""} ${isRead ? "announcement-read" : ""}`} 
    // style={{
    //   backgroundColor: announcementClosed ? 'white' : announcement.announcement_read ? "#E0E0E0" : announcementClicked === announcement ? "#ADD8E6" : "white",
    // }}
    // style={{
    //   backgroundColor: announcementClosed ? "green" : data.announcement_read ? "#E0E0E0" : "white",
    // }}
    onClick={handleAnnouncements}>
      <div className={"announcement-list-card-picture-container" } >
        <div
          className="announcement-list-card-picture"
          style={{ width: "40px", height: "40px", border: "4px solid transparent", borderRadius: "50%", borderColor: getBorderColor(), overflow: "hidden" }}
          onClick={(e) => {
            if (pageToNavigate) {
              e.stopPropagation();
              navigate(pageToNavigate, navigationParams);
            }
          }}
        >
          {/* {data.sender_photo_url ? (
            <img src={data.sender_photo_url} alt="Sender" className="announcement-list-card-profile-img" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
          ) : (
            <img src={DefaultProfileImg} alt="Default" className="announcement-list-card-profile-img" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
          )} */}
          <img src={photoURL} alt="Sender" className="announcement-list-card-profile-img" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
        </div>
      </div>
      <div className="announcement-list-card-text-container">
        <div className="announcement-list-card-text-from">{sent_or_received === "Sent" ? "To: " + (data?.receiver_first_name + data?.receiver_last_name) : "From: " + (data?.sender_first_name + data?.sender_last_name)}</div>
        <div className="announcement-list-card-text-from">{sent_or_received === "Sent" ? "To: " + data.announcement_receiver : "From: " + data.announcement_sender}</div>
        <div className="announcement-list-card-text-from">{sent_or_received === "Sent" ? "Role: " + data?.receiver_role : "Role: " + data?.sender_role}</div>
        <div className="announcement-list-card-text-contents">{"Title: " + data.announcement_title.substring(0, 20) + "..."}</div>
        <div className="announcement-list-card-text-contents">{data.announcement_msg.substring(0, 20) + "..."}</div>
        <div className="announcement-list-card-text-date">{"Added: " + calculateAge(data.announcement_date)}</div>
      </div>
      <div className="announcement-list-card-options">
        {/* <div
          className="announcement-list-card-picture"
          onClick={(e) => {
            if (pageToNavigate) {
              e.stopPropagation();
              navigate(pageToNavigate, navigationParams);
            }
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.66667 28C5.93334 28 5.30534 27.7387 4.78267 27.216C4.26 26.6933 3.99911 26.0658 4 25.3333V6.66667C4 5.93334 4.26134 5.30534 4.784 4.78267C5.30667 4.26 5.93422 3.99911 6.66667 4H25.3333C26.0667 4 26.6947 4.26134 27.2173 4.784C27.74 5.30667 28.0009 5.93422 28 6.66667V25.3333C28 26.0667 27.7387 26.6947 27.216 27.2173C26.6933 27.74 26.0658 28.0009 25.3333 28H6.66667ZM8 22.6667H24L19 16L15 21.3333L12 17.3333L8 22.6667Z"
              fill="black"
              fillOpacity="0.5"
            />
          </svg>
        </div> */}
        {showCheckbox && (
          <div className="announcement-list-card-checkbox">
            <input type="checkbox" checked={checked1} onChange={handleCheckboxChange} />
          </div>
        )}
        {/* <div
          className="announcement-list-card-checkbox"
          checked={checked}
          //condition to check if it only in sent
          onChange={handleCheckboxChange}
        >
          <input type="checkbox" />
        </div> */}
      </div>
    </div>
  );
}

export default AnnouncementCard;
