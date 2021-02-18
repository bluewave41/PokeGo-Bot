const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
 
const logger = createLogger({
	level: 'info',
	format: combine(
        timestamp(),
        myFormat,
        format.json()
	),
	transports: [
		new transports.File({ filename: 'combined.log' }),
	],
});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
/*if (process.env.NODE_ENV !== 'production') {
    console.log('here');
    logger.add(new transports.Console({
        format: format.simple(),
    }));
}*/

module.exports = logger;