import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import CommonButton from "../../common/commonButton/commonButton";
import uploadImageIcon from "../../../assets/icons/upload.png";
import { useDispatch } from "react-redux";
import { uploadImage } from "../../../redux/actions/imageUpload";
import { createEvent } from "../../../redux/actions/event";

const AddEventModel = ({ onHide, show, disabled, editable, id }) => {
  const [image, setImage] = useState(null);
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [projectName, setProjectName] = useState("");
  const [errors, setErrors] = useState({});
  const [exist, setExist] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setImage(null);
    setErrors({});
    setExist("");
  }, [show]); // Add an empty array here to run useEffect only on mount

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setExist("");
    setErrors((prev) => ({ ...prev, image: "" }));

    if (file) {
      if (file.size > 1024 * 1024) {
        setExist("Please select an image smaller than 1 MB.");
        setError(true);
      } else if (
        !["image/png", "image/jpeg", "image/jpg"].includes(file.type)
      ) {
        setExist("Only PNG, JPG, and JPEG formats are allowed.");
        setErrors(true);
      } else {
        setImage(file);
        setExist("");
      }
    }
  };


  const validateInputs = () => {
    const newErrors = {};

    // Validation checks
    if (!eventName) newErrors.eventName = "Event Name is required.";
    if (!date) newErrors.date = "Date is required.";
    if (!venue) newErrors.venue = "Venue is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!eventLink) newErrors.eventLink = "Event Link is required.";
    // if (!projectName) newErrors.projectName = "Project Name is required.";
    if (!image) newErrors.image = "Event photo is required.";
    
    // Log errors to see what is missing
    console.log("Validation Errors:", newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


  const handleProfileUpload = async (selectedFile) => {
    if (!selectedFile) return;
    const uploadedImageUrl = await dispatch(uploadImage(selectedFile));
    return uploadedImageUrl;
  };


  const clearInputs = () =>{
    setDate("");
    setDescription("");
    setEventLink("");
    setEventName("");
    setVenue("");
    setImage(null);
  }

  const handleSave = async (e) => {
    e.preventDefault();
    const isValid = validateInputs();
    if (isValid) {
      const imgUrl = await handleProfileUpload(image);

      const eventData = {
        eventName,
        date,
        venue,
        description,
        eventLink,
        image: imgUrl,
        "status": "ACTIVE",
      };

      console.log("add event data :", eventData)

      dispatch(createEvent(id, eventData, (response) => {
        console.log("add event", response)
        if (response.status === 201) {
          console.log("Event created successfully:", response);
          onHide(); 
          clearInputs();
          window.location.reload();
        } else {
          console.error("Error creating event:", response);
        }
      }));
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        animation={true}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            className="text-cl-primary"
            id="contained-modal-title-vcenter"
          >
            {editable ? "Edit" : disabled ? "View" : "Add"} Event
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <div className="mt-3">
              <div className="">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  Event Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="event name"
                  disabled={disabled}
                  name="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
                {errors.eventName && (
                  <div className="text-danger">{errors.eventName}</div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <div className="">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="date"
                  disabled={disabled}
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && (
                  <div className="text-danger">{errors.date}</div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <div className="">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  Venue
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="venue"
                  disabled={disabled}
                  name="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
                {errors.venue && (
                  <div className="text-danger">{errors.venue}</div>
                )}
              </div>
            </div>

            <div className="mt-3">
              <div class="form-group">
                <label for="exampleFormControlTextarea1">Description</label>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  disabled={disabled}
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                {errors.description && (
                  <div className="text-danger">{errors.description}</div>
                )}
              </div>
            </div>

            <div className="mt-3">
              <div class="form-group">
                <label for="exampleFormControlTextarea1">Event Link</label>
                <input
                  type="link"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="eventUrl"
                  disabled={disabled}
                  name="eventLink"
                  value={eventLink}
                  onChange={(e) => setEventLink(e.target.value)}
                />
                {errors.eventLink && (
                  <div className="text-danger">{errors.eventLink}</div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="mt-3">
              <label htmlFor="ouLogo" className="form-label mt-3 text-dark">
                Event Photo
              </label>

              <div className="d-flex flex-column align-items-center justify-content-center">
                {image ? (
                  <div
                    className="border border-2 border-dark p-2"
                    style={{ width: "240px", height: "150px" }}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Profile Preview"
                      className="img-fluid object-fit-cover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                ) : (
                  <div
                    className="border border-1 p-3 d-flex flex-column justify-content-center align-items-center bg-light"
                    style={{
                      width: "300px",
                      height: "180px",
                      cursor: "pointer",
                      borderRadius: "6px",
                    }}
                    onClick={() =>
                      document.getElementById("ouLogoInput").click()
                    }
                  >
                    <img
                      src={uploadImageIcon}
                      alt="Upload"
                      className="text-center"
                      height="60"
                      width="60"
                    />

                    <input
                      type="file"
                      id="ouLogoInput"
                      style={{ display: "none" }}
                      accept="image/png, image/jpeg"
                      onChange={handleImageChange}
                    />

                    <p
                      className="text-center mb-0 mt-2"
                      style={{ color: "#6c757d" }}
                    >
                      Click here to upload profile photo.
                    </p>
                  </div>
                )}

                {errors.image && (
                  <div className="text-danger text-center mt-2">
                    {errors.image}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          
            <div className="mr-2">
              <CommonButton onClick={handleSave} text="Save" />
            </div>
            <div>
              <CommonButton  onClick={() => {
                              onHide();  
                              clearInputs(); 
                              }} 
                              close={true} 
                              text={"Close"} 
                              />
            </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEventModel;
