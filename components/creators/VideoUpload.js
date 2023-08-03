import Image from 'next/image';
import DottedBorder from '../UI/DottedBorder';
import UploadIcon from '../../public/img/icons/upload-icon1.svg';
import Border from '../UI/Border';

const VideoUpload = ({ data, setData, name, isValid, hasSubmitted }) => {
  return (
    <div className="w-full">
      <DottedBorder classes="relative block md:inline-block w-full">
        <div className="flex flex-col items-center py-s3">
          <div className="flex h-[160px] w-[160px] place-content-center rounded-full bg-gray-1">
            <Image
              src={UploadIcon}
              alt="Upload"
              width={80}
              height={80}
            />
          </div>
          <p className="py-s2 text-xl text-white">
            {
             'Drag and drop videos files to upload'
            }
          </p>
          <label className="cursor-pointer">
            <input
              type="file"
              name={name}
              className="hidden"
              accept="video/mp4,video/x-m4v,video/*"
              onChange={(e) => setData(name,  e.target.files[0])}
            />
            <Border borderRadius="full">
                <span
                  className={`transition-300 mx-auto block rounded-full bg-black px-s4 py-s1 text-center text-white`}
                >
                  Select Files
                </span>
            </Border>
          </label>
          {/* <span className="absolute right-[10px] top-[15px]">
            {isValid && (
              <Image src={Correct} alt="Correct" width={25} height={25} />
            )}
            {hasSubmitted && !isValid && (
              <Image src={Incorrect} alt="Incorrect" width={25} height={25} />
            )}
          </span> */}
        </div>
      </DottedBorder>
    </div>
  );
};

export default VideoUpload;
