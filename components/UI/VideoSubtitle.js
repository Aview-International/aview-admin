import Image from 'next/image';

const VideoSubTitle = ({ image, text, classes, children }) => {
  return (
    <div className="flex flex-col gap-y-4 text-white">
      <div
        className={`flex w-full flex-row items-center justify-start ${classes}`}
      >
        <Image src={image} alt="sub-title-image" width={20} height={20} />
        <h3 className="ml-3 h-auto pt-1 text-center text-lg font-medium">
          {text}
        </h3>
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
};

export default VideoSubTitle;
