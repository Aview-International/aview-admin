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
import FormInput from '../../components/FormComponents/FormInput';

const Dashboard = () => {
  const [translator, setTranslator] = useState(null);
  const [translatorId, setTranslatorId] = useState(null);
  const [settings, setSettings] = useState(false);
  

  const handleTranslator = async () => {
    const token = Cookies.get('session');
    const userId = authStatus(token).data.user_id;

    const translatorInfo = await getTranslatorFromUserId(userId);
    setTranslator(translatorInfo.data);
    setTranslatorId(translatorInfo.data._id);

  
  };

  

  useEffect(() => {
    handleTranslator();
  }, []);

  const formatMoney = (amount) => {
    let dollars = Math.floor(amount / 100);
    let cents = amount % 100;
    return dollars + '.' + (cents < 10 ? '0' : '') + cents;
  };

  

  return (
    <>
      <PageTitle title="Referral" />
      <div className="relative min-w-[1300px]">
        <DashboardLayoutNoSidebar
          setSettings={setSettings}
          profilePicture={translator ? translator.profilePicture : null}
          name={translator ? translator.name : ''}
        >
          <ReviewerSettingsPopup
            show={settings}
            onClose={() => {
              setSettings(false);
            }}
            translator={translator}
          />
          <div className="w-full h-full flex justify-center">
            <div className="w-[1000px] h-full flex flex-col">
                <div className="w-full h-[220px] rounded-lg bg-white-transparent mt-s5 p-s3">
                    <div className="text-white text-3xl font-bold">
                        Your referral statistics
                    </div>
                    <div className="mt-s5 flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <div className="font-bold text-white text-[64px] leading-none">
                                1200
                            </div>
                            <div className="text-lg text-white mt-s1">
                                AVIEW credits earned
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="font-bold text-white text-[64px] leading-none">
                                15
                            </div>
                            <div className="text-lg text-white mt-s1">
                                Reviewers referred
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="font-bold text-white text-[64px] leading-none">
                                $3200
                            </div>
                            <div className="text-lg text-white mt-s1">
                                Earned
                            </div>
                        </div>

                    </div>

                </div>

                <div className="w-full h-[290px] rounded-lg bg-white-transparent mt-s2 p-s3">
                    <div className="text-white text-3xl font-bold">
                        How it works
                    </div>

                    <div className="text-lg text-white">
                        Invite other reviewers to AVIEW and earn $5 per 10 referrals. 
                    </div>

                    <div className="text-white text-2xl font-bold mt-s5 mb-s2">
                        Share your link
                    </div>


                    <FormInput
                    label="Share your referrable link by copying and sharing it"
                    value={1}
                    placeholder="Your email"
                    onChange={(e) => {}}
                    name="title"
                    labelClasses="text-lg text-white !mb-s2"
                    valueClasses="text-lg font-light"
                    classes="!mb-s4"
                  />
                </div>

                <div className="w-full h-[200px] rounded-lg bg-white-transparent mt-s2 p-s3">
                    <div className="text-white text-3xl font-bold">
                        Invite a reviewer
                    </div>
                </div>

                
                

            </div>
          </div>
        </DashboardLayoutNoSidebar>
      </div>
    </>
  );
};

export default Dashboard;
