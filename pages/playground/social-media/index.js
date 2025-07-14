import Image from 'next/image';
import FormInput from '../../../components/FormComponents/FormInput';
import PageTitle from '../../../components/SEO/PageTitle';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import PasteIcon from '../../../public/img/icons/paste.svg';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Youtube from '../../../public/img/icons/youtube-red.svg';
import Info from '../../../public/img/icons/info.svg';
import Instagram from '../../../public/img/icons/instagram-2.svg';
import Facebook from '../../../public/img/icons/facebook.svg';
import TikTok from '../../../public/img/icons/tiktok.svg';
import X from '../../../public/img/icons/x.svg';
import ErrorHandler from '../../../utils/errorHandler';
import { submitAdminTranscriptionLink } from '../../../services/api';
import TranslateOptions from '../../../components/dashboard/TranslateOptions';
import { useRouter } from 'next/router';
import Arrowback from '../../../public/img/icons/arrow-back.svg';
import Link from 'next/link';
import CustomSelectInput from '../../../components/FormComponents/CustomSelectInput';

const SocialMedia = () => {
  const router = useRouter();
  const [link, setLink] = useState('');
  const [timeOption, setTimeOption] = useState('seconds');
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    link,
    languages: [],
    saveSettings: false,
    requestHumanReview: false,
    secondsToProcess: 0,
  });

  const pasteFromClipboard = async () => {
    const text = await navigator.clipboard.readText();
    setLink(text);
    toast.success('Pasted data from clipboard');
  };

  const linkType = useMemo(() => {
    const patterns = {
      youtube: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/,
      instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com/,
      tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.com/,
      x: /https:\/\/(?:twitter|x)\.com\/[^/]+\/status\/(\d+)/,
    };

    for (const pattern in patterns) {
      const match = patterns[pattern].test(link);
      if (match) return pattern;
    }
  }, [link]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let seconds = parseInt(payload.secondsToProcess);
    if (timeOption === 'minutes') seconds *= 60;

    setIsLoading(true);
    try {
      await submitAdminTranscriptionLink({
        ...payload,
        link,
        secondsToProcess: seconds,
      });
      setIsLoading(false);
      router.push('/history');
    } catch (error) {
      setIsLoading(false);
      ErrorHandler(error);
    }
  };

  const linkTypes = {
    youtube: Youtube,
    instagram: Instagram,
    tiktok: TikTok,
    facebook: Facebook,
    x: X,
  };

  const timeInSec = useMemo(() => {
    let val = payload.secondsToProcess;
    if (timeOption === 'seconds') return val;
    if (timeOption === 'minutes') return (val *= 60);
  }, [timeOption, payload.secondsToProcess]);

  const timeInMin = useMemo(() => {
    let val = payload.secondsToProcess;
    if (timeOption === 'seconds') return (val /= 60).toFixed(1);
    if (timeOption === 'minutes') return val;
  }, [timeOption, payload.secondsToProcess]);

  return (
    <>
      <PageTitle title="Social Media Servicing" />

      <Link href={'/playground'} className="mb-s4 flex items-center text-lg">
        <Image src={Arrowback} alt="" width={18} height={18} />
        <span className="pl-s2">Back</span>
      </Link>

      <div className="flex px-6">
        <div className="mr-10 w-7/12">
          <div className="h-12">
            {link && (
              <Image
                src={linkTypes[linkType] ?? Info}
                alt=""
                width={40}
                height={40}
              />
            )}
          </div>
          <div className="mt-4 flex">
            <FormInput
              extraClasses=""
              placeholder="Paste social media url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <button
              className="relative ml-2 w-fit"
              onClick={pasteFromClipboard}
            >
              <Image src={PasteIcon} alt="" width={50} height={50} />
              <span className="">
                click here <br />
                to paste
              </span>
            </button>
          </div>
          <br />
          <br />
          <p>Cut specific part of video &#40;optional&#41;</p>
          <div className="mt-4 flex items-center">
            <div className="mr-8 w-1/2">
              <FormInput
                extraClasses=""
                placeholder={`Enter ${timeOption}`}
                value={payload['']}
                type={'number'}
                min="0"
                onChange={(e) =>
                  setPayload((prev) => ({
                    ...prev,
                    secondsToProcess: Number(e.target.value),
                  }))
                }
              />
            </div>
            <CustomSelectInput
              text=""
              defaultData={timeOption}
              options={['seconds', 'minutes']}
              onChange={(e) => setTimeOption(e)}
            />
          </div>
          {!!payload.secondsToProcess && (
            <div className="mt-4 flex text-lg">
              <p>Part of video selected</p>
              <p className="mx-4">{timeInSec} seconds</p>
              <p>{timeInMin} minutes</p>
            </div>
          )}
        </div>
        <div className="w-5/12">
          <TranslateOptions
            handleSubmit={handleSubmit}
            payload={payload}
            setPayload={setPayload}
            isLoading={isLoading}
            // disabled={payload.languages.length < 1 || !linkType}
          />
        </div>
      </div>
    </>
  );
};

SocialMedia.getLayout = DashboardLayout;

export default SocialMedia;
