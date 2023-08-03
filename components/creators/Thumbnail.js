import React,{ useState, useEffect } from 'react'
import Image from 'next/image'

const Thumbnail = ({ data, setData }) => {
    const [uploadedImage, setUploadedImage] = useState('');

    const handleImageUpload = (file) => {
      
      
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
   
  const convertDate= (formattedDate) => {
    const newDate = formattedDate.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return newDate
  }


  useEffect(()=>{
    if(data){
      handleImageUpload(data)
    }
  },[data])

return (
  <div>
    <label>
      <div>
        { data ? 
          <div className='flex flex-col justify-start my-1'>
            <div className='flex flex-row justify-start'>
              {uploadedImage && <Image src={uploadedImage} alt="thumbnail_img" width={220} height={120} className='rounded-md bg-cover'/>}
               <div className='flex flex-col ml-4'>
                 <p className='font-medium text-lg'>{data.name}</p>
                 <p>Added {convertDate(data.lastModifiedDate)}</p>
               </div>
            </div>   
            <div>
             <input 
              type="file"
              name="thumbnail"
              className="hidden"
              accept=".jpg, .jpeg, .png, image/*"
              onChange={(e) => setData("thumbnail", e.target.files[0] )}
             />
             <p className='p-1 bg-gray-1 w-[115px] rounded-md cursor-pointer mt-4'>Replace Image</p>
            </div>
          </div> 
          : 
          <div>
           <input 
             type="file"
             name="thumbnail"
             className="hidden"
             accept=".jpg, .jpeg, .png, image/*"
             onChange={(e) => setData("thumbnail", e.target.files[0] )}
            />
            <p className='p-1 bg-gray-1 w-[150px] rounded-md cursor-pointer'>Add an attachment</p>
          </div>
        }
      </div>
    </label>
  </div>
  )
}

export default Thumbnail
