import { useSelector } from 'react-redux';
import CheckBox from '../FormComponents/CheckBox';
import ToggleButton from '../FormComponents/ToggleButton';
import DashboardButton from '../UI/DashboardButton';

const TranslateOptions = ({
  handleSubmit,
  payload,
  setPayload,
  isLoading,
  disabled,
  uploadProgress,
}) => {
  const languages = useSelector((state) => state.aview.allLanguages);

  const handleChange = (language) => {
    let allLanguages = [...payload.languages];
    if (allLanguages.includes(language))
      allLanguages.splice(allLanguages.indexOf(language), 1);
    else allLanguages.push(language);
    setPayload({ ...payload, languages: allLanguages });
  };

  return (
    <>
      <h3 className="mb-s3 text-2xl font-bold">Servicing</h3>
      <p className="mb-s4 text-lg">
        Which languages do you want these videos serviced in?
      </p>
      <div className="max-h-[368px] overflow-y-auto overflow-x-hidden pr-s1.5">
        {languages.map((language, index) => (
          <div
            className="min-w-max(100%,360px) gradient-dark mb-s2 flex items-center justify-between rounded-md p-s1.5"
            key={index}
          >
            <div className="ml-3">
              <h2 className="text-lg">{language.dialect}</h2>
              <p className="text-sm">{language.language}</p>
            </div>
            <ToggleButton
              isChecked={payload.languages.includes(language)}
              handleChange={() => handleChange(language)}
            />
          </div>
        ))}
      </div>
      <br />
      <CheckBox
        onChange={(e) =>
          setPayload({ ...payload, saveSettings: e.target.checked })
        }
        label="Save these settings for future translations"
      />
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
          <p>Processing video please wait</p>
        ))}
      {!isLoading && (
        <div className="w-full md:w-36">
          <DashboardButton isLoading={isLoading} onClick={handleSubmit} disabled={disabled}>
            Submit
          </DashboardButton>
        </div>
      )}
    </>
  );
};

export default TranslateOptions;
