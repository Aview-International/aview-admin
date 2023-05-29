import axios from "axios"
export default async function handler(req, res){
   const { type } =req.query
   const userid='123' 
   const containerId =await axios.post(`https://graph.facebook.com/v17.0/${userid}/media?video_url=${'video_url'}&media_type=REELS&caption=${'#captions'}&access_token=${'access_token'}`)
    const response = await axios.post(`https://graph.facebook.com/v17.0/${userid}/media_publish?creation_id=${containerId.id}&access_token=${'access_token'}`)
    console.log(response.data)
   
} 