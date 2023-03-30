const { MessageFactory, CardFactory } = require('botbuilder');

const {SaveOTPnMail,verifyOTP,saveEducationSurvey,deleteOldOTP}= require('../../services/axios')

const {HelpandCancel}= require('../interruptHandler');

const GetOtp= require('../../resources/commons/getOTP.json')
const verifyotp= require('../../resources/commons/verifyOTP.json')
const education_survey= require('../../resources/educationResources/education_survey.json')
const startCard= require('../../resources/commons/startCard.json')
 
const EDUCATIONAL_SURVEY='EDUCATION_SURVEY';
const WATERFALL_DIALOG='WATERFALL_DIALOG';
const TEXT_PROMPT="TEXT_PROMPT";
const {
    TextPrompt,
    WaterfallDialog,
    Dialog
} = require('botbuilder-dialogs');

class educationSurvey extends HelpandCancel{
    constructor(){
        super(EDUCATIONAL_SURVEY);

        this.addDialog(new TextPrompt(TEXT_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG,[
            this.sendOTP.bind(this),
            this.verifyOTP.bind(this),
            this.getDetails.bind(this),
            this.surveyCompleted.bind(this)
        ]));
        this.initialDialogId=WATERFALL_DIALOG;
    }
 
    async sendOTP(step){
        console.log("step.options,",step.options);

        if(step.options.hasOwnProperty('case')){
            return await step.next();
        }
        const getotp= await step.context.sendActivity({
            attachments:[CardFactory.adaptiveCard(GetOtp)]
        })
        step.values.intent="delete"
         step.values.activityId=getotp.id;
        return Dialog.EndOfTurn;
    }
    async verifyOTP(step){
       if(step.values.intent==="delete"){
         await step.context.deleteActivity(step.values.activityId);
       }
        if(step.options.hasOwnProperty('case')){
            const verifyotp1= await step.context.sendActivity({
                attachments:[CardFactory.adaptiveCard(verifyotp)]
            })
             step.values.activityId= verifyotp1.id;
            return Dialog.EndOfTurn
        }else{
            step.values.name=step.context.activity.value.fullName;
            step.values.email= step.context.activity.value.emailID;
            console.log( step.values.email);
            const name= step.context.activity.value.fullName;
            const email= step.context.activity.value.emailID;
            const isSaved= await SaveOTPnMail(email,name);
            const verifyotp1= await step.context.sendActivity({
                attachments:[CardFactory.adaptiveCard(verifyotp)]
            })
            step.values.activityId= verifyotp1.id;
            return Dialog.EndOfTurn;
        }
    }

    async getDetails(step){
        await step.context.deleteActivity(step.values.activityId);
        if(step.context.activity.value.name==="verify_otp"){
            const otp= step.context.activity.value.OTP;
            console.log('otp', otp);
            const email= step.values.email !==undefined ? step.values.email : step.options.info;
            console.log("email",email);
            const Verified= await verifyOTP(email,otp);
            console.log("Verified",Verified);
            if(Verified.success===true){
                const edusurvey= await step.context.sendActivity({
                    attachments:[CardFactory.adaptiveCard(education_survey)]
                })
                step.values.intent='verified';
                step.values.activityId= edusurvey.id;
                console.log(step.values.activityId)
                return Dialog.EndOfTurn;
            }else{  
                await step.prompt(TEXT_PROMPT,'Your OTP was incorrect. Please re-enter the correct OTP!')
                step.values.intent='wrong_otp';
                return await step.endDialog();
            }
        }if(step.context.activity.value.name==="resend_otp"){
            const email= step.values.email;
            const name= step.values.name;
            console.log(email,"emmail")
            const del=  await deleteOldOTP(email);
            const isSaved= await SaveOTPnMail(email,name);
            step.options.case="resend_otp";
            step.options.info=step.values.email;
            step.options.name=step.values.name;
            return await step.replaceDialog(this.id,step.options)
        }
    }
    
    async surveyCompleted(step){
        console.log(step.values.intent);
        if(step.values.intent==="verified"){
            console.log(step.values.activityId)
            await step.context.deleteActivity(step.values.activityId);
        }
        if(step.values.intent==="wrong_otp"){
            step.options.case='not_verified';
            step.options.info=step.values.email;
            step.options.name= step.values.name;
            return await step.replaceDialog(this.id,step.options)
        }
        const name=step.values.name !== undefined ? step.values.name :step.options.name;
        const email=step.values.email !== undefined ? step.values.email :step.options.info;
        console.log("name and email",name,email);

        const {qualification,college,grades,placed,package_,invested,campus_rating,opinion}= step.context.activity.value;
        const save = await saveEducationSurvey(name,email,qualification,college,grades,placed,package_,invested,campus_rating,opinion)

        const finalMesage= `Great ${name}, You have successfully completed the survey! 
        We have your Education Profile as given below:\n 
        Name of Candidate       :   ${name} \n
        EmailID                 :   ${email} \n
        Qualification           :   ${qualification} \n
        College                 :   ${college}\n
        Grades/Percentage       :   ${grades}\n
        Placement               :   ${placed}\n
        Package                 :   ${package_}\n
        Invested Amount         :   ${invested}\n
        Campus Rating           :   ${campus_rating} \n
        Opinion                 :   ${opinion}\n
        \n
        Thank you, Mr.${name} for participating in survey. `

        await step.prompt(TEXT_PROMPT,finalMesage);
        await step.context.sendActivity({
            attachments:[CardFactory.adaptiveCard(startCard)]
        })
        Dialog.EndOfTurn
        return await step.endDialog();
    }
}

module.exports = {educationSurvey,EDUCATIONAL_SURVEY}




