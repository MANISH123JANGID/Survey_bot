const { CardFactory } = require('botbuilder');

const {HelpandCancel}= require('../interruptHandler');

const {educationSurveyRenderer}= require('../../resources/educationResources/educationSurveyRenderer');

const getEmailCard=require('../../resources/commons/getEmailCard.json');

const WATERFALL_DIALOG='WATERFALL_DIALOG';
const TEXT_PROMPT="TEXT_PROMPT";
const STATUS_DIALOG='STATUS_DIALOG';

const {
    TextPrompt,
    WaterfallDialog,
    Dialog
} = require('botbuilder-dialogs');

class statusDialog extends HelpandCancel{
    constructor(){
        super(STATUS_DIALOG);

        this.addDialog(new TextPrompt(TEXT_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG,[
            this.getEmail.bind(this),
            this.checkEmail.bind(this),
            this.showDetails.bind(this)
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
        await step.context.deleteActivity(step.values.activityId);
        const email = step.context.activity.value.emailID;
        const isSurvey = await educationSurveyRenderer(email);
        console.log("isSurvey",isSurvey);
        if(isSurvey.message){
             await step.prompt(TEXT_PROMPT,`${isSurvey.message}`)
             return step.endDialog();
        }else{
            const survey= await step.context.sendActivity({
                attachments:[CardFactory.adaptiveCard(isSurvey)]
            })
            step.values.activityId= survey.id;
            await step.prompt(TEXT_PROMPT,'Type something to continue...');
            return step.cancelAllDialogs();
        }   
    }
    async showDetails(step){
        await step.context.deleteActivity(step.values.activityId);
        step.options.case='not_found';
        return await step.replaceDialog(this.id,step.options)
    }
}

module.exports = {statusDialog,STATUS_DIALOG}




