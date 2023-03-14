const express= require('express');

const router= express.Router();

const{familySurveyController, educationSurveyController,getStatusnDetails,saveReason,deleteSurvey,editSurvey }=require('../controller/dialog')


router.post('/familySurvey',familySurveyController);

router.post('/educationSurvey',educationSurveyController);

router.post('/getStatusnDetails',getStatusnDetails);

router.post('/saveReason',saveReason);

router.delete('/deleteSurvey',deleteSurvey)

router.put('/editSurvey',editSurvey)

module.exports = router;
