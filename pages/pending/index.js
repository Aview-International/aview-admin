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
    getTranslatorFromUserId,
    getJobAndVerify,
    flagJob,
    getCreatorProfile, }  from '../../services/apis';
import Check from '../../public/img/icons/check-circle-green.svg';
import Cookies from 'js-cookie';
import { authStatus } from '../../utils/authStatus';
import Button from '../../components/UI/Button';
import Image from 'next/image'
import Timer from '../../components/UI/Timer';
import Textarea from '../../components/FormComponents/Textarea';


const pending = () => {
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [translatorId, setTranslatorId] = useState(null);
    const [videoLink, setVideoLink] = useState(null);
    const [originalVideoLink, setOriginalVideoLink] = useState(null);
    const [creatorName, setCreatorName] = useState(null);
    const [loader, setLoader] = useState(null);
    const [popupApprove, setPopupApprove] = useState(false);
    const [popupFlag, setPopupFlag] = useState(false);
    const [flagReason, setFlagReason] = useState(null);
    const [submitHeader, setSubmitHeader] = useState("Approved!");

    const router = useRouter();
    const { jobId } = router.query;

    const handleApproval = async () => {
        try{
            setLoader('approve');
            await finishPendingJob(translatorId, jobId).then(() => {
            setLoader('');
            setSubmitHeader("Approved!");
            setPopupApprove(true);
            });
        }catch(error){
            ErrorHandler(error);
        }
        
    };

    const handleFlag = async () => {
        try {
          setLoader('flag');
          if (!flagReason ){
            throw new Error(`Invalid flag reason`);
          }
          console.log(translatorId, jobId, flagReason);
          await flagJob(translatorId, jobId, flagReason, "pending").then(() => {
            setLoader('');
            setPopupFlag(false);
            setSubmitHeader("Flagged!");
            setPopupApprove(true);
            
          });
        } catch (error) {
          ErrorHandler(error);
          setLoader('');
        }
      };


    const getJob = async (jobId, translatorId) => {

        try {
            const job = await getJobAndVerify(translatorId, jobId)
            setJob(job.data);
            setIsLoading(false);
        }catch(error) {
            ErrorHandler(error);
        }
    }

    const handleTranslator = async (userId) => {
        const translator = await getTranslatorFromUserId(userId);
        console.log(translator.data._id);
        setTranslatorId(translator.data._id);
    };

    const handleVideo = async () => {
        if (job && translatorId) {
            const res = await getCreatorProfile(job.creatorId);
            const resData = res.data;
        
            setCreatorName(resData?.firstName + ' ' + resData?.lastName);

            const languageCode = SupportedLanguages.find(
                (language) => language.languageName === job.translatedLanguage
            ).translateCode;
        
            const videoPath = `dubbing-tasks/${job.creatorId}/${jobId}/${languageCode}.mp4`;
            const originalVideoPath = `dubbing-tasks/${job.creatorId}/${jobId}/video.mp4`
            const downloadLink = await getDownloadLink(videoPath);
            const originalDownloadLink = await getDownloadLink(originalVideoPath);
    
            console.log(downloadLink);
            setVideoLink(downloadLink.data);
            setOriginalVideoLink(originalDownloadLink.data);
        }
    }

    useEffect(() => {
        const token = Cookies.get("session");
        console.log(token);
        const userId = authStatus(token).data.user_id;
        console.log(token);
        console.log(userId);
    
        handleTranslator(userId);
    
    },[]);

    useEffect(() => {
        if(jobId && translatorId) {
            getJob(jobId, translatorId);
        }
    }, [jobId, translatorId]);

    useEffect(() => {
        if (job && translatorId) {
            handleVideo();
        }
    }, [job, translatorId]);

    return(
        <>
        <PageTitle title="Pending" />

        {isLoading && <FullScreenLoader/>}
        <Popup show={popupApprove} disableClose={true}>
            <div className="h-full w-full">
            <div className="w-[500px] rounded-2xl bg-indigo-2 p-s3">
                <div className="flex flex-col items-center justify-center">
                <h2 className="mb-s2 text-2xl text-white">{submitHeader}</h2>
                <p className="text-white">
                    Payment will be issued out shortly. Thank you.
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
                        onClick={() => {handleFlag()}}
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
            <Timer translatorId={translatorId} jobId={jobId} jobType={"pending"} setIsLoading={setIsLoading} jobTimestamp={job ? job.pendingStatus:null}/>
        </div>
        <div className="w-full h-screen flex flex-col px-s12 pb-s5 pt-s7">
            <div className="flex flex-row mt-s15">
                <div className="w-1/2 pr-s1">
                    <div className="relative w-full flex-1 overflow-hidden rounded-2xl bg-white-transparent p-s2 pb-[76px]">
                        <div className="flex flex-row items-center justify-between">
                            <div className="text-white text-2xl mb-[4px] font-bold">Original Video - {job ? job.videoData.caption:""}</div>
                            <div className="bg-white-transparent rounded-full py-[4px] px-s1 text-white">{job ? job.originalLanguage:""}</div>
                        </div>
                        <div className="text-white text-lg mb-s2">{creatorName ? creatorName:""}</div>
                        <div
                        className="relative w-full overflow-hidden"
                        style={{ paddingTop: '56.25%' }}
                        >
                            {originalVideoLink &&
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
                            }
                        </div>
                    </div>
                </div>

                <div className="w-1/2 pl-s1">
                    <div className="relative w-full flex-1 overflow-hidden rounded-2xl bg-white-transparent p-s2">
                        <div className="flex flex-row items-center justify-between">
                            <div className="text-white text-2xl mb-[4px] font-bold">Translated Video - {job ? job.videoData.caption:""}</div>
                            <div className="bg-white-transparent rounded-full py-[4px] px-s1 text-white">{job ? job.originalLanguage:""}</div>
                        </div>
                        <div className="text-white text-lg mb-s2">{creatorName ? creatorName:""}</div>
                        <div
                        className="relative w-full overflow-hidden"
                        style={{ paddingTop: '56.25%' }}
                        >
                            {videoLink &&
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
                                src={videoLink ? videoLink : ''}
                                type="video/mp4"
                                />
                            </video>
                            }
                        </div>
                        <div className="flex flex-row">
                            <Button
                            theme="error"
                            classes="flex flex-col justify-center items-center  mt-s2 mr-s2"
                            onClick={()=>{setPopupFlag(true)}}
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
    )
}

export default pending;