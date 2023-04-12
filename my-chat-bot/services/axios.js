const axios = require('axios');

const saveFamilyProfile = async(name,emailID,familyType,numOfMembers,belowAgeOf18,aboveAgeOf18,numOfEmployed,numOfMales,numOfFemales,religion,caste,familyIncome)=>{
        const data= await axios.post('http://localhost:3500/api/messages/familySurvey',{
            name,emailID,familyType,numOfMembers,belowAgeOf18  ,aboveAgeOf18,
    numOfEmployed,numOfMales,numOfFemales,religion,caste,familyIncome
        })
        return data.data;
}

const saveEducationSurvey= async(name,email,qualification,college,grades,placed,package_,invested,campus_rating,opinion)=>{
         const data =await axios.post('http://localhost:3500/api/messages/educationSurvey',{
                name,email,qualification,college,grades,placed,package_,invested,campus_rating,opinion
        })
        return data.data;
}

const getStatusnDetails= async(emailId)=>{
        console.log("emailId::",emailId);
       const family=await axios.post('http://localhost:3500/api/messages/getStatusnDetails',{
             emailId   
       })
       console.log("family :::",family.data)
       return family.data
}

const saveReason= async(reason,emailId)=>{
        const saved=await axios.post('http://localhost:3500/api/messages/saveReason',{
                reason,emailId
        })
        return saved.data
}

const delete_Survey= async(email)=>{
        const emailID= email;
        console.log('this is in axios',emailID);
        const data = {
                emailId:emailID
        }
        const isDeleted= await axios.delete('http://localhost:3500/api/messages/deleteSurvey/',
        {data})
        return isDeleted.data;
} 

const delete_Survey_Edu= async(email)=>{
        const emailID= email;
        console.log('this is in axios',emailID);
        const data = {
                emailId:emailID
        }
        const isDeleted= await axios.delete('http://localhost:3500/api/messages/deleteSurveyEdu/',
        {data})
        return isDeleted.data;
} 

const editSurvey= async(Id,dataToUpdate) => {
        const data={};
        data.Id=Id;
        data.dataToUpdate=dataToUpdate;
        console.log(data);
        const updated= await axios.put('http://localhost:3500/api/messages/editSurvey/',{
                data
        });
        return updated;
}

const checkMail= async(email)=>{
        const emailPresent= await axios.post('http://localhost:3500/api/messages/isEmail/',{
                email
        })
        return emailPresent;
}

const SaveOTPnMail= async(email,name)=>{
        const data=await axios.post('http://localhost:3500/api/messages/saveOTPnMail/',{
                email,name
        });
        return data;
}

const verifyOTP= async(email,OTP) => {
        const verify= await axios.post("http://localhost:3500/api/messages/verifyOTP",{
                email,OTP
        });
        return verify.data;
}

const getStatusnDetailsOfEducation= async (email)=>{
        console.log(email,"emial in axios");
        const survey= await axios.post("http://localhost:3500/api/messages/getStatusnDetailsOfEducation",{
                email
        });
        console.log("survey :::",survey.data)
        return survey.data
}

const isEmailPresentEdu=  async(email)=>{
        const emailPresent= await axios.post('http://localhost:3500/api/messages/isEmailPresentEdu/',{
                email
        })
        return emailPresent.data;
}

const editSurveyEdu= async(Id,dataToUpdate) => {
        const data={};
        data.Id=Id;
        data.dataToUpdate=dataToUpdate;
        console.log(data);
        const updated= await axios.put('http://localhost:3500/api/messages/editSurveyEdu/',{
                data
        });
        return updated;
}

const deleteOldOTP= async (email) => {
        const emailId= email;
        const data = {
                email:emailId
        }
        const deleted= await axios.delete('http://localhost:3500/api/messages/deleteOldOTP/',{data});
        return deleted;
}

const saveImageDb= async(localFileName,filePath)=>{
        const saved= await axios.post('http://localhost:3500/api/messages/saveImage',{localFileName,filePath})
        if(saved){
                console.log('image saved')
        }
}

module.exports= {saveEducationSurvey,saveFamilyProfile,getStatusnDetails,saveReason,delete_Survey,editSurvey,checkMail,
        SaveOTPnMail,verifyOTP,getStatusnDetailsOfEducation,delete_Survey_Edu,isEmailPresentEdu,editSurveyEdu,deleteOldOTP,saveImageDb};
