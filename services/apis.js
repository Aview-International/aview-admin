import axios from 'axios';
import FormData from 'form-data';
import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';
import { auth } from './firebase';

// Create an Axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
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
    let token = Cookies.get('session');
    if (isTokenExpired(token) === true || !isTokenExpired(token)) {
      const newToken = await auth.currentUser?.getIdToken(true); // force token refresh
      Cookies.set('session', newToken, { sameSite: 'Strict' });
      token = newToken;
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const downloadS3Object = async (s3Path) => {
  await axiosInstance.post('admin/download-object', {
    s3Path,
  });
};

export const approveTranslation = async (
  jobId,
  objectKey,
  date,
  translatedLanguageKey,
  creatorId
) => {
  return axiosInstance.post('dubbing/dub-srt', {
    jobId,
    objectKey,
    date,
    translatedLanguageKey,
    creatorId,
  });
};

export const getYoutubeVideoData = async (videoId) => {
  const res = await axiosInstance.post('admin/get-youtube-data', {
    videoId,
  });
  return res.data;
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

export const getSupportedLanguages = async () =>
  (await axiosInstance.get('admin/supported-languages')).data;

export const getCountriesAndCodes = async () =>
  (await axiosInstance.get('admin/countries-and-codes')).data;

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

export const translateText = async (text, target_lang) => {
  const response = await axiosInstance.post('admin/translate-text', {
    text,
    target_lang,
  });
  return response.data;
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

export const approveVideoReview = async (jobId) => {
  await axiosInstance.get('admin/approve-video/' + jobId);
};

export const createTranslator = async (
  name,
  email,
  nativeLanguage,
  country,
  paymentMethod,
  paymentDetails
) => {
  return axiosInstance.post('admin/create-translator', {
    name,
    email,
    nativeLanguage,
    country,
    paymentMethod,
    paymentDetails,
  });
};

export const sendSupportMessage = async (email, message) => {
  return axiosInstance.post('admin/create-translator-inquiry', {
    email,
    message,
  });
};

export const finishModerationJob = async (jobId, updatedSrt) => {
  return axiosInstance.post('admin/finish-moderation-job', {
    jobId,
    updatedSrt,
  });
};

export const getS3DownloadLink = async ({ userId, timestamp, lang }) =>
  (await axiosInstance.get(`admin/download/${userId}/${timestamp}/${lang}`))
    .data;

export const getDownloadLink = async (s3Path) => {
  const response = axiosInstance.post('admin/download-object', {
    s3Path,
  });

  return response;
};

export const getAllJobs = async () =>
  (await axiosInstance.get('admin/get-all-jobs')).data;

export const getActiveJobs = async () =>
  (await axiosInstance.get('admin/active-jobs')).data;

export const finishOverlayJob = async (jobId, operationsArray) => {
  return axiosInstance.post('admin/finish-overlay-job', {
    jobId,
    operationsArray,
  });
};

export const verifyTranslatorEmail = async () => {
  await axiosInstance.get('admin/verify-translator');
};

export const getTranslatorFromUserId = async () =>
  (await axiosInstance.get('admin/translator')).data;

export const acceptJob = async (jobId, jobType) => {
  return axiosInstance.post('admin/accept-job', {
    jobId,
    jobType,
  });
};

export const getJobAndVerify = async (jobType, jobId) =>
  (await axiosInstance.get(`admin/verify-job/${jobType}/${jobId}`)).data;

export const getTranslatorLeaderboards = async () => {
  return axiosInstance.post('admin/get-translator-leaderboards');
};

export const singleSignOnLogin = async (email, origin) =>
  await axiosInstance.post('email/login', { email, origin });

export const uploadReviewerProfilePicture = async (translatorId, picture) => {
  const formData = new FormData();
  formData.append('translatorId', translatorId);
  formData.append('picture', picture);

  return axiosInstance.post('admin/upload-reviewer-profile-picture', formData);
};

export const addTime = async (jobId, jobType) => {
  return axiosInstance.post('admin/add-time', { jobId, jobType });
};

export const flagJob = async (jobId, message, jobType) => {
  return axiosInstance.post('admin/flag-job', {
    jobId,
    message,
    jobType,
  });
};

export const clearOverdueJobFromTimer = async (jobId, jobType) => {
  return axiosInstance.post('admin/clear-overdue-job-from-timer', {
    jobId,
    jobType,
  });
};

export const getCreatorProfile = async (userId) => {
  return axiosInstance.post('admin/get-creator-profile', { userId });
};
