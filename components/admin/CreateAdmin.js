import { useState } from 'react';
import FormInput from '../FormComponents/FormInput';
import DashboardButton from '../UI/DashboardButton';
import { emailValidator } from '../../utils/regex';
import PhoneNumberInput from '../FormComponents/PhoneNumberInput';
import { COUNTRIES, ONBOARD_ADMIN, ROLES } from '../../constants/constants';
import Border from '../UI/Border';
import UploadFile from '../FormComponents/UploadFile';
import { createNewAdmin } from '../../pages/api/firebase';
import Button from '../UI/Button';

const Admin_Onboarding_Step_1 = ({ setStage, payload, setPayload }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const handleChange = (e) =>
    setPayload({ ...payload, [e.target.name]: e.target.value });

  const handleClick = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    setStage('stage2');
  };
  return (
    <>
      <p className="my-s4 text-2xl">Step 1 : Personal Information</p>
      <form className="block w-3/5">
        {ONBOARD_ADMIN.map((item, index) => (
          <FormInput
            key={`input-${index}`}
            onChange={handleChange}
            value={payload[item.name]}
            hasSubmitted={hasSubmitted}
            {...item}
          />
        ))}

        <p className="mb-s1 text-xl">Country of residence</p>
        <Border borderRadius="[5px] w-full">
          <select
            className="w-full border-none bg-black p-s1 text-xl"
            onChange={(e) =>
              setPayload({ ...payload, country: e.target.value })
            }
          >
            <option value="Select Country">Select Country</option>
            {COUNTRIES.map((country, index) => (
              <option value={country} key={`country-${index}`}>
                {country}
              </option>
            ))}
          </select>
        </Border>

        <div className="mt-s4 mb-s4">
          <PhoneNumberInput
            label="Phone Number"
            hasSubmitted={hasSubmitted}
            onChange={(value) => setPayload({ ...payload, phone: value })}
          />
        </div>

        <DashboardButton
          onClick={handleClick}
          disabled={
            !payload.firstName ||
            !payload.lastName ||
            !payload.country ||
            payload.country === 'Select Country' ||
            !emailValidator(payload.email) ||
            payload.phone.length < 10 ||
            payload.phone.length > 20
          }
        >
          Proceed
        </DashboardButton>
      </form>
    </>
  );
};

const Admin_Onboarding_Step_2 = ({ payload, setPayload, setStage }) => {
  const [sideEffects, setSideEffects] = useState({
    isLoading: false,
    hasSubmitted: false,
  });

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setSideEffects({ ...sideEffects, isLoading: true, hasSubmitted: true });
      await createNewAdmin(payload);
      setStage('success');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <p className="my-s4 text-2xl">Step 2 : Job Details</p>
      <form className="block w-3/5">
        <p className="mb-s1 text-xl">Select Role</p>
        <Border borderRadius="[5px] w-full">
          <select
            className="w-full border-none bg-black p-s1 text-xl"
            onChange={(e) => setPayload({ ...payload, role: e.target.value })}
          >
            <option value="Select Country">Choose Role</option>
            {ROLES.map((role, index) => (
              <option value={role} key={`role-${index}`}>
                {role}
              </option>
            ))}
          </select>
        </Border>

        <div className="mt-s4">
          <UploadFile desc="Upload Picture" />
        </div>

        <DashboardButton
          isLoading={sideEffects.isLoading}
          disabled={!payload.role}
          onClick={handleClick}
        >
          Proceed
        </DashboardButton>
      </form>
    </>
  );
};

const Success = () => {
  return (
    <div>
      <h2 className="title my-s4">
        <span className="gradient-1 gradient-text">Admin account created!</span>
      </h2>
      <p className={`mb-s4 text-xl text-white`}>Account created successfully</p>
      <div className='flex gap-6'>
        <Button type="secondary" purpose="route" route="/">
          Check all admins
        </Button>
        <Button type="primary" purpose="route" route="/">
          Add another admin
        </Button>
      </div>
    </div>
  );
};
export { Admin_Onboarding_Step_1, Admin_Onboarding_Step_2, Success };
