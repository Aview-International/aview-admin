import { useSelector } from 'react-redux';
import CheckBox from '../FormComponents/CheckBox';
import ToggleButton from '../FormComponents/ToggleButton';
import DashboardButton from '../UI/DashboardButton';

const TranslateOptions = ({
  handleSubmit,
  payload,
  setPayload,
  isLoading,
  uploadProgress,
  disabled,
}) => {
  const allLanguages = useSelector((state) => state.aview.allLanguages);

  const findLangData = (lang) =>
    allLanguages.find((el) => el.languageName === lang);

  const handleChange = (code) => {
    let allLanguages = [...payload.languages];
    if (allLanguages.includes(code))
      allLanguages.splice(allLanguages.indexOf(code), 1);
    else allLanguages.push(code);
    setPayload({ ...payload, languages: allLanguages });
  };

  return (
    <>
      <h3 className="mb-s3 text-2xl font-bold">Distribution</h3>
      <p className="mb-s4 text-lg">
        Which channels do you want these videos posted on? Want to post in an
        additional language? You can create more international channels.
      </p>
      <div className="max-h-[368px] overflow-y-auto overflow-x-hidden pr-s1.5">
        {/* // ?.map((el) => el.languageName) */}
        {allLanguages.map((lang, index) => (
          <div
            className="min-w-max(100%,360px) gradient-dark mb-s2 flex items-center justify-between rounded-md p-s1.5"
            key={index}
          >
            <div className="flex items-center justify-between">
              <div className="ml-3">
                <h2 className="text-lg">{lang?.localDialect}</h2>
                <p className="text-sm">{lang?.languageName}</p>
              </div>
            </div>
            <ToggleButton
              isChecked={payload.languages.includes(lang?.translateCode)}
              handleChange={() => handleChange(lang?.translateCode)}
            />
          </div>
        ))}
      </div>

      <br />
      {isLoading &&
        (uploadProgress < 100 ? (
          <div className="h-3 w-full rounded-full">
            <div
              className="gradient-2 h-full rounded-full"
              style={{ width: uploadProgress + '%' }}
            ></div>
          </div>
        ) : (
          <p>Processing media please wait</p>
        ))}

      {!isLoading && (
        <div className="w-full md:w-36">
          <DashboardButton
            isLoading={isLoading}
            onClick={handleSubmit}
            disabled={disabled}
          >
            Submit
          </DashboardButton>
        </div>
      )}
    </>
  );
};

export default TranslateOptions;
