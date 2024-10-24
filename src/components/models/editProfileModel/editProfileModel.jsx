import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import CommonButton from "../../common/commonButton/commonButton";
import uploadImageIcon from "../../../assets/icons/upload.png";
import { useDispatch } from "react-redux";
import { uploadImage } from "../../../redux/actions/imageUpload";

const EditProfileModal = ({
  showModal,
  onClose,
  onSave,
  editable = false,
  loading = false,
  disabled = false,
}) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(false);
  const [exist, setExist] = useState("");


  useEffect(() => {
    setImage(null);
    setError(false);
    setExist("");
  }, [showModal]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setExist("");
    setError(false);

    if (file) {
      if (file.size > 1024 * 1024) {
        setExist("Please select an image smaller than 1 MB.");
        setError(true);
      } else if (
        !["image/png", "image/jpeg", "image/jpg"].includes(file.type)
      ) {
        setExist("Only PNG, JPG, and JPEG formats are allowed.");
        setError(true);
      } else {
        setImage(file);
        setExist("");
      }
    }
  };



  const handleSave = async () => {
    if (!image) {
      setError(true);
      setExist("Profile picture is required.");
      return;
    }
    onSave(image);
    onClose();
  };

  return (
    <Modal
      show={showModal}
      onHide={onClose}
      animation={true}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
     
      <Modal.Header closeButton>
       <Modal.Title>Edit Profile Photo</Modal.Title>
      </Modal.Header>
  
      <Modal.Body>
    
        <div className="d-flex flex-column align-items-center">
         
          <label htmlFor="ouLogo" className="form-label mt-3 text-dark">
             Profile Photo
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
                onClick={() => document.getElementById("ouLogoInput").click()}
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
         
            {error && (
              <div className="text-danger text-center mt-2">{exist}</div>
            )}
           
          </div>
        
        </div>
      
      </Modal.Body>
    
      <Modal.Footer className="d-flex justify-content-end">
      
        <div>
         
          <CommonButton onClick={onClose} close={true} text={"Close"} />
        </div>
       
        {!disabled && (
          <div>
          
            <CommonButton
              load={loading}
              onClick={handleSave}
              text={editable ? "Save" : "Add"}
            />
          
          </div>
        )}
       
      </Modal.Footer>
   
    </Modal>
  );
};

export default EditProfileModal;
