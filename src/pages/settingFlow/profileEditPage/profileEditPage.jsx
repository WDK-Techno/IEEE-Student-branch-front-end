import React, {useState, useEffect} from "react";
import Facebook from "../../../assets/icons/Facebook.png";
import Linkedin from "../../../assets/icons/LinkedIn Circled.png";
import profile from "../../../assets/images/default-user.png";
import CommonButton from "../../../components/common/commonButton/commonButton";
import EditProfileModal from "../../../components/models/editProfileModel/editProfileModel";
import {useSelector} from "react-redux";
import {editUsers} from "../../../redux/actions/user";
import {uploadImage} from "../../../redux/actions/imageUpload";
import {useDispatch} from "react-redux";

const ProfileCard = ({formData}) => {
    return (
        <div
            className="card"
            style={{
                borderRadius: "10px",
                padding: "20px",
                position: "relative",
                width: "450px",
            }}
        >
            <div className="card-body d-flex">   
                <img
                    src={formData.profilePic || profile}
                    alt="Profile"
                    className="img-thumbnail me-3 rounded-circle"
                    style={{width: "100px", height: "100px", objectFit: "cover"}}
                />
                <div>
                    <h5 className="card-title">
                        {formData.firstName + " " + formData.lastName}
                    </h5>
                    <div className="d-flex gap-2">
                        {formData.fbURL && (
                            <a
                                href={formData.fbURL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={Facebook} alt="Facebook"/>
                            </a>
                        )}

                        {formData.linkedInURL && (
                            <a
                                href={formData.linkedInURL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={Linkedin} alt="Linkedin"/>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileEditPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [loader, setLoader] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const userData = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        bio: "",
        profilePic: "",
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        contactNo: "",
        ieee_email: "",
        location: "",
        ieee_membership_number: "",
        fbURL: "",
        linkedInURL: "",
    });

    const [error, setError] = useState({
        bio: false,
        profilePic: false,
        firstName: false,
        lastName: false,
        userName: false,
        fbURL: false,
        linkedInURL: false,
        email: false,
        contactNo: false,
        ieee_email: false,
        location: false,
        ieee_membership_number: false,
    });

    useEffect(() => {
        if (userData && userData.length > 0) {
            const user = userData[0]?.user;
            setFormData({
                profilePic: user.profilePic || profile,
                bio: user.bio || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                fbURL: user.fbURL || "",
                linkedInURL: user.linkedInURL || "",
                userName: user.username || "",
                email: user.email || "",
                contactNo: user.contactNo || "",
                ieee_email: user.ieee_email || "",
                location: user.location || "",
                ieee_membership_number: user.ieee_membership_number || "",
            });
        }
    }, [userData]);

    const handleUploadClick = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleSave = (img) => {
        setUploadedImage(img);
        setFormData((prevFormData) => ({
            ...prevFormData,
            profilePic: URL.createObjectURL(img),
        }));
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
        setError((prevError) => ({...prevError, [name]: false}));
    };

    const handleProfileUpload = async () => {
        if (!uploadedImage) return;
        const uploadedImageUrl = await dispatch(uploadImage(uploadedImage));
        return uploadedImageUrl;
    };

    const handleSubmit = async () => {
        const requiredFields = [
            "profilePic",
            "firstName",
            "lastName",
            "userName",
            "email",
            "contactNo",
        ];

        const error = {};
        let hasError = false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                error[field] = true;
                hasError = true;
            }
        });

        if (formData.email && !emailRegex.test(formData.email)) {
            error.email = "Invalid email format";
            hasError = true;
        }
        if (formData.ieee_email && !emailRegex.test(formData.ieee_email)) {
          error.ieee_email = "Invalid email format";
          hasError = true;
      }

        const phoneRegex = /^[0-9]{10}$/;
        if (formData.contactNo && !phoneRegex.test(formData.contactNo)) {
            error.contactNo = "Invalid contact number";
            hasError = true;
        }

        if (formData.type === "") {
            error.type = true;
            hasError = true;
        }

        if (hasError) {
            setError(error);
            return;
        }

        let newImage = null;
        if (uploadedImage) {
            newImage = await handleProfileUpload();
        }

        const data = {
            email: formData.email,
            ieee_email: formData.ieee_email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            ieee_membership_number: formData.ieee_membership_number,
            contactNo: formData.contactNo,
            bio: formData.bio,
            profilePic: newImage ? newImage : formData.profilePic,
            fbURL: formData.fbURL,
            linkedInURL: formData.linkedInURL,
            location: formData.location,
        };

        setLoader(true);

        editUsers(data, (res) => {
            setLoader(false);
            if (res?.status === 200) {
                console.log(res, "User updated successfully:");
                setIsEditable(false);
            } else {
                console.log(res, "User Update Failed.");
            }
        });
    };


    const handleEditClick = () => {
        setIsEditable(true);
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center">
                <div className="row mt-4 px-5">
                    <div className="col-6 col-md-6 mb-4">
                        <ProfileCard formData={formData}/>
                    </div>
                </div>

                <div
                    className="d-flex justify-content-between align-items-center gap-1"
                    style={{marginRight: "150px"}}
                >
                    <div className="d-flex gap-3 flex-row">
                        {isEditable && (
                            <div>
                                <CommonButton
                                    text={"Upload New Photo"}
                                    onClick={handleUploadClick}
                                />
                            </div>
                        )}

                        {!isEditable && (
                            <div>
                                <CommonButton text={"Edit Profile"} onClick={handleEditClick}/>
                            </div>
                        )}
                        {isEditable && (
                            <div>
                                <CommonButton text={"Delete"} close={true}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column px-5">
                {(formData.bio || isEditable) && (
                    <div className="mt-3">
                        <label htmlFor="bio" className="form-label text-dark">
                            Bio
                        </label>
                        <input
                            type="text"
                            name="bio"
                            value={formData.bio || ""}
                            onChange={handleInputChange}
                                className={`form-control ${error.bio ? "is-invalid" : ""}`}
                            style={{width: "520px"}}
                            readOnly={!isEditable}
                            placeholder={
                                !isEditable && !formData.bio ? "No role defined" : ""
                            }
                        />
                    </div>
                )}

                <div className="mt-3 d-flex flex-wrap gap-lg-3">
                    <div>
                        <label htmlFor="firstName" className="form-label text-dark">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ""}
                            onChange={handleInputChange}
                            className={`form-control ${error.firstName ? "is-invalid" : ""}`}
                            style={{width: "520px"}}
                            required
                            readOnly={!isEditable}
                        />
                        {error.firstName && (
                            <div className="invalid-feedback">This field is required.</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="form-label text-dark">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName || ""}
                            onChange={handleInputChange}
                            className={`form-control ${error.lastName ? "is-invalid" : ""}`}
                            style={{width: "520px"}}
                            required
                            readOnly={!isEditable}
                        />
                        {error.lastName && (
                            <div className="invalid-feedback">This field is required.</div>
                        )}
                    </div>
                </div>

                <div>
                        <label htmlFor="lastName" className="form-label text-dark">
                            User Name
                        </label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName || ""}
                            onChange={handleInputChange}
                            className={`form-control ${error.userName ? "is-invalid" : ""}`}
                            style={{width: "520px"}}
                            required
                            readOnly={!isEditable}
                        />
                        {error.userName && (
                            <div className="invalid-feedback">This field is required.</div>
                        )}
                    </div>

                <div className="mt-3 d-flex flex-wrap gap-lg-3">
                    <div>
                        <label htmlFor="email" className="form-label text-dark">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            className={`form-control ${error.email ? "is-invalid" : ""}`}
                            style={{width: "520px"}}
                            required
                            readOnly={!isEditable}
                        />
                        {error.email && (
                            <div className="invalid-feedback">
                                {error.email === "Invalid email format"
                                    ? "Please enter a valid email address."
                                    : "This field is required."}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="contactNo" className="form-label text-dark">
                            Contact No
                        </label>
                        <input
                            type="text"
                            name="contactNo"
                            value={formData.contactNo || ""}
                            onChange={handleInputChange}
                            className={`form-control ${error.contactNo ? "is-invalid" : ""}`}
                            style={{width: "520px"}}
                            required
                            readOnly={!isEditable}
                        />
                        {error.contactNo && (
                            <div className="invalid-feedback">
                                {error.contactNo === "Invalid contact number"
                                    ? "Please enter a valid phone number."
                                    : "This field is required."}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-3 d-flex flex-wrap gap-lg-3">
                    {(formData.location || isEditable) && (
                        <div>
                            <label htmlFor="location" className="form-label text-dark">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location || ""}
                                onChange={handleInputChange}
                                className={`form-control ${error.location ? "is-invalid" : ""}`}
                                style={{width: "520px"}}
                                required
                                readOnly={!isEditable}
                            />
                            {error.location && (
                                <div className="invalid-feedback">This field is required.</div>
                            )}
                        </div>
                    )}

                    {(formData.ieee_email || isEditable) && (
                        <div>
                            <label htmlFor="ieee_email" className="form-label text-dark">
                                IEEE Email
                            </label>
                            <input
                                type="text"
                                name="ieee_email"
                                value={formData.ieee_email || ""}
                                onChange={handleInputChange}
                                className={`form-control ${error.ieee_email ? "is-invalid" : ""}`}
                                style={{width: "520px"}}
                                readOnly={!isEditable}
                            />
                            {error.ieee_email && (
                            <div className="invalid-feedback">
                                {error.ieee_email === "Invalid email format"
                                    ? "Please enter a valid email address."
                                    : "This field is required."}
                            </div>
                        )}
                        </div>
                    )}
                </div>

                <div className="mt-3 d-flex flex-wrap gap-lg-3">
                    {(formData.ieee_membership_number || isEditable) && (
                        <div    >
                            <label htmlFor="ieee_membership_number" className="form-label text-dark">
                                IEEE Number
                            </label>
                            <input
                                type="number"
                                name="ieee_membership_number"
                                value={formData.ieee_membership_number || ""}
                                onChange={handleInputChange}
                                className={`form-control ${error.ieee_membership_number ? "is-invalid" : ""}`}
                                style={{width: "520px"}}
                                readOnly={!isEditable}
                            />
                            {error.ieee_membership_number && (
                                <div className="invalid-feedback">This field is required.</div>
                            )}
                        </div>
                    )}

                    {(formData.fbURL || isEditable) && (
                        <div    >
                            <label htmlFor="fbURL" className="form-label text-dark">
                                Facebook URL
                            </label>
                            <input
                                type="text"
                                name="fbURL"
                                value={formData.fbURL || ""}
                                onChange={handleInputChange}
                                className={`form-control ${error.fbURL ? "is-invalid" : ""}`}
                                style={{width: "520px"}}
                                readOnly={!isEditable}
                            />
                            {error.fbURL && (
                                <div className="invalid-feedback">This field is required.</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-3 d-flex flex-wrap gap-lg-3">
                {(formData.linkedInURL || isEditable) && (
                    <div    >
                        <label htmlFor="linkedInURL" className="form-label text-dark">
                            LinkedIn URL
                        </label>
                        <input
                            type="text"
                            name="linkedInURL"
                            value={formData.linkedInURL || ""}
                            onChange={handleInputChange}
                            className={`form-control ${
                                error.linkedInURL ? "is-invalid" : ""
                            }`}
                            style={{width: "520px"}}
                            readOnly={!isEditable}
                        />
                        {error.linkedInURL && (
                            <div className="invalid-feedback">This field is required.</div>
                        )}
                    </div>
                )}
                </div>

                <div className="d-flex justify-content-end align-items-end gap-1 mt-5">
                    <div className="d-flex gap-3 flex-row">
                        <div>
                            {isEditable && (
                                <CommonButton
                                    text={"Cancel"}
                                    close={true}
                                    onClick={() => {
                                        setIsEditable(false);
                                    }}
                                />
                            )}
                        </div>
                        <div>
                            {isEditable && (
                                <CommonButton
                                    text={"Save Changes"}
                                    loader={loader}
                                    onClick={handleSubmit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <EditProfileModal
                showModal={showModal}
                onClose={handleModalClose}
                onSave={handleSave}
            />
        </div>
    );
};

export default ProfileEditPage;
