import axios from 'axios';
import { baseUrl } from './baseUrl';

// Create an Axios instance with default config
const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
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

export const signInWithGoogleAcc = async (token) =>
  await axiosInstance.post(baseUrl + 'auth/login', { token });
