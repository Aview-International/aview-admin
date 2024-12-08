import { useState } from 'react';
import TranslateOptions from '../../../components/dashboard/TranslateOptions';
import UploadVideo from '../../../components/dashboard/upload/UploadVideo';
import PageTitle from '../../../components/SEO/PageTitle';
import { uploadCreatorVideo } from '../../../services/api.js';
import ErrorHandler from '../../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Arrowback from '../../../public/img/icons/arrow-back.svg';
import Link from 'next/link';
import Image from 'next/image';

const Upload = () => {
  const router = useRouter();
  const [video, setVideo] = useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    languages: [],
    saveSettings: false,
    additionalNote: '',
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await uploadCreatorVideo(
        video,
        payload.languages,
        payload.additionalNote,
        setUploadProgress
      );
      toast.success('Tasks submitted succesfully 🚀');
      setIsLoading(false);
      router.push('/history');
    } catch (error) {
      setIsLoading(false);
      ErrorHandler(error);
    }
  };

  return (
    <>
      <PageTitle title="Upload Video" />

      <Link href={'/playground'} className="mb-s4 flex items-center text-lg">
        <Image src={Arrowback} alt="" width={18} height={18} />
        <span className="pl-s2">Back</span>
      </Link>

      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col rounded-xl bg-white-transparent p-s5 text-white lg:flex-row">
          <div className={video ? '' : 'lg:w-full'}>
            <UploadVideo
              setVideo={setVideo}
              video={video}
              uploadProgress={uploadProgress}
            />
          </div>
          <div className={`w-full ${video ? 'lg:ml-s5' : 'lg:mt-0 lg:w-1/2'}`}>
            <TranslateOptions
              handleSubmit={handleSubmit}
              payload={payload}
              setPayload={setPayload}
              isLoading={isLoading}
              disabled={payload.languages.length < 1 || !video}
              uploadProgress={uploadProgress}
            />
          </div>
        </div>
      </div>
    </>
  );
};

Upload.getLayout = DashboardLayout;

export default Upload;
