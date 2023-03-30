const { CardFactory } = require('botbuilder');

const {HelpandCancel}= require('../interruptHandler');

const {educationSurveyRenderer}= require('../../resources/educationResources/educationSurveyRenderer');

const{showEditCardforEdu}= require('../../resources/educationResources/showCardEditForEdu')

const{editSurveyEdu}= require('../../services/axios')

const getEmailCard=require('../../resources/commons/getEmailCard.json');

const WATERFALL_DIALOG='WATERFALL_DIALOG';
const TEXT_PROMPT="TEXT_PROMPT";
const EDIT_SURVEY='EDIT_SURVEY';

const {
    TextPrompt,
    WaterfallDialog,
    Dialog
} = require('botbuilder-dialogs');

class editSurvey extends HelpandCancel{
    constructor(){
        super(EDIT_SURVEY);

        this.addDialog(new TextPrompt(TEXT_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG,[
            this.getEmail.bind(this),
            this.checkEmail.bind(this),
            this.showDetails.bind(this)
        ]));
        this.initialDialogId=WATERFALL_DIALOG;
    }

    async getEmail(step){
        const getemail= await step.context.sendActivity({
            attachments:[CardFactory.adaptiveCard(getEmailCard)]
        })
        step.values.activityId= getemail.id;
        return Dialog.EndOfTurn;
    }

    async checkEmail(step){
        await step.context.deleteActivity(step.values.activityId)
        const email = step.context.activity.value.emailID;
        step.values.email=email;
        const isSurvey = await showEditCardforEdu(email);
        console.log("is survey", isSurvey);
        if(isSurvey.message){
             await step.prompt(TEXT_PROMPT,`${isSurvey.message}`)
             step.values.intent="Not_found"
             return step.endDialog();
        }else{
            const editCard=  await step.context.sendActivity({
                attachments:[CardFactory.adaptiveCard(isSurvey.card)]
            })
            step.values.activityId= editCard.id;
            step.values.userId= isSurvey.userData.userId;
            return Dialog.EndOfTurn;
        }   
    }

    async showDetails(step){
        if(step.values.intent==="Not_found"){
            return await step.replaceDialog(this.id);
        }
        await step.context.deleteActivity(step.values.activityId)
        const dataToUpdate = step.context.activity.value;
        const ID= step.values.userId;
        console.log(ID);
        const updated = await editSurveyEdu(ID, dataToUpdate);
        console.log("updated",updated);
        if(updated){
            console.log('email id receievd here is ',step.context.activity.value.email)
            const emailID= step.context.activity.value.email;
            const educationCard= await educationSurveyRenderer(emailID);
            await step.context.sendActivity({
                text:'Survey updated successfully! Here is your updated survey',
                attachments: [CardFactory.adaptiveCard(educationCard)]
            })
            await step.prompt(TEXT_PROMPT,'Please type something to continue');
            return await step.cancelAllDialogs();
        }else{
            await step.prompt(TEXT_PROMPT,'There was some error in updating the survey');
            return await step.cancelAllDialogs();
        }
    }
}

module.exports = {editSurvey,EDIT_SURVEY}




