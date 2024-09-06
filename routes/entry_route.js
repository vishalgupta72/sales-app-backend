const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const EntryModel = mongoose.model("EntryModel");
const protectedRoute = require("../middleware/protectedResource");






// create an add entry
router.post("/addentry",protectedRoute, (req, res)=>{
  const {productName, quantity, price} = req.body;
  if(!productName || !quantity || !price){
      return res.status(400).json({error: "One or more mandatory field are empty"});
  }
  req.user.password = undefined;
  const entryObj = new EntryModel({productName: productName, quantity: quantity, price: price, author: req.user});
  entryObj.save()
  .then((newEntry)=>{
      res.status(201).json({entry: newEntry});
  })
  .catch((error)=>{
      console.log(error);
  })
})




// top 5 entrys
router.get("/topentrys", (req, res)=>{
    EntryModel.find()
    .populate("author", "_id productName quantity price")
    .sort({price: -1})
    .limit(5)
    .then((dbEntrys)=>{
        res.status(200).json({entrys: dbEntrys})
    })
    .catch((error)=>{
        console.log(error);
    })
})


// total revenue
router.get("/totalrevenue", (req, res)=>{
    EntryModel.find()
    .then((dbEntrys)=>{
        const totalRevenue = dbEntrys.reduce((acc, entry) => acc + entry.price, 0);
        res.status(200).json({ totalRevenue: totalRevenue });
    })
    .catch((error)=>{
        console.log(error);
    })
})






module.exports = router;