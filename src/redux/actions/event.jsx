import HttpInterceptor from "../../service/http-interceptor";


const http = new HttpInterceptor();

export const getAllEvents = (callback) => {
  const endpoint = `${import.meta.env.VITE_API_HOST}event`;

  try {
    http
      .get(endpoint)
      .then((response) => {
        callback(response);
      })
      .catch((error) => {
        callback(error.response);
      });
  } catch (error) {
    callback(error.response);
  }
};

export const getEventsByProject = (eventId,callback) => {
  const endpoint = `${import.meta.env.VITE_API_HOST}event/${eventId}`;

  try {
      http
          .get(endpoint)
          .then((response) => {
              callback(response);
          })
          .catch((error) => {
              callback(error.response);
          });
  } catch (error) {
      callback(error.response);
  }
};

// export const updatEvent = (projectId, eventId, body, callback) => {
//   const endpoint = `${import.meta.env.VITE_API_HOST}event/${projectId}/${eventId}`;

//   try {
//     http
//       .put(endpoint, body)
//       .then((response) => {
//         callback(response);
//       })
//       .catch((error) => {
//         callback(error.response);
//       });
//   } catch (error) {
//     callback(error.response);
//   }
// };

export const updatEvent = (projectId, eventId, body, callback) => {
  return async (dispatch) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}event/${projectId}/${eventId}`;

    try {
      const response = await http.put(endpoint, body);
      callback(response);
    } catch (error) {
      callback(error.response);
    }
  };
};

export const createEvent = (projectId, body, callback) => {
  return async (dispatch) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}event/${projectId}`;
    console.log("endpoint", endpoint)
    console.log("body:", body)

    try {
      const response = await http.post(endpoint, body);
      callback(response);
    } catch (error) {
      callback(error.response);
    }
  };
};
