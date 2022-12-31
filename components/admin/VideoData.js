import { useState } from 'react';
import DownloadFile from '../../components/admin/DownloadFile';
import UploadFile from '../../components/admin/UploadFile';

export const TranscriptionVideoFiles = () => {
  const [file, setFile] = useState(undefined);
  return (
    <>
      <p className="mb-s2 text-2xl">Transcription</p>
      <DownloadFile name="logalpaultranscript.txt" />
      <div className="mt-s5">
        <UploadFile file={file} onChange={(e) => setFile(e.target.files[0])} />
      </div>
    </>
  );
};

export const TranslationVideoFiles = () => {
  const [file, setFile] = useState(undefined);
  return (
    <>
      <p className="mb-s2 text-2xl">Translation</p>
      <DownloadFile name="logalpaultranscript.txt" />
      <div className="mt-s5">
        <UploadFile file={file} onChange={(e) => setFile(e.target.files[0])} />
      </div>
    </>
  );
};

export const DubbingVideoFiles = () => {
  const [file, setFile] = useState(undefined);
  return (
    <>
      <p className="mb-s2 text-2xl">Dubbing</p>
      <DownloadFile name="logalpaultranscript.txt" />
      <div className="mt-s5">
        <UploadFile file={file} onChange={(e) => setFile(e.target.files[0])} />
      </div>
    </>
  );
};

export const ThumbnailVideoFiles = () => {
  const [file, setFile] = useState(undefined);
  return (
    <>
      <p className="mb-s2 text-2xl">Thumbnail</p>
      <DownloadFile name="logalpaultranscript.txt" />
      <div className="mt-s5">
        <UploadFile file={file} onChange={(e) => setFile(e.target.files[0])} />
      </div>
    </>
  );
};
