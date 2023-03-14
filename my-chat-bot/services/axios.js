const axios = require('axios');

const saveFamilyProfile = async(name,emailID,familyType,numOfMembers,belowAgeOf18,aboveAgeOf18,numOfEmployed,numOfMales,numOfFemales,religion,caste,familyIncome)=>{
        const data= await axios.post('http://localhost:3500/api/messages/familySurvey',{
            name,emailID,familyType,numOfMembers,belowAgeOf18  ,aboveAgeOf18,
    numOfEmployed,numOfMales,numOfFemales,religion,caste,familyIncome
        })
        return data.data;
}

const saveEducationSurvey= async(name,qualification,collegeSchoolName,gradesOrPercent,
        placed,investedAmount,expectedPackage,satisfied,recommended,rating)=>{
         const data =await axios.post('http://localhost:3500/api/messages/educationSurvey',{
            name,qualification,collegeSchoolName,gradesOrPercent,
            placed,investedAmount,expectedPackage,satisfied,recommended,rating
        })
        return data.data;
}

const getStatusnDetails= async(emailId)=>{
        console.log("emailId::",emailId);
       const family=await axios.post('http://localhost:3500/api/messages/getStatusnDetails',{
             emailId   
       })
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

const updateSurvey= async(Id,dataToUpdate) => {
        const data={};
        data.Id=Id;
        data.dataToUpdate=dataToUpdate;
        console.log(data);
        const updated= await axios.put('http://localhost:3500/api/messages/editSurvey/',{
                data
        });
        return updated;
}
module.exports= {saveEducationSurvey,saveFamilyProfile,getStatusnDetails,saveReason,delete_Survey,updateSurvey}
