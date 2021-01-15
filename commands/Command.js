const UserCommands = require("../data/ModelHandlers/UserCommands");
const CustomError = require("../lib/errors/CustomError");

class Command {
    constructor(msg, options) {
        this.msg = msg;
        Object.assign(this, options);
    }
    /*Ensures that all parameters exist and that their types match*/
    //DO NOT MUTATE EXPECTED PARAMETERS
    validate() {
        for(var i=0;i<this.expectedParameters.length;i++) {
            const expected = this.expectedParameters[i];
            const actual = this.msg.parameters[i] || expected.default;
            const actualType = this.determineVariableType(expected.type, actual);
            //do the types match?
            if(!expected.type.includes(actualType)) {
                //error here for something
            }
            console.log(actualType);
            console.log(expected, actual, actualType);

            //does the parameter exist?
            if((actualType === 'undefined' || actual == '') && !expected.optional) {
                console.log('here');
                throw new CustomError('MISSING_PARAMETER', expected.name);
            }
            switch(actualType) {
                case 'string':
                case 'array':
                    this[expected.name] = actual;
                    break;
                case 'number':
                    let parsed = parseInt(actual);
                    console.log('PARSED', parsed);
                    if(!Number.isInteger(parsed)) {
                        throw new CustomError('NON_NUMERIC_CHOICE', expected.name);
                    }
                    if(parsed <= 0) {
                        throw new CustomError('NEGATIVE_VALUE');
                    }
                    //valid
                    this[expected.name] = parsed;
                    break;
                case 'rest':
                    this[expected.name] = this.msg.parameters.slice(i, this.msg.parameters.length).join(' ');
                    break;
            }
        }
        return true;
    }
    determineVariableType(possible, value) {
        if(Array.isArray(possible)) {
            for(var i=0;i<possible.length;i++) {
                switch(possible[i]) {
                    case 'number':
                        if(Number.isInteger(parseInt(value))) {
                            return 'number';
                        }
                    case 'array':
                        if(Array.isArray(JSON.parse(value))) {
                            return 'array';
                        }
                    case 'string':
                        return 'string';
                    case 'rest':
                        return 'rest';
                    default:
                        return undefined;
                }
            }
        }
        return typeof value;
    }
    async run() {
        //setup the next command
        if(this.reset) {
            await UserCommands.update(this.msg.userId, [
                { rowName: 'nextCommand', value: null },
                { rowName: 'saved', value: null }
            ]);
        }
        if(this.nextCommand !== undefined) {
            await UserCommands.update(this.msg.userId, [
                { rowName: 'nextCommand', value: this.nextCommand }
            ]);
        }
    }
}

module.exports = Command;