import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { useEffect, useMemo, useRef, useState } from 'react';
import info from '../../public/img/icons/info_1.svg';
import paperclip from '../../public/img/icons/paperclip.svg';
import { useRouter } from 'next/router';
import {
  getRegionCategory,
  getSingleVideoData,
  getSupportedLanguages,
  getYoutubePlaylistData,
  // getYoutubeVideoData,
  postToYouTube,
  translateText,
} from '../../services/api';
import { toast } from 'react-toastify';
import Cancel from '../../public/img/icons/cancel-white.svg';
import Image from 'next/image';
import VideoSubTitle from '../../components/UI/VideoSubtitle';
import Textarea from '../../components/FormComponents/Textarea';
import CustomSelectInput from '../../components/FormComponents/CustomSelectInput';
import FormInput from '../../components/FormComponents/FormInput';
import RadioInput from '../../components/FormComponents/RadioInput';
import Border from '../../components/UI/Border';
import Thumbnail from '../../components/creators/Thumbnail';
import Button from '../../components/UI/Button';
import VideoUpload from '../../components/creators/VideoUpload';
import { getUserProfile } from '../../services/firebase';

const Creators = () => {
  const tagsInputRef = useRef(null);
  const router = useRouter();
  const {
    query: { lang, creator, date, 'video-id': videoId },
  } = router;
  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    comments: 0,
    favorites: 0,
  });
  const [playlists, setPlaylists] = useState([
    'Wildlife',
    'Speaking To People',
    'Life',
    'Education',
  ]);
  const [categories, setCategories] = useState([
    'Entertainment',
    'Education',
    'Music',
    'Technology',
    'Sci-Fi',
  ]);
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [translated, setTranslated] = useState({
    title: false,
    description: false,
  });
  const [youtubePayload, setYoutubePayload] = useState({
    snippet: {
      title: '',
      description: '',
      categoryId: '',
      thumbnail: '',
      tags: [],
      channelId: '',
    },
    status: {
      privacyStatus: 'private',
      madeForKids: false,
      adSuitability: false,
      monetization: false,
    },
    // localizations: {
    //   en: {
    //     title: 'English Title',
    //     description: 'English Description',
    //   },
    //   fr: {
    //     title: 'Titre français',
    //     description: 'Description en français',
    //   },
    // },
  });

  const handleInputChange = (section, target, value) => {
    setYoutubePayload((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [target]: value,
      },
    }));
  };

  const getLanguages = async () => {
    const lang = await getSupportedLanguages();
    setLanguages(lang);
  };

  const getPlaylists = async (youtubeChannelId) => {
    try {
      const list = await getYoutubePlaylistData(youtubeChannelId);
      console.log(list);
      setPlaylists(list);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getYoutubeData = async () => {
    const data = await getSingleVideoData(videoId);
    console.log(data);
    const details = data;
    setYoutubePayload((prevState) => ({
      ...prevState,
      snippet: {
        ...prevState.snippet,
        title: details.snippet.title,
        description: details.snippet.description,
        thumbnail: details.snippet.thumbnails.high.url,
        tags: details.snippet.tags,
      },
      status: {
        ...prevState.status,
        madeForKids: details.status.madeForKids,
      },
    }));
    setStats({
      views: details.statistics.viewCount,
      likes: details.statistics.likeCount,
      comments: details.statistics.commentCount,
      favorites: details.statistics.favoriteCount,
    });
    setIsLoading(false);
  };

  const getCategory = async () => {
    const res = await getRegionCategory(lang);
    setCategories(res);
  };

  const getVideoData = async () => {
    await getYoutubeData();
    const user = await getUserProfile(creator);
    const list = await getYoutubePlaylistData(user.youtube.youtubeChannelId);
    setPlaylists(list);
    handleInputChange('snippet', 'channelId', user.youtube.youtubeChannelId);
  };

  useEffect(() => {
    if (lang) {
      getCategory();
      getLanguages();
      getVideoData();
    }
  }, [lang]);

  const videoLanguage = useMemo(() => {
    const language = languages.find((lang) => lang.languageName === lang);
    return language;
  }, [languages]);

  const handleRadioButtonClick = (value, target) => {
    setYoutubePayload((prevState) => ({
      ...prevState,
      status: {
        ...prevState.status,
        [target]: value,
      },
    }));
  };

  const handleTagsAction = (value, action) => {
    const updatedTags = youtubePayload.snippet.tags;
    switch (action) {
      case 'remove': {
        updatedTags.splice(updatedTags.indexOf(value), 1);
        tagsInputRef.current.value = '';
        break;
      }
      case 'add': {
        if (value.includes(',')) {
          updatedTags.push(value.slice(0, -1));
          tagsInputRef.current.value = '';
        }
        break;
      }
    }

    setYoutubePayload((prevState) => ({
      ...prevState,
      snippet: {
        ...prevState.snippet,
        tags: updatedTags,
      },
    }));
  };

  const translateMetaData = async (target) => {
    const data = await translateText(youtubePayload.snippet[target], lang);
    handleInputChange('snippet', target, data.text);
    setTranslated((prevState) => ({ ...prevState, [target]: true }));
  };

  useEffect(() => {
    if (!isLoading) {
      youtubePayload.snippet.title &&
        !translated.title &&
        translateMetaData('title');

      youtubePayload.snippet.description &&
        !translated.description &&
        translateMetaData('description');
    }
  }, [isLoading]);

  const handleSubmit = () => {
    // postToYouTube(lang, creator, date, youtubePayload);
  };

  return (
    <>
      <PageTitle title="Distribution" />
      <div className="gradient-dark rounded-2xl p-s3">
        <div className="my-12 flex flex-row items-start justify-center gap-12">
          <div className="w-full flex-1">
            <VideoUpload />
            <p className="mb-4 mt-8 text-lg font-bold">Current stats:</p>
            <p>Views: {stats.views} </p>
            <p>Likes: {stats.likes} </p>
            <p>Comments: {stats.comments}</p>
            <p>Favorites: {stats.favorites} </p>
          </div>
          <div className="flex-1">
            <div className="mt-8 flex w-full flex-col gap-y-8">
              <p className="text-xl">Target Language: {lang}</p>
              <div className={`w-full text-white`}>
                <div className="w-full">
                  <FormInput
                    label="Title"
                    placeholder="Add a title..."
                    value={youtubePayload.snippet.title}
                    onChange={(e) =>
                      handleInputChange('snippet', 'title', e.target.value)
                    }
                    name="title"
                  />
                </div>
              </div>
              <div className="flex h-full w-full flex-col justify-between py-2">
                <div>
                  <Textarea
                    placeholder="Tell viewers about your video"
                    name="description"
                    textColor="false"
                    label="Description"
                    value={youtubePayload.snippet.description}
                    onChange={(e) =>
                      handleInputChange(
                        'snippet',
                        'description',
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <VideoSubTitle image={paperclip} text="Thumbnail">
                <Thumbnail
                  thumbnail={youtubePayload.snippet.thumbnail}
                  setYoutubePayload={setYoutubePayload}
                />
              </VideoSubTitle>
              <VideoSubTitle image={info} text="Details">
                <div className="flex flex-col justify-start gap-y-2">
                  <div>
                    <CustomSelectInput
                      text="Playlists"
                      name="playlists"
                      onChange={handleInputChange}
                      options={[]}
                      // options={playlists.map((el) => el.name)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="mb-1 text-lg">Audience</h3>
                    <div className="mb-2">
                      <RadioInput
                        value={true}
                        chosenValue={youtubePayload.status.madeForKids}
                        label={"Yes, it's made for kids"}
                        onChange={() =>
                          handleRadioButtonClick(true, 'madeForKids')
                        }
                        name={'madeForKids'}
                      />
                    </div>
                    <RadioInput
                      value={false}
                      chosenValue={youtubePayload.status.madeForKids}
                      label={"No, it's not made for kids"}
                      onChange={() =>
                        handleRadioButtonClick(false, 'madeForKids')
                      }
                      name={'madeForKids'}
                    />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="mb-1 text-lg">Monetization</h3>
                    <div className="mb-2">
                      <RadioInput
                        value={true}
                        chosenValue={youtubePayload.status.monetization}
                        label={'Yes'}
                        onChange={() =>
                          handleRadioButtonClick(true, 'monetization')
                        }
                        name={'monetization'}
                      />
                    </div>
                    <RadioInput
                      value={false}
                      chosenValue={youtubePayload.status.monetization}
                      label={'No'}
                      onChange={() =>
                        handleRadioButtonClick(false, 'monetization')
                      }
                      name={'monetization'}
                    />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="mb-1 text-lg">Ad Suitability</h3>
                    <div className="mb-2">
                      <RadioInput
                        value={true}
                        chosenValue={youtubePayload.status.adSuitability}
                        label={'Yes'}
                        onChange={() =>
                          handleRadioButtonClick(true, 'adSuitability')
                        }
                        name={'adSuitability'}
                      />
                    </div>
                    <RadioInput
                      value={false}
                      chosenValue={youtubePayload.status.adSuitability}
                      label={'No'}
                      onChange={() =>
                        handleRadioButtonClick(false, 'adSuitability')
                      }
                      name={'adSuitability'}
                    />
                  </div>

                  <div className="my-4">
                    <h3 className="mb-2 mt-4 text-lg">Tags</h3>
                    <Border borderRadius="md w-full">
                      <div className="rounded-md bg-black p-s2">
                        {youtubePayload.snippet.tags.map((el, i) => (
                          <div
                            key={i}
                            className="m-2 inline-flex items-center rounded-full bg-white-transparent p-2"
                          >
                            {el}
                            <span
                              className="ml-2 flex cursor-pointer items-center justify-center"
                              onClick={() => handleTagsAction(el, 'remove')}
                            >
                              <Image src={Cancel} alt="" />
                            </span>
                          </div>
                        ))}
                        <input
                          className="bg-transparent"
                          ref={tagsInputRef}
                          onChange={(e) =>
                            handleTagsAction(e.target.value, 'add')
                          }
                        />
                      </div>
                    </Border>
                    <small>Enter a comma after each tag</small>
                  </div>

                  <h3 className="text-lg">
                    Video Language:
                    {' ' + videoLanguage?.languageName}
                  </h3>

                  <CustomSelectInput
                    text="Category"
                    value={youtubePayload.snippet.categoryId}
                    onChange={(val) => {
                      handleInputChange('snippet', 'categoryId', val);
                    }}
                    options={[]}
                    // options={categories.map((el) => el.name)}
                  />
                </div>
              </VideoSubTitle>
            </div>
            <div className="ml-8 w-36 text-center text-xl font-semibold">
              <Button theme="light" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Creators.getLayout = DashboardLayout;

export default Creators;
