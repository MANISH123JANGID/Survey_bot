// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory,CardFactory } = require('botbuilder');
const{saveFamilyProfile,getStatusnDetails,saveReason,delete_Survey,updateSurvey} = require('../services/axios')
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
const FamilyProfile = require('../familyProfile');

const {FamilyDetailCardRenderer}= require('../resources/familyDetailCardRender');
const {DeleteDetailCardRenderer} = require('../resources/deleteCard')
const {EditCardRenderer}= require('../resources/showCardForEdit');

const populationOptionCard= require('../resources/populationOptionCard.json');
const statusnDetailCard= require('../resources/statusnDetailCard.json');
const getEmailCard=require('../resources/getEmailCard.json');
const editSurveyCard= require('../resources/editSurveyCard.json');
const startCard= require('../resources/startCard.json')

// const familyDetailCard= require('../resources/familyDetailCard.json');
const deleteCard= require('../resources/deleteCard.json');
// const {rootDialog ,ROOT_DIALOG } = require('./rootdialog');

// const {ParentDialog, PARENT_DIALOG}= require('./parentDialog');

const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const POPULATION_DIALOG = 'POPULATION_DIALOG';
const FAMILY_TYPE= 'FAMILY_TYPE';
const NUM_OF_MEMBERS = 'NUM_OF_MEMBERS';

class PopulationDialog extends ComponentDialog {
    constructor(){
        super(POPULATION_DIALOG);

        // this.addDialog(new rootDialog(ROOT_DIALOG));
        // this.addDialog(new rootDialog(ROOT_DIALOG));

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
            this.emailId.bind(this),
            this.familyType.bind(this),
            this.numOfMembers.bind(this),
            this.belowAgeOf18.bind(this),
            this.howManyEmployed.bind(this),
            this.noOfMales.bind(this),
            this.religion.bind(this),
            this.caste.bind(this),
            this.familyIncome.bind(this),
            this.summaryStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    // async run(context, accessor) {
    //     const dialogSet = new DialogSet(accessor);
    //     dialogSet.add(this);
    //     const dialogContext = await dialogSet.createContext(context);
    //     const result =await dialogContext.continueDialog();
    //     if(result.status===DialogTurnStatus.empty){
    //         await dialogContext.beginDialog(this.id);
    //     }
    // }

    async startSurveyStep(step){
        // return await step.prompt(CHOICE_PROMPT,{
        //     prompt:"Hey! Welcome to the Population Survey.Please select any option.",
        //     choices: ChoiceFactory.toChoices(['Start-Survey','Cancel'])
        // })
        await step.context.sendActivity({
            attachments:[CardFactory.adaptiveCard(populationOptionCard)]
        })
        return Dialog.EndOfTurn;

    }

    async startOrCancelStep(step) {
        const choice = step.context.activity.value.name;

        switch(choice){
            case 'new_survey':
                const promptOptions= {prompt:'Please enter your name.', retryPrompt: 'Please enter name in valid format'}
                return await step.prompt(NAME_PROMPT,promptOptions)
               
            case 'status_details':
                await step.context.sendActivity({
                    attachments:[CardFactory.adaptiveCard(getEmailCard)]
                });
                step.values.intent='statusnDetails'
                return Dialog.EndOfTurn;
             
            case 'edit':
                 await step.context.sendActivity({
                    attachments:[CardFactory.adaptiveCard(getEmailCard)]
                })
                step.values.intent= 'edit';
                return Dialog.EndOfTurn;

            case 'delete_survey':
                await step.context.sendActivity({
                    attachments:[CardFactory.adaptiveCard(getEmailCard)]
                })
                step.values.intent= 'delete'
                return Dialog.EndOfTurn;

            case 'cancel_survey':
                await step.context.sendActivity({
                    attachments:[CardFactory.adaptiveCard(startCard)]
                })
                return step.endDialog();
        }

        // if(step.context.activity.value.name==='new_survey'){
        //     const promptOptions= {prompt:'Please enter your name.', retryPrompt: 'Please enter name in valid format'}
        //     return await step.prompt(NAME_PROMPT,promptOptions)
        // }else if{

        // }
        // else{
        //     return await step.cancelAllDialogs();
        // }
    }
    async emailId(step) {
        console.log(step.context.activity.value);
        if(step.context.activity.value !== undefined) {
            if(step.context.activity.value.emailID){

                if(step.values.intent==='statusnDetails'){
                    const emailId = step.context.activity.value.emailID;
                    const familyDetailCard= await FamilyDetailCardRenderer(emailId);
                    console.log(familyDetailCard);
                    await step.context.sendActivity({
                        attachments:[CardFactory.adaptiveCard(familyDetailCard)]
                    })
                    //step.prompt(NAME_PROMPT,'Write something to continue!');
                    await step.context.sendActivity({
                        attachments:[CardFactory.adaptiveCard(startCard)]
                    })
                    return await step.cancelAllDialogs();
                }

                if(step.values.intent==='edit'){
                    const emailID= step.context.activity.value.emailID;
                    const data= await EditCardRenderer(emailID);
                    console.log(data);

                    await step.context.sendActivity({
                        attachments:[CardFactory.adaptiveCard(data.card)]
                    })
                    step.values.Id= data.userData.userId;
                    return Dialog.EndOfTurn;
                }

                if(step.values.intent==='delete'){
                    const emailID= step.context.activity.value.emailID;
                    step.values.emailIDforDeleting= emailID;
                    const deleteCard= await DeleteDetailCardRenderer(emailID);
                    await step.context.sendActivity({
                        attachments:[CardFactory.adaptiveCard(deleteCard)]
                    })
                    return Dialog.EndOfTurn;
                }
            }
        }
        if(step.result !== undefined) { 
            step.values.name= step.result;
            const promptOptions= {prompt:"Please enter your email address.",retryPrompt:"Please enter a valid email address"}
            return await step.prompt(NAME_PROMPT,promptOptions);
        }
    }
    async familyType(step){
        if(step.values.intent==='edit'){
            const dataToUpdate = step.context.activity.value;
            const ID= step.values.Id;
            console.log(ID);
            const updated = await updateSurvey(ID, dataToUpdate);
            console.log(updated);
            if(updated){
                console.log('email id receievd here is ',step.context.activity.value.emailID)
                const emailID=step.context.activity.value.emailID;
                const familyDetailCard= await FamilyDetailCardRenderer(emailID);
                await step.context.sendActivity({
                    text:'Survey updated successfully! Here is your updated survey',
                    attachments: [CardFactory.adaptiveCard(familyDetailCard)]
                })
                Dialog.EndOfTurn
                await step.prompt(NAME_PROMPT,'Please type something to continue');
                return await step.cancelAllDialogs();
            }else{
               return  await step.prompt(NAME_PROMPT,'There was some error in updating the survey');
            }
        }
        console.log(step.context.activity.value)
        if(step.context.activity.value !== undefined){
            if(step.context.activity.value.reason){
                step.values.reason= step.context.activity.value.reason;
                console.log(step.context.activity.value.reason);
                return await step.prompt(CONFIRM_PROMPT,'Please confirm to delete the survey!');
            }else{

            }
        }else{
            step.values.emailID= step.result;
            return await step.prompt(FAMILY_TYPE,{
                prompt:`Great ${step.values.name}, You are good to go! \n Select the type of family`,
                choices: ChoiceFactory.toChoices(['NUCLEAR-FAMILY','JOINT-FAMILY',])
            })
        } 
    }

    async numOfMembers(step){
        if(step.result===true){
            const reasonSaved= await saveReason(step.values.reason,step.values.emailIDforDeleting);
            const deleted= await delete_Survey(step.values.emailIDforDeleting);
            console.log(deleted);
            await step.prompt(NAME_PROMPT,"Your survey has been deleted! Type anything to continue!")
            return await step.cancelAllDialogs();
        }if(step.result===false){
            await step.prompt(NAME_PROMPT,"You cancelled deleting the survey!\n Type anything to continue!");
            return await step.cancelAllDialogs();
        }else{
            step.values.familyType= step.result;
            return await step.prompt(NUM_OF_MEMBERS,`${step.values.name}, Enter the number of members in your family.`);
        }
    }
    async belowAgeOf18(step){
        step.values.numOfMembers= step.result;
        return await step.prompt(NUMBER_PROMPT,'How many are below the age of 18?');
    }
    async howManyEmployed(step){
        step.values.belowAgeOf18= step.result;
        step.values.aboveAgeOf18= step.values.numOfMembers-step.values.belowAgeOf18;
        return await step.prompt(NUMBER_PROMPT,'How many are Employed or working?')
    }
    async noOfMales(step){
        step.values.Employed= step.result;
        return await step.prompt(NUMBER_PROMPT,'Number of males in the family');
    }
    async religion(step){
        step.values.numOfMales= step.result;
        step.values.numOfFemales= step.values.numOfMembers- step.values.numOfMales;
        return await step.prompt(CHOICE_PROMPT,{
            prompt:"Please select your religion from given choices.",
            choices: ChoiceFactory.toChoices(['Hinduism','Islam','Sikhism','Christianity','Jainism','Buddhism ','Tribal-Religion','No religion'])
        })
    }
    async caste(step){
        step.values.religion= step.result;
        return await step.prompt(NAME_PROMPT,'Please enter your caste.')
    }
    async familyIncome(step){
        step.values.caste= step.result;
        return await step.prompt(CHOICE_PROMPT,{
            prompt:"Please select income range of your family(per annum).",
            choices: ChoiceFactory.toChoices(['Upto ₹2.5 Lakh','₹2.5-5 Lakh','₹5-10 Lakh','₹10-20 Lakh','₹20-50 Lakh','₹50-99 Lakh','₹1 Crore or above'])
        })
    }
    async summaryStep(step) {
        step.values.familyIncome= step.result;
        console.log(step.values)

        const familyProfile= new FamilyProfile(step.values.name,step.values.emailID,step.values.familyType.value,step.values.numOfMembers,step.values.belowAgeOf18,step.values.aboveAgeOf18,step.values.Employed,step.values.numOfMales,step.values.numOfFemales,step.values.caste,step.values.religion.value,step.values.familyIncome.value);

        const finalMesage= `Great ${familyProfile.NameofHead}, You have successfully completed the survey! 
        We have your familyProfile as given below:\n 
        Name of Head of Family  :   ${familyProfile.NameofHead} \n
        EmailID                 :   ${familyProfile.emailID} \n
        Type of Family          :   ${familyProfile.familyType} \n
        Total Members in Family :   ${familyProfile.numberOfMembers}\n
        Members(below age of 18):   ${familyProfile.numBelow18}\n
        Members(above age of 18):   ${familyProfile.numAbove18}\n
        Employed Members        :   ${familyProfile.numOfEmployed}\n
        Number of Males         :   ${familyProfile.numOfMales}\n
        Number of Females       :   ${familyProfile.numOfFemales} \n
        Caste                   :   ${familyProfile.Caste}\n
        Religion                :   ${familyProfile.Religion}\n
        Family Income(₹)        :   ${familyProfile.FamilyIncome} per annum\n
        \n
        Thank you, Mr.${familyProfile.NameofHead} for participating in survey. `
        
        console.log(step.values.name,step.values.emailID,step.values.familyType.value,
            step.values.numOfMembers,step.values.belowAgeOf18,
            step.values.aboveAgeOf18,step.values.Employed,
            step.values.numOfMales,step.values.numOfFemales,step.values.caste,step.values.religion.value,
            step.values.familyIncome.value)

        const saved= await saveFamilyProfile(step.values.name,step.values.emailID,step.values.familyType.value,
            step.values.numOfMembers,step.values.belowAgeOf18,
            step.values.aboveAgeOf18,step.values.Employed,
            step.values.numOfMales,step.values.numOfFemales,step.values.religion.value,step.values.caste,
            step.values.familyIncome.value);
        
        const dataSaved= 'Your survey has been saved. Please type something to continue!'

        if(saved){
            await step.context.sendActivity(finalMesage);
        }
        await step.context.sendActivity(dataSaved);

        return await step.endDialog();
    }
}

module.exports = {PopulationDialog,POPULATION_DIALOG}
