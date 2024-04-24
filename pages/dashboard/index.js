import { useEffect, useState } from 'react';
import DashboardLayoutNoSidebar from '../../components/dashboard/DashboardLayoutNoSidebar';
import PendingJobs from '../../components/dashboard/PendingJobs';
import OverlayJobs from '../../components/dashboard/OverlayJobs';
import ModerationJobs from '../../components/dashboard/ModerationJobs';
import AllJobs from '../../components/dashboard/AllJobs';
import PageTitle from '../../components/SEO/PageTitle';
import {
  getTranslatorFromUserId,
  getTranslatorLeaderboards,
  acceptJob,
} from '../../services/apis';
import { authStatus } from '../../utils/authStatus';
import Cookies from 'js-cookie';
import ReviewerSettingsPopup from '../../components/dashboard/ReviewerSettingsPopup';
import PieChart from '../../components/UI/PieChart';
import Popup from '../../components/UI/PopupNormal';
import Button from '../../components/UI/Button';
import ErrorHandler from '../../utils/errorHandler';
import Image from 'next/image';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('all');
  const [translator, setTranslator] = useState(null);
  const [translatorId, setTranslatorId] = useState(null);
  const [settings, setSettings] = useState(false);
  const [leaderboards, setLeaderboards] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [popupPreview, setPopupPreview] = useState(false);
  const [previewJob, setPreviewJob] = useState(null);
  const [previewJobVideoLink, setPreviewJobVideoLink] = useState(null);
  const [previewJobType, setPreviewJobType] = useState(null);

  const handleTranslator = async () => {
    const token = Cookies.get('session');
    const userId = authStatus(token).data.user_id;

    const translatorInfo = await getTranslatorFromUserId(userId);
    setTranslator(translatorInfo.data);
    setTranslatorId(translatorInfo.data._id);

    const data = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: '# of Votes',
          data: [
            translatorInfo.data.pendingJobsCompleted,
            translatorInfo.data.moderationJobsCompleted,
            translatorInfo.data.overlayJobsCompleted,
          ],
          backgroundColor: ['#FF3939', '#FC00FF', '#00FFFF'],
          borderColor: ['#FF3939', '#FC00FF', '#00FFFF'],
          borderWidth: 1,
        },
      ],
    };

    if (translatorInfo.data.pendingJobsCompleted == 0 && translatorInfo.data.moderationJobsCompleted == 0 && translatorInfo.data.overlayJobsCompleted ==0) {
      setPieChartData(null);
    }else{
      setPieChartData(data);
    }

  
  };

  const handleAccept = async () => {
    if (popupPreview) {
      if (previewJobType == 'moderation') {
        await handleAcceptModerationjob(previewJob.jobId);
      } else if (previewJobType == 'pending') {
        await handleAcceptPendingJob(previewJob.jobId);
      } else if (previewJobType == 'overlay') {
        await handleAcceptOverlayJob(previewJob.jobId);
      }
    }
  };

  const handleAcceptPendingJob = async (jobId) => {
    try {
      if (translatorId == null) throw new Error('Invalid translatorId.');
      await acceptJob(translatorId, jobId, 'pending');

      window.open(`/pending?jobId=${jobId}`, '_blank');
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleAcceptOverlayJob = async (jobId) => {
    try {
      if (translatorId == null) throw new Error('Invalid translatorId.');
      await acceptJob(translatorId, jobId, 'overlay');

      window.open(`/overlays?jobId=${jobId}`, '_blank');
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleAcceptModerationjob = async (jobId) => {
    try {
      if (translatorId == null) throw new Error('Invalid translatorId.');

      await acceptJob(translatorId, jobId, 'moderation');
      window.open(`/moderation?jobId=${jobId}`, '_blank');
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleLeaderboards = async () => {
    const leaderboard = await getTranslatorLeaderboards();
    const leaderboardData = leaderboard.data;
    setLeaderboards(leaderboardData);
  };

  function formatNameString(input) {
    if (input.length > 22) {
      return input.substring(0, 20) + '...';
    }
    return input;
  }

  useEffect(() => {
    handleTranslator();
    handleLeaderboards();
  }, []);

  const formatMoney = (amount) => {
    let dollars = Math.floor(amount / 100);
    let cents = amount % 100;
    return dollars + '.' + (cents < 10 ? '0' : '') + cents;
  };

  const jobTypes = [
    {
      title: 'All Jobs',
      id: 'all',
      component: AllJobs,
    },
    {
      title: 'Pending',
      id: 'pending',
      component: PendingJobs,
      class: 'bg-red',
      value: translator?.pendingJobsCompleted,
    },
    {
      title: 'Moderation',
      id: 'moderation',
      component: ModerationJobs,
      class: 'bg-purple',
      value: translator?.moderationJobsCompleted,
    },
    {
      title: 'Overlay',
      id: 'overlay',
      component: OverlayJobs,
      class: 'bg-blue',
      value: translator?.overlayJobsCompleted,
    },
  ];

  const selectedJobType = jobTypes.find((job) => job.id === selectedOption);
  const ComponentToRender = selectedJobType.component;

  return (
    <>
      <PageTitle title="Dashboard" />
      <div className="relative min-w-[1300px]">
        <DashboardLayoutNoSidebar
          setSettings={setSettings}
          profilePicture={translator && translator.profilePicture ? translator.profilePicture : null}
          name={translator ? translator.name : ''}
        >
          <ReviewerSettingsPopup
            show={settings}
            onClose={() => {
              setSettings(false);
            }}
            translator={translator}
          />
          <Popup
            show={popupPreview}
            onClose={() => {
              setPopupPreview(false);
              setPreviewJob(null);
              setPreviewJobType(null);
              setPreviewJobVideoLink(null);
            }}
          >
            <div className="h-full w-full">
              <div className="w-[600px] rounded-2xl">
                <div className="w-[600px] rounded-2xl bg-indigo-1 py-s2 px-s4">
                  <div className="flex flex-col items-center justify-center">
                    <h2 className="mb-s2 w-full text-left text-2xl text-white">
                      Preview
                    </h2>
                    <div
                      className="relative w-full overflow-hidden"
                      style={{ paddingTop: '56.25%' }}
                    >
                      {previewJobVideoLink && (
                        <video
                          className="absolute top-0 left-0 h-full w-full bg-black object-contain"
                          controls
                        >
                          <source
                            src={previewJobVideoLink ? previewJobVideoLink : ''}
                            type="video/mp4"
                          />
                        </video>
                      )}
                    </div>
                    <div className="mt-s2 w-full">
                      <div className="float-right h-[47px] w-[170px]">
                        <Button theme="success" onClick={handleAccept}>
                          Accept job
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
          <div className="flex h-full w-full flex-col justify-center p-s8 ">
            <div className="mb-s2 flex h-[320px] w-full">
              <div className="h-full w-1/3 pr-s1">
                <div className="h-full w-full rounded-2xl bg-white-transparent p-s2">
                  <div className="text-2xl text-white">Earnings</div>
                  <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
                  <div className="mb-s1 text-lg text-white">Lifetime</div>
                  <div className="rounded-lg bg-white-transparent p-s1.5 text-lg text-5xl font-bold text-white">
                    ${translator ? formatMoney(translator.totalPayment) : ''}
                  </div>
                  <div className="mt-s4 mb-s1 text-lg text-white">Weekly</div>
                  <div className="rounded-lg bg-white-transparent p-s1.5 text-lg text-5xl font-bold text-white">
                    ${translator ? formatMoney(translator.paymentOwed) : ''}
                  </div>
                </div>
              </div>

              <div className="h-full w-1/3 pr-s1 pl-s1">
                <div className="h-full w-full rounded-2xl bg-white-transparent p-s2">
                  <div className="text-2xl text-white">Job Statistics</div>
                  <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
                  <div className="flex w-full flex-row">
                    <div className="w-1/2 pr-s1">
                      <div className="h-full max-h-[221px] w-full">
                        <PieChart data={pieChartData ? pieChartData : null} />
                      </div>

                    </div>
                    <div className="flex w-1/2 flex-col justify-center pl-s1">
                      <div className="text-lg font-bold text-white">
                        {translator ? translator.totalJobsCompleted : ''}{' '}
                        {(translator && translator.totalJobsCompleted) == 1
                          ? 'Job completed'
                          : 'Jobs completed'}
                      </div>
                      {jobTypes.slice(1).map((job) => (
                        <div className="mt-s1 flex w-full flex-row items-center">
                          <div
                            className={`mr-s1 h-3.5	w-3.5 rounded-full ${job.class}`}
                          ></div>
                          <div className="pt-1 text-lg text-white">
                            {job.title}
                          </div>
                          <div className="ml-auto w-[50px] rounded-lg bg-white-transparent px-[8px] pt-[2px] text-center text-base text-white">
                            {translator ? job.value : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-full w-1/3 pl-s1">
                <div className="h-full w-full rounded-2xl bg-white-transparent p-s2">
                  <div className="text-2xl text-white">Leaderboards</div>
                  <div className="mt-s2  h-[1px] w-full bg-white"></div>
                  <div className="h-[226px] overflow-x-hidden overflow-y-scroll">
                    {leaderboards.map((translator, i) => (
                      <div key={i} className="my-s2 w-full">
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex flex-row items-center">
                            <div className="mt-[3px] mr-s2 w-[22px] text-lg font-bold text-white">
                              {i + 1}
                            </div>
                            <Image
                              src={
                                translator.profilePicture
                                  ? translator.profilePicture +
                                    '?v=' +
                                    new Date().getTime()
                                  : '/img/graphics/default.png'
                              }
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <div className="mt-[3px] text-base font-bold text-white ml-s2">
                              {formatNameString(translator.name)}
                            </div>
                          </div>
                          <div className="mt-[3px] mr-s2 text-base font-bold text-white">
                            {translator.totalJobsCompleted} jobs
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-s2 flex w-full items-center p-s1">
              <div className="flex flex-row">
                {jobTypes.map((job) => (
                  <div
                    key={job.id}
                    className={`mr-s2 min-w-fit cursor-pointer rounded-xl py-s1 px-s2 text-xl text-white ${
                      selectedOption == job.id
                        ? 'bg-white text-black'
                        : 'bg-white-transparent text-white'
                    }`}
                    onClick={() => setSelectedOption(job.id)}
                  >
                    {job.title}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <ComponentToRender
                setPopupPreview={setPopupPreview}
                setPreviewJob={setPreviewJob}
                setPreviewJobType={setPreviewJobType}
                setPreviewJobVideoLink={setPreviewJobVideoLink}
              />
            </div>

            <div></div>
          </div>
        </DashboardLayoutNoSidebar>
      </div>
    </>
  );
};

export default Dashboard;
