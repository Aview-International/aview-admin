import Image from 'next/image';
import DashboardLayout from '../../components/dashboard/DashboardLayoutOnboarding';
import FormInput from '../../components/FormComponents/FormInput';
import CustomSelectInput from '../../components/FormComponents/CustomSelectInput';
import Button from '../../components/UI/Button';
import Blobs from '../../components/UI/blobs';
import React, { useState, useEffect, useSelector } from 'react';
import ErrorHandler from '../../utils/errorHandler';
import SuccessHandler from '../../utils/successHandler';
import {
  getSupportedLanguages,
  getCountriesAndCodes,
  createTranslator,
  sendSupportMessage,
} from '../../services/apis';
import FullScreenLoader from '../../public/loaders/FullScreenLoader';
import CheckBox from '../../components/FormComponents/CheckBox';
import Popup from '../../components/UI/PopupWithBorder';
import messages from '../../public/img/icons/messages.svg';
import Textarea from '../../components/FormComponents/Textarea';
import PageTitle from '../../components/SEO/PageTitle';
import MultipleSelectInput from '../../components/FormComponents/MultipleSelectInput';
import { useRouter } from 'next/router';


const Onboarding = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState([]);
  const [country, setCountry] = useState('Select');
  const [paypal, setPaypal] = useState('');
  const [xoom, setXoom] = useState('');
  const [remitly, setRemitly] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [countriesAndCodes, setCountriesAndCodes] = useState([]);
  const [checkedState, setCheckedState] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [loader, setLoader] = useState('');
  const [popupSupport, setPopupSupport] = useState(false);
  const [popupSubmit, setPopupSubmit] = useState(false);
  const [supportEmail, setSupportEmail] = useState('');
  const [supportInquiry, setSupportInquiry] = useState('');

  const router = useRouter();
  const { referralTranslatorId } = router.query;

  const handleCheckBox = (name) => {
    setCheckedState(name);
  };

  const handleSubmit = async () => {
    setLoader('submit');
    try {
      if (!name) {
        throw new Error('Please enter name');
      } else if (!email) {
        throw new Error('Please enter email');
      } else if (!verifyEmail(email)) {
        throw new Error('Please enter a valid email');
      } else if (nativeLanguage.length === 0) {
        throw new Error('Please select native language');
      } else if (country === 'Select') {
        throw new Error('Please select country');
      } else if (!checkedState) {
        throw new Error('Please select payment method');
      } else if (
        !(
          (checkedState === 'xoom' && xoom) ||
          (checkedState === 'remitly' && remitly) ||
          (checkedState === 'paypal' && paypal)
        )
      ) {
        throw new Error('Please enter payment details');
      } else {
        try {
          localStorage.setItem('emailForSignIn', email);
          


          await createTranslator(
            name,
            email,
            nativeLanguage,
            country,
            checkedState,
            paymentDetails,
            referralTranslatorId,
          );

          setPopupSubmit(true);
        } catch (error) {
          ErrorHandler(error);
        }

        setLoader('');
      }
    } catch (error) {
      ErrorHandler(error);
      setLoader('');
    }
  };

  const handleSupport = async (e) => {
    e.preventDefault();
    setLoader('support');

    try {
      if (!supportEmail) {
        throw new Error('Please enter email');
      } else if (!verifyEmail(supportEmail)) {
        throw new Error('Please enter a valid email');
      } else if (!supportInquiry) {
        throw new Error('Please enter inquiry');
      } else {
        try {
          await sendSupportMessage(supportEmail, supportInquiry);
          SuccessHandler('sent!');
          setPopupSupport(false);
        } catch (error) {
          ErrorHandler(error);
        }

        setLoader('');
      }
    } catch (error) {
      ErrorHandler(error);
      setLoader('');
    }
  };

  const verifyEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getLanguagesAndCountries = async () => {
    await getSupportedLanguages().then((res) => {
      setSupportedLanguages(res.map((item) => item.languageName).sort());
    });

    await getCountriesAndCodes().then((res) => {
      setCountriesAndCodes(res.map((item) => item.name).sort());
    });

    setIsLoading(false);
  };

  const handleMultipleLanguages = (option) => {
    const allLanguages = [...nativeLanguage];
    if (allLanguages.includes(option))
      allLanguages.splice(allLanguages.indexOf(option), 1);
    else allLanguages.push(option);
    setNativeLanguage(allLanguages);
  };

  useEffect(() => {
    getLanguagesAndCountries();
  }, []);

  return (
    <>
      <PageTitle
        title="Onboarding"
        description={
          'Join the league of reviewers servicing and distributing contents globally'
        }
      />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Popup show={popupSubmit} disableClose={true}>
            <div className="h-full w-full text-white">
              <div className="w-[500px] rounded-2xl bg-indigo-2 p-s3">
                <div className="flex flex-col items-center justify-center">
                  <h2 className="mb-s2 text-2xl">Verify email address</h2>
                  <p className="text-center">
                    Please check your email inbox to verify and continue, thank
                    you
                  </p>
                </div>
              </div>
            </div>
          </Popup>
          <Popup show={popupSupport} onClose={() => setPopupSupport(false)}>
            <div className="h-full w-full">
              <div className="w-[600px] rounded-2xl bg-indigo-2 p-s2">
                <div className="flex flex-col items-center justify-center">
                  <h2 className="mb-s4 text-2xl text-white">Contact Support</h2>
                  <FormInput
                    label="Email"
                    value={supportEmail}
                    placeholder="Your email"
                    onChange={(e) => setSupportEmail(e.target.value)}
                    name="title"
                    labelClasses="text-lg text-white !mb-[4px]"
                    valueClasses="text-lg font-light"
                    classes="!mb-s4"
                  />
                  <h2 className="w-full text-lg text-white">Support Message</h2>
                  <Textarea
                    placeholder="Your inquiry"
                    classes="!mb-s2"
                    textAreaClasses="text-lg text-white font-light"
                    onChange={(e) => setSupportInquiry(e.target.value)}
                  />
                  <div className="w-full">
                    <div className="float-right h-[47px] w-[134px]">
                      <Button
                        theme="light"
                        onClick={handleSupport}
                        isLoading={loader === 'support'}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
          <div className="float-right mt-s2 mr-[100px] cursor-pointer">
            <a
              className="relative flex items-center rounded-full bg-white-transparent px-s2 py-2.5 text-sm"
              onClick={() => setPopupSupport(true)}
            >
              <span className="mr-s1.5 grid place-content-center brightness-0 invert">
                <Image src={messages} alt="Messages" />
              </span>
              <span className="mt-0.5 text-white">Support</span>
            </a>
          </div>
          <div className="mx-auto mt-s5 mb-[200px] max-h-screen w-full max-w-[768px] px-4 sm:px-6 lg:px-8">
            <div className="text-6xl font-bold text-white text-center">
              Work with us
            </div>
            <div className="mt-s2 text-lg font-normal text-white text-center mb-s5">
              Sign up today to become a translator and manage content.
            </div>
            
            <div className="w-full h-full bg-white-transparent px-s4 pt-s4 pb-s14 rounded-2xl">
              <div className=" text-xl font-bold text-white">
                Personal Information
              </div>
              <FormInput
                label="Name"
                placeholder="First and last Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                labelClasses="text-lg text-white mt-s2 !mb-[4px]"
                valueClasses="text-lg font-light"
                classes="!mb-s2"
              />

              <FormInput
                label="Email"
                value={email}
                placeholder="Your email"
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                labelClasses="text-lg text-white !mb-[4px]"
                valueClasses="text-lg font-light"
                classes="!mb-s2"
              />

              <MultipleSelectInput
                text="Native Languages"
                answer={nativeLanguage}
                options={supportedLanguages}
                onChange={(selectedOption) => {
                  handleMultipleLanguages(selectedOption);
                }}
                labelClasses="!text-lg !text-white !mb-[4px]"
                valueClasses="!text-lg !text-white ml-s1 font-light"
                classes="!mb-s2"
                hideCheckmark={true}
              />

              <CustomSelectInput
                text="Country"
                value={country}
                options={countriesAndCodes}
                onChange={(selectedOption) => setCountry(selectedOption)}
                labelClasses="text-lg text-white !mb-[px]"
                valueClasses="text-lg !text-white ml-s1 font-light"
              />

              <div className="mt-s3 text-xl font-bold text-white">
                Payment method
              </div>

              <div className="mt-s2">
                <CheckBox
                  label="Paypal"
                  onChange={() => handleCheckBox('paypal')}
                  name="checkbox"
                  labelClasses="text-lg mt-[3px]"
                  isChecked={checkedState === 'paypal'}
                />
              </div>
              {checkedState == 'paypal' && (
                <FormInput
                  value={paypal}
                  placeholder="Name, username, email"
                  onChange={(e) => {
                    setPaypal(e.target.value);
                    setPaymentDetails(e.target.value);
                  }}
                  labelClasses="text-lg text-white mt-s2"
                  valueClasses="text-lg font-light"
                  classes="!mb-s2"
                />
              )}

              <div className="mt-s1">
                <CheckBox
                  label="Xoom"
                  onChange={() => handleCheckBox('xoom')}
                  name="checkbox"
                  labelClasses="text-lg mt-[5px]"
                  isChecked={checkedState === 'xoom'}
                />
              </div>

              {checkedState === 'xoom' && (
                <FormInput
                  value={xoom}
                  placeholder="Name, username, email"
                  onChange={(e) => {
                    setXoom(e.target.value);
                    setPaymentDetails(e.target.value);
                  }}
                  labelClasses="text-lg text-white mt-s2"
                  valueClasses="text-lg font-light"
                  classes="!mb-s2"
                />
              )}

              <div className="mt-s1">
                <CheckBox
                  label="Remitly"
                  onChange={() => handleCheckBox('remitly')}
                  name="checkbox"
                  labelClasses="text-lg mt-[5px]"
                  isChecked={checkedState === 'remitly'}
                />
              </div>

              {checkedState === 'remitly' && (
                <FormInput
                  value={remitly}
                  placeholder="Name, username, email"
                  onChange={(e) => {
                    setRemitly(e.target.value);
                    setPaymentDetails(e.target.value);
                  }}
                  labelClasses="text-lg text-white mt-s2"
                  valueClasses="text-lg font-light"
                  classes="!mb-s2"
                />
              )}

              <div className="float-right mt-s4 h-[47px] w-[134px]">
                <Button
                  theme="light"
                  onClick={handleSubmit}
                  isLoading={loader === 'submit'}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
          <Blobs />
        </>
      )}
    </>
  );
};

Onboarding.getLayout = DashboardLayout;

export default Onboarding;
