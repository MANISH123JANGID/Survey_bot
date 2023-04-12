const educationModel= require('../Models/educationalsurvey');

const familyModel= require('../Models/familysurvey');

const reasonModel= require('../Models/reason');

const OTPnMail= require('../Models/OTP');

const nodeMailer= require('nodemailer');

const mailGen= require('mailgen');

const imgSchema=require('../Models/image')

const path = require('path');
const fs = require('fs');

const familySurveyController= async(req,res) => {
    try{
        console.log(req.body);
        const {name,emailID,familyType,numOfMembers,belowAgeOf18,aboveAgeOf18,numOfEmployed,numOfMales,numOfFemales,religion,caste,familyIncome}=req.body;

        const newFamilySurvey= new familyModel({name,emailID,familyType,numOfMembers,belowAgeOf18,aboveAgeOf18,numOfEmployed,numOfMales,numOfFemales,religion,caste,familyIncome});

        const isSaved= await newFamilySurvey.save();
        if(isSaved){
            return res.status(201).json({message:'FamilyProfile saved successfully'})
        }
    }catch(err){
        console.log(err);
    }
}

const educationSurveyController= async(req,res) => {
    try{
        const{name,email,qualification,college,grades,placed,package_,invested,campus_rating,opinion}= req.body;

        const newEducationSurvey= new educationModel({name,email,qualification,college,grades,placed,package_,invested,campus_rating,opinion});
    
        const isSaved= await newEducationSurvey.save();
        if(isSaved){
            return res.status(201).json({message:'Data saved successfully'})
        }
    }catch(err){
        console.log(err);
    }   
}

const getStatusnDetails= async(req,res)=>{
    try{ 
        const emailId = req.body.emailId;
        const family = await familyModel.findOne({emailID:emailId}); 
        if(family){
            return res.status(201).json({family:family})
        }else{
            return res.status(200).json({message: `Family with email ${emailId} not found`})
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

const saveReason= async(req,res) => {
    try{
        const {reason,emailId}= req.body;
        const newReason= new reasonModel({reason,emailId});
        const isSaved= await newReason.save();
        if(isSaved){
            return res.status(200).json({message:"Reason saved in database"});
        }else{
            return res.status(500).json({message:"something went wrong"})
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal server error"});
    }
}

const deleteSurvey= async (req, res)=>{
    try{
        console.log('this is email from axios')
        console.log(req.body.emailId)
        const emailId= req.body.emailId;
        const family= await familyModel.findOneAndDelete({emailID: emailId})
        if(family){
            return res.status(200).json({message:"Survey was deleted successfully"});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}
const deleteSurveyEdu= async (req, res)=>{
    try{
        console.log('this is email from axios')
        console.log(req.body.emailId)
        const emailId= req.body.emailId;
        const edu= await educationModel.findOneAndDelete({emailID: emailId})
        if(edu){
            return res.status(200).json({message:"Survey was deleted successfully"});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}


const editSurvey= async(req, res)=>{
    try{
        const data= req.body;
        const isUpdated= await familyModel.findByIdAndUpdate(data.data.Id,data.data.dataToUpdate);
        if(isUpdated){return res.status(200).json({message:"edit was successful"})}
        
    }catch(error){
        return res.status(500).json({message:"edit was unsuccessful internal error"})
    }
}

const editSurveyEdu= async(req, res)=>{
    try{
        const data= req.body;
        const isUpdated= await educationModel.findByIdAndUpdate(data.data.Id,data.data.dataToUpdate);
        if(isUpdated){return res.status(200).json({message:"edit was successful"})}
        
    }catch(error){
        return res.status(500).json({message:"edit was unsuccessful internal error"})
    }
}

const isEmailPresent= async(req,res)=>{
    try{
        const email= req.body.email;
        console.log(req.body);
        const isEmail= await familyModel.findOne({emailID:email});
        if(isEmail){
            return res.status(200).json({success:true,message:"User found"});
        }else{
            return res.status(200).json({success:false,message:"User not found"})
        }
    }catch(err){
        res.status(500).json({message:"Internal server error!"})
    }
}

const isEmailPresentEdu= async(req,res)=>{
    try{
        const email= req.body.email;
        console.log("req.body in the cheker",req.body);
        const isEmail= await educationModel.findOne({email:email});
        if(isEmail){
            return res.status(200).json({success:true,message:"User found"});
        }else{
            return res.status(200).json({success:false,message:"User not found"})
        }
    }catch(err){
        res.status(500).json({message:"Internal server error!"})
    }
}

const saveOTPnMail= async(req, res)=>{  
  try{
    const {email,name} = req.body;

    const config={
        service:'gmail',
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    }

    const transporter= await nodeMailer.createTransport(config)

    const mailGenerator = new mailGen({
        theme:"default",
        product:{
            name:"Candy-Bot 🤖",
            link:"https://mailgen.js/"
        }
    })

    const ran= Math.random();
    const minus= Math.random()*100;
    const otp= ran*100000+1000-minus;
    const finalOTP= Math.floor(otp)
    console.log(finalOTP) 

    const response={
        body:{
            name:`${name}`,
            intro:"Your Otp has arrived!",
            table:{
                data:[
                        {
                        OTP:`${finalOTP}`,
                    }
                ]
            },
            outro:"Please use this OTP to verify your account! Valid for only 5 minutes!"
        }
    }

    const mail = mailGenerator.generate(response);

    let message ={
        from:' <candy@bot.com>',
        to: email,
        subject: 'Your OTP for Candy bot',
        text:`Hi User,\n Welcome to Candy! Please verify your OTP \n Your OTP is: ${finalOTP} `,
        html:mail
    }

    let OTP= finalOTP;
    const newOTP= new OTPnMail({email,OTP});
    const saved= newOTP.save();
    if(saved){
        console.log('otp saved to db')
    }else{
        console.log('otp  ntot saved to db')
    }

    transporter.sendMail(message).then(()=>{
        return res.status(201).json({message:`OTP has been sent successfully on ${email}`});
    }).catch(err=>{
        return res.status(500).json({message:err.message});
    })
  }catch(err){
    res.status(500).json({message:err.message});
  }
}

const verifyOTP= async (req, res) => {
    try{
        const{email,OTP}= req.body;
        console.log("otp from body",OTP)
        const isEmail =await OTPnMail.findOne({email: email})
        console.log("isEmail.OTP",isEmail.OTP)
        if(isEmail.OTP==OTP) {
            return res.status(200).json({success:true,message:'verified'})
        }else{
            return res.status(200).json({success:false,message:"not_verified"});
        }
    }catch(e){
        return res.status(200).json({success:false,message: e.message});
    }
}

const getStatusnDetailsOfEducation= async(req,res)=>{
    try{
        console.log(req.body,"req.body")
        const email = req.body.email;
        console.log("email in controlerr",email);
        const education = await educationModel.findOne({email:email}); 
        if(education){
            return res.status(201).json({education:education})
        }else{
            return res.status(200).json({message: `Survey with email ${email} not found`})
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

const deleteOldOTP= async(req, res)=>{
  try{
    const email = req.body.email;
    console.log("here is email",email)
    const otp= await OTPnMail.findOneAndDelete({email: email});
    if(otp){
        return res.status(200).json({message:"OTP deleted successfully"});
    }
  }catch(error){
    console.log(error);
    return res.status(200).json({message:"Error deleting"});
  }
}

const saveImage= async(req,res)=>{
   try{
        console.log(req.body)
        const filePath = req.body.filePath;
        console.log(filePath);
        const image= fs.readFileSync(filePath)

        console.log("this is the imagae",image)
        const obj = {
            name: req.body.localFileName,
            image: {
                data:image,
                contentType: 'image/png'
            }
        }
       await imgSchema.create(obj)
        .then ((err, item) => {
            if (err) {
                console.log(err);
            }
            else {
                item.save();
            }
        });
        return res.status(200).json({message:"saved successfully"});
   }catch(err){
        console.log(err);
        return res.status(500).json({message:err})
   }
}

module.exports={familySurveyController,educationSurveyController,getStatusnDetails,
     saveReason,deleteSurvey,editSurvey,isEmailPresent,saveOTPnMail,verifyOTP,getStatusnDetailsOfEducation,
     deleteSurveyEdu,isEmailPresentEdu,editSurveyEdu,deleteOldOTP,saveImage};