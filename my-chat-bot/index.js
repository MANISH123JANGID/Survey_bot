const path = require('path');
const express= require('express');

// absolute path of the env file 
const ENV_FILE= path.join(__dirname,'.env');

const dotenv = require('dotenv');

const logger= require('./services/logger');

const{ 
    ApplicationInsightsTelemetryClient,
    TelemetryInitializerMiddleware
 }=  require('botbuilder-applicationinsights'); 

const{ 
    TelemetryLoggerMiddleware 
} = require('botbuilder-core');


// configuration of env file on the path 
dotenv.config({path: ENV_FILE});

const {cosmosDatabase}= require('./services/cosmosDB')

// destructuring various classes required for the app from botbuilder
const{
    CloudAdapter,
    ConfigurationBotFrameworkAuthentication,
    UserState,
    ConversationState,
    MemoryStorage,
    NullTelemetryClient
}= require('botbuilder');

const server = express();

server.use(express.json())

server.listen(3978, ()=>{
    console.log(`\n${ server.name } listening to ${ server.url }.`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// creating the authentication object from the class by passing the required params
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env);

// adpater object to create the adapter for the bot 
const Adapter = new CloudAdapter(botFrameworkAuthentication);

// requiring the files required for creating bot object and the root dialog object and other dialog objects are
const Bot = require('./bots/bot');
const {rootDialog}= require('./dialogs/rootdialog');

// for handling the exceptions and errors which the bot logic cant handle
Adapter.onTurnError= async (context,error)=>{

    console.error(`Unhandler error: ${error}`);

    // sending the activity to the emulator 
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    )
    
    // sending message to the user 
    await context.sendActivity('The bot encountered an error or bug!');
    
    // deleting the context of the conversationstate
    await conversationState.delete(context);
}

// method to create a telementry client where the date is sent , in this case app insights
const createTelementryClient=(instrumentationKey)=>{
    if(instrumentationKey){
        return new ApplicationInsightsTelemetryClient(instrumentationKey);
    }else{
        return new NullTelemetryClient()
    }
}

// adding the telementry client to the adapter middleware pipeline
const telemetryClient= createTelementryClient(process.env.InstrumentationKey)
const telementryLoggerMiddleware= new TelemetryLoggerMiddleware(telemetryClient);
const telemetryInitializerMiddleware= new TelemetryInitializerMiddleware(telementryLoggerMiddleware);
Adapter.use(telemetryInitializerMiddleware);


// creating memory storage object to store the states
const memoryStorage= new MemoryStorage();

// userState to save the userstate
const userState = new UserState(memoryStorage);

const conversationState= new ConversationState(memoryStorage);

const rootdialog = new rootDialog(userState, conversationState, telemetryClient);
rootDialog.telemetryClient= telemetryClient;
const myBot = new Bot(userState, conversationState, rootdialog);

server.get('/api/notification',async(req,res,next) => {
    const {email}= req.body;

    const cosmos= new cosmosDatabase();

    const result= await cosmos.Find(email);
    console.log(result);
    for (const iterator of Object.values(result)) {
        console.log(iterator);
        await Adapter.continueConversationAsync(process.env.MicrosoftAppId,iterator.conversion,async context => {
            await context.sendActivity('proactive hello');
        })
    }
    return res.status(200).json({
        message: 'Proactive message has been sent successfully'
    })
})

server.post('/api/messages', async (req,res)=>{
    logger.error('this is some error message');
    logger.debug('this is some error message');
    logger.info('this is some error message')
    await Adapter.process(req,res,(context)=>
        myBot.run(context));
});

