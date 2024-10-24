import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import CommonButton from "../../common/commonButton/commonButton";
import { getAllOU } from "../../../redux/actions/ou";
import { CreateProject, updateProject } from "../../../redux/actions/project";
import { useDispatch } from "react-redux";
import { uploadImage } from "../../../redux/actions/imageUpload";
import deleteimage from "../.../../../../assets/icons/delete.png";
import uploadimage from "../.../../../../assets/icons/upload.png";

const ProjectModel = ({
  onHide,
  show,
  disabled,
  editable,
  id,
  changed,
  item,
}) => {
  const [ou, setOu] = useState([]);
  const [image, setImage] = useState(null);
  const distpatch = useDispatch();

  useEffect(() => {
    getAllOU((response) => {
      if (response && response.data && Array.isArray(response.data.data)) {
        setOu(response.data.data);
      } else {
        setOu([]);
      }
    });
  }, []);

  useEffect(() => {
    if (show && editable && item) {
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      const data = {
        project_name: item.projectName,
        description: item.description,
        start_date: formatDate(item.startDate),
        end_date: formatDate(item.endDate),
        project_logo: item.projectLogo,
        status: item.status,
        ou_id: item.ous.map((ou) => ou.ouID),
      };

      setFormData(data);
    }
  }, [show, item]);

  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    start_date: "",
    end_date: "",
    project_logo: "",
    status: "",
    ou_id: [],
  });

  const [error, setError] = useState({
    project_name: false,
    description: false,
    start_date: false,
    end_date: false,
    project_logo: false,
    ou_id: false,
  });

  const [loading, setLoading] = useState(false);
  const [exist, setExist] = useState("");

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, status: value }));
  };

  useEffect(() => {
    if (!editable) {
      setFormData({
        project_name: "",
        description: "",
        start_date: "",
        end_date: "",
        project_logo: "",
        ou_id: [],
      });
    }
    setError({
      project_name: false,
      description: false,
      start_date: false,
      end_date: false,
      project_logo: false,
      ou_id: false,
    });
    setImage(null);
    setExist("");
  }, [editable, item]);

  const resetFields = () => {
    setFormData({
      project_name: "",
      description: "",
      start_date: "",
      end_date: "",
      project_logo: "",
      ou_id: [],
    });
    setError({
      project_name: false,
      description: false,
      start_date: false,
      end_date: false,
      project_logo: false,
      ou_id: false,
    });
    setImage(null);
    setExist("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: false }));
    setExist("");
  };

  const handleImageChange = (e) => {
    setExist("");
    setError((prevData) => ({ ...prevData, project_logo: false }));
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setExist("Please select an image smaller than 1 MB.");
      } else if (
        !["image/png", "image/jpeg", "image/jpg"].includes(file.type)
      ) {
        setExist("Only PNG, JPG, and JPEG formats are allowed.");
      } else {
        setImage(file);
        setExist("");
      }
    }
  };

  const handleProfileUpload = async (selectedFile) => {
    if (!selectedFile) return;
    const uploadedImageUrl = await distpatch(uploadImage(selectedFile));
    console.warn(uploadedImageUrl);
    return uploadedImageUrl;
  };

  const handleDeleteClick = () => {
    setImage(null);
    setFormData((prevData) => ({ ...prevData, project_logo: "" }));
  };

  const handleCheckboxChange = (e, ouId) => {
    const isChecked = e.target.checked;
    setFormData((prevData) => {
      const updatedOuId = isChecked
        ? [...prevData.ou_id, ouId]
        : prevData.ou_id.filter((id) => id !== ouId);
      return { ...prevData, ou_id: updatedOuId };
    });
    setError((prevError) => ({ ...prevError, ou_id: false }));
  };

  const onSuccessSaveDetails = async () => {
    console.log("click");

    setExist("");
    setError({
      project_name: false,
      description: false,
      start_date: false,
      end_date: false,
      project_logo: false,
      ou_id: false,
    });

    const hasErrors = {
      project_name: !formData.project_name,
      description: !formData.description,
      project_logo: !formData.project_logo && !image,
      start_date: !formData.start_date,
      end_date: !formData.end_date,
      ou_id: formData.ou_id.length === 0,
    };

    if (
      hasErrors.project_name ||
      hasErrors.description ||
      hasErrors.project_logo ||
      hasErrors.start_date ||
      hasErrors.end_date ||
      hasErrors.ou_id
    ) {
      if (image) {
        hasErrors.project_logo = false;
      }

      setError(hasErrors);
      return;
    }

    setLoading(true);

    if (editable) {
      let updatedFormData = { ...formData };
      const imgurl = await handleProfileUpload(image);
      updatedFormData = { ...updatedFormData, project_logo: imgurl };
      const id = item?.projectID;
      updateProject(id, updatedFormData, (res) => {
        if (res?.status === 201) {
          setLoading(false);
          changed();
          onHide();
        } else {
          setLoading(false);
          setExist("Project Update Failed");
        }
      });
    } else {
      let updatedFormData = { ...formData };
      const imgurl = await handleProfileUpload(image);
      updatedFormData = { ...updatedFormData, project_logo: imgurl };
      CreateProject(updatedFormData, (res) => {
        if (res?.status === 201) {
          setLoading(false);
          resetFields();
          changed();
          onHide();
        } else if (res?.status === 409) {
          setLoading(false);
          setExist("Policy Already Exists");
        } else {
          setLoading(false);
          setExist("Policy Creation Failed");
        }
      });
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
            {editable ? "Edit" : disabled ? "View" : "Add"} Project
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <div className="mt-3">
              <label className="form-label text-dark">OU</label>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {ou?.map(
                  (item) =>
                    item?.ouID &&
                    item?.ouName && (
                      <div className="form-check" key={item.ouID}>
                        <input
                          className={`form-check-input ${error.ou_id ? "is-invalid" : ""
                            }`}
                          type="checkbox"
                          id={item.ouID}
                          name="ouID"
                          checked={formData.ou_id.includes(item.ouID)}
                          onChange={(e) => handleCheckboxChange(e, item.ouID)}
                        />
                        <label className="form-check-label" htmlFor={item.ouID}>
                          {item.ouName}
                        </label>
                      </div>
                    )
                )}
              </div>

              {error.ou_id && (
                <div className="invalid-feedback d-block">
                  At least one OU must be selected.
                </div>
              )}
            </div>

            <div className="mt-3">
              <div className="">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  Project Title
                </label>
                <input
                  type="text"
                  id="exampleFormControlInput1"
                  placeholder="project title"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  className={`form-select ${error.project_name ? "is-invalid" : ""
                    }`}
                  disabled={disabled}
                />
                <div className="invalid-feedback">This field is required.</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className={`form-select ${error.start_date ? "is-invalid" : ""
                    }`}
                  id="exampleFormControlInput1"
                  placeholder="account number"
                  disabled={disabled}
                />
                <div className="invalid-feedback">This field is required.</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  End date
                </label>
                <input
                  type="date"
                  min={formData.start_date}
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className={`form-select ${error.end_date ? "is-invalid" : ""
                    }`}
                  id="exampleFormControlInput1"
                  placeholder="amount"
                  disabled={disabled}
                />
                <div className="invalid-feedback">This field is required.</div>
              </div>
            </div>
            <div className="mt-3">
              <div class="form-group">
                <label for="exampleFormControlTextarea1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`form-select ${error.description ? "is-invalid" : ""
                    }`}
                  id="exampleFormControlTextarea1"
                  rows="3"
                  disabled={disabled}
                />
                <div className="invalid-feedback">This field is required.</div>
              </div>
            </div>
            {editable && (
              <div className="mt-3">
                <div class="form-group">
                  <label for="exampleFormControlTextarea1">Status</label>
                  <select
                    className="form-select w-100"
                    aria-label="Large select example"
                    value={formData.status}
                    onChange={handleStatusChange}
                  >
                    <option value="">Select Status</option>
                    <option value="TODO">To Do</option>
                    <option value="PROGRESS">Progress</option>
                    <option value="COMPLETE">Complete</option>
                  </select>
                  {error.status && (
                    <div className="invalid-feedback d-block">
                      This field is required.
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="mt-3">
              <label
                htmlFor="academicYear"
                className="form-label mt-3 text-dark"
              >
                OU logo
              </label>
              <div className=" d-flex flex-column align-items-center justify-content-center">
                {image != null || formData.project_logo != "" ? (
                  <div className="p-1 border border-2 border-black d-flex flex-column justify-content-center align-items-center">
                    <div
                      style={{
                        position: "relative",
                        height: "180px",
                        width: "360px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={
                          image != null
                            ? URL.createObjectURL(image)
                            : formData.project_logo
                        }
                        className="img-fluid object-fit-cover"
                        alt="OU Logo"
                        style={{ width: "100%", height: "100%" }}
                        loading="lazy"
                      />
                      <div className="delete-button w-100 h-100 text-center d-flex align-items-center justify-content-center">
                        <div>
                          <img
                            style={{ cursor: "pointer" }}
                            onClick={handleDeleteClick}
                            src={deleteimage}
                            alt="Delete"
                            width="30"
                            height="30"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="p-3 border border-2 border-black d-flex flex-column justify-content-center align-items-center bg-secondary-subtle"
                    style={{
                      borderStyle: "dotted",
                      height: "180px",
                      width: "360px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      document.getElementById("customFile").click()
                    }
                  >
                    <img
                      src={uploadimage}
                      alt="Upload the Logo"
                      loading="lazy"
                      className="text-center"
                      height="90"
                      width="90"
                    />
                    <input
                      type="file"
                      id="customFile"
                      style={{ visibility: "hidden" }}
                      accept="image/png, image/jpeg"
                      onChange={handleImageChange}
                    />
                    <p>Click here to upload Project Logo.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          <div>
            <CommonButton onClick={onHide} close={true} text={"Close"} />
          </div>
          {disabled ? null : (
            <div>
              <CommonButton
                onClick={onSuccessSaveDetails}
                text={editable ? "Save" : "Add"}
                load={loading}
              />
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProjectModel;
