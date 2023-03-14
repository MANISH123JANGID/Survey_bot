const educationModel= require('../Models/educationalsurvey');

const familyModel= require('../Models/familysurvey');

const reasonModel= require('../Models/reason');

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
        const{name,qualification,collegeSchoolName,gradesOrPercent,placed,investedAmount,expectedPackage,satisfied,recommended,rating}= req.body;

        const newEducationSurvey= new educationModel({name,qualification,collegeSchoolName,gradesOrPercent,placed,investedAmount,expectedPackage,satisfied,recommended,rating});
    
        const isSaved= await newEducationSurvey.save();
        if(isSaved){
            return res.status(201).json({message:'Data saved successfully'})
        }
    }catch(err){
        console.log(err);
    }   
}


// controller to get the status & details of a family using email

const getStatusnDetails= async(req,res)=>{
    try{ 
    const emailId = req.body.emailId;
    const family = await familyModel.findOne({emailID:emailId}).exec(); 
    if(family){
        return res.status(201).json({family:family})
    }else{
        return res.status(404).json({message: `Family with email ${emailId} not found`})
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

const editSurvey= async(req, res)=>{
    try{
        const data= req.body;
        const isUpdated= await familyModel.findByIdAndUpdate(data.data.Id,data.data.dataToUpdate);
        if(isUpdated) return res.status(200).json({message:"edit was successful"})
    }catch(error){
        return res.status(500).json({message:"edit was unsuccessful internal error"})
    }
}
module.exports={familySurveyController,educationSurveyController,getStatusnDetails, saveReason,deleteSurvey,editSurvey};