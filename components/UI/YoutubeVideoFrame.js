import Image from 'next/image';
import Youtube from '../../public/img/icons/youtube-red.svg';
import ExternalLink from '../../public/img/icons/external-link.svg';

const YoutubeVideoFrame = ({ thumbnail, publishedAt, title, videoId }) => {
  return (
    <a
      className="cursor-pointer justify-self-center hover:opacity-80"
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className="group relative">
        <div className="mb-s1 flex text-lg">
          <Image src={Youtube} alt="" with={24} height={24} />
          <p className="pl-s1">YouTube Video</p>
        </div>
        <Image
          loader={() => thumbnail}
          src={thumbnail}
          alt={'Youtube'}
          width={250}
          height={150}
        />
        <span className="absolute right-2 top-0 hidden h-6 w-6 group-hover:block">
          <Image src={ExternalLink} alt={''} width={50} height={50} />
        </span>
      </div>
      <div className="flex">
        <div>
          <p className="mb-s1 text-lg">
            {title.substring(0, 17)}
            {title.length > 17 && '...'}
          </p>
          <p className="text-sm">
            <span>
              {new Date(publishedAt).toLocaleString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </p>
        </div>
      </div>
    </a>
  );
};

export default YoutubeVideoFrame;
