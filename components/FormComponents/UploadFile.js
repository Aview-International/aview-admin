import Image from 'next/image';
import DottedBorder from '../UI/DottedBorder';
import UploadIcon from '../../public/img/icons/upload-icon1.svg';
import Correct from '../../public/img/icons/green-check-circle.svg';
import Incorrect from '../../public/img/icons/incorrect.svg';

const UploadFile = ({ file, handleChange, hasSubmitted, desc }) => {
  return (
    <DottedBorder classes="relative block md:inline-block">
      <label className="flex cursor-pointer flex-col items-center py-s6 md:px-s10">
        <Image
          src={file ? URL.createObjectURL(file) : UploadIcon}
          alt="Upload"
          width={120}
          height={120}
        />
        <p className="pt-s1 text-xl text-white">
          {!file ? desc : file.name.substring(0, 20)}
          {file && file.name.length > 20 && '...'}
        </p>
        <input
          type="file"
          name="resume"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
      </label>
      <span className="absolute right-[10px] top-[15px]">
        {file && <Image src={Correct} alt="Correct" width={25} height={25} />}
        {hasSubmitted && !file && (
          <Image src={Incorrect} alt="Incorrect" width={25} height={25} />
        )}
      </span>
    </DottedBorder>
  );
};

export default UploadFile;
