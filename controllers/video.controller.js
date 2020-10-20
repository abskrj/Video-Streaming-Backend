const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const util = require('util');
const { spawn } = require('child_process');
const s3FolderUpload = require('s3-folder-upload');
const fsExtra = require('fs-extra');


const credentials = {
    "accessKeyId": process.env.ACCESS_KEY_ID,
    "secretAccessKey": process.env.SECRET_ACCESS_KEY,
    "region": process.env.REGION,
    "bucket": process.env.BUCKET_NAME
}

exports.registerVideo = ((req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        fileProperty = files.video.type.split('/');

        if (fileProperty[0] != 'video') {
            res.send({ message: "Upload video only" });
        }
        else {
            var oldPath = files.video.path;
            var newPath = path.join(__dirname, '../videos', `${req.videoId}.${fileProperty[1]}`);
            var rawData = fs.readFileSync(oldPath)

            const fs_writeFile = util.promisify(fs.writeFile)

            fs_writeFile(newPath, rawData, function (err) {
                if (err) console.log(err);
                else {
                    res.send({ message: "Successfully uploaded" });
                }
            })
                .then((value) => {

                    console.log(value);

                    const cmandPath = path.join(__dirname, '../createDashVid.sh');


                    const createHLSVOD = spawn('bash', [cmandPath, req.videoId, fileProperty[1]]);
                    createHLSVOD.stdout.on('data', d => console.log(`stdout info: ${d}`));
                    createHLSVOD.stderr.on('data', d => console.log(`stdout output: ${d}`));
                    createHLSVOD.on('error', d => console.log(`error: ${d}`));
                    createHLSVOD.on('close', code => {

                        console.log(`child process ended with code ${code}`);
                        console.log(`Uploading ${req.videoId} to s3`);

                        fsExtra.removeSync(newPath);
                        console.info(`Deleted ${req.videoId} from videos folder.`);


                        const directoryName = path.join(__dirname, '../uploads', req.videoId);

                        const s3options = {
                            useFoldersForFileTypes: false,
                            useIAMRoleCredentials: false,
                            uploadFolder: `videos/${req.videoId}`
                        }
                        s3FolderUpload(directoryName, credentials, s3options)
                            .then(function (doc) {
                                fsExtra.removeSync(directoryName);
                                console.info(`Deleted ${req.videoId} from uploads folder.`);

                            })
                            .catch(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });

                    });

                })
                .catch((err) => {
                    if (err) {
                        console.log(err);
                        res.send({ message: "Something went wrong" });
                    }
                });
                res.send({message: "Video Uploaded Successfully"});
        }
    })

});
