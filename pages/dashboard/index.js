import { useEffect, useState, useMemo } from 'react';
import DashboardNoSidebar from '../../components/dashboard/DashboardNoSidebar';
import PendingJobs from '../../components/dashboard/PendingJobs';
import OverlayJobs from '../../components/dashboard/OverlayJobs';
import ModerationJobs from '../../components/dashboard/ModerationJobs';
import AllJobs from '../../components/dashboard/AllJobs';
import PageTitle from '../../components/SEO/PageTitle';
import {
  getTranslatorLeaderboards,
  acceptJob,
  getAllJobs,
} from '../../services/apis';
import PieChart from '../../components/UI/PieChart';
import Popup from '../../components/UI/PopupNormal';
import Button from '../../components/UI/Button';
import ErrorHandler from '../../utils/errorHandler';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import defaultProfilePicture from '../../public/img/graphics/default.png';
import { setAllJobs, setJobsLoading } from '../../store/reducers/jobs.reducer';
import CircleLoader from '../../public/loaders/CircleLoader';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const translator = useSelector((state) => state.user);
  const { jobs, isLoading } = useSelector((state) => state.jobs);
  const [selectedOption, setSelectedOption] = useState('all');
  const [leaderboards, setLeaderboards] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [popupPreview, setPopupPreview] = useState(false);
  const dispatch = useDispatch();
  const [previewJob, setPreviewJob] = useState(null);
  const [previewJobVideoLink, setPreviewJobVideoLink] = useState(null);
  const [previewJobType, setPreviewJobType] = useState(null);
  const router = useRouter();

  const handleTranslator = async () => {
    const data = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: '# of Votes',
          data: [
            translator.pendingJobsCompleted,
            translator.moderationJobsCompleted,
            translator.overlayJobsCompleted,
          ],
          backgroundColor: ['#FF3939', '#FC00FF', '#00FFFF'],
          borderColor: ['#FF3939', '#FC00FF', '#00FFFF'],
          borderWidth: 1,
        },
      ],
    };

    if (
      translator.pendingJobsCompleted == 0 &&
      translator.moderationJobsCompleted == 0 &&
      translator.overlayJobsCompleted == 0
    ) {
      setPieChartData(null);
    } else {
      setPieChartData(data);
    }
  };

  const handleAllJobs = async () => {
    dispatch(setJobsLoading(true));
    const res = await getAllJobs();
    const resData = res.data;
    const pending = resData
      ? Object.values(resData).map((item, i) => ({
          ...item,
          jobId: Object.keys(resData)[i],
        }))
      : [];

    const sortedJobs = pending.sort((a, b) => {
      return Number(b.timestamp) - Number(a.timestamp);
    });

    dispatch(setAllJobs(sortedJobs));
    dispatch(setJobsLoading(false));
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
      await acceptJob(jobId, 'pending');

      window.open(`/pending?jobId=${jobId}`, '_blank');
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleAcceptOverlayJob = async (jobId) => {
    try {
      await acceptJob(jobId, 'overlay');

      window.open(`/overlays?jobId=${jobId}`, '_blank');
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleAcceptModerationjob = async (jobId) => {
    try {
      await acceptJob(jobId, 'moderation');
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

  const filteredJobs = useMemo(() => {
    if (selectedOption === 'all') {
      return jobs;
    }
    return jobs.filter((job) => job.status === selectedOption);
  }, [jobs, selectedOption]);

  useEffect(() => {
    handleTranslator();
    handleLeaderboards();
  }, []);

  useEffect(() => {
    handleAllJobs();
  }, []);

  if (!translator.isLoggedIn) {
    router.push('/');
    return null;
  }

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
    },
    {
      title: 'Moderation',
      id: 'moderation',
      component: ModerationJobs,
    },
    {
      title: 'Overlay',
      id: 'overlay',
      component: OverlayJobs,
    },
    {
      title: 'Active',
      id: 'active',
      component: AllJobs,
    },
  ];

  const selectedJobType = jobTypes.find((job) => job.id === selectedOption);
  const ComponentToRender = selectedJobType.component;

  return (
    <>
      <PageTitle title="Dashboard" />
      <DashboardNoSidebar>
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
                  {previewJobVideoLink && (
                    <div className="mt-s2 w-full">
                      <div className="float-right h-[47px] w-[170px]">
                        <Button theme="success" onClick={handleAccept}>
                          Accept job
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Popup>
        <div className="p-s8">
          <div className="mb-s2 grid h-[320px] grid-cols-3 gap-s2">
            <div className="rounded-2xl bg-white-transparent p-s2 text-lg">
              <div className="text-2xl">Earnings</div>
              <div className="my-s2 h-[1px] w-full bg-white"></div>
              <div className="mb-s1">Lifetime</div>
              <div className="rounded-lg bg-white-transparent p-s1.5 font-bold">
                ${translator ? formatMoney(translator.totalPayment) : ''}
              </div>
              <div className="mt-s4 mb-s1">Weekly</div>
              <div className="rounded-lg bg-white-transparent p-s1.5 font-bold">
                ${translator ? formatMoney(translator.paymentOwed) : ''}
              </div>
            </div>

            <div className="h-full w-full rounded-2xl bg-white-transparent p-s2">
              <div className="text-2xl text-white">Job Statistics</div>
              <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
              <div className="flex w-full flex-row">
                <div className="h-full max-h-[221px] w-1/2 pr-s1">
                  <PieChart data={pieChartData ? pieChartData : null} />
                </div>
                <div className="flex w-1/2 flex-col justify-center pl-s1">
                  <div className="text-lg font-bold">
                    {translator ? translator.totalJobsCompleted : ''}{' '}
                    {(translator && translator.totalJobsCompleted) == 1
                      ? 'Job completed'
                      : 'Jobs completed'}
                  </div>
                  {jobTypes.slice(1).map((job, i) => (
                    <div
                      className="mt-s1 flex w-full flex-row items-center"
                      key={i}
                    >
                      <div
                        className={`mr-s1 h-3.5	w-3.5 rounded-full ${job.class}`}
                      ></div>
                      <div className="pt-1 text-lg">{job.title}</div>
                      <div className="ml-auto w-[50px] rounded-lg bg-white-transparent px-[8px] pt-[2px] text-center text-base">
                        {translator ? translator.pendingJobsCompleted : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white-transparent p-s2">
              <p className="text-2xl">Leaderboards</p>
              <div className="mt-s2 h-[1px] w-full bg-white"></div>
              <div className="h-[226px] overflow-x-hidden overflow-y-scroll font-bold">
                {leaderboards.map((data, i) => (
                  <div
                    key={i}
                    className="my-s2 grid grid-cols-[10%_20%_40%_30%]"
                  >
                    <p>{i + 1}</p>
                    <div>
                      <Image
                        src={data?.profilePicture ?? defaultProfilePicture}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                    <p>
                      {data.name.substring(0, 20)}
                      {data.name.length > 20 && '...'}
                    </p>
                    <p className="text-right">{data.totalJobsCompleted} jobs</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="my-s3 flex flex-row">
            {jobTypes.map((job) => (
              <div
                key={job.id}
                className={`mr-s2 min-w-fit cursor-pointer rounded-xl py-s1 px-s2 text-xl ${
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

          <div>
            {isLoading ? (
              <CircleLoader />
            ) : (
              <ComponentToRender
                jobs={filteredJobs}
                setPopupPreview={setPopupPreview}
                setPreviewJob={setPreviewJob}
                setPreviewJobType={setPreviewJobType}
                setPreviewJobVideoLink={setPreviewJobVideoLink}
              />
            )}
          </div>
        </div>
      </DashboardNoSidebar>
    </>
  );
};

export default Dashboard;
