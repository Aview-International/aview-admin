import axios from 'axios';
import { baseUrl } from './baseUrl';

export const getSenders = async () => {
  const response = await axios.get(baseUrl + 'messages/senders');
  return response.data;
};

export const getUserMessages = async (id) => {
  const response = await axios.get(baseUrl + 'messages/convo?userId=' + id);
  return response.data;
};

export const getUserProfile = async (id) => {
  const response = await axios.get(baseUrl + 'auth/user?userId=' + id);
  return response.data;
};
