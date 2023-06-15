import { useState } from 'react';
import DownloadFile from '../../components/admin/DownloadFile';
import Card from '../UI/Card';
import incorrect from '../../public/img/icons/incorrect.svg'
import dropdown_arrow from '../../public/img/icons/dropdown-arrow.svg'
import { DASHBOARD_FEATURES } from '../../constants/constants.js'
import UploadFile from '../../components/admin/UploadFile'
import ReviewBlock from '../sections/reused/ReviewBlock'
import OnboardingButton from '../Onboarding/button'
import Border from '../UI/Border'
import Image from 'next/image';

export const TranscriptionVideoFiles = () => {
  const [file, setFile] = useState(undefined);
  

  return (
    <>
      <p className="mb-s2 text-2xl">Actions</p>
      <Card borderRadius="2xl" fullWidth="92%">
       <div className='w-full h-full flex flex-col'>
        <div className='h-auto'>
          <IterateData idValue={1}/> 
        </div>
       </div>
      </Card>
    </>
  );
};


export const IterateData = ({idValue}) =>{
  const [isOpen, setIsOpen] = useState(1);
  return (
    <>
       {
          DASHBOARD_FEATURES.slice(0,idValue).map((feature,index)=>{
            return (
              <>
              <div className='flex flex-col' key={index}>
               <Border classes={`rounded-tl-2xl rounded-tr-2xl pl-0 pr-0 pb-0 ${feature.id===1&&'pt-0'} ${feature.id===idValue && 'rounded-bl-2xl rounded-br-2xl'}`}>
                 <div className={`w-full text-white flex justify-between rounded-tl-2xl rounded-tr-2xl px-5 bg-black ${ isOpen===feature.id ? 'h-auto items-start py-3' : `h-16 grow-0 items-center`} ${feature.id===idValue && 'rounded-bl-2xl rounded-br-2xl'}`}>
                  <div className='flex w-1/2 justify-start gap-5'>
                    <Image src={incorrect} width={30} height={30}/>
                    <p className='font-semibold text-2xl mt-1'>{feature.name}</p>
                  </div>
                 <div className={`w-1/2 flex justify-end `} onClick={()=>setIsOpen(feature.id)}>
                   <Image src={dropdown_arrow} width={28} height={28} className={`cursor-pointer duration-200 ease-in-out ${ isOpen===feature.id ? 'rotate-0' : '-rotate-90'}`}/>  
                 </div>
                </div> 
               </Border>
               {
                isOpen===feature.id && 
                <div>
                  <ReviewBlock text={`${feature.placeHolder}`}/>
                </div>  
               }
              </div>
             </>
            )
          })
       }
       {/* <div className="mt-s4 flex justify-start">
          <div className="w-46 text-xl font-semibold block">
            <OnboardingButton theme="light" disabled={true}>Submit Video</OnboardingButton>
          </div>
        </div> */}
    </>
  )
}

export const TranslationVideoFiles = () => {
  const [file, setFile] = useState(undefined);
  
  return (
    <>
      <p className="mb-s2 text-2xl">Actions</p>
      <Card borderRadius="2xl" fullWidth="92%">
       <div className='w-full h-full flex flex-col'>
        <div className='h-auto'>
          <IterateData idValue={2}/> 
        </div>
       </div>
      </Card>
    </>
  )
}

export const DubbingVideoFiles = () => {
  const [file, setFile] = useState(undefined);
  return (
    <>
      <p className="mb-s2 text-2xl">Actions</p>
      <Card borderRadius="2xl" fullWidth="92%">
       <div className='w-full h-full flex flex-col'>
        <div className='h-auto'>
          <IterateData idValue={3}/> 
        </div>
       </div>
      </Card>
    </>
  )
}

export const ThumbnailVideoFiles = () => {
  const [file, setFile] = useState(undefined);
  return (
    <>
      <p className="mb-s2 text-2xl">Actions</p>
      <Card borderRadius="2xl" fullWidth="92%">
       <div className='w-full h-full flex flex-col'>
        <div className='h-[565px]'>
          <IterateData idValue={4}/> 
        </div>
       </div>
      </Card>
    </>
  )
}
