const stream = require("stream")
const createError = require('http-errors')
const firebaseAdmin = require('firebase-admin');
const uuid = require('uuid');
const serviceAccount = require('../ezzyshopnepal-firebase-adminsdk-vphjo-8b2a09d22c.json');
const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});
let storageRef = admin.storage().bucket(`gs://ezzyshopnepal.appspot.com/`);
const Upload = require('../models/upload.model.js')
const  {uploadSchemaJOI} = require('../helpers/validationSchema')
const moment = require('moment')

module.exports = {
    register: async (req, res) => {
        try {
            let acceptedTypes = ['image/png','image/jpeg','image/jpg','image/PNG','image/webp']
            let acceptedFolders = ['Dot Images','Pictures','Signatures','']
            if(!(acceptedTypes.includes(req.body.imageType) && acceptedFolders.includes(req.body.type))){
                return res.status(400).json({message:"Image Type Not Supported"})
            }
            let strImage = req.body.image.replace(/^data:image\/[a-z]+;base64,/, "");
            let bufferStream = new stream.PassThrough();
            bufferStream.end(new Buffer.from(strImage, 'base64'));
            let extension = ""
            if(req.body.imageType === 'image/png')
                extension = 'png'
            if(req.body.imageType === 'image/jpeg')
                extension = 'jpeg'
            if(req.body.imageType === 'image/jpg')
                extension = 'jpg'
            let path = req.body.type+'/'+uuid.v4()+'.'+extension
            let file = storageRef.file(path);
            bufferStream.pipe(file.createWriteStream({
                metadata: {
                    contentType: req.body.imageType
                }
            }))
                .on('error', error => {
                    console.log(error)
                    return res.status(400).json({message:error})
                })
                .on('finish', async () => {
                    try {
                        let postData = {
                            path:path,
                            type:req.body.type,
                            organization_id:res.locals.payload.organization
                        }
                        const isValidated = await uploadSchemaJOI.validateAsync(postData)
                        const upload = new Upload(isValidated)
                        const newUpload = await upload.save()
                        return res.status(201).json(newUpload)
                    } catch (error) {
                        if (error.isJoi === true) error.status = 422
                        return res.status(400).json({error:true,message: error.message})
                    }
                });
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    getImage: async (req,res)=>{
        try {
            let mainFile = await Upload.findById(req.params.id)
            let file = storageRef.file(mainFile.path);
            let today = moment(Date.now())
            let expire = today.add(1,'days').format('MM-DD-YYYY')
            const config = {
                action: 'read',
                expires: expire
            };
            file.getSignedUrl(config, (error, url) => {
                if (error) {
                    return res.status(400).json({message:error})
                }
                return res.status(201).json({url:url})
            });
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    deleteImage: async (req,res)=>{
        try {
            let mainFile = await Upload.findById(req.params.id)
            let file = storageRef.file(mainFile.path);
            let del = await file.delete()
            return res.status(201).json({message:"Deleted"})
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    }
}