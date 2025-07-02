import Border from '../UI/Border';
import Arrow from '../../public/img/icons/dropdown-arrow.svg';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import HorizontalLine from '../UI/HorizontalLine';

const MultipleSelectInput = ({ answer, text, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedAnswer = useMemo(() => {
    return answer;
  });
  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      <p className="mb-s1 text-xl text-white">{text}</p>
      <div className="relative text-lg text-white">
        <Border borderRadius="[5px]" classes="w-full">
          <div
            className="flex w-full cursor-pointer items-center justify-between rounded-[5px] bg-black p-s1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <p>
              {selectedAnswer?.length > 0
                ? `${selectedAnswer[0]}, ${
                    selectedAnswer.length > 1 ? selectedAnswer[1] : ''
                  }${selectedAnswer.length > 2 ? ', ...' : ''}`
                : 'Select Languages'}
            </p>
            <span className={`transition-300  ${isOpen && 'rotate-180'}`}>
              <Image src={Arrow} alt="arrow" />
            </span>
          </div>
        </Border>
        <OPTIONS isOpen={isOpen} options={options} onChange={onChange} />
      </div>
    </OutsideClickHandler>
  );
};

const OPTIONS = ({ isOpen, options, onChange, selectedOptions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [options, searchQuery]
  );
  return (
    <Border
      borderRadius="[5px]"
      classes={`w-full absolute left-0 top-full transition-300 z-20 ${
        isOpen ? 'visible opacity-1' : 'invisible opacity-0'
      }`}
    >
      <div className="gradient-1 rounded-[5px] bg-black">
        <div className="mb-s1">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[5px] border-white bg-black p-s1 text-white focus:outline-none"
          />
        </div>
        <div className="max-h-48 overflow-scroll rounded-[5px]">
          {filteredOptions.map((option) => (
            <CHECKBOX
              option={option}
              onChange={onChange}
              key={option}
              isChecked={selectedOptions?.includes(option)}
            />
          ))}
        </div>
      </div>
    </Border>
  );
};

const CHECKBOX = ({ option, onChange, isChecked }) => {
  return (
    <>
      <div
        onClick={() => onChange(option)}
        className={`flex cursor-pointer items-center bg-black p-s1 text-lg text-white`}
      >
        <span
          className={`mr-4 flex h-5 w-5 items-center justify-center ${
            isChecked ? 'gradient-1' : 'bg-white'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 border-2 border-black ${
              isChecked ? 'gradient-1' : 'bg-black'
            }`}
          ></span>
        </span>
        {option}
      </div>
      <HorizontalLine />
    </>
  );
};
export default MultipleSelectInput;
