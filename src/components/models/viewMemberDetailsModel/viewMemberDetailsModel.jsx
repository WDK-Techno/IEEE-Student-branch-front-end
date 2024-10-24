import React from 'react';
import Modal from 'react-bootstrap/Modal';
import CommonButton from '../../common/commonButton/commonButton';
import Profile from '../../../assets/images/profile.png';

const MemberDetailsModal = ({ onHide, show, memberData }) => {
  if (!memberData) return null;

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
        <Modal.Title className="text-cl-primary" id="contained-modal-title-vcenter">
          Member Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <img
            src={memberData.profileImg || Profile}
            alt="Profile"
            className="rounded-circle mb-3"
            style={{ width: '200px', height: '200px' }}
          />
          <div className="w-100">
          <div className="mb-3">
              <label className="form-label text-dark"><b>First Name:</b></label> {memberData.fname}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark"><b>Last Name:</b></label> {memberData.lname}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark"><b>Email:</b></label> {memberData.email}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark"><b>Contact Number:</b></label> {memberData.contactNo}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark"><b>Entity:</b></label> {memberData.entity}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark"><b>Position:</b></label> {memberData.position}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark"><b>Academic Year:</b></label> {memberData.academicYear}
            </div>
            <div className="mb-3">
              <label className="form-label text-dark"><b>Term Year:</b></label> {memberData.termYear}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end mt-3">
        <div>
        <CommonButton onClick={onHide} close={true} text={"No, cancel"} />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default MemberDetailsModal;









// import React from 'react';
// import Modal from 'react-bootstrap/Modal';
// import CommonButton from '../../common/commonButton/commonButton';
// import Profile from '../../../assets/images/profile.png';

// const MemberDetailsModal = ({ onHide, show, memberData }) => {
//   if (!memberData) return "no data";

//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       animation={true}
//       size="md"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title className="text-cl-primary" id="contained-modal-title-vcenter">
//           Member Details
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="d-flex flex-column align-items-center">
//           <img
//             src={Profile}
//             alt="Profile"
//             className="rounded-circle mb-3"
//             style={{ width: '100px', height: '100px' }}
//           />
//           <div className="w-100">
//             <div className="mb-3">
//               <label className="form-label text-dark"><b>First Name:</b></label> {memberData.fname}
//             </div>
//             <div className="mb-3">
//               <label className="form-label text-dark"><b>Last Name:</b></label> {memberData.lname}
//             </div>
//             <div className="mb-3">
//               <label className="form-label text-dark"><b>Email:</b></label> {memberData.email}
//             </div>
//             <div className="mb-3">
//               <label className="form-label text-dark"><b>Contact Number:</b></label> {memberData.contactNo}
//             </div>
//             <div className="mb-3">
//               <label className="form-label text-dark"><b>Entity:</b></label> {memberData.entity}
//             </div>
//             <div className="mb-3">
//               <label className="form-label text-dark"><b>Position:</b></label> {memberData.position}
//             </div>
//             <div className="mb-3">
//               <label className="form-label text-dark"><b>Academic Year:</b></label> {memberData.academicYear}
//             </div>
//             <div className="mb-3">
//               <label className="form-label text-dark"><b>Term Year:</b></label> {memberData.termYear}
//             </div>
//           </div>
//         </div>
//       </Modal.Body>
//       <Modal.Footer className="d-flex justify-content-end mt-3">
//         <div>
//           <CommonButton onClick={onHide} close={true} text={"No, cancel"} />
//         </div>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default MemberDetailsModal;
