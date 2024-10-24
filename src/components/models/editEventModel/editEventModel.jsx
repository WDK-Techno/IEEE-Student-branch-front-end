import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import CommonButton from "../../common/commonButton/commonButton";
import { useDispatch } from "react-redux"; // Import useDispatch to dispatch actions
import { updatEvent } from "../../../redux/actions/event";
import { useParams } from "react-router-dom";
import uploadImageIcon from "../../../assets/icons/upload.png";
import { uploadImage } from "../../../redux/actions/imageUpload";

const EditEventModal = ({ onHide, show, eventData, editable }) => {
  const [formData, setFormData] = useState(eventData || {});
  const dispatch = useDispatch(); // Initialize dispatch
  const { id: projectID } = useParams();
  const [image, setImage] = useState(null);
  const [exist, setExist] = useState("");

  useEffect(() => {
    setImage(null);
    setExist("");
  }, [show]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setExist("");
    // setErrors((prev) => ({ ...prev, image: "" }));

    if (file) {
      if (file.size > 1024 * 1024) {
        setExist("Please select an image smaller than 1 MB.");
        // setError(true);
      } else if (
        !["image/png", "image/jpeg", "image/jpg"].includes(file.type)
      ) {
        setExist("Only PNG, JPG, and JPEG formats are allowed.");
        // setErrors(true);
      } else {
        setImage(file);
        setExist("");
      }
    }
  };

  const handleProfileUpload = async (selectedFile) => {
    if (!selectedFile) return;
    const uploadedImageUrl = await dispatch(uploadImage(selectedFile));
    return uploadedImageUrl;
  };

  // Use useEffect to update formData when eventData changes
  useEffect(() => {
    if (eventData) {
      setFormData(eventData);
    }
  }, [eventData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // console.log("formdata",formData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const imgUrl =  await handleProfileUpload(image);

    const updatedData = {
      eventName: formData.eventName,
      status: "ACTIVE",
      eventLink: formData.eventLink,
      date: formData.date.split("T")[0],
      venue: formData.venue,
      image: imgUrl,
      description: formData.description,
    };

    console.log(updatedData);

    dispatch(
      updatEvent(projectID, eventData.id, updatedData, (res) => {
        if (res?.status == 201) {
          console.log("event updated");
          onHide();
          window.location.reload();
        } else {
          console.log("event not updated");
        }
      })
    );

    // dispatch(
    //     updatEvent(projectID, eventData.id, updatedData, (res)))
    //     .then(() => {
    //         onHide();
    //     })
    //     .catch((error) => {
    //         console.error('Error updating event:', error);

    //     }
    // );
  };

  if (!eventData) return null;

  return (
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
          Edit Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {" "}
          {/* Wrap the form fields in a form tag */}
          <div className="d-flex flex-column align-items-center">
            <div className="w-100">
              <div className="mb-3">
                <label className="form-label text-dark">Event Name</label>
                <input
                  type="text"
                  name="eventName"
                  className="form-control"
                  value={formData.eventName || ""}
                  onChange={editable ? handleInputChange : undefined}
                  disabled={!editable} // Make input non-editable based on editable prop
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-dark">Date</label>
                <input
                  type="text"
                  name="date"
                  className="form-control"
                  value={formData.date || ""}
                  onChange={editable ? handleInputChange : undefined}
                  disabled={!editable}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-dark">Venue</label>
                <input
                  type="text"
                  name="venue"
                  className="form-control"
                  value={formData.venue || ""}
                  onChange={editable ? handleInputChange : undefined}
                  disabled={!editable}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-dark">Description</label>
                <textarea
                  name="description"
                  className="form-control text-red"
                  value={formData.description || ""}
                  onChange={editable ? handleInputChange : undefined}
                  rows={4}
                  disabled={!editable}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-dark">Link</label>
                <input
                  type="text"
                  name="eventLink"
                  className="form-control"
                  value={formData.eventLink || ""}
                  onChange={editable ? handleInputChange : undefined}
                  disabled={!editable}
                />
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
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-end mt-3">
        <div>
          <CommonButton onClick={handleSubmit} text={"Save"} />{" "}
          {/* Save button will submit the form */}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditEventModal;
