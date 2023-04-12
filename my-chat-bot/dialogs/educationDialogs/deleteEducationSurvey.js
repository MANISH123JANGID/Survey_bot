const { CardFactory } = require('botbuilder');

const {HelpandCancel}= require('../interruptHandler');

const {delete_Survey_Edu,isEmailPresentEdu}= require('../../services/axios');

const getEmailCard=require('../../resources/commons/getEmailCard.json');

const WATERFALL_DIALOG='WATERFALL_DIALOG';
const TEXT_PROMPT="TEXT_PROMPT";
const DELETE_SURVEY='DELETE_SURVEY';
const CONFIRM_PROMPT="CHOICE_PROMPT";
const {
    TextPrompt,
    ChoicePrompt,
    ConfirmPrompt,
    WaterfallDialog,
    Dialog
} = require('botbuilder-dialogs');

class deleteSurvey extends HelpandCancel{
    constructor(userState,conversationState,telemetryClient){
        super(DELETE_SURVEY);

        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));


        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG,[
            this.getEmail.bind(this),
            this.checkEmail.bind(this),
            this.finalStep.bind(this)
        ]));
        this.initialDialogId=WATERFALL_DIALOG;
    }

    async getEmail(step){
        const getEmail= await step.context.sendActivity({
            attachments:[CardFactory.adaptiveCard(getEmailCard)]
        })
        step.values.activityId= getEmail.id;
        return Dialog.EndOfTurn;
    }

    async checkEmail(step){ 
        await step.context.deleteActivity(step.values.activityId)
        const email = step.context.activity.value.emailID;
        step.values.email=email;
        const isEmail = await isEmailPresentEdu(email);
        console.log(isEmail)
        if(isEmail.success===true){
            return await step.prompt(CONFIRM_PROMPT,'Please confirm to delete the survey!');
        }else{
            await step.prompt(TEXT_PROMPT,`Survey with email : ${email} not found!`); 
            step.values.intent='Not_found' 
            return step.endDialog();
        }   
    }
    async finalStep(step){
        if(step.values.intent==="Not_found"){
            return await step.replaceDialog(this.id);
        }
        const email = step.values.email;
        console.log(email);
        console.log(step.result);   
        if(step.result===true){
            const deleted= await delete_Survey_Edu(email);
            console.log(deleted);
            await step.prompt(TEXT_PROMPT,"Your survey has been deleted! Type anything to continue!")
            return await step.cancelAllDialogs();
        }if(step.result===false){
            await step.prompt(TEXT_PROMPT,"You cancelled deleting the survey!\n Type anything to continue!");
            return await step.cancelAllDialogs();
        }
    }
}

module.exports = {deleteSurvey,DELETE_SURVEY}




