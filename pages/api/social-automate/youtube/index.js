import { google } from 'googleapis'

const authClient = new google.auth.OAuth2({
  clientId: '',
  clientSecret: '',
  redirectUri: ''
})

authClient.setCredentials({
  access_token: '',
  refresh_token: ''
})

const youtube = google.youtube({
  version: 'v3',
  auth: authClient
})

export default async function handler(req, res) {
    const channels = await youtube.channels.list({
        part: ['snippet','contentDetails'],
        forUsername:'',
    })
    
    const channelId = channels.data.items[0].id
    const videoFilePath = '' //path_to_video_file
    const videoFileSize = fs.statSync(videoFilePath).size
  
    const res = await youtube.videos.insert({
      part: 'id,snippet,status',
      requestBody: {
        snippet: {
          title: '',//title of the video
          description: '',//descriptions of the video
          tags: ['test', 'video', 'nodejs'], //Tags for the video goes here
          categoryId: '22',
          channelId, // channelId or channelTitle
          channelTitle: '' ,
          
        },
        status: {
          privacyStatus: 'private', // or "public" 
        },
    
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
    }, {
      headers: {
        'Content-Length': videoFileSize,
      },
    });
  
    console.log(`Video has been uploaded with ID ${res.data.id}`);
  }



