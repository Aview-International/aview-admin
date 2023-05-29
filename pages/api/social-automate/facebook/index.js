import axios from "axios"


export default async function handler(req,res){
   const { type }=req.query

   if(type==='reels'){
    const data = {
        file_url: 'https://example.com/file.jpg'
    }
    
    const session = axios.post(`https://graph.facebook.com/v13.0/{page-id}/video_reels?upload_phase=start&access_token={access-token}`)
    const uploadVideo = axios.post(`{session.upload_url}/{session.video_id}`,data,{
        headers:{
            'Content-Type': 'application/octet-stream',
            'Authorization': 'Bearer{access-token}'
        }
    })
    const upload = await axios.post(`https://graph.facebook.com/v13.0/{page-id}/video_reels?upload_phase=finish&video_id={video-id}&video_state='PUBLISHED'&access_token={access-token}`)
    console.log(upload.data)
    }
    else{
        
       const dataBinary = await axios.get('https://example.com/file.jpg', { responseType: 'arraybuffer' })
       const data = dataBinary.data
       const size = data.byteLength
        const session = axios.post(`https://graph.facebook.com/{api-version}/{app-id}/uploads?&file_length={size}&file_type={video/mp4}&access_token={access-token}`)

        const upload = await axios.post(`https://graph.facebook.com/{api-version}/{session-id}`,data,{
            headers:{
                'Content-Type': 'application/octet-stream',
                'Authorization': 'Bearer {access-token}',
                'file_offset': '0'
            }
        })
   }
 }