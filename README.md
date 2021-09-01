# Adaptive Video Streaming Service

Frontend: https://github.com/abhishekraj272/Video-Streaming-Frontend
Backend: https://github.com/abhishekraj272/Video-Streaming-Backend

## Tech Used
- ExpressJS - For APIs
- MongoDB - For Fast R/W as little to no relation between data's + plus comes with free tier.
- Bash - For writting script to automate video video processing
- ffmpeg - For breaking video in chunks

### Video Processing
- DASH Protocol is used to break videos in chunks of 7 seconds.
- DASH JS is used to fetch and play videos from AWS S3.
