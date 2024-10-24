// import AWS from 'aws-sdk';

// export const UPLOAD_IMAGE_REQUEST = 'UPLOAD_IMAGE_REQUEST';
// export const UPLOAD_IMAGE_SUCCESS = 'UPLOAD_IMAGE_SUCCESS';
// export const UPLOAD_IMAGE_FAILURE = 'UPLOAD_IMAGE_FAILURE';

// export const uploadImageRequest = () => ({
//   type: UPLOAD_IMAGE_REQUEST,
// });

// export const uploadImageSuccess = (imageUrl) => ({
//   type: UPLOAD_IMAGE_SUCCESS,
//   payload: imageUrl,
// });

// export const uploadImageFailure = (error) => ({
//   type: UPLOAD_IMAGE_FAILURE,
//   payload: error,
// });

// export const uploadImage = (file) => async (dispatch) => {
//   if (!file) return false;


//   AWS.config.update({
//     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//     region: import.meta.env.VITE_AWS_REGION,
//   });

//   const s3 = new AWS.S3();
//   const params = {
//     Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
//     Key: `${Date.now()}_${file.name}`,
//     Body: file,
//     ContentType: file.type,
//   };

//   try {
//     const data = await s3.upload(params).promise();
//     return data.Location;
//   } catch (error) {
//     return false;
//   }
// };



import { Cloudinary } from "cloudinary-core";



export const UPLOAD_IMAGE_REQUEST = "UPLOAD_IMAGE_REQUEST";
export const UPLOAD_IMAGE_SUCCESS = "UPLOAD_IMAGE_SUCCESS";
export const UPLOAD_IMAGE_FAILURE = "UPLOAD_IMAGE_FAILURE";


export const uploadImageRequest = () => ({
  type: UPLOAD_IMAGE_REQUEST,
});

export const uploadImageSuccess = (imageUrl) => ({
  type: UPLOAD_IMAGE_SUCCESS,
  payload: imageUrl,
});

export const uploadImageFailure = (error) => ({
  type: UPLOAD_IMAGE_FAILURE,
  payload: error,
});

export const uploadImage = (file) => async (dispatch) => {
  if (!file) return false;

  dispatch(uploadImageRequest());

  try {
    const cloudinary = new Cloudinary({ cloud_name: "dfjr7mu1f" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ieee_project");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dfjr7mu1f/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      dispatch(uploadImageSuccess(data.secure_url));
      return data.secure_url;
    } else {
      const error = "Upload failed.";
      dispatch(uploadImageFailure(error));
      return false;
    }
  } catch (error) {
    dispatch(uploadImageFailure(error.message));
    return false;
  }
};

