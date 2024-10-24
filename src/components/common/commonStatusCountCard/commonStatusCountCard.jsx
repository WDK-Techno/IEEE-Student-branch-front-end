import React, { useEffect, useState } from "react";
import completeCount from "../../../assets/images/completeCount.png";
import onGoingCount from "../../../assets/images/onGoing.png";
import toDoCount from "../../../assets/images/toDo.png";

const CommonStatusCountCard = ({ type, count, withoutImage }) => {
  const [data, setData] = useState({ color: "", text: "", image: "" });

  useEffect(() => {
    setData(getStatus(type));
  }, [type]);

  function getStatus() {
    switch (type) {
      case "COMPLETE":
        return { color: "#229954", text: "Completed", image: completeCount };
      case "TODO":
        return { color: "#5F6A6A", text: "To Do", image: toDoCount };
      case "ONGOING":
        return { color: "#00629B", text: "Ongoing", image: onGoingCount };
      default:
        break;
    }
  }
  if (withoutImage) {
    return (
      <div style={{width:250}} className="d-flex justify-content-between align-items-center px-3 gap-2 bg-white rounded-4 common-shadow common-transition">
        <div className="">
          <h4 className="fw-bold m-0" style={{ color: data.color }}>
            {data.text}
          </h4>
        </div>

        <div
          className="bg-body-secondary my-2 rounded-4 d-flex justify-content-center align-items-center"
          style={{
            width: 70,
            height:40,
            borderRadius:20,
          }}
        >
          <h2 className="m-0 fw-bolder" >{count}</h2>
        </div>
      </div>
    );
  } else {
    return (
      <div className="d-flex p-3 flex-column gap-2 bg-white rounded-4 common-shadow common-transition">
        <div>
          <h4 className="fw-bold" style={{ color: data.color }}>
            {data.text}
          </h4>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <img src={data.image} width={85} />
          </div>
          <div
            className="bg-body-secondary p-3 rounded-circle d-flex justify-content-center align-items-center"
            style={{
              maxWidth: 180,
              width: "100%",
              aspectRatio: 1 / 1,
              margin: "auto",
            }}
          >
            <h2 className="m-0 fw-bolder">{count}</h2>
          </div>
        </div>
      </div>
    );
  }
};

export default CommonStatusCountCard;
