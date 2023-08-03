import React,{ useState } from 'react'
import Image from 'next/image'
import VideoSubTitle from '../UI/VideoSubTitle'
import align_left from '../../public/img/icons/align-left.svg'
import calender from '../../public/img/icons/calendar.svg'
import info from '../../public/img/icons/info_1.svg'
import paperclip from '../../public/img/icons/paperclip.svg'
import tv from '../../public/img/icons/tv.svg'
import TextInput from '../UI/TextInput'
import AttachFiles from '../UI/AttachFiles'
import RadioContent from '../sections/reused/RadioContent'
import CustomSelectInput from '../FormComponents/CustomSelectInput'
import Button from '../UI/Button'
import Textarea from '../FormComponents/Textarea'
import { DASHBOARD_CREATORS_PLAYLISTS,
         DASHBOARD_CREATORS_VIDEO_LANGUAGE,
         DASHBOARD_CREATORS_VIDEO_LOCATION,
         DASHBOARD_CREATORS_VIDEO_CATEGORY,
          
    } from '../../constants/constants'
import Thumbnail from './Thumbnail'
import VideoUpload from './VideoUpload'


const DistributeUI = () => {

  const [data,setData] = useState({
    video: '',
    title: '',
    finalVideo: '',
    titleAndDescriptionTranslation: '',
    description: '',
    thumbnail: '',
    playlists: '',
    audience: false,
    tags: [],
    video_language: '',
    video_location: '',
    category: '',
    monetization: false,
    ad_suitability: false,
    date: '',
    time: '',
  })

  console.log(data)

  const handleInputChange = (name, value) => {
    setData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };


  return (
    <>
    <div className='flex flex-col  my-12 justify-center items-center'>
    <div className='w-1/2'>
      <VideoUpload data={data.video} setData={handleInputChange} name="video"/>
    </div>
    <div className='w-1/2'>
      <div className='flex flex-col gap-y-8 w-full mt-8'>
      <div className={`flex flex-row justify-start w-full items-center text-white`}>
        <Image src={tv} alt='sub-title-image' width={20} height={20}/>
        <div className='ml-5 w-full'>
          <TextInput placeholder="Add a title..." bgColor="black" textColor="white" value={data.title} setData={handleInputChange} name="title"/>
        </div>
      </div>
      <VideoSubTitle image={align_left} text='Video Assets'>
        <div className='py-2 flex flex-col justify-between w-full h-full'>
          <div>
             <div className='flex flex-row justify-start gap-x-2 items-center'>
               <p>Final Video: </p>
               <AttachFiles image={paperclip} text="Upload a file" data={data.finalVideo} setData={handleInputChange} name="finalVideo"/>
             </div>
             <div className='flex flex-row justify-start gap-x-2 items-center'>
               <p>Title and Description Translations: </p>
               <AttachFiles image={paperclip} text="Upload a file" data={data.titleAndDescriptionTranslation} setData={handleInputChange} name="titleAndDescriptionTranslation"/>
             </div>
          </div>
          <div>
            <Textarea placeholder="Tell viewers about your video" name="description" textColor="false"  label="Description" value={data.description} onChange={handleInputChange}/>
          </div> 
        </div>
      </VideoSubTitle>
      <VideoSubTitle image={paperclip} text='Thumbnail'>
        <Thumbnail data={data.thumbnail} setData={handleInputChange} />
      </VideoSubTitle>
      <VideoSubTitle image={info} text='Details'>
       <div className='flex flex-col justify-start gap-y-2'>
        <div className='w-[35%]'>
          <CustomSelectInput text="Playlists" name="playlists" onChange={handleInputChange}  options={DASHBOARD_CREATORS_PLAYLISTS} />
        </div>
        <RadioContent title="Audience" option1="Yes, it's made for kids" option2="No, it's not for kids" data={data.audience} setData={handleInputChange} name="audience"/>
        <div>
          <h3 className='font-medium mt-3 mb-1'>Tags</h3>
          <TextInput placeholder='Add a tag' bgColor="black" value={data.tags} name="tags" setData={handleInputChange} textColor="white/80" />
        </div>
        <div className=' grid grid-cols-2 mt-3 gap-3 w-full'>
          <CustomSelectInput text="Video Language" name="video_language" onChange={handleInputChange} options={DASHBOARD_CREATORS_VIDEO_LANGUAGE}/>
          <CustomSelectInput text="Video Location" name="video_location" onChange={handleInputChange} options={DASHBOARD_CREATORS_VIDEO_LOCATION}/>
        </div>
        <div className='w-full'>
          <CustomSelectInput text="Category" name="category" onChange={handleInputChange} options={DASHBOARD_CREATORS_VIDEO_CATEGORY}/>
        </div>
        <RadioContent title="Monetization" option1="Yes" option2="No" data={data.monetization} setData={handleInputChange} name="monetization"/>
        <div className='mt-2'>
         <RadioContent title="Ad Suitability" option1="Yes" option2="No" data={data.ad_suitability} setData={handleInputChange} name="ad_suitability"/>
        </div>
      </div>
      </VideoSubTitle>
      <VideoSubTitle image={calender} text='Schedule'>
        <div className='flex flex-row justify-start items-center'>
          <div className='w-[35%]'>
           <CustomSelectInput text="Date and time"/>
          </div>
          <div className='w-[35%] ml-3 mt-3'> 
            <TextInput placeholder="10 AM" bgColor="black" textColor="white/80" value={data.time} name="time" setData={handleInputChange}/>
          </div>
        </div>
      </VideoSubTitle>
    </div>
    <div className="w-36 text-xl ml-8 text-center font-semibold">
      <Button theme="light">
        Submit
      </Button>
    </div>
    </div>
    </div>
    </>
  )
}

export default DistributeUI
