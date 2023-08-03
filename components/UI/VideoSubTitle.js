import React from 'react'
import Image from 'next/image'

const VideoSubTitle = ({ image, text, classes, children }) => {
  return (
    <div className='flex flex-col gap-y-4 text-white'>
      <div className={`flex flex-row justify-start w-full items-center ${classes}`}>
        <Image src={image} alt='sub-title-image' width={20} height={20}/>
        <h3 className='ml-3 text-center pt-1 h-auto font-medium text-lg'>{text}</h3>
      </div>  
      <div className='pl-8'>
        {children}
      </div>
    </div>
  )
}

export default VideoSubTitle
