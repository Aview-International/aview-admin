import Download from '../../public/img/icons/download.svg';
import Image from 'next/image';
import OnboardingButton from '../UI/DashboardButton';

const DownloadFile = ({ name }) => {
  return (
    <>
      <p>{name}</p>
      <div className="my-s2 w-52">
        <OnboardingButton theme="dark">
          Download
          <Image
            src={Download}
            alt=""
            width={40}
            height={15}
            className="invert"
          />
        </OnboardingButton>
      </div>
    </>
  );
};

export default DownloadFile;
