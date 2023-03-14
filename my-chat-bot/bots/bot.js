// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TeamsActivityHandler, MessageFactory, CardFactory } = require('botbuilder');
const startCard= require('../resources/startCard.json')

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


        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMembersAdded(async (context, next) => {
            await context.sendActivity({
                attachments:[CardFactory.adaptiveCard(startCard)]
            })
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {
            await this.dialog.run(context, this.dialogState);
            await next();
        });
    }

    async run(context){
        await super.run(context);

        await this.conversationState.saveChanges(context,false);
        await this.userState.saveChanges(context,false);
    }
    handleTeamsSigninVerifyState=async(context,state)=>
    { 
        console.log(state); await this.dialog.run(context,this.dialogState);
    }
}

module.exports = Bot;
