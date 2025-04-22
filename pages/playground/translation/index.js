import Image from 'next/image';
import DottedBorder from '../../../components/UI/DottedBorder';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import UploadIcon from '../../../public/img/icons/upload-icon1.svg';
import Border from '../../../components/UI/Border';
import { useEffect, useState } from 'react';
import {
  getSupportedLanguages,
  uploadManualSrtTranslation,
} from '../../../services/api';
import PageTitle from '../../../components/SEO/PageTitle';
import ErrorHandler from '../../../utils/errorHandler';
import Arrowback from '../../../public/img/icons/arrow-back.svg';
import Link from 'next/link';

const ManualTranslation = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [lang, setLang] = useState(undefined);

  const getLang = async () => {
    const res = await getSupportedLanguages();
    setLanguages(res);
  };

  const handleLangSelect = (e) => {
    const selection = languages.find(
      (lang) => lang.languageName === e.target.value
    );
    setLang(selection);
  };

  useEffect(() => {
    getLang();
  }, []);

  const handleUpload = async () => {
    try {
      setIsLoading(true);
      const res = await uploadManualSrtTranslation(file, lang.translateCode);
      const filename = `${lang.translateCode}-${file.name}`;

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link); // Clean up
      window.URL.revokeObjectURL(url);

      setIsLoading(false);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  return (
    <>
      <PageTitle title="Manual Translation" />
      <Link href={'/playground'} className="mb-s4 flex items-center text-lg">
        <Image src={Arrowback} alt="" width={18} height={18} />
        <span className="pl-s2">Back</span>
      </Link>
      <div className="w-11/12 text-white">
        <DottedBorder classes="relative block md:inline-block w-full">
          {file && (
            <button
              onClick={() => setFile(null)}
              className={`gradient-2 absolute right-4 top-4 z-50 mx-auto block w-[80px] cursor-pointer rounded-full pb-1 pt-1 text-center text-sm`}
            >
              Remove
            </button>
          )}
          <input
            type="file"
            className="hidden"
            accept=".srt,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            id="srt_upload"
          />

          <div className="flex flex-col items-center py-s6">
            <div className="flex h-[80px] w-[80px] place-content-center rounded-full bg-gray-1">
              <Image src={UploadIcon} alt="Upload" width={40} height={40} />
            </div>

            {!file && (
              <label className="mt-s5 cursor-pointer" htmlFor="srt_upload">
                <Border borderRadius="full">
                  <span
                    className={`transition-300 mx-auto block rounded-full bg-black px-s3 pb-s1 pt-s1.5 text-center text-white`}
                  >
                    Upload Srt File
                  </span>
                </Border>
              </label>
            )}
            {file && <p className="my-s5">{file.name}</p>}
          </div>
        </DottedBorder>
        {file && (
          <div className="my-s3 text-center">
            <p className="text-xl">Select Language</p>
            <select
              className="border bg-transparent"
              onChange={handleLangSelect}
            >
              {languages.map(
                (el, i) =>
                  el.translation && <option key={i}>{el.languageName}</option>
              )}
            </select>
          </div>
        )}
        {file && (
          <button
            onClick={handleUpload}
            className={`gradient-2 z-50 mx-auto block w-[140px] cursor-pointer rounded-full pb-s1 pt-s1.5 text-center`}
          >
            Proceed
          </button>
        )}
        <p className="cursor-not-allowed py-s2 text-center text-lg underline opacity-30">
          {isLoading ? 'Processing, please wait' : 'Upload Srt File'}
        </p>
      </div>
    </>
  );
};

ManualTranslation.getLayout = DashboardLayout;

export default ManualTranslation;
