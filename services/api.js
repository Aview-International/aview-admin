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
    let token = Cookies.get('token');
    if (!isTokenExpired(token)) {
      const newToken = await auth.currentUser.getIdToken(true); // force token refresh
      Cookies.set('token', newToken);
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

export const getReviewerMessages = async () =>
  (await axiosInstance.get('/admin/get-all-translator-inquiries')).data;

export const markReviewerConcernAsCompleted = async (id) =>
  (await axiosInstance.put(`/admin/resolve-translator-inquiry/${id}`)).data;

export const getAllCreators = async () =>
  (await axiosInstance.get('/admin/creators')).data;

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

export const getSupportedLanguages = async () =>
  (await axiosInstance.get('admin/supported-languages')).data;

export const uploadManualSrtTranslation = async (srt, langugageCode) => {
  let formData = new FormData();
  formData.append('srt', srt);
  formData.append('langugageCode', langugageCode);
  const res = axiosInstance.post('admin/manual-translation', formData, {
    responseType: 'blob',
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res;
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
  jobId,
  translatedLanguage
) => {
  let url = `transcription/rerun/${stage}?`;
  url += `s3Path=dubbing-tasks/${creatorId}/${jobId}&`;
  url += `translatedLanguage=${translatedLanguage}&`;
  await axiosInstance.get(url);
};

export const approveReviewerAccount = async (uid) =>
  (await axiosInstance.patch('admin/verify-translator-account/' + uid)).data;

export const getRegionCategory = async (language) => {
  const response = await axiosInstance.post('admin/youtube-categories', {
    language,
  });

  const categories = response.data
    .map((category) => {
      if (category.snippet.assignable)
        return {
          name: category.snippet.title,
          id: category.id,
        };
      else return;
    })
    .filter((item) => item !== undefined);

  return categories;
};

export const getYoutubePlaylistData = async (videoId) => {
  const response = await axiosInstance.post('admin/get-youtube-playlist', {
    videoId,
  });

  const playlists = response.data.items.map((playlist) => ({
    name: playlist.snippet.title,
    id: playlist.id,
  }));

  return playlists;
};

export const getYoutubeVideoData = async (videoId) => {
  const res = await axiosInstance.post('admin/get-youtube-data', {
    videoId,
  });
  return res.data;
};

export const postToYouTube = async (
  filePath,
  creatorId,
  date,
  youtubePayload
) => {
  const response = await axiosInstance.post('admin/post-to-youtube', {
    filePath,
    creatorId,
    date,
    youtubePayload,
  });

  console.log(response);
};

export const translateText = async (text, target_lang) => {
  const response = await axiosInstance.post('admin/translate-text', {
    text,
    target_lang,
  });
  return response.data;
};

export const getS3DownloadLink = async ({ userId, timestamp, lang }) =>
  (await axiosInstance.get(`admin/download/${userId}/${timestamp}/${lang}`))
    .data;

export const downloadS3Object = async (s3Path) => {
  await axiosInstance.post('admin/download-object', {
    s3Path,
  });
};

export const deleteJob = async (creatorId, jobId) =>
  (await axiosInstance.delete(`admin/job/${creatorId}/${jobId}`)).data;

export const getAllAdminJobs = async () =>
  (await axiosInstance.get('admin/get-all-admin-jobs')).data;

export const getSingleVideoData = async (videoId) =>
  (await axiosInstance.get('admin/get-single-video-data/' + videoId)).data;
