import React, { useState } from "react";
import EditIcon from "../../../assets/icons/editPrimary.png";
import ViewIcon from "../../../assets/icons/viewPrimary.png";
import CopyToClipboardIcon from "../../../assets/icons/copyToClipboardWhite.png";
import OpenNewTabIcon from "../../../assets/icons/externalLinkWhite.png";
import BgImage from "../../../assets/images/event_default_bg.png";
import ViewEventModal from '../../../components/models/viewEventModel/viewEventModel'; // Import the correct ViewEventModal
import EditEventModal from '../../../components/models/editEventModel/editEventModel'; // Import the correct EditEventModal

// const truncateText = (text, maxWords) => {
//     const words = text.split(' ');
//     if (words.length > maxWords) {
//         return words.slice(0, maxWords).join(' ') + '...';
//     }
//     return text;
// };

const truncateText = (text, maxWords) => {
    if (!text) {
        return ''; // Return an empty string if text is null or undefined
    }
    
    const words = text.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    
    return text;
};


const CommonEventCard = ({ eventDetails, editable, editAction, viewAction }) => {
    const truncatedDescription = truncateText(eventDetails.description, 20);

    // State for modal visibility and selected event
    const [viewEventModalShow, setViewEventModalShow] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null); // State for selected event
    const [editEventModalShow, setEditEventModalShow] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleCloseViewEventModal = () => setViewEventModalShow(false);
    const handleCloseEditEventModal = () => setEditEventModalShow(false);

    const handleShowViewEventModal = (event) => {
        if (event) {
            setSelectedEvent(event); // Set selected event data
            setViewEventModalShow(true); // Show the modal
        } else {
            console.error("No event data available");
        }
    };

    const handleShowEditEventModal = (event) => {
        setSelectedEvent(event);
        setEditEventModalShow(true);
    };

    return (
        <div className="card m-0 p-0 shadow-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="card-header fw-bold text-light bg-dark">
                {eventDetails.eventName}
            </div>
            <div className="card-body text-light d-flex flex-column position-relative bg-dark p-0">
                <img
                    src={eventDetails.image ? eventDetails.image : BgImage}
                    className="m-0 w-100"
                    style={{ height: "220px", width: "100%", objectFit: "cover" }}
                    alt="Event Background"
                />
                {isHovered && (
                <div
                    className="position-absolute top-0 start-0 m-0 text-light px-2 py-1"
                    style={{ background: "rgba(0, 0, 0, 0.5)", height: "220px" }}
                >
                    <div className="fw-bold text-center mt-1" style={{ fontSize: "1.0rem" }}>
                        {eventDetails.date}
                    </div>

                    <div className="mt-1 fw-bold" style={{ fontSize: "0.8rem" }}>
                        Venue
                    </div>
                    <div style={{ fontSize: "0.7rem" }}> {eventDetails.venue}</div>

                    <div className="mt-1 fw-bold" style={{ fontSize: "0.8rem" }}>
                        Description
                    </div>
                    <div style={{ fontSize: "0.7rem",color:"white" }}>{eventDetails.description}</div>

                    <div className="mt-1 fw-bold" style={{ fontSize: "0.8rem" }}>
                        Event Link
                    </div>
                    <div style={{ fontSize: "0.7rem" }}> {eventDetails.eventLink}</div>
                    {/* <div className="d-flex py-0 mt-0">
                        <button className="bg-transparent border-0 d-flex" onClick={""}>
                            <img src={CopyToClipboardIcon} width={20} alt="Copy" />
                        </button>
                        <button className="bg-transparent border-0 ms-0 d-flex" onClick={""}>
                            <img src={OpenNewTabIcon} width={20} alt="Open New Tab" />
                        </button>
                    </div> */}
                </div>
                )}
            </div>
            <div className="card-footer d-flex">
                <div className="fw-bold">{eventDetails.projectName}</div>
                <div className="ms-auto me-1">
                    <button
                        className="bg-transparent border-0"
                        onClick={() => handleShowViewEventModal(eventDetails)} // Pass event details to modal
                    >
                        <img src={ViewIcon} width={25} alt="View" />
                    </button>

                    {editable && (
                        <button
                            className="bg-transparent border-0"
                            onClick={() => handleShowEditEventModal(eventDetails)}
                        >
                            <img src={EditIcon} width={25} alt="Edit" />
                        </button>
                    )}
                </div>
            </div>

            {/* Modal to show event details */}
            <ViewEventModal
                show={viewEventModalShow}
                onHide={handleCloseViewEventModal}
                eventData={selectedEvent} // Pass selected event data
            />

            {/* Modal to edit event details */}
            <EditEventModal
                show={editEventModalShow}
                onHide={handleCloseEditEventModal}
                eventData={selectedEvent} // Pass selected event data
                editable={editable} // Ensure that editable is passed correctly
            />
        </div>
    );
};

export default CommonEventCard;
