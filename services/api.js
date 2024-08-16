import axios from 'axios';
import FormData from 'form-data';
import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';
import { auth } from './firebase';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Create an Axios instance with default config
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

const isTokenExpired = (token) => {
  try {
    if (!token) return false;
    else {
      const data = decodeJwt(token);
      if (!data) return false;
      const newDate = new Date(data.exp) * 1000;
      if (newDate < new Date().getTime()) return true;
      else {
        return data;
      }
    }
  } catch (error) {
    return false;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (!user) return config;
    let token = user.stsTokenManager.accessToken;
    if (isTokenExpired(token) === true || !isTokenExpired(token)) {
      const newToken = await auth.currentUser.getIdToken(true); // force token refresh
      Cookies.set('session', newToken);
      token = newToken;
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getSenders = async () => {
  const response = await axiosInstance.get(baseUrl + 'messages/senders');
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
      ...axiosInstance.defaults.headers.common, // spread the existing headers
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

export const completeSeparation = async (timestamp) =>
  axiosInstance.delete(`dubbing/manual/separation/${timestamp}`);

export const uploadCreatorVideo = async (
  video,
  languages,
  additionalNote,
  setUploadProgress
) => {
  let formData = new FormData();
  formData.append('video', video);
  formData.append('additionalNote', additionalNote);
  for (const lang of languages) formData.append('languages', lang);

  await axiosInstance.post('transcription/upload-admin-video', formData, {
    onUploadProgress: (progressEvent) =>
      setUploadProgress(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      ),
  });
  return;
};

export const getSupportedLanguages = async () => {
  const response = await axiosInstance.get(
    baseUrl + 'admin/supported-languages'
  );
  return response.data;
};

export const uploadManualSrtTranslation = async (
  srt,
  langugageCode,
  languageName
) => {
  let formData = new FormData();
  formData.append('srt', srt);
  formData.append('langugageCode', langugageCode);
  formData.append('languageName', languageName);
  const response = await axiosInstance({
    method: 'POST',
    url: baseUrl + 'admin/manual-translation',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
  return response.data;
};

export const uploadManualSrtDubbing = async ({ srt, voiceId, multiVoice }) => {
  let formData = new FormData();
  formData.append('srt', srt);
  if (multiVoice) {
    formData.append('multipleVoices', multiVoice);
  } else {
    formData.append('voiceId', voiceId);
  }
  const response = await axiosInstance({
    method: 'POST',
    url: baseUrl + 'admin/manual-dubbing',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
  return response.data;
};

export const getElevenLabsVoices = async () =>
  (await axiosInstance.get('dubbing/get-voices')).data;

export const submitAdminTranscriptionLink = async (data) =>
  (await axiosInstance.post('/transcription/admin-social-link', data)).data;

export const downloadVideoFromS3 = async (timestamp, title, lang) =>
  (
    await axiosInstance.post(`admin/download`, {
      timestamp,
      title,
      language: lang,
      admin: true,
    })
  ).data;

export const sendEnquiryMessage = async (message, id) =>
  axiosInstance.post(`messages/admin/${id}`, { message });

export const markTicketAsResolved = async (id) =>
  await axiosInstance.patch('/messages/support/' + id);

export const rerunStuckJobs = async (
  stage,
  creatorId,
  timestamp,
  translatedLanguage
) => {
  let url = `transcription/rerun/${stage}?`;
  url += `s3Path=dubbing-tasks/${creatorId}/${timestamp}&`;
  url += `translatedLanguage=${translatedLanguage}&`;
  await axiosInstance.get(url);
};
