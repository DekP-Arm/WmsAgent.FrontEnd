import axios from 'axios';

const BASE_URL = process.env.BASE_API

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      //can add other headers like authorization token here
    },
  });

  const _get = (url : string, config = {}) => {
    return apiClient.get(url, config);
  };
  
  const _delete = (url : string, config = {}) => {
    return apiClient.delete(url, config);
  };
  
  const _put = (url : string, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  };
  
  const _post = (url : string, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  };
