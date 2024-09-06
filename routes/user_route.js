const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel");
var bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config')


//  sign for user
router.post("/signup", (req, res)=>{
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName || !password || !email){
        return res.status(400).json({error: "One or more mandatory field are empty"});
    }

    UserModel.findOne({email: email})
    .then((userInDB)=>{
        if(userInDB){
            return res.status(500).json({error: "User with this email already registered"});
        }
        bcryptjs.hash(password, 16)
        .then((hashedPassword) =>{
            const user = new UserModel({firstName, lastName, email, password: hashedPassword});
            user.save()
            .then((newUser) =>{
                res.status(201).json({result: "User signed up Successgfullly"});
            })
            .catch((err)=>{
                console.log(err);
            })
        })
    })
    .catch((err) => {
        console.log(err)
    })

}) 





//  loing for user
router.post("/login", (req, res)=>{
    const {email, password} = req.body;
    if(!password || !email){
        return res.status(400).json({error: "One or more mandatory field are empty"});
    }

    UserModel.findOne({email: email})
    .then((userInDB)=>{
        if(!userInDB){
            return res.status(401).json({error: "Invalid Creadentials"});
        }
        bcryptjs.compare(password, userInDB.password)
        .then((didMatch) =>{
            if(didMatch){
                const jwtToken = jwt.sign({_id: userInDB._id}, JWT_SECRET);
                const userInfo = {"_id": userInDB._id,"email": userInDB.email, "firstName": userInDB.firstName};

                res.status(200).json({result: {token: jwtToken, user: userInfo}});
            }else{
                return res.status(401).json({error: "Invalid Creadentials"});
            }
        })
    })
    .catch((err) => {
        console.log(err)
    })

}) 




module.exports = router;