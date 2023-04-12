// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory, CardFactory } = require('botbuilder');
// const newCard= require('../resources/newCard.json');
const {saveEducationSurvey}= require('../../services/axios');
const { 
    AttachmentPrompt,
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog,
    Dialog
} = require('botbuilder-dialogs');
const { Channels } = require('botbuilder-core');

// const Education= require('../../educationProfile')

// const {educationSurvey,EDUCATIONAL_SURVEY}= require('./educationSurvey')

// const{statusDialog,STATUS_DIALOG}= require('./statusDialog')
// const {deleteSurvey,DELETE_SURVEY}= require('./deleteEducationSurvey')
// const{editSurvey,EDIT_SURVEY}=require('./editSurvey')

const{populationSurvey,POPULATION_SURVEY}= require('./populationSurvey')

const {HelpandCancel}= require('../interruptHandler');

const startCard= require('../../resources/commons/startCard.json')
const OptionCard= require('../../resources/commons/OptionCard.json');

const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const POPULATION_DIALOG = 'POPULATION_DIALOG';
const FAMILY_TYPE= 'FAMILY_TYPE';
const NUM_OF_MEMBERS = 'NUM_OF_MEMBERS';

class populationDialog extends HelpandCancel {
    constructor(userState, conversationState,telemetryClient){
        super(POPULATION_DIALOG);

        this.userState = userState
        this.conversationState = conversationState
        this.telemetryClient = telemetryClient
        
        // this.addDialog(new rootDialog(ROOT_DIALOG));
        this.addDialog(new populationSurvey(userState,conversationState,telemetryClient));
        
        // this.addDialog(new deleteSurvey());

        // this.addDialog(new statusDialog());

        // this.addDialog(new editSurvey());

        this.addDialog(new TextPrompt(NAME_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT));
        this.addDialog(new ChoicePrompt(FAMILY_TYPE));
        this.addDialog(new NumberPrompt(NUM_OF_MEMBERS));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.startSurveyStep.bind(this),
            this.startOrCancelStep.bind(this),
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
  
    async startSurveyStep(step){
        const optioncard=  await step.context.sendActivity({
            attachments:[CardFactory.adaptiveCard(OptionCard)]
        })
        // step.values.activityId= optioncard.id;
        return Dialog.EndOfTurn
    }

    async startOrCancelStep(step) {
        // await step.context.deleteActivity(step.values.activityId);
        const choice= step.context.activity.value.name;
        console.log('in the educationdialog',choice, step.context.activity.value.name);
        switch(choice) {
            case 'new_survey':
                return await step.beginDialog(POPULATION_SURVEY);
            case 'status_details':
                return await step.beginDialog(STATUS_DIALOG)
            case 'edit':
                return await step.beginDialog(EDIT_SURVEY)
            case 'delete_survey':
                return await step.beginDialog(DELETE_SURVEY)
            case 'cancel_survey':
                await step.context.sendActivity({
                    attachments:[CardFactory.adaptiveCard(startCard)]
                })
                return step.endDialog();
        }
    }
}

module.exports = {populationDialog,POPULATION_DIALOG}
