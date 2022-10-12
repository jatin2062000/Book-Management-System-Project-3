const express = require('express')
const router = express.Router()
const registerUser = require("../controller/userController")
const createbook = require("../controller/bookController")
const createreview = require('../controller/reviewController')
const auth = require('../middleware/middleware')
const aws = require("aws-sdk")
//user
router.post('/register',registerUser.createUserDocument)
router.post('/login',registerUser.loginUser)
//book
router.post('/books',createbook.createBook)
router.get('/books',auth.authentication,createbook.getbooks)
router.get('/books/:bookId',auth.authentication,createbook.getBooksById)
//authentication and authorization
router.put('/books/:bookId',auth.authentication,auth.authorization,createbook.updateBooksById) //auth.authorization
router.delete('/books/:bookId',auth.authentication,auth.authorization,createbook.deleteBooksById) 
//review
router.post('/books/:bookId/review',createreview.createReview)
router.put('/books/:bookId/review/:reviewId',createreview.updatereviewbookbybookid)
router.delete('/books/:bookId/review/:reviewId',createreview.deletereviewbyid)

module.exports = router;

// connect wuth AWS =======================>

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file, arr) =>{
   return new Promise( function(resolve, reject) {
    let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  //HERE
        Key: "Group55/" + file.originalname, //HERE 
        Body: file.buffer
    }

    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        console.log(data)
        console.log("file uploaded succesfully")
        arr.push(data.Location)
        return resolve(data.Location)
    })
   })
}

router.post("/write-file-aws", async function(req, res){

    try{
        let files= req.files
        if(files && files.length>0){
            console.log(files)
            let arr = [];
            for (let i= 0; i<files.length; i++){
                let uploadedFileURL= await uploadFile( files[i],arr )
            }
            
            res.status(201).send({msg: "file uploaded succesfully", data: arr})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }    
    }
    catch(err){
        res.status(500).send({msg: err})
    }    
})


//for worng route=============================>

router.all('/*/',async function(req,res){
    return res.status(404).send({status:false,message:"Page Not Found"})
})