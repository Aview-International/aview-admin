import { useEffect, useState } from 'react';
import PageTitle from '../../components/SEO/PageTitle';
import { useRouter } from 'next/router';
import ErrorHandler from '../../utils/errorHandler';
import Popup from '../../components/UI/PopupWithBorder';
import FullScreenLoader from '../../public/loaders/FullScreenLoader';
import { SupportedLanguages } from '../../constants/constants';
import {
  finishPendingJob,
  getDownloadLink,
  getJobAndVerify,
  flagJob,
  getCreatorProfile,
} from '../../services/apis';
import Check from '../../public/img/icons/check-circle-green.svg';
import Button from '../../components/UI/Button';
import Image from 'next/image';
import Timer from '../../components/UI/Timer';
import Textarea from '../../components/FormComponents/Textarea';

const Pending = () => {
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoLink, setVideoLink] = useState(null);
  const [originalVideoLink, setOriginalVideoLink] = useState(null);
  const [creatorName, setCreatorName] = useState(null);
  const [loader, setLoader] = useState(null);
  const [popupApprove, setPopupApprove] = useState(false);
  const [popupFlag, setPopupFlag] = useState(false);
  const [flagReason, setFlagReason] = useState(null);
  const [submitHeader, setSubmitHeader] = useState('Approved!');

  const router = useRouter();
  const { jobId } = router.query;

  const handleApproval = async () => {
    try {
      setLoader('approve');
      await finishPendingJob(jobId).then(() => {
        setLoader('');
        setSubmitHeader('Approved!');
        setPopupApprove(true);
      });
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleFlag = async () => {
    try {
      setLoader('flag');
      if (!flagReason) {
        throw new Error(`Invalid flag reason`);
      }
      await flagJob(jobId, flagReason, 'pending').then(() => {
        setLoader('');
        setPopupFlag(false);
        setSubmitHeader('Flagged!');
        setPopupApprove(true);
      });
    } catch (error) {
      ErrorHandler(error);
      setLoader('');
    }
  };

  const getJob = async (jobId) => {
    try {
      const job = await getJobAndVerify(jobId);
      setJob(job.data);
      setIsLoading(false);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleVideo = async () => {
    if (job) {
      const res = await getCreatorProfile(job.creatorId);
      const resData = res.data;
      setCreatorName(resData?.firstName + ' ' + resData?.lastName);

      const languageCode = SupportedLanguages.find(
        (language) => language.languageName === job.translatedLanguage
      ).translateCode;

      const videoPath = `dubbing-tasks/${job.creatorId}/${jobId}/${languageCode}.mp4`;
      const originalVideoPath = `dubbing-tasks/${job.creatorId}/${jobId}/video.mp4`;
      const downloadLink = await getDownloadLink(videoPath);
      const originalDownloadLink = await getDownloadLink(originalVideoPath);

      setVideoLink(downloadLink.data);
      setOriginalVideoLink(originalDownloadLink.data);
    }
  };

  useEffect(() => {
    if (jobId) {
      getJob(jobId);
    }
  }, [jobId]);

  useEffect(() => {
    if (job) {
      handleVideo();
    }
  }, [job]);

  console.log(job);
  return (
    <>
      <PageTitle title="Pending" />
      <Popup show={popupApprove} disableClose={true}>
        <div className="h-full w-full">
          <div className="w-[500px] rounded-2xl bg-indigo-2 p-s3">
            <div className="flex flex-col items-center justify-center">
              <h2 className="mb-s2 text-2xl text-white">{submitHeader}</h2>
              <p className="text-white">
                Please wait 1-2 business days for payment to process. Thank you.
              </p>
            </div>
          </div>
        </div>
      </Popup>
      <Popup show={popupFlag} onClose={() => setPopupFlag(false)}>
        <div className="h-full w-full">
          <div className="w-[600px] rounded-2xl bg-indigo-2 p-s2">
            <div className="flex flex-col items-center justify-center">
              <h2 className="mb-s4 text-2xl text-white">Flag job?</h2>
              <h2 className="w-full text-lg text-white">Flag reasoning</h2>
              <Textarea
                placeholder="Write a short description of the problem"
                classes="!mb-s2"
                textAreaClasses="text-lg text-white font-light"
                onChange={(e) => setFlagReason(e.target.value)}
              />
              <div className="w-full">
                <div className="float-right h-[47px] w-[134px]">
                  <Button
                    theme="error"
                    onClick={() => {
                      handleFlag();
                    }}
                    isLoading={loader === 'flag'}
                  >
                    Flag
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Popup>
      <div className="absolute top-0 right-0 py-s2 px-s2">
        <Timer
          jobId={jobId}
          jobType={'pending'}
          setIsLoading={setIsLoading}
          jobTimestamp={job ? job.pendingStatus : null}
        />
      </div>
      <div className="flex h-screen w-full flex-col px-s12 pb-s5 pt-s7">
        <div className="mt-s15 flex flex-row">
          <div className="w-1/2 pr-s1">
            <div className="relative w-full flex-1 overflow-hidden rounded-2xl bg-white-transparent p-s2 pb-[76px]">
              <div className="flex flex-row items-center justify-between">
                <div className="mb-[4px] text-2xl font-bold text-white">
                  Original Video - {job ? job.videoData.caption : ''}
                </div>
                <div className="rounded-full bg-white-transparent py-[4px] px-s1 text-white">
                  {job ? job.originalLanguage : ''}
                </div>
              </div>
              <div className="mb-s2 text-lg text-white">
                {creatorName ? creatorName : ''}
              </div>
              <div
                className="relative w-full overflow-hidden"
                style={{ paddingTop: '56.25%' }}
              >
                {originalVideoLink && (
                  <video
                    style={{
                      objectFit: 'contain',
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#000',
                    }}
                    controls
                  >
                    <source
                      src={originalVideoLink ? originalVideoLink : ''}
                      type="video/mp4"
                    />
                  </video>
                )}
              </div>
            </div>
          </div>

          <div className="w-1/2 pl-s1">
            <div className="relative w-full flex-1 overflow-hidden rounded-2xl bg-white-transparent p-s2">
              <div className="flex flex-row items-center justify-between">
                <div className="mb-[4px] text-2xl font-bold text-white">
                  Translated Video - {job ? job.videoData.caption : ''}
                </div>
                <div className="rounded-full bg-white-transparent py-[4px] px-s1 text-white">
                  {job ? job.originalLanguage : ''}
                </div>
              </div>
              <div className="mb-s2 text-lg text-white">
                {creatorName ? creatorName : ''}
              </div>
              <div
                className="relative w-full overflow-hidden"
                style={{ paddingTop: '56.25%' }}
              >
                {videoLink && (
                  <video
                    style={{
                      objectFit: 'contain',
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#000',
                    }}
                    controls
                  >
                    <source src={videoLink ? videoLink : ''} type="video/mp4" />
                  </video>
                )}
              </div>
              <div className="flex flex-row">
                <Button
                  theme="error"
                  classes="flex flex-col justify-center items-center  mt-s2 mr-s2"
                  onClick={() => {
                    setPopupFlag(true);
                  }}
                  isLoading={loader === 'flagged'}
                >
                  <div className="flex flex-row items-center">
                    <span className="">Flag</span>
                  </div>
                </Button>
                <Button
                  theme="success"
                  classes="flex flex-col justify-center items-center  mt-s2"
                  onClick={() => handleApproval()}
                  isLoading={loader === 'approve'}
                >
                  <div className="flex flex-row items-center">
                    <Image src={Check} alt="" width={24} height={24} />
                    <span className="ml-s1">Approve</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pending;
