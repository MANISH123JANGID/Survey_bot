const{
    ComponentDialog,
    ChoiceFactory,
    ChoicePrompt,
    ConfirmPrompt,
    TextPrompt,
    NumberPrompt,
    AttachmentPrompt,
    DialogSet,
    WaterfallDialog,
    DialogTurnStatus,
    Dialog
}= require('botbuilder-dialogs');

const {  CardFactory, MessageFactory, ConversationState } = require('botbuilder');

const logger= require('../services/logger');


const{EducationalDialog, EDUCATIONAL_DIALOG}= require('./educationDialogs/educationaldialog');
const{populationDialog, POPULATION_DIALOG}=require('./populationDialogs/populationDialogs');
// const{ParentDialog, PARENT_DIALOG}=require('./parentdialog');

const startCard= require('../resources/commons/startCard.json');

const ROOT_DIALOG= 'ROOT_DIALOG';
const WATERFALL_DIALOG= 'WATERFALL_DIALOG';
const CHOICE_PROMPT= 'CHOICE_PROMPT';   

class rootDialog extends ComponentDialog{
    constructor(userState, conversationState, telemetryClient){
        super(ROOT_DIALOG);
        
        this.userState = userState
        this.conversationState = conversationState
        this.telemetryClient = telemetryClient

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new EducationalDialog(userState,conversationState,telemetryClient));
        this.addDialog(new populationDialog(userState, conversationState,telemetryClient));
   
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG,[
            this.firstStep.bind(this),
            this.secondStep.bind(this),
        ]));
        this.initialDialogId= WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        const dialogSet= new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext=await dialogSet.createContext(turnContext);
        const results= await dialogContext.continueDialog();
        if(results.status===DialogTurnStatus.empty){
            await dialogContext.beginDialog(this.id)
        }  
    }
    async firstStep(step){
        const choice = step.context.activity.text !== undefined ? step.context.activity.text : step.context.activity.value.name;
        switch(choice){
            case 'population':
                return await step.beginDialog(POPULATION_DIALOG);
            case 'education':
                return await step.beginDialog(EDUCATIONAL_DIALOG);
            default:
               return await step.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(startCard)]
               })
        }
    }
    async secondStep(step){
        return await step.endDialog();
    }
}

module.exports= {rootDialog,ROOT_DIALOG}