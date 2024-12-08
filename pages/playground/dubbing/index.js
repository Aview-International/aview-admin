import Image from 'next/image';
import DottedBorder from '../../../components/UI/DottedBorder';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import UploadIcon from '../../../public/img/icons/upload-icon1.svg';
import Border from '../../../components/UI/Border';
import { useEffect, useRef, useState } from 'react';
import {
  getElevenLabsVoices,
  uploadManualSrtDubbing,
} from '../../../services/api';
import ErrorHandler from '../../../utils/errorHandler';
import RadioInput from '../../../components/FormComponents/RadioContent';
import PlayIcon from '../../../public/img/icons/play.svg';
import ToggleButton from '../../../components/FormComponents/ToggleButton';
import PageTitle from '../../../components/SEO/PageTitle';
import Arrowback from '../../../public/img/icons/arrow-back.svg';
import Link from 'next/link';

const ManualDubbing = () => {
  const audioRef = useRef(null);
  const [multiVoice, setMultiVoice] = useState(false);
  const [file, setFile] = useState(null);
  const [voiceId, setVoiceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState({
    elevenLabs: [],
  });

  const handleUpload = async () => {
    try {
      setIsLoading(true);
      const res = await uploadManualSrtDubbing({
        srt: file,
        voiceId,
        multiVoice,
      });
      setIsLoading(false);
      // window.open(res, '_blank');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { voices } = await getElevenLabsVoices();
        setVoices((prev) => ({
          ...prev,
          elevenLabs: voices,
        }));
      } catch (error) {
        ErrorHandler(error);
      }
    })();
  }, []);

  const handleVoiceSelection = (data) => {
    setVoiceId(data);
  };

  const handlePreviewVoice = (previewUrl) => {
    let audioPlayer = audioRef.current;
    audioPlayer.src = previewUrl;
    audioPlayer.load();
    audioPlayer.play();
  };
  return (
    <>
      <PageTitle title="Manual Translation" />

      <Link href={'/playground'} className="mb-s4 flex items-center text-lg">
        <Image src={Arrowback} alt="" width={18} height={18} />
        <span className="pl-s2">Back</span>
      </Link>
 
      <div className="w-11/12 text-white">
        <DottedBorder classes="relative block md:inline-block w-full">
          {file && (
            <button
              onClick={() => setFile(null)}
              className={`gradient-2 absolute top-4 right-4 z-50 mx-auto block w-[80px] cursor-pointer rounded-full pt-1 pb-1 text-center text-sm`}
            >
              Remove
            </button>
          )}
          <input
            type="file"
            className="hidden"
            accept=".srt"
            onChange={(e) => setFile(e.target.files[0])}
            id="srt_upload"
          />

          <div className="flex flex-col items-center py-s3">
            <div className="flex h-[80px] w-[80px] place-content-center rounded-full bg-gray-1">
              <Image src={UploadIcon} alt="Upload" width={40} height={40} />
            </div>

            {!file && (
              <label className="mt-s5 cursor-pointer" htmlFor="srt_upload">
                <Border borderRadius="full">
                  <span
                    className={`transition-300 mx-auto block rounded-full bg-black px-s3 pt-s1.5 pb-s1 text-center text-white`}
                  >
                    Upload Srt File for dubbing
                  </span>
                </Border>
              </label>
            )}
            {file && <p className="my-s5">{file.name}</p>}
          </div>
        </DottedBorder>

        <br />
        <div className="my-s3 flex">
          <p className="pr-2">Multiple Voice Dubbing</p>
          <ToggleButton
            handleChange={() => setMultiVoice(!multiVoice)}
            isChecked={multiVoice}
          />
        </div>
        {!multiVoice && (
          <h3 className="my-s2 text-center text-2xl">Select Voice</h3>
        )}
        <audio hidden={true} ref={audioRef} controls></audio>

        {!multiVoice && (
          <div className="text-lg">
            <p>Eleven Labs Voices</p>
            {voices.elevenLabs.map((voice, i) => (
              <div className="my-2 flex items-center" key={i}>
                <button
                  onClick={() => handlePreviewVoice(voice.preview_url)}
                  className="mr-s2 flex items-center justify-center"
                >
                  <Image src={PlayIcon} alt="" width={30} height={30} />
                </button>
                <RadioInput
                  key={i}
                  chosenValue={voiceId}
                  name={'voices'}
                  text={voice.name}
                  value={voice.voice_id}
                  onChange={() => handleVoiceSelection(voice.voice_id)}
                />
              </div>
            ))}
          </div>
        )}

        {file && (multiVoice || voiceId) && (
          <button
            onClick={handleUpload}
            className={`gradient-2 z-50 mx-auto block w-[140px] cursor-pointer rounded-full pt-s1.5 pb-s1 text-center`}
          >
            Proceed
          </button>
        )}
        <p className="cursor-not-allowed py-s2 text-center text-lg underline opacity-30">
          {isLoading ? 'Processing, please wait' : ''}
        </p>
      </div>
    </>
  );
};

ManualDubbing.getLayout = DashboardLayout;

export default ManualDubbing;
