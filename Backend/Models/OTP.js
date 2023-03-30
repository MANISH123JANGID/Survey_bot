const mongoose= require('mongoose');

const OTPnMail=  mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    OTP:{
        type:Number,
        required:true,
    }
},{timestamps:true})

OTPnMail.index({createdAt:Date.now()},{expireAfterSeconds:200});

module.exports= mongoose.model('OTPnMail',OTPnMail);