import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { useEffect, useMemo, useRef, useState } from 'react';
import info from '../../public/img/icons/info_1.svg';
import paperclip from '../../public/img/icons/paperclip.svg';
import { useRouter } from 'next/router';
import {
  getRegionCategory,
  getSupportedLanguages,
  getYoutubePlaylistData,
  getYoutubeVideoData,
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
import { getSingleVideoData, getUserProfile } from '../../services/firebase';

const Creators = () => {
  const tagsInputRef = useRef(null);
  const router = useRouter();
  const {
    query: { lang, id, date, 'video-id': videoId },
  } = router;

  const language = lang.split('-')[0];
  const [payload, setPayload] = useState(undefined);
  const [playlists, setPlaylists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creatorId, setCreatorId] = useState('');
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
      setPlaylists(list);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getYoutubeData = async (id) => {
    const data = await getYoutubeVideoData(id);
    setPayload(data.items[0]);
    const details = data.items[0];
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
    setIsLoading(false);
  };

  const getCategory = async (language) => {
    const res = await getRegionCategory(language);
    setCategories(res);
  };

  const getVideoData = async () => {
    const data = await getSingleVideoData(id);
    setCreatorId(data.creatorId);
    const user = await getUserProfile(data.creatorId);
    // getPlaylists(user.youtubeChannelId);
    handleInputChange('snippet', 'channelId', user.youtubeChannelId);
  };

  useEffect(() => {
    if (lang) {
      getCategory(language);
      getLanguages();
      getVideoData();
      isLoading && getYoutubeData(videoId);
    }
  }, [lang]);

  const videoLanguage = useMemo(() => {
    const language = languages.find((lang) => lang.languageName === lang);
    return language;
  }, [languages]);

  const handleRadioButtonClick = (value) => {
    setYoutubePayload((prevState) => ({
      ...prevState,
      status: {
        ...prevState.status,
        madeForKids: value,
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
    const data = await translateText(youtubePayload.snippet[target], language);
    handleInputChange('snippet', target, data);
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
    console.log(youtubePayload);
    postToYouTube(lang, creatorId, date, youtubePayload);
  };

  return (
    <>
      <PageTitle title="Distribution" />
      <div className="gradient-dark rounded-2xl p-s3">
        <>
          <div className="my-12 flex  flex-col items-center justify-center">
            <div className="w-1/2">
              <VideoUpload />
            </div>
            <div className="w-1/2">
              <div className="mt-8 flex w-full flex-col gap-y-8">
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
                  <Thumbnail thumbnail={youtubePayload.snippet.thumbnail} />
                </VideoSubTitle>
                <VideoSubTitle image={info} text="Details">
                  <div className="flex flex-col justify-start gap-y-2">
                    <div>
                      <CustomSelectInput
                        text="Playlists"
                        name="playlists"
                        onChange={handleInputChange}
                        options={playlists.map((el) => el.name)}
                      />
                    </div>

                    <div className="flex flex-col">
                      <h3 className="mb-1 text-lg">Audience</h3>
                      <div className="mb-2">
                        <RadioInput
                          value={true}
                          chosenValue={youtubePayload.status.madeForKids}
                          label={"Yes, it's made for kids"}
                          onChange={() => handleRadioButtonClick(true)}
                          name={'madeForKids'}
                        />
                      </div>
                      <RadioInput
                        value={false}
                        chosenValue={youtubePayload.status.madeForKids}
                        label={"No, it's not made for kids"}
                        onChange={() => handleRadioButtonClick(false)}
                        name={'madeForKids'}
                      />
                    </div>

                    <div className="my-4">
                      <h3 className="mb-2 mt-4 text-lg">Tags</h3>
                      <Border borderRadius="md w-full">
                        <div className="rounded-md bg-black p-s2">
                          {payload?.snippet.tags.map((el, i) => (
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
                      value={
                        categories.find(
                          (el) => el.id === youtubePayload.snippet.categoryId
                        )?.name
                      }
                      onChange={(val) => {
                        const category = categories.find(
                          (el) => el.name === val
                        );
                        handleInputChange('snippet', 'categoryId', category.id);
                      }}
                      options={categories.map((category) => category.name)}
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
        </>
      </div>
    </>
  );
};

Creators.getLayout = DashboardLayout;

export default Creators;
