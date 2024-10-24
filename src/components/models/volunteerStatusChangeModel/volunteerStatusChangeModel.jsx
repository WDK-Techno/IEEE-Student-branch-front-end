import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import CommonButton from "../../common/commonButton/commonButton";
import { editServiceRequestStatus } from "../../../redux/actions/service";

const VolunteerStatusChangeModel = ({ onHide, show, requestData, refresh }) => {
  const [serviceId, setServiceId] = useState(null);
  const [requestStatus, setReqestStatus] = useState(null);
  const [reqData, setReqData] = useState(null);

  useEffect(() => {
    // console.log(requestData, "sadsassddd");
    setServiceId(requestData?.item?.serviceId);
    setReqestStatus(requestData?.item?.status);
    setReqData(requestData?.item);
  }, [show]);

  const handleStatusChange = (e) => {
    setReqestStatus(e.target.value);
  };
  const handleSubmit = () => {
    if (serviceId != null && requestStatus == "REVIEWED") {
      editServiceRequestStatus(serviceId, (res) => {
        if (res?.status == 200) {
          setServiceId(null);
          onHide();
          refresh();
        }
      });
    }
  };
  function formatDateTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Formatting options for date and time
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

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
            Edit Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <div className="mt-3">
              <label
                for="exampleFormControlInput1"
                className="form-label text-dark"
              >
                Select Status
              </label>
              <select
                className="form-select w-100"
                aria-label="Large select example"
                id="status"
                name="status"
                value={requestStatus}
                onChange={handleStatusChange}
              >
                <option selected hidden>
                  Select status
                </option>
                <option value="TODO" hidden>
                  ToDo
                </option>
                <option value="REVIEWED">Reviewed</option>
              </select>
            </div>
            {reqData?.status == "REVIEWED" ? (
              <div className="d-flex flex-column mt-4 text-cl-primary ">
                <div className="fw-light">Reviewd By :</div>
                <div className="ms-3 fw-bolder">
                  {reqData?.reviewed_by?.firstName}{" "}
                  {reqData?.reviewed_by?.lastName}
                  {""} <br />
                  {formatDateTime(reqData?.reviewed_date)}
                </div>
              </div>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          <div>
            <CommonButton onClick={onHide} close={true} text={"Close"} />
          </div>
          <div>
            <CommonButton onClick={handleSubmit} text={"Save"} />
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VolunteerStatusChangeModel;
