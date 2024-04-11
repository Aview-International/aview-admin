import Image from 'next/image';
import DottedBorder from '../../../components/UI/DottedBorder';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import UploadIcon from '../../../public/img/icons/upload-icon1.svg';
import Link from 'next/link';
import Border from '../../../components/UI/Border';
import { useState } from 'react';
import { manualSeparation } from '../../../services/api';
import PageTitle from '../../../components/SEO/PageTitle';
import { ErrorHandler } from '../../../utils/errorHandler';

const AudioSeparation = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    try {
      setIsLoading(true);
      const res = await manualSeparation(file, setUploadProgress);
      setIsLoading(false);
      //   window.open(res, '_blank');
    } catch (error) {
      setIsLoading(false);
      ErrorHandler(error);
    }
  };

  return (
    <>
      <PageTitle title="Manual Transcription" />

      <div className="w-11/12 text-white">
        <DottedBorder classes="relative block md:inline-block w-full max-w-2xl">
          {file && (
            <button
              onClick={() => setFile(null)}
              className={`gradient-2 pt-s0 pb-s0 absolute top-4 right-4 z-50 mx-auto block w-[80px] cursor-pointer rounded-full text-center text-sm`}
            >
              Remove
            </button>
          )}
          {file && (
            <button
              onClick={handleUpload}
              className={`gradient-2 absolute bottom-4 right-1/2 left-1/2 z-50 mx-auto block w-[140px] -translate-x-1/2 cursor-pointer rounded-full pt-s1.5 pb-s1 text-center`}
            >
              Proceed
            </button>
          )}
          <input
            type="file"
            className="hidden"
            accept="video/*,audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            id="video_upload"
          />
          {file ? (
            file.type.split('/')[0] === 'video' ? (
              <video
                width="400"
                height="400"
                controls
                className="h-full w-full"
              >
                <source src={URL.createObjectURL(file)} type={file.type} />
              </video>
            ) : (
              <audio controls className="my-s8 block w-full">
                <source src={URL.createObjectURL(file)} type={file.type} />
                Your browser does not support the audio element.
              </audio>
            )
          ) : (
            <div className="flex flex-col items-center py-s6">
              <div className="flex h-[160px] w-[160px] place-content-center rounded-full bg-gray-1">
                <Image src={UploadIcon} alt="Upload" width={80} height={80} />
              </div>

              <label className="mt-s5 cursor-pointer" htmlFor="video_upload">
                <Border borderRadius="full">
                  <span
                    className={`transition-300 mx-auto block rounded-full bg-black px-s3 pt-s1.5 pb-s1 text-center text-white`}
                  >
                    Select Video/Audio
                  </span>
                </Border>
              </label>
            </div>
          )}
        </DottedBorder>
        <p className="cursor-not-allowed py-s2 text-center text-lg underline opacity-30">
          Download Transcription
        </p>
        {isLoading && (
          <>
            <p>Please wait</p>
            <div className="mt-4 h-3 w-full rounded-full">
              <div
                className="gradient-2 h-full rounded-full"
                style={{ width: uploadProgress + '%' }}
              ></div>
            </div>
          </>
        )}

        <small className="text-sm">
          If you selected Distribution, you acknowledge that you agree to
          Aview&#39;s &nbsp;
          <span className="gradient-1 gradient-text">
            <Link href="/privacy-policy">Terms of Service</Link>
          </span>
          &nbsp;and give us permission to post translated content on your
          behalf.
        </small>
      </div>
    </>
  );
};

AudioSeparation.getLayout = DashboardLayout;

export default AudioSeparation;
