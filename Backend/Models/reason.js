const mongoose=require('mongoose');

const reasonSchema = new mongoose.Schema({
    reason:{
        type: String,
        required: true
    },
    emailId:{
        type: String,
        required: true,
        lowercase: true
    },
    date:{
        type: Date,
        required: true,
        default: Date.now()
    }
},{timestamps: true});

module.exports=mongoose.model('reason',reasonSchema)