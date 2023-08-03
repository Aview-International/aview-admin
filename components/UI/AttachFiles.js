import React from 'react'
import Image from 'next/image'

const AttachFiles = ({ image, text, data, setData, name }) => {
  return (
    <div className='h-full bg-gray-1 rounded-md px-1 py-[2px]'>
      <label>
        <input 
         type="file"
         name={name}
         className="hidden"
         accept="video/mp4,video/x-m4v,video/*"
         onChange={(e) => setData(name, e.target.files[0] )}
        />
         {
          data ? <p>{data.name.slice(0,-4)}</p> : <div className='flex flex-row cursor-pointer'>
          {image && <Image src={image} alt='image' width={15} height={15}/>}
          <p className='ml-[6px] text-center'>{text}</p>
         </div>
         }
      </label>
    </div>
  )
}

export default AttachFiles
