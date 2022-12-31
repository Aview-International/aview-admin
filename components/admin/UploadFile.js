import UploadIcon from '../../public/img/icons/upload-icon1.svg';
import Image from 'next/image';
import OnboardingButton from '../UI/DashboardButton';
import DottedBorder from '../UI/DottedBorder';

const UploadFile = ({ file, onChange }) => {
  return (
    <>
      <div className="w-1/2">
        <DottedBorder>
          <label
            className="gradient-dark block flex h-24 flex-col items-center justify-center p-s4"
            htmlFor="transcription_file"
          >
            <input
              id="transcription_file"
              type="file"
              className="hidden"
              accept="application/*"
              onChange={onChange}
            />
            <p>Upload transcription file here</p>
            {file && (
              <p>
                {file.name.substring(0, 22)}
                {file.name.length > 22 && '...'}
              </p>
            )}
          </label>
        </DottedBorder>
      </div>
      <div className="my-s2 w-48">
        <OnboardingButton theme="light" disabled={!file}>
          <span className="pr-s1">Upload</span>
          <Image
            src={UploadIcon}
            alt="Upload"
            className="brightness-0"
            width={40}
            height={15}
          />
        </OnboardingButton>
      </div>
    </>
  );
};

export default UploadFile;
