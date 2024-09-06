const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const entrySchema = new mongoose.Schema({
    productName:{
        type: String,
        require: true,
        
    },
    quantity:{
        type: Number,
        require: true,

    },
    price:{
        type: Number,
        require: true,
    },
    author:{
        type: ObjectId,
        ref: "UserModel"
    }
})


mongoose.model("EntryModel", entrySchema);