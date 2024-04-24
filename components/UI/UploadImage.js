import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import DottedBorder from '../UI/DottedBorder';
import UploadIcon from '../../public/img/icons/upload-icon1.svg';
import Border from '../UI/Border';
import ErrorHandler from '../../utils/errorHandler';

const UploadImage = ({ setImage, image }) => {
  const [isFileDragging, setIsFileDragging] = useState(false);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsFileDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (!dropZone.contains(e.relatedTarget)) {
        setIsFileDragging(false);
      }
    };
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);

    return () => {
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
    };
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsFileDragging(false);
    const files = e.dataTransfer.files;
    try {
      if (files && files.length === 1) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          setImage(file);
        } else {
          throw new Error('Please submit an image file.');
        }
      } else {
        throw new Error('Please submit a single image file.');
      }
    } catch (error) {
      ErrorHandler(error);
    }
  };

  return (
    <div
      ref={dropZoneRef}
      className="w-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <DottedBorder
        classes={`p-s1 relative block md:inline-block w-full ${
          isFileDragging && !image
          ? 'border-gradient border-transparent'
          : 'border-white'
        }`}
      >
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          id="image_upload"
        />
        {image ? (
          <div className="flex flex-row justify-between">
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded Image"
              style={{
                maxWidth: '384px',
                height: '316px',
                width: '100%',
                objectFit: 'contain',
                backgroundColor: 'black',
                objectPosition: 'center',
              }}
              className="max-h-sm max-w-[24rem] rounded-lg"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-3 right-3 z-50 rounded-full bg-red p-s1 text-center text-sm"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-s6">
            <div className="flex h-[160px] w-[160px] place-content-center rounded-full bg-gray-1">
              <Image src={UploadIcon} alt="Upload" width={80} height={80} />
            </div>
            <label className="mt-s5" htmlFor="image_upload">
              <Border borderRadius="full">
                <span
                  className="transition-300 mx-auto block rounded-full bg-black px-s3 pt-s1.5 pb-s1 text-center text-white"
                >
                  Select image
                </span>
              </Border>
            </label>
            <p className="mt-s2 text-base text-white">or drag and drop image here</p>
          </div>
        )}
      </DottedBorder>
    </div>
  );
};

export default UploadImage;
