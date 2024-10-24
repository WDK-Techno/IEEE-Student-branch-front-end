import HttpInterceptor from "../../service/http-interceptor";

const http = new HttpInterceptor();

export const addAccount = (body, callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}account`;

    try {
        http
            .post(endpoint, body)
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



export const editAccount = (id, body, callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}account/${id}`;

    try {
        http
            .put(endpoint, body)
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


export const getAllAccount = (callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}account`;

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