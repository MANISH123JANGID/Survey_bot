const {InputHints,CardFactory}=require('botbuilder');

const {ComponentDialog, DialogTurnStatus}=require('botbuilder-dialogs');

const startCard= require('../resources/commons/startCard.json')

class HelpandCancel extends ComponentDialog {
    async onContinueDialog(innerDc){
        const result = await this.interrupt(innerDc);
        if(result){
            return result;
        }
        return await super.onContinueDialog(innerDc);
    }
    async interrupt(innerDc){
        if(innerDc.context.activity.text){
            const text= innerDc.context.activity.text.toLowerCase();

            switch(text){
                case 'help':
                case '?':{
                    const helpMessageText = 'This is a help section, type you answer on the last bots question to continue the dialog';
                    await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
                    return { status: DialogTurnStatus.waiting };
                }
                case 'leave':
                case 'exit':
                case 'quit':
                case 'cancel':{
                    const cancelMessageText = 'Thanks For visiting!';
                    await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                    await innerDc.context.sendActivity({
                         attachments:[CardFactory.adaptiveCard(startCard)]
                        })
                        return await innerDc.cancelAllDialogs();
                }
                default: await innerDc.context.sendActivity({
                    attachments:[CardFactory.adaptiveCard(startCard)]
                   })
                   return await innerDc.cancelAllDialogs();
            }
        }
    }   
}

module.exports.HelpandCancel=HelpandCancel;