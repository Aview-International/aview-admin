import Border from '../UI/Border';
import Arrow from '../../public/img/icons/dropdown-arrow.svg';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import Correct from '../../public/img/icons/green-check-circle.svg';
import Incorrect from '../../public/img/icons/incorrect.svg';

const CustomSelectInput = ({
  text,
  options,
  onChange,
  hasSubmitted,
  isValid,
  hideCheckmark,
  value,
  labelClasses,
  valueClasses,
  classes
}) => {
  const elementRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const scroll = typeof window !== 'undefined' && window.scrollY;

  const isBottom = useMemo(() => {
    const elementPosition = elementRef.current?.offsetTop;
    const windowHeight = typeof window !== 'undefined' && window.outerHeight;

    if (elementPosition > windowHeight / 2) return true;
    else return false;
  }, [elementRef.current?.offsetTop, scroll]);

  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      <div className={`relative mb-s4 text-xl text-white ${classes}`} ref={elementRef}>
        <p className={`mb-s1 ${labelClasses}`}>{text}</p>
        <Border borderRadius="[5px] w-full">
          <div
            className="flex w-full cursor-pointer items-center justify-between rounded-md bg-black p-s1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <p className={`text-white/70 ${valueClasses}`}>{value || 'Your response'}</p>
            <span className={`transition-300  ${isOpen && 'rotate-180'}`}>
              <Image src={Arrow} alt="arrow" />
            </span>
          </div>
        </Border>
        {!hideCheckmark && (
          <span className="absolute right-[35px] bottom-[7px]">
            {isValid && (
              <Image src={Correct} alt="Correct" width={20} height={20} />
            )}
            {hasSubmitted && !isValid && (
              <Image src={Incorrect} alt="Incorrect" width={20} height={20} />
            )}
          </span>
        )}
        <Options
          isOpen={isOpen}
          options={options}
          setIsOpen={setIsOpen}
          onChange={onChange}
          isBottom={isBottom}
        />
      </div>
    </OutsideClickHandler>
  );
};

const Options = ({ isOpen, options, setIsOpen, onChange, isBottom }) => {
  return (
    <Border
      borderRadius="[5px]"
      classes={`w-full absolute left-0 ${
        isBottom ? 'bottom-1/2' : 'top-full'
      } mt-3 z-10 transition-300 max-h-[300px] overflow-x-hidden overflow-y-scroll ${
        isOpen ? 'visible opacity-1' : 'invisible opacity-0'
      }`}
    >
      <div className="gradient-1 rounded-[5px]">
        {options.map((option, i) => (
          <p
            className="my-[2px] cursor-pointer bg-black p-s1"
            key={`option-${i}`}
            onClick={() => {
              onChange(option);
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