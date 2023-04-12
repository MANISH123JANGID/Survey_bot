// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TeamsActivityHandler, MessageFactory, CardFactory, TeamsInfo, TurnContext } = require('botbuilder');
const startCard= require('../resources/commons/startCard.json')

const axios = require('axios');

const logger= require('../services/logger');

const {saveImageDb}= require('../services/axios');

const path= require('path');
const fs = require('fs')

const {cosmosDatabase}= require('../services/cosmosDB');

class Bot extends TeamsActivityHandler {
    constructor(userState, conversationState, dialog) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState= conversationState;
        this.userState= userState;
        this.dialog= dialog;
        this.dialogState= this.conversationState.createProperty('DialogState')

        this.onConversationUpdate(async(context,next) => {
            await this.addConversationReference(context);
            await next();
        })

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMembersAdded(async (context, next) => {
            await context.sendActivity({
                attachments:[CardFactory.adaptiveCard(startCard)]
            })
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {
            // if(context.activity.attachments && context.activity.attachments.length>0){
            //     await this.handleIncomingAttachments(context);
            // }
           
            await this.addConversationReference(context);
            await this.dialog.run(context, this.dialogState);
            await next();
        });
    }

    async addConversationReference(context){
        const cosmos= new cosmosDatabase();
        let members= await TeamsInfo.getMembers(context);
        const conversationReference= TurnContext.getConversationReference(context.activity);
        console.log(conversationReference,"conversationReference");
        return await cosmos.upsert(members[0].userPrincipalName,conversationReference);
    }

    async run(context){
        await super.run(context);

        await this.conversationState.saveChanges(context,false);
        await this.userState.saveChanges(context,false);
    }

    // async handleIncomingAttachments(turnContext){
    //     const promises= turnContext.activity.attachments.map(this.downloadandWriteFile);
    //     const successfulSaves=await Promise.all(promises);

    //     async function replyForReceivedAttachments(localAttachmentData) {
    //         if (localAttachmentData) {
    //             // Because the TurnContext was bound to this function, the bot can call
    //             // `TurnContext.sendActivity` via `this.sendActivity`;
    //             await this.sendActivity(`Attachment "${ localAttachmentData.fileName }" ` +
    //                 `has been received and saved to "${ localAttachmentData.localPath }".`);
    //         } else {
    //             await this.sendActivity('Attachment was not successfully saved to disk.');
    //         }
    //     }

    //     const replyPromises = successfulSaves.map(replyForReceivedAttachments.bind(turnContext));
    //     await Promise.all(replyPromises);
    // }

    // async downloadandWriteFile(attachment) {
    //     // Retrieve the attachment via the attachment's contentUrl.
    //     const url = attachment.contentUrl;
    //     console.log(attachment.contentUrl)

    //     // Local file path for the bot to save the attachment.
    //     const localFileName = path.join(__dirname, attachment.name);
    //     try {
    //         // arraybuffer is necessary for images
    //         const response = await axios.get(url, { responseType: 'arraybuffer' });
    //         console.log("response before converting to json",response.data);
    //         // If user uploads JSON file, this prevents it from being written as "{"type":"Buffer","data":[123,13,10,32,32,34,108..."
    //         if (response.headers['content-type'] === 'application/json') {
    //             response.data = JSON.parse(response.data, (key, value) => {
    //                 return value && value.type === 'Buffer' ? Buffer.from(value.data) : value;
    //             });
    //         }
    //         console.log("response after converting to json",response.data);
            
    //         fs.writeFile(localFileName, response.data, (fsError) => {
    //             if (fsError) {
    //                 throw fsError;
    //             }
    //         });

    //         const saveImage= await saveImageDb(attachment.name,localFileName);
    //     } catch (error) {
    //         console.error(error);
    //         return undefined;
    //     }
    //     // If no error was thrown while writing to disk, return the attachment's name
    //     // and localFilePath for the response back to the user.
    //     return {
    //         fileName: attachment.name,
    //     };
    // }


    handleTeamsSigninVerifyState=async(context,state)=>
    { 
        console.log(state);
         await this.dialog.run(context,this.dialogState);
    }

}

module.exports = Bot;
