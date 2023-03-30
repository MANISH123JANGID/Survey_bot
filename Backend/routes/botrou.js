const express= require('express');

const router= express.Router();

const{familySurveyController, educationSurveyController,getStatusnDetails,saveReason,deleteSurvey,
    editSurvey,isEmailPresent,saveOTPnMail,verifyOTP,getStatusnDetailsOfEducation ,
    deleteSurveyEdu,isEmailPresentEdu,editSurveyEdu,deleteOldOTP}=require('../controller/dialog')

router.post('/familySurvey',familySurveyController);

router.post('/educationSurvey',educationSurveyController);

router.post('/getStatusnDetails',getStatusnDetails);

router.post('/saveReason',saveReason);

router.delete('/deleteSurvey',deleteSurvey)

router.put('/editSurvey',editSurvey)

router.post('/isEmail',isEmailPresent)

router.post('/saveOTPnMail',saveOTPnMail);

router.post('/verifyOTP',verifyOTP);

router.post('/getStatusnDetailsOfEducation',getStatusnDetailsOfEducation)

router.delete('/deleteSurveyEdu',deleteSurveyEdu)

router.post('/isEmailPresentEdu',isEmailPresentEdu)

router.put('/editSurveyEdu',editSurveyEdu)

router.delete('/deleteOldOTP',deleteOldOTP)

module.exports = router;
