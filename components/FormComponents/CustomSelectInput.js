import Border from '../UI/Border';
import Arrow from '../../public/img/icons/dropdown-arrow.svg';
import Image from 'next/image';
import { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import Correct from '../../public/img/icons/green-check-circle.svg';
import Incorrect from '../../public/img/icons/incorrect.svg';

const CustomSelectInput = ({
  text,
  name,
  options,
  onChange,
  hasSubmitted,
  isValid,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState('');

  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      <div className="relative mb-s2  text-white/60">
        <p className="mb-1 text-white">{text}</p>
        <Border borderRadius="[5px] w-full">
          <div
            className="flex w-full cursor-pointer items-center justify-between rounded-md bg-black p-s1"
            onClick={() => setIsOpen(!isOpen)
            }
          >
            <p>{data || 'Select'}</p>
            <span className={`transition-300  ${isOpen && 'rotate-180'}`}>
              <Image src={Arrow} alt="arrow" />
            </span>
          </div>
        </Border>
        <span className="absolute right-[30px] bottom-[7px]">
          {isValid && (
            <Image src={Correct} alt="Correct" width={20} height={20} />
          )}
          {hasSubmitted && !isValid && (
            <Image src={Incorrect} alt="Incorrect" width={20} height={20} />
          )}
        </span>
        <Options
          isOpen={isOpen}
          setData={setData}
          options={options}
          name={name}
          setIsOpen={setIsOpen}
          onChange={onChange}
        />
      </div>
    </OutsideClickHandler>
  );
};

const Options = ({ isOpen, setData, options, name, setIsOpen, onChange }) => {
  return (
    <Border
      borderRadius="[5px]"
      classes={`w-full absolute left-0 top-full z-10 transition-300 ${
        isOpen ? 'visible opacity-1' : 'invisible opacity-0'
      }`}
    >
      <div className="gradient-1 rounded-[5px]">
        {options && options.map((option, i) => (
          <p
            className="my-[2px] cursor-pointer bg-black p-s1"
            key={`option-${i}`}
            onClick={() => {
              onChange(name, option);
              setData(option);
              setIsOpen(false);
            }}
          >
            {option}
          </p>
        ))}
      </div>
    </Border>
  );
};

export default CustomSelectInput;
