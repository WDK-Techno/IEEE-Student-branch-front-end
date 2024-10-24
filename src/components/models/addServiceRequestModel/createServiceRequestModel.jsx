import React, { useEffect, useState } from "react";
import service from "../../../assets/images/serviceback.png";
import Modal from "react-bootstrap/Modal";
import CommonButton from "../../common/commonButton/commonButton";
import { createServiceLetterRequest } from "../../../redux/actions/service";

const CreateServiceRequestModel = ({
  onHide,
  show,
  view,
  edit,
  refresh,
  requestData,
}) => {
  const initialFormData = {
    due_date: "",
    email: "",
    remarks: "",
    type_excom: false,
    type_project: false,
    type_other: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({
    due_date: false,
    email: false,
    remarks: false,
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.split("T")[0];
  };
  useEffect(() => {
    if (view) {
      const request = requestData?.item;
      const user = requestData?.user;
      const data = {
        request_date: formatDate(request?.request_date),
        due_date: formatDate(request?.due_date),
        email: request?.email,
        remarks: request?.remarks,
        type_excom: request?.type_excom,
        type_project: request?.type_project,
        type_other: request?.type_other,
      };
      setFormData(data);
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const handleSubmit = () => {
    if (edit) {
      createServiceLetterRequest(formData, (res) => {
        if (res?.status == 200) {
          // Clear the form
          setFormData(initialFormData);
          onHide();
          refresh();
        }
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} animation={true} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-cl-primary">Request Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column">
          <div className="">
            {view && (
              <div className="pb-3">
                <label htmlFor="due_date" className="Text-input-label pb-2">
                  Requested Date
                </label>
                <div>
                  <input
                    className="form-control"
                    type="date"
                    id="due_date"
                    name="due_date"
                    value={formData.request_date}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
              </div>
            )}

            <div className="pb-3">
              <label htmlFor="due_date" className="Text-input-label pb-2">
                Due Date
              </label>
              <div>
                <input
                  className="form-control"
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  disabled={view ? true : false}
                />
              </div>
            </div>

            <div className="pb-3">
              <label htmlFor="email" className="Text-input-label pb-2">
                Email
              </label>
              <div>
                <input
                  className="form-control"
                  type="text"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={view ? true : false}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-around pb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="type_excom"
                name="type_excom"
                checked={formData.type_excom}
                onChange={handleInputChange}
                disabled={view ? true : false}
              />
              <label className="form-check-label" htmlFor="excom">
                Excom
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="type_project"
                name="type_project"
                checked={formData.type_project}
                onChange={handleInputChange}
                disabled={view ? true : false}
              />
              <label className="form-check-label" htmlFor="projects">
                Projects
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="type_other"
                name="type_other"
                checked={formData.type_other}
                onChange={handleInputChange}
                disabled={view ? true : false}
              />
              <label className="form-check-label" htmlFor="others">
                Others
              </label>
            </div>
          </div>
          <div className="pb-3">
            <label htmlFor="remarks" className="Text-input-label pb-2">
              Remarks
            </label>
            <div>
              <textarea
                className="form-control"
                id="remarks"
                name="remarks"
                rows={3}
                value={formData.remarks}
                onChange={handleInputChange}
                disabled={view ? true : false}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        <div>
          <CommonButton onClick={onHide} close={true} text={"Close"} />
        </div>
        {edit && (
          <div>
            <CommonButton text={"Submit"} width={150} onClick={handleSubmit} />
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CreateServiceRequestModel;
