import Axios from './axios';

const GetService = async ({ route, params, }) => {
  return await Axios.get(route, { params });
};

// const PostService = async ({ route, params, data }) => {
//   const response = await Axios.post(route, data, { params });
//   return response;
// }

const PostService = async ({ route, data, params, onUploadProgress }) => {
  const config = { ...params, ...(onUploadProgress && { onUploadProgress }) };
  const response = await Axios.post(route, data, config);
  return response;
};

const DeleteService = async ({ route, data, params }) => {
  const response = await Axios.delete(route, { params, data });
  return response;
};


const PutService = async ({ route, params, data, onUploadProgress }) => {
  const config = { ...params, ...(onUploadProgress && { onUploadProgress }) };
  const response = await Axios.put(route, data, config);
  return response;
};


export { PostService, DeleteService, GetService, PutService };

