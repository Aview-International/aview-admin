import Loader from '../../public/loaders/ButtonLoader';
import Shadow from './Shadow';

const DashboardButton = ({
  children,
  isLoading,
  onClick,
  disabled,
  theme,
  extraClasses = 'px-s2',
}) => {
  return disabled ? (
    <button
      className={`transition-300 w-full cursor-not-allowed rounded-full bg-gray-1 pb-s1 pt-s1.5 text-lg font-medium text-black ${extraClasses}`}
      onClick={null}
      disabled
    >
      {children}
    </button>
  ) : theme === 'error' ? (
    <button
      className="w-full rounded-full bg-red p-3"
      onClick={isLoading ? () => null : onClick}
    >
      {isLoading ? <Loader /> : children}
    </button>
  ) : (
    <Shadow classes="w-full">
      <div
        className={`${
          theme !== 'white' && 'gradient-1'
        } inline-block w-full rounded-full p-[3px]`}
      >
        <button
          id="opener"
          className={`transition-300 w-full cursor-pointer rounded-full pb-s1 pt-s1.5 text-lg font-medium ${extraClasses} ${
            theme === 'light' && 'text-black'
          } ${theme === 'dark' && 'bg-black text-white'} ${
            theme === 'success' && 'bg-green text-white'
          }  ${
            theme === 'white' &&
            'border-[3px] border-solid border-white bg-black text-white hover:bg-white hover:text-black'
          }`}
          onClick={isLoading ? () => null : onClick}
        >
          {isLoading ? <Loader /> : children}
        </button>
      </div>
    </Shadow>
  );
};

export default DashboardButton;
