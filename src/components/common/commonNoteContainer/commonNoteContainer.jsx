import React from "react";
import enter from "../../../assets/icons/note.png";
import deleted from "../../../assets/icons/delete.png";
import defaultUser from "../../../assets/images/default-user.png";
import { deleteCommentById } from "../../../redux/actions/comment";

const CommonNoteContainer = ({ noteData, refreshCommentLoader }) => {
  function handleDeleteComment() {
    deleteCommentById(noteData.commentID, (res) => {
      if (res?.status == 200) {
        refreshCommentLoader();
      }
    });
  }

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
    <div className="bg-white w-100 d-flex flex-column common-shadow rounded-3 p-3 w-100">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <div className="d-flex justify-content-center">
            <div>
              <img src={enter} width={15} className="text-center" />
            </div>
          </div>
          <div className="">
            <p className="m-0 text-secondary">
              {formatDateTime(noteData?.created_at)}
            </p>
          </div>
        </div>
        <button
          className="bg-transparent border-0"
          onClick={handleDeleteComment}
        >
          <img src={deleted} width={25} />
        </button>
      </div>
      <div className="mt-2">
        <p style={{ color: "#4F4F4F" }}>{noteData?.comment}</p>
      </div>
      <div className=" d-flex justify-content-end align-items-center gap-2">
        <div>
          <p className="m-0" style={{ fontSize: 11, color: "#999999" }}>
            {noteData?.user?.firstName} {noteData?.user?.lastName}
          </p>
        </div>
        <div className="">
          <img
            src={noteData?.user?.profilePic || defaultUser}
            height={25}
            width={25}
            style={{ borderRadius: 90 }}
          />
        </div>
      </div>
    </div>
  );
};

export default CommonNoteContainer;
