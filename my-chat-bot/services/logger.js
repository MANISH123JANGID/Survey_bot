const {format,transports,createLogger}= require('winston');

const{ combine, timestamp, label, printf,prettyPrint } =format;

const CATEGORY='CUSTOM_FORMAT';

require("winston-daily-rotate-file");

const errorFile= new transports.DailyRotateFile({
    level: 'error',
    filename:"logs/rotate-error-%DATE%.log",
    datePattern:"DD-MM-YYYY",
    maxFiles:"1d"
})

const debugFile= new transports.DailyRotateFile({
    filename:"logs/rotate-debug-%DATE%.log",
    datePattern:"DD-MM-YYYY",
    maxFiles:"1d"
})

const infoFile = new transports.DailyRotateFile({
    filename:"logs/rotate-info-%DATE%.log",
    datePattern:"DD-MM-YYYY",
    maxFiles:"1d"
})

const customFormat= printf(({level,message,label,timestamp}) =>{
    return `${timestamp} [${label}] ${level}: ${message}`
})

const logger= createLogger({
    level:"debug",
    format: combine(label({label: CATEGORY}),timestamp(),prettyPrint()),
    transports: [ new transports.Console(), errorFile, debugFile, infoFile]
})

// const logger= winston.createLogger({
//     level:"debug",
//     format: winston.format.json(),
//     transports: [new winston.transports.Console()],
// })

module.exports= logger;