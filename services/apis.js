import axios from 'axios';
import { baseUrl } from './baseUrl';
import FormData from 'form-data';

// Create an Axios instance without default headers
const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

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

export const downloadYoutubeVideo = async (id) => {
  const filename = id + '.mp4';
  const response = await axiosInstance.post(
    baseUrl + 'admin/download-youtube-video',
    { id },
    { responseType: 'blob' }
  );

  const blob = new Blob([response.data]);

  // create anchor element
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  downloadLink.click();
  // cleanup
  URL.revokeObjectURL(downloadLink.href);
};

export const uploadFinalVideo = async (
  file,
  jobId,
  objectKey,
  date,
  creatorId,
  dubbedAudioKey
) => {
  let formData = new FormData();
  formData.append('file', file);
  formData.append('creatorId', creatorId);
  formData.append('jobId', jobId);
  formData.append('date', date);
  formData.append('objectKey', objectKey);
  formData.append('dubbedAudioKey', dubbedAudioKey);
  await axiosInstance.post(baseUrl + 'admin/upload-final-video', formData, {
    'Content-Type': 'multipart/form-data',
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

export const uploadManualVideoTranscription = async (video, setProgress) => {
  let formData = new FormData();
  formData.append('video', video);
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
  (await axiosInstance.get('dubbing/get-elevenlabs-voices')).data;

export const transcribeSocialLink = async (body) =>
  await axiosInstance.post('transcription/social', body);

export const completeJob = async (creatorId, timestamp) => {
  await axiosInstance.post('admin/complete-job', {
    creatorId,
    timestamp,
  });
};

export const createTranslator = async (
  name,
  email,
  nativeLanguage,
  country,
  paymentMethod,
  paymentDetails,
  editor,
) => {
  return axiosInstance.post(baseUrl + 'admin/create-translator', {
    name,
    email,
    nativeLanguage,
    country,
    paymentMethod,
    paymentDetails,
    editor,
  });
};

export const sendSupportMessage = async (email, message) => {
  return axiosInstance.post(baseUrl + 'admin/create-translator-inquiry', {
    email,
    message,
  });
};

export const getTranslatorById = async (id) => {
  return axiosInstance.post(baseUrl + 'admin/get-translator-by-id', {
    id,
  });
};

export const createTranslatorProgress = async (
  jobId,
  creatorId,
  lang,
  translatorId,
  progress,
  startTimestamp,
  endTimestamp
) => {
  return axiosInstance.post(baseUrl + 'admin/create-translator-progress', {
    jobId,
    creatorId,
    lang,
    translatorId,
    progress,
    startTimestamp,
    endTimestamp,
  });
};

export const updateTranslatorProgress = async (jobId, progress) => {
  return axiosInstance.post(baseUrl + 'admin/update-translator-progress', {
    jobId,
    progress,
  });
};

export const finishTranslation = async (jobId) => {
  return axiosInstance.post(baseUrl + 'admin/finish-translation', {
    jobId,
  });
};

export const getTranslatorProgress = async (jobId) => {
  return axiosInstance.post(baseUrl + 'admin/get-translator-progress', {
    jobId,
  });
};
