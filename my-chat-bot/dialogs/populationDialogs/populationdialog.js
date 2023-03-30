// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory,CardFactory } = require('botbuilder');
const{saveFamilyProfile,getStatusnDetails,saveReason,delete_Survey,editSurvey} = require('../../services/axios')
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
const FamilyProfile = require('../../familyProfile');

const {HelpandCancel}= require('../interruptHandler');

const {FamilyDetailCardRenderer}= require('../../resources/populationResources/familyDetailCardRender');
const {DeleteDetailCardRenderer} = require('../../resources/populationResources/deleteCard')
const {EditCardRenderer}= require('../../resources/populationResources/showCardForEdit');

const populationOptionCard= require('../../resources/commons/OptionCard.json');
const getEmailCard=require('../../resources/commons/getEmailCard.json');
const startCard= require('../../resources/commons/startCard.json');

const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const POPULATION_DIALOG = 'POPULATION_DIALOG';
const FAMILY_TYPE= 'FAMILY_TYPE';
const NUM_OF_MEMBERS_JOINT = 'NUM_OF_MEMBERS_JOINT';
const NUM_OF_MEMBERS_NUCLEAR='NUM_OF_MEMBERS_NUCLEAR'
const EMAIL_PROMPT= 'EMAIL_PROMPT';
const NUMBER_BELOW_18='NUMBER_BELOW_18'
const NUMBER_ABOVE_18 = 'NUMBER_ABOVE_18'
const TEXT_PROMPT="TEXT_PROMPT"

class PopulationDialog extends HelpandCancel {
    constructor(userState, conversationState){
        super(POPULATION_DIALOG);
        this.userProfile = userState.createProperty("USER_PROFILE");

        this.inputs={};
        this.addDialog(new TextPrompt(NAME_PROMPT,this.NameValidator));
        this.addDialog(new TextPrompt(EMAIL_PROMPT,this.EmailValidator));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT));
        this.addDialog(new ChoicePrompt(FAMILY_TYPE));
        this.addDialog(new NumberPrompt(NUM_OF_MEMBERS_NUCLEAR,this.MembersValidator_Nuclear));
        this.addDialog(new NumberPrompt(NUM_OF_MEMBERS_JOINT,this.MembersValidator_Joint))
        this.addDialog(new NumberPrompt(NUMBER_BELOW_18))
        this.addDialog(new NumberPrompt(NUMBER_ABOVE_18))
        this.addDialog(new TextPrompt(TEXT_PROMPT));

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
   

    async startSurveyStep(step){  
        const opt=step.options;
        console.log('opt',opt);
        if(opt.hasOwnProperty('case')){
            return await step.next();
        }
      
        const populationCard= await step.context.sendActivity({
            attachments:[CardFactory.adaptiveCard(populationOptionCard)]
        })
        step.values.activityId= populationCard.id;
        return Dialog.EndOfTurn;
    }

    async startOrCancelStep(step) {
        await step.context.deleteActivity(step.values.activityId)
        console.log(" hiii",step.options);
        console.log("hey",step.context.activity.value.name)
        const choice = step.options.hasOwnProperty('case')?step.options.case: step.context.activity.value.name;
        delete step.options.case;
        console.log("step.options",step.options)
        switch(choice){
            case 'new_survey':
                const promptOptions= {prompt:'Please enter your name.', retryPrompt: 'Please enter name in valid format'}
              
                return await step.prompt(NAME_PROMPT,promptOptions);
            case 'status_details':
               
                const emailCard= await step.context.sendActivity({
                    attachments:[CardFactory.adaptiveCard(getEmailCard)]
                });
                step.values.activityId= emailCard.id;
                step.values.intent='statusnDetails'
                return Dialog.EndOfTurn;
             
            case 'edit':
                const emailCard1= await step.context.sendActivity({
                    attachments:[CardFactory.adaptiveCard(getEmailCard)]
                })
                step.values.activityId= emailCard1.id;
                step.values.intent= 'edit';
                return Dialog.EndOfTurn;

            case 'delete_survey':
                const emailCard2= await step.context.sendActivity({
                    attachments:[CardFactory.adaptiveCard(getEmailCard)]
                })
                step.values.activityId= emailCard2.id;
                step.values.intent= 'delete'
                return Dialog.EndOfTurn;

            case 'cancel_survey':
                await step.context.sendActivity({
                    attachments:[CardFactory.adaptiveCard(startCard)]
                })
                return step.endDialog();
        }
    }
    async emailId(step) {
        console.log(step.context.activity.value);
        if(step.context.activity.value !== undefined) {
            if(step.context.activity.value.emailID){
                if(step.values.intent==='statusnDetails'){
                    await step.context.deleteActivity(step.values.activityId)
                    const emailId = step.context.activity.value.emailID;
                    const familyDetailCard= await FamilyDetailCardRenderer(emailId);
                    if(familyDetailCard.message){
                         await step.prompt(TEXT_PROMPT,`${familyDetailCard.message}`)
                         await step.context.sendActivity({
                            attachments:[CardFactory.adaptiveCard(startCard)]
                        })
                        return await step.cancelAllDialogs();
                    }else{
                        await step.context.sendActivity({
                            attachments:[CardFactory.adaptiveCard(familyDetailCard)]
                        })
                        await step.context.sendActivity({
                            attachments:[CardFactory.adaptiveCard(startCard)]
                        })
                        return await step.cancelAllDialogs();
                    }
                }

                if(step.values.intent==='edit'){
                    await step.context.deleteActivity(step.values.activityId)
                    const emailID= step.context.activity.value.emailID;
                    const data= await EditCardRenderer(emailID);
                    console.log(" data of edit card option",data);
                    if(data.message){
                        await step.prompt(TEXT_PROMPT,`Family Profile with Email: ${emailID} not found`);
                        await step.context.sendActivity({
                            attachments:[CardFactory.adaptiveCard(startCard)]
                        })
                        return await step.cancelAllDialogs();
                    }else{
                        const editCard= await step.context.sendActivity({
                            attachments:[CardFactory.adaptiveCard(data.card)]
                        })
                        step.values.activityId=editCard.id;

                        step.values.Id= data.userData.userId;
                        return Dialog.EndOfTurn;
                    }
                }
                if(step.values.intent==='delete'){
                    await step.context.deleteActivity(step.values.activityId)
                    const emailID= step.context.activity.value.emailID;
                    step.values.emailIDforDeleting= emailID;
                    const deleteCard= await DeleteDetailCardRenderer(emailID);
                    if(deleteCard.message){
                        await step.prompt(TEXT_PROMPT,`Family Profile with Email: ${emailID} not found`);
                        await step.context.sendActivity({
                            attachments:[CardFactory.adaptiveCard(startCard)]
                        })
                        return await step.cancelAllDialogs();
                    }else{
                        const deleteCard1= await step.context.sendActivity({
                            attachments:[CardFactory.adaptiveCard(deleteCard)]
                        })
                        step.values.activityId=deleteCard1.id;
                        return Dialog.EndOfTurn;
                    }
                }
            }
        }
        if(step.result !== undefined) { 
            step.values.name= step.result;
            const promptOptions= {prompt:"Please enter your email address.",retryPrompt:"Please enter a valid email address"}
            return await step.prompt(EMAIL_PROMPT,promptOptions);
        }
       
    }
    async familyType(step){
        if(step.values.intent==='edit'){
            await step.context.deleteActivity(step.values.activityId)
            const dataToUpdate = step.context.activity.value;
            const ID= step.values.Id;
            console.log(ID);
            const updated = await editSurvey(ID, dataToUpdate);
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
                await step.context.deleteActivity(step.values.activityId)
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
        this.familyType=step.result;
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
            console.log("step.result.value",step.result.value)
            step.values.familyType= step.result.value;
            console.log(step.result);   
            console.log(step.values.familyType)
            if(step.values.familyType==='NUCLEAR-FAMILY'){
                const  promptOptions={prompt:'Enter the number of members in your nuclear family [Max. Limit:8]',retryPrompt:'Please enter valid number of members [Max. Limit:8]'}
                return await step.prompt(NUM_OF_MEMBERS_NUCLEAR,promptOptions)
            }else{
                const promptOptions={prompt:"Enter the number of members. [Max. Limit: 25]", retryPrompt:'Please enter valid number of members [Max. Limit:25]'};
                return await step.prompt(NUM_OF_MEMBERS_JOINT,promptOptions);
            }
        }
    }
    async belowAgeOf18(step){
        let user_Profile= await this.userProfile.get(step.context,new FamilyProfile());
        user_Profile.numberOfMembers=step.result;
        console.log('this is the best ',this.userProfile)
        // user_Profile.numberOfMembers= step.result;
        step.values.numOfMembers= step.result;
        this.inputs.numberOfMembers= step.result;  
        console.log(this.inputs);
        console.log("variables.numberOfMembers",this.inputs.numberOfMembers);
        console.log("step.values.numOfMembers,",step.values.numOfMembers);
        const promptOptions={prompt:"Enter the number of members below the age of 18.",retryPrompt:"Please enter a valid number! "}
        return await step.prompt(NUMBER_BELOW_18,promptOptions);
    }
    async howManyEmployed(step){
        let user_Profile= await this.userProfile.get(step.context,new FamilyProfile());
        user_Profile.numOfEmployed=step.result;
        console.log('user profile: ')
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

        const familyProfile= new FamilyProfile(step.values.name,step.values.emailID,step.values.familyType,step.values.numOfMembers,step.values.belowAgeOf18,step.values.aboveAgeOf18,step.values.Employed,step.values.numOfMales,step.values.numOfFemales,step.values.caste,step.values.religion.value,step.values.familyIncome.value);

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
        
        console.log(step.values.name,step.values.emailID,step.values.familyType,
            step.values.numOfMembers,step.values.belowAgeOf18,
            step.values.aboveAgeOf18,step.values.Employed,
            step.values.numOfMales,step.values.numOfFemales,step.values.caste,step.values.religion.value,
            step.values.familyIncome.value)

        const saved= await saveFamilyProfile(step.values.name,step.values.emailID,step.values.familyType,
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


    // VALIDATORS FOR VALIDATION OF DIFFRENT VALUES 
    NameValidator(prompt){
        const name= prompt.recognized.value;
        const NameExp= new RegExp("[a-zA-Z]");
        return NameExp.test(name);
    }

    EmailValidator(prompt){
        const email = prompt.recognized.value; const EMAIL_REGEXP = new RegExp("[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"); return EMAIL_REGEXP.test(email)
    }

    MembersValidator_Nuclear(prompt) {
        const num= prompt.recognized.value;
        if(num>8){
            return false;
        }else return true;
    }

    MembersValidator_Joint(prompt) {
        const num= prompt.recognized.value;
        if(num>25){
            return false;
        }else return true;
    }
}

module.exports = {PopulationDialog,POPULATION_DIALOG}
