// dashboard sidebar icons
import home from '../public/img/icons/home.svg';

//onBoardingLanguages Icons
import English from '../public/img/icons/english.svg';
import Spanish from '../public/img/icons/spanish.svg';
import Spanish2 from '../public/img/icons/spanish-2.svg';
import French from '../public/img/icons/french.svg';
import Portuguese from '../public/img/icons/portuguese.svg';
import Arabic from '../public/img/icons/arabic.svg';
import Hindi from '../public/img/icons/hindi.svg';
import Chinese from '../public/img/icons/chinese.svg';
import Russian from '../public/img/icons/russian.svg';
import Japanese from '../public/img/icons/japanese.svg';
import German from '../public/img/icons/german.svg';
import Italian from '../public/img/icons/italian.svg';
import Turkish from '../public/img/icons/turkish.svg';
import Filipino from '../public/img/icons/filipino.svg';
import Indonesian from '../public/img/icons/indonesian.svg';
import Korean from '../public/img/icons/korean.svg';
import Canada from '../public/img/icons/canada.svg';
import Portugal from '../public/img/icons/portugal.svg';
import Uk from '../public/img/icons/uk.svg';

// continents from
import asia from '../public/img/graphics/asia.svg';
import europe from '../public/img/graphics/europe.svg';
import north_america from '../public/img/graphics/north_america.svg';
import south_america from '../public/img/graphics/south_america.svg';

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
    text: 'Dashboard',
    image: home,
    route: '/dashboard',
  },
  {
    text: 'Upload',
    image: home,
    route: '/upload',
  },
  {
    text: 'Admins',
    image: home,
    route: '/admin-accounts',
  },
  {
    text: 'Creators',
    image: home,
    route: '/creator-accounts',
  },
  {
    text: 'Q/A Inquiries',
    image: home,
    route: '/inquiries',
  },
  {
    text: 'Messages',
    image: home,
    route: '/messages',
  },
  {
    text: 'History',
    image: home,
    route: '/history',
  },
  {
    text: 'Playground',
    image: home,
    route: '/playground',
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

export const SUPPORTED_REGIONS = [
  {
    title: 'North America',
    image: north_america,
    data: [
      {
        image: English,
        languageName: 'English (US)',
        localDialect: 'English (US)',
        id: 'English',
      },
      {
        image: Spanish2,
        languageName: 'Spanish (LATAM)',
        localDialect: 'Español (LATAM)',
      },
      {
        image: Canada,
        languageName: 'French (QB)',
        localDialect: 'Français (QB)',
        id: 'Français',
      },
    ],
  },
  {
    title: 'South America',
    image: south_america,
    data: [
      {
        image: Spanish2,
        languageName: 'Spanish (LATAM)',
        localDialect: 'Español (LATAM)',
        id: 'Español',
      },
      {
        image: Portuguese,
        languageName: 'Portuguese (BR)',
        localDialect: 'Português (BR)',
        id: 'Português',
      },
    ],
  },
  {
    title: 'Asia',
    image: asia,
    data: [
      {
        image: Chinese,
        languageName: 'Chinese (Mandarin)',
        localDialect: '中文 (Zhōngwén)',
      },
      {
        image: Hindi,
        languageName: 'Hindi',
        localDialect: 'हिन्दी (Hindī)',
      },
      {
        image: Russian,
        languageName: 'Russian',
        localDialect: 'Русский (Russkiy)',
      },
      {
        image: Arabic,
        languageName: 'Arabic',
        localDialect: 'العربية (Al - ʿarabiyyah)',
      },
      {
        image: Korean,
        languageName: 'Korean',
        localDialect: '한국어 (Hangugeo)',
      },
      {
        image: Japanese,
        languageName: 'Japanese',
        localDialect: '日本語 (Nihongo)',
      },
      {
        image: Indonesian,
        languageName: 'Indonesian',
        localDialect: 'Bahasa Indonesia',
      },
      {
        image: Hindi,
        languageName: 'Bengali',
        localDialect: 'বাংলা (Bangla)',
      },
      {
        image: Filipino,
        languageName: 'Filipino',
        localDialect: 'Wikang Filipino',
      },
    ],
  },
  {
    title: 'Europe',
    image: europe,
    data: [
      {
        image: Russian,
        languageName: 'Russian',
        localDialect: 'Russian',
      },
      {
        image: German,
        languageName: 'German',
        localDialect: 'Deutsch',
      },
      {
        image: Uk,
        languageName: 'English (UK)',
        localDialect: 'English (UK)',
        id: 'English ',
      },
      {
        image: French,
        languageName: 'French',
        localDialect: 'Français',
      },
      {
        image: Italian,
        languageName: 'Italian',
        localDialect: 'Italiano',
      },
      {
        image: Turkish,
        languageName: 'Turkish',
        localDialect: 'Türkçe',
      },
      {
        image: Spanish,
        languageName: 'Spanish',
        localDialect: 'Español',
      },
      {
        image: Portugal,
        languageName: 'Portuguese',
        localDialect: 'Portugués',
      },
    ],
  },
];
