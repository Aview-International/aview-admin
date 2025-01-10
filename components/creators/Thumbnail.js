import Image from 'next/image';

const Thumbnail = ({ thumbnail }) => {
  return (
    <div>
      <label>
        <div>
          <Image
            src={thumbnail}
            alt="thumbnail_img"
            width={220}
            height={120}
            className="rounded-md bg-cover"
          />

          <div>
            {/* <input
              type="file"
              name="thumbnail"
              className="hidden"
              accept=".jpg, .jpeg, .png, image/*"
              onChange={(e) => setData('thumbnail', e.target.files[0])}
            /> */}
            <p className="w-[150px] cursor-pointer rounded-md bg-gray-1 p-1">
              Replace image
            </p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default Thumbnail;
