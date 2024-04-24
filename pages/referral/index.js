import { useEffect, useState } from 'react';
import DashboardLayoutNoSidebar from '../../components/dashboard/DashboardLayoutNoSidebar';
import PageTitle from '../../components/SEO/PageTitle';
import {
  getTranslatorFromUserId,
  sendReferralEmail,
} from '../../services/apis';
import { authStatus } from '../../utils/authStatus';
import Cookies from 'js-cookie';
import ReviewerSettingsPopup from '../../components/dashboard/ReviewerSettingsPopup';
import Button from '../../components/UI/Button';
import ErrorHandler from '../../utils/errorHandler';
import Image from 'next/image';
import FormInput from '../../components/FormComponents/FormInput';
import UploadImage from '../../components/UI/UploadImage';
import SuccessHandler from '../../utils/successHandler';

const Dashboard = () => {
  const [translator, setTranslator] = useState(null);
  const [translatorId, setTranslatorId] = useState(null);
  const [settings, setSettings] = useState(false);
  const [referralVerification, setReferralVerification] = useState(false);
  const [verificationImage, setVerificationImage] = useState(undefined);
  const [referralEmail, setReferralEmail] = useState("");
  const [origin, setOrigin] = useState(null);

  const handleTranslator = async () => {
    const token = Cookies.get('session');
    const userId = authStatus(token).data.user_id;

    const translatorInfo = await getTranslatorFromUserId(userId);
    setTranslator(translatorInfo.data);
    setTranslatorId(translatorInfo.data._id);

  
  };

  const handleCopy = async (textToCopy) => {
    await navigator.clipboard.writeText(textToCopy);
    SuccessHandler("Url added to clipboard!");
  };

  useEffect(() => {
    handleTranslator();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
      
    }
  }, []);

  const formatMoney = (amount) => {
    let dollars = Math.floor(amount / 100);
    let cents = amount % 100;
    return dollars + '.' + (cents < 10 ? '0' : '') + cents;
  };

  const handleInvite = async() => {
    try{
      await sendReferralEmail(referralEmail, translatorId, window.location.origin).then(()=>{
        SuccessHandler("Invite sent!");
      });
    }catch (error){
      ErrorHandler(error);
    }
   
  }

  

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
          {referralVerification &&
            <div className="w-full h-full flex justify-center">
              <div className="w-[1000px] h-full flex flex-col">
                <div className="w-full h-fit rounded-lg bg-white-transparent mt-s5 p-s3">
                  <div className="text-white text-3xl font-bold">
                    Referral Verification
                  </div>

                  <div className="text-lg text-white mt-s2">
                    Please take a picture of yourself completing the following prompt: 
                  </div>

                  <div className="text-lg text-white mt-s2 p-s1 bg-white-transparent rounded-lg w-fit">
                    stick up two fingers 
                  </div>

                  <div className="w-full flex justify-center mt-s3">
                    <UploadImage
                      setImage={setVerificationImage}
                      image={verificationImage}
                    />
                  </div>

                  <div className="float-right h-[47px] w-[130px] mt-s3 ml-s2">
                      <Button
                        theme="light"
                        classes="flex justify-center items-center h-[36px] !px-s2"
                        onClick={()=>{}}
                      >
                        Submit
                      </Button>
                  </div>
                </div>
              </div>
            </div>

          }
          {referralVerification==false && 
          <div className="w-full h-full flex justify-center">
            <div className="w-[1000px] h-full flex flex-col">
                <div className="w-full h-[220px] rounded-lg bg-white-transparent mt-s5 p-s3">
                    <div className="text-white text-3xl font-bold">
                        Your referral statistics
                    </div>
                    <div className="mt-s5 flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <div className="font-bold text-white text-[64px] leading-none">
                                10
                            </div>
                            <div className="text-lg text-white mt-s1">
                                Referrals pending
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
                                $20
                            </div>
                            <div className="text-lg text-white mt-s1">
                                Earned
                            </div>
                        </div>

                    </div>

                </div>

                <div className="w-full h-[300px] rounded-lg bg-white-transparent mt-s2 p-s3">
                    <div className="text-white text-3xl font-bold">
                        How it works
                    </div>

                    <div className="text-lg text-white mt-s2">
                        Invite other reviewers to AVIEW and earn $5 per 10 referrals. 
                    </div>

                    <div className="text-white text-2xl font-bold mt-s5 mb-s2">
                        Share your link
                    </div>


                    <div className="flex flex-row items-center">
                      <FormInput
                      label="Share your referral link by copying and sharing it."
                      value={`${origin}/onboarding?referralTranslatorId=${translatorId}`}
                      placeholder="Your email"
                      onChange={(e) => {}}
                      name="title"
                      labelClasses="text-lg text-white !mb-s3"
                      valueClasses="text-lg font-light"
                      classes="!mb-s4"
                    />
                     <div className="float-right h-[47px] w-[161px] mt-[12px] ml-s2">
                      <Button
                        theme="light"
                        classes="flex justify-center items-center h-[36px] !px-s2"
                        onClick={()=>{handleCopy(`${origin}/onboarding?referralTranslatorId=${translatorId}`)}}
                      >
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[190px] rounded-lg bg-white-transparent mt-s2 p-s3">
                    <div className="text-white text-3xl font-bold mb-s2">
                        Invite a reviewer
                    </div>
                    <div className="flex flex-row items-center">
                      <FormInput
                      label="Invite a reviewer and get 500 credits instantly."
                      value={referralEmail}
                      placeholder="Email"
                      onChange={(e) => {setReferralEmail(e.target.value)}}
                      name="title"
                      labelClasses="text-lg text-white !mb-s3"
                      valueClasses="text-lg font-light"
                      classes="!mb-s4"
                    />
                     <div className="float-right h-[47px] w-[161px] mt-[12px] ml-s2">
                      <Button
                        theme="light"
                        classes="flex justify-center items-center h-[36px] !px-s2"
                        onClick={()=>{handleInvite()}}
                      >
                        Invite
                      </Button>
                    </div>
                  </div>

                    
                </div>
            </div>
          </div>}


        </DashboardLayoutNoSidebar>
      </div>
    </>
  );
};

export default Dashboard;
