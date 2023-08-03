import transcription from '../public/img/icons/transcript.svg';
import translation from '../public/img/icons/translation.svg';
import dubbing from '../public/img/icons/dubbing.svg';
import videoedit from '../public/img/icons/video-edit.svg';
import creator from '../public/img/icons/creator.svg';
import permission from '../public/img/icons/permission.svg';

export const LANGUAGES = [
  'English',
  'French',
  'German',
  'Spanish',
  'Swedish',
  'Portuguese',
  'Arabic',
  'Russian',
  'Chinese',
];

export const DASHBOARD_NAVLINKS = [
  {
    text: 'Transcription',
    image: transcription,
    route: '/transcription',
  },
  {
    text: 'Translation',
    image: translation,
    route: '/translation',
  },
  // {
  //   text: 'Dubbing',
  //   image: dubbing,
  //   route: '/dubbing',
  // },
  {
    text: 'Video Edits',
    image: videoedit,
    route: '/video-edits',
  },
  // {
  //   text: 'Permissions',
  //   image: permission,
  //   route: '/permissions',
  // },
  {
    text: 'Creators',
    image: creator,
    route: '/creators',
  },
];


export const DASHBOARD_CREATORS_PLAYLISTS = [
  'None',
  'Videos',
  'Shorts',
]

export const DASHBOARD_CREATORS_VIDEO_LANGUAGE = [
  'Arabic',
  'Hindi',
  'Spanish',
  'French',
  'German',
  'Chinese'
]

export const DASHBOARD_CREATORS_VIDEO_LOCATION = [
  'Africa',
  'Europe',
  'Asia',
]

export const DASHBOARD_CREATORS_VIDEO_CATEGORY = [
  'News',
  'Entertainment',
  'Music',
  'Arts'
]


export const DASHBOARD_FEATURES = [
  {
    name: 'Transcription',
    id: 1,
    placeHolder: 'Click here to Upload and download transcription files',
  },
  {
    name: 'Translation',
    id: 2,
    placeHolder:
      'Click here to Upload and download transcription files. You may need to upload multiple files if it is over 10000 words.',
  },
  {
    name: 'Dubbing',
    id: 3,
    placeHolder:
      'Click here to Upload and download transcription files. You may need to upload multiple files if it is over 10000 words.',
  },
  {
    name: 'Video Edits',
    id: 4,
    placeHolder:
      'Click here to Upload and download transcription files. You may need to upload multiple files if it is over 10000 words.',
  },
];

export const DAHSHBOARD_SERVICES = [
  'Subtitle',
  'Dubs',
  'Shorts',
  'Distribution',
];

export const DAHSHBOARD_TRANSLATED_LANGUAGES = [
  'English',
  'Spanish',
  'Portuguese',
  'French',
  'Hindi',
  'German',
  'Mandarin',
  'Arabic',
  'Others',
];
