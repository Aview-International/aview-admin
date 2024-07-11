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

const SocialMedia = () => {
  const router = useRouter();
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    link,
    languages: [],
    saveSettings: false,
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
    setIsLoading(true);
    try {
      await submitAdminTranscriptionLink({ ...payload, link });
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

  return (
    <>
      <PageTitle title="Social Media Servicing" />
      <div className="flex">
        <div className="mr-10 flex-1">
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
          <FormInput
            extraClasses="mt-4"
            placeholder="Paste social media url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button className="relative ml-2 mt-4" onClick={pasteFromClipboard}>
            <span className="absolute -bottom-8 -left-2 w-40">
              click here to paste
            </span>
            <Image src={PasteIcon} alt="" width={50} height={50} />
          </button>
        </div>
        <div className="flex-1">
          <TranslateOptions
            handleSubmit={handleSubmit}
            payload={payload}
            setPayload={setPayload}
            isLoading={isLoading}
            disabled={payload.languages.length < 1 || !linkType}
          />
        </div>
      </div>
    </>
  );
};

SocialMedia.getLayout = DashboardLayout;

export default SocialMedia;
