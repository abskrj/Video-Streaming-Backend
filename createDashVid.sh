SAVEDIR="uploads/${1}"
mkdir -p ${SAVEDIR}

# sudo apt install ffmpeg
# sudo apt install gpac


# Check programs
if [ -z "$(which ffmpeg)" ]; then
    echo "Error: ffmpeg is not installed"
    exit 1
fi

if [ -z "$(which MP4Box)" ]; then
    echo "Error: MP4Box is not installed"
    exit 1
fi


target="videos/${1}.${2}"
if [[ ! "${target}" ]]; then
  target="${source##*/}" # leave only last component of path
  target="${target%.*}"  # strip extension
fi

f=$target

fe="$target" # fullname of the file
f="${1}" # name without extension

if [ ! -d "${f}" ]; then #if directory does not exist, convert
  echo "Converting \"$f\" to multi-bitrate video in MPEG-DASH"
  ffmpeg -y -i "${fe}" -c:a aac -b:a 192k -vn "${SAVEDIR}/${f}_audio.m4a"
#   ffmpeg -y -i "${fe}" -preset slow -tune film -vsync passthrough -an -c:v libx264 -x264opts 'keyint=25:min-keyint=25:no-scenecut' -crf 22 -maxrate 5000k -bufsize 12000k -pix_fmt yuv420p -f mp4 "${SAVEDIR}/${f}_5000.mp4"
  ffmpeg -y -i "${fe}" -preset slow -tune film -vsync passthrough -an -c:v libx264 -x264opts 'keyint=25:min-keyint=25:no-scenecut' -crf 23 -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -f mp4  "${SAVEDIR}/${f}_3000.mp4"
  # ffmpeg -y -i "${fe}" -preset slow -tune film -vsync passthrough -an -c:v libx264 -x264opts 'keyint=25:min-keyint=25:no-scenecut' -crf 23 -maxrate 1500k -bufsize 3000k -pix_fmt yuv420p -f mp4   "${SAVEDIR}/${f}_1500.mp4"
  ffmpeg -y -i "${fe}" -preset slow -tune film -vsync passthrough -an -c:v libx264 -x264opts 'keyint=25:min-keyint=25:no-scenecut' -crf 23 -maxrate 800k -bufsize 2000k -pix_fmt yuv420p -vf "scale=-2:720" -f mp4  "${SAVEDIR}/${f}_800.mp4"
  ffmpeg -y -i "${fe}" -preset slow -tune film -vsync passthrough -an -c:v libx264 -x264opts 'keyint=25:min-keyint=25:no-scenecut' -crf 23 -maxrate 400k -bufsize 1000k -pix_fmt yuv420p -vf "scale=-2:540" -f mp4  "${SAVEDIR}/${f}_400.mp4"
  # static file for ios and old browsers and mobile safari
#   ffmpeg -y -i "${fe}" -preset slow -tune film -movflags +faststart -vsync passthrough -c:a aac -b:a 160k -c:v libx264  -crf 23 -maxrate 2000k -bufsize 4000k -pix_fmt yuv420p -f mp4 "${SAVEDIR}/${f}.mp4"
 
  rm -f ffmpeg*log*
  # if audio stream does not exist, ignore it
  if [ -e "${SAVEDIR}/${f}_audio.m4a" ]; then
      MP4Box -dash 2000 -rap -frag-rap  -bs-switching no -profile "dashavc264:live" "${SAVEDIR}/${f}_3000.mp4" "${SAVEDIR}/${f}_1500.mp4" "${SAVEDIR}/${f}_800.mp4" "${SAVEDIR}/${f}_audio.m4a" -out "${SAVEDIR}/${f}.mpd"
      rm "${SAVEDIR}/${f}_3000.mp4" "${SAVEDIR}/${f}_1500.mp4" "${SAVEDIR}/${f}_800.mp4" "${SAVEDIR}/${f}_audio.m4a"
  else
      MP4Box -dash 2000 -rap -frag-rap  -bs-switching no -profile "dashavc264:live" "${SAVEDIR}/${f}_3000.mp4" "${SAVEDIR}/${f}_1500.mp4" "${SAVEDIR}/${f}_800.mp4" -out "${SAVEDIR}/${f}.mpd"
      rm "${SAVEDIR}/${f}_3000.mp4" "${SAVEDIR}/${f}_1500.mp4" "${SAVEDIR}/${f}_800.mp4"
  fi
  # create a jpg for poster. Use imagemagick or just save the frame directly from ffmpeg is you don't have cjpeg installed.
ffmpeg -ss 00:00:01 -i "${fe}" -vframes 1 "${SAVEDIR}/${f}.jpg"

fi
