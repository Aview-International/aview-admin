import { Fragment, useState } from 'react';
import FormInput from '../FormComponents/FormInput';
import DashboardButton from '../UI/DashboardButton';
import { emailValidator } from '../../utils/regex';
import PhoneNumberInput from '../FormComponents/PhoneNumberInput';
import { COUNTRIES, ONBOARD_ADMIN, ROLES } from '../../constants/constants';
import Border from '../UI/Border';
import UploadFile from '../FormComponents/UploadFile';
import { createNewAdmin } from '../../pages/api/firebase';
import Button from '../UI/Button';
import axios from 'axios';
import FormData from 'form-data';

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
          <Fragment key={index}>
            <FormInput
              onChange={handleChange}
              value={payload[item.name]}
              hasSubmitted={hasSubmitted}
              {...item}
            />
            <br />
          </Fragment>
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
        <div className="w-60">
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
        </div>
      </form>
    </>
  );
};

const Admin_Onboarding_Step_2 = ({ payload, setPayload, setStage }) => {
  const [image, setImage] = useState(undefined);
  const [sideEffects, setSideEffects] = useState({
    isLoading: false,
    hasSubmitted: false,
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('file', image);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );
    try {
      setSideEffects({ ...sideEffects, isLoading: true, hasSubmitted: true });

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      setPayload({ ...payload, picture: res.data.secure_url });
      await createNewAdmin(payload, res.data.secure_url);
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
            <option value="Choose Role">Choose Role</option>
            {ROLES.map((role, index) => (
              <option value={role} key={`role-${index}`}>
                {role}
              </option>
            ))}
          </select>
        </Border>

        <div className="mt-s4">
          <UploadFile
            desc="Upload Profile Picture"
            file={image}
            handleChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className="mt-s4 w-60">
          <DashboardButton
            isLoading={sideEffects.isLoading}
            disabled={!payload.role || payload.role === 'Choose Role'}
            onClick={handleClick}
          >
            Proceed
          </DashboardButton>
        </div>
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
      <div className="flex gap-6">
        <Button type="secondary" purpose="route" route="/admin-accounts">
          Check all admins
        </Button>
        <Button
          type="primary"
          purpose="onClick"
          onClick={() => window.location.reload()}
        >
          Add another admin
        </Button>
      </div>
    </div>
  );
};
export { Admin_Onboarding_Step_1, Admin_Onboarding_Step_2, Success };
