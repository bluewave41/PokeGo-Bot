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
            const actualType = typeof actual;
            console.log(expected, actual, actualType)

            //does the parameter exist?
            if((actualType == 'undefined' || actual == '') && !expected.optional) {
                throw new CustomError('MISSING_PARAMETER', expected.name);
            }
            switch(expected.type) {
                case 'string':
                    this[expected.name] = actual;
                    break;
                case 'number':
                    let parsed = parseInt(actual);
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