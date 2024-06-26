import axios from 'axios';
import { baseUrl } from './baseUrl';
import FormData from 'form-data';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = Cookies.get('session');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signInWithGoogleAcc = async (token) =>
  (await axiosInstance.post(baseUrl + 'auth/login', { token })).data;

export const downloadS3Object = async (s3Path) => {
  await axiosInstance.post(baseUrl + 'admin/download-object', {
    s3Path,
  });
};

export const getRawSRT = async (s3Path) => {
  const response = await axiosInstance.post(baseUrl + 'admin/get-raw-srt', {
    s3Path,
  });

  return response.data;
};

export const approveSrt = async (
  jobId,
  date,
  objectKey,
  creatorId,
  language
) => {
  return axiosInstance.post(baseUrl + 'admin/approve-srt', {
    jobId,
    date,
    creatorId,
    objectKey,
    language,
  });
};

export const approveTranslation = async (
  jobId,
  objectKey,
  date,
  translatedLanguageKey,
  creatorId
) => {
  return axiosInstance.post(baseUrl + 'dubbing/dub-srt', {
    jobId,
    objectKey,
    date,
    translatedLanguageKey,
    creatorId,
  });
};

export const getYoutubeVideoData = async (videoId) => {
  const res = await axiosInstance.post(baseUrl + 'admin/get-youtube-data', {
    videoId,
  });
  return res.data;
};

export const getYoutubePlaylistData = async (videoId) => {
  const response = await axiosInstance.post(
    baseUrl + 'admin/get-youtube-playlist',
    {
      videoId,
    }
  );

  const playlists = response.data.items.map((playlist) => ({
    name: playlist.snippet.title,
    id: playlist.id,
  }));

  return playlists;
};

export const getSupportedLanguages = async () => {
  const response = await axiosInstance.get(
    baseUrl + 'admin/supported-languages'
  );
  return response.data;
};

export const getCountriesAndCodes = async () => {
  const response = await axiosInstance.get(
    baseUrl + 'admin/countries-and-codes'
  );

  return response.data;
};

export const getRegionCategory = async (language) => {
  const response = await axiosInstance.post(
    baseUrl + 'admin/youtube-categories',
    {
      language,
    }
  );

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
  const response = await axiosInstance.post(baseUrl + 'admin/translate-text', {
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
  const response = await axiosInstance.post(baseUrl + 'admin/post-to-youtube', {
    filePath,
    creatorId,
    date,
    youtubePayload,
  });

  console.log(response);
};

export const transcribeSocialLink = async (body) =>
  await axiosInstance.post('transcription/social', body);

export const finishPendingJob = async (translatorId, jobId) => {
  await axiosInstance.post('admin/finish-pending-job', {
    translatorId,
    jobId,
  });
};

export const createTranslator = async (
  name,
  email,
  nativeLanguage,
  country,
  paymentMethod,
  paymentDetails
) => {
  return axiosInstance.post(baseUrl + 'admin/create-translator', {
    name,
    email,
    nativeLanguage,
    country,
    paymentMethod,
    paymentDetails,
  });
};

export const updateTranslator = async (
  name,
  email,
  nativeLanguage,
  country,
  paymentMethod,
  paymentDetails,
  translatorId
) => {
  return axiosInstance.post(baseUrl + 'admin/update-translator', {
    translatorData: {
      name,
      email,
      nativeLanguage,
      country,
      paymentMethod,
      paymentDetails,
    },
    translatorId,
  });
};

export const sendSupportMessage = async (email, message) => {
  return axiosInstance.post(baseUrl + 'admin/create-translator-inquiry', {
    email,
    message,
  });
};

export const getTranslatorById = async (translatorId) => {
  return axiosInstance.post(baseUrl + 'admin/get-translator-by-id', {
    translatorId,
  });
};

export const finishModerationJob = async (jobId, translatorId, updatedSrt) => {
  return axiosInstance.post(baseUrl + 'admin/finish-moderation-job', {
    jobId,
    translatorId,
    updatedSrt,
  });
};

export const getS3DownloadLink = async ({ userId, timestamp, lang }) =>
  (
    await axiosInstance.get(
      `admin/admin-download/${userId}/${timestamp}/${lang}`
    )
  ).data;

export const getDownloadLink = async (s3Path) => {
  const response = axiosInstance.post(baseUrl + 'admin/download-object', {
    s3Path,
  });

  return response;
};

export const getAllJobs = async (translatorId) => {
  return axiosInstance.post('admin/get-all-jobs', { translatorId });
};

export const finishOverlayJob = async (
  translatorId,
  jobId,
  operationsArray
) => {
  return axiosInstance.post(baseUrl + 'admin/finish-overlay-job', {
    translatorId,
    jobId,
    operationsArray,
  });
};

export const verifyTranslatorEmail = async () => {
  await axiosInstance.get('admin/verify-translator');
};

export const attachUserIdToTranslator = async (email, userId) => {
  await axiosInstance.post('admin/attach-userid-to-translator', {
    email,
    userId,
  });
};

export const getTranslatorFromUserId = async (userId) => {
  return axiosInstance.post('admin/get-translator-from-userid', { userId });
};

export const getAllPendingJobs = async (translatorId) => {
  return axiosInstance.post('admin/get-pending-jobs', { translatorId });
};

export const getAllModerationJobs = async (translatorId) => {
  return axiosInstance.post('admin/get-moderation-jobs', { translatorId });
};

export const getAllOverlayJobs = async (translatorId) => {
  return axiosInstance.post('admin/get-overlay-jobs', { translatorId });
};

export const acceptJob = async (translatorId, jobId, jobType) => {
  return axiosInstance.post('admin/accept-job', {
    translatorId,
    jobId,
    jobType,
  });
};

export const getJobAndVerify = async (translatorId, jobId) => {
  return axiosInstance.post('admin/get-job-and-verify', {
    translatorId,
    jobId,
  });
};

export const getTranslatorLeaderboards = async () => {
  return axiosInstance.post('admin/get-translator-leaderboards');
};

export const singleSignOnLogin = async (email, origin) =>
  await axiosInstance.post(baseUrl + 'email/login', { email, origin });

export const uploadReviewerProfilePicture = async (translatorId, picture) => {
  const formData = new FormData();
  formData.append('translatorId', translatorId);
  formData.append('picture', picture);

  return axiosInstance.post('admin/upload-reviewer-profile-picture', formData);
};

export const addTime = async (translatorId, jobId, jobType) => {
  return axiosInstance.post('admin/add-time', { translatorId, jobId, jobType });
};

export const flagJob = async (translatorId, jobId, message, jobType) => {
  return axiosInstance.post('admin/flag-job', {
    translatorId,
    jobId,
    message,
    jobType,
  });
};

export const clearOverdueJobFromTimer = async (
  translatorId,
  jobId,
  jobType
) => {
  return axiosInstance.post('admin/clear-overdue-job-from-timer', {
    translatorId,
    jobId,
    jobType,
  });
};

export const getCreatorProfile = async (userId) => {
  return axiosInstance.post('admin/get-creator-profile', { userId });
};
