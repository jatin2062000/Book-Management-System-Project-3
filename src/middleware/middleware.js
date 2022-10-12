const jwt = require('jsonwebtoken')
const bookModel = require("../models/bookModel")

const authentication = (req,res,next)=>{
    try{
    //FETCH TOKEN FROM HEADER---- 
    let token = req.headers["x-auth-token"||"X-Auth-Token"]
    if (!token) {
       return res.status(400).send({ status:false,message: "no token found" })
    }

    // DECODE TOKEN FETCH BY FROM HEADER----
    let decodedToken = jwt.verify(token, "Group55")
    if(!decodedToken){
       return res.staus(401).send({status:false,message:"Invalid token"})
    }
    req.decodedToken=decodedToken
   
    next();
}catch(err){
    res.status(500).send({status:false,message:err.message})
}
}

const authorization=async (req, res, next)=>{
    try{
    //FETCH TOKEN FROM HEADER----
    let token = req.headers["x-auth-token"||"X-Auth-Token"]
    if (!token) {
     return   res.status(400).send({ status:false,message: "no token found" })
    }

    // DECODE TOKEN FETCH BY FROM HEADER----
    let decodedToken = jwt.verify(token, "Group55")
    if(!decodedToken){
      return  res.staus(401).send({status:false,message:"Invalid token"})
    }
    // FETCH BOOK ID PRESENT IN PARAMS----
    let Id = req.params.bookId

    // FIND BOOK DOCUMENT BY BOOK ID-----
    let Book = await bookModel.findOne({_id:Id})
    
    if(!Book){
      return  res.status(404).send({status:false, message:"No book found with given Id" })
    }

    // MATCH THE USER-ID PRESENT IN TOKEN AND USER-ID PRESENT IN BOOK-ID-----
    if(decodedToken.userId != Book.userId){
       
       return res.status(403).send({status:false, message:"User Not authorized!" })
    }
    next()
}catch(err){
    res.status(500).send({status:false,message:err.message})
}
}

// MAKE MODULE PUBLIC AND EXPORT FROM HERE-----
module.exports={authentication, authorization}
