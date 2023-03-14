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

 const {  CardFactory, MessageFactory } = require('botbuilder');


const{EducationalDialog, EDUCATIONAL_DIALOG}= require('./educationaldialog');
const{PopulationDialog, POPULATION_DIALOG}=require('./populationdialog');
// const{ParentDialog, PARENT_DIALOG}=require('./parentdialog');

const startCard= require('../resources/startCard.json')
const newCard= require('../resources/newCard.json')

const ROOT_DIALOG= 'ROOT_DIALOG';
const WATERFALL_DIALOG= 'WATERFALL_DIALOG';
const CHOICE_PROMPT= 'CHOICE_PROMPT';   

class rootDialog extends ComponentDialog{
    constructor(){
        super(ROOT_DIALOG);
        
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new EducationalDialog(EDUCATIONAL_DIALOG));
        this.addDialog(new PopulationDialog(POPULATION_DIALOG));
    //    this.addDialog(new ParentDialog(PARENT_DIALOG));

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
                break;
            
            case 'education':
                return await step.beginDialog(EDUCATIONAL_DIALOG);
                break;
            default:
               // return await step.beginDialog(PARENT_DIALOG);
               return await step.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(startCard)]
               })
        }

        // await step.context.sendActivity({
        //     text: 'Here is an Adaptive Card:',
        //     attachments: [CardFactory.adaptiveCard(startCard)]
        // });
        // return Dialog.EndOfTurn;
    }

    async secondStep(step){
        return await step.endDialog();
    }
}

module.exports= {rootDialog,ROOT_DIALOG}