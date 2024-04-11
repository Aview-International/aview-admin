import axios from 'axios';
import { baseUrl } from './baseUrl';
import FormData from 'form-data';
import Cookies from 'js-cookie';

// Create an Axios instance with default config
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: 'Bearer ' + Cookies.get('token'),
  },
});

export const getSenders = async () => {
  const response = await axiosInstance.get(baseUrl + 'messages/senders');
  return response.data;
};

export const getUserMessages = async (id) => {
  const response = await axiosInstance.get(
    baseUrl + 'messages/convo?userId=' + id
  );
  return response.data;
};

export const getUserProfile = async (id) => {
  const response = await axiosInstance.get(baseUrl + 'auth/user?userId=' + id);
  return response.data;
};

export const getReviewerMessages = async () =>
  (await axiosInstance.get('/admin/get-all-translator-inquiries')).data;

export const markReviewerConcernAsCompleted = async (id) =>
  (await axiosInstance.put(`/admin/resolve-translator-inquiry/${id}`)).data;

export const getAllAdmins = async () =>
  (await axiosInstance.get('/admin/all-reviewers')).data;

export const uploadManualTranscription = async (file, setProgress) => {
  let formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance({
    method: 'POST',
    url: baseUrl + 'transcription/manual-transcription',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress: (progressEvent) =>
      setProgress(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      ),
  });
  return response.data;
};

export const manualSeparation = async (file, setProgress) => {
  let formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance({
    method: 'POST',
    url: baseUrl + 'dubbing/manual/separation',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress: (progressEvent) =>
      setProgress(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      ),
  });
  return response.data;
};
