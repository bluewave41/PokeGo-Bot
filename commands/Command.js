const UserCommands = require("../data/ModelHandlers/UserCommands");
const CustomError = require("../lib/errors/CustomError");

class Command {
    constructor(msg, options) {
        this.msg = msg;
        Object.assign(this, options);
    }
    checkParameter(expected, actual, actualType, index) {
        //does the parameter exist?
        if((actualType === 'undefined' || actual == '') && !expected.optional) {
            throw new CustomError('MISSING_PARAMETER', expected.name);
        }

        //check the type
        switch(actualType) {
            case 'string':
            case 'array':
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
                //check of type
                let rest = '';
                let i;
                for(i=index-1;i<this.msg.parameters.length;i++) {
                    const type = this.determineVariableType(this.msg.parameters[i], expected.ofType);
                    if(type == expected.ofType || expected.ofType == 'any') {
                        rest += this.msg.parameters[i] + expected.separator;
                    }
                    else {
                        break;
                    }
                }
                this[expected.name] = rest;
                return i;
        }
        return index;
    }
    /*Ensures that all parameters exist and that their types match*/
    //DO NOT MUTATE EXPECTED PARAMETERS
    validate() {
        let expectedParameters = this.expectedParameters;
        let index = 0;
        for(var i=0;i<expectedParameters.length;i++) {
            const expected = expectedParameters[i]; //what should the parameter be?
            /*Using index here because optional parameters shouldn't increment this count*/
            const actual = this.msg.parameters[index]; //what is the actual parameter?
            const actualType = this.determineVariableType(actual, expected.type); //what type is it?
            if(expected.type.includes(actualType)) {
                index++;
                if(expected.isDefined) {
                    this.checkParameter(expected, actual, actualType, i);
                    expectedParameters = expected.isDefined;
                    //reset for loop for new array
                    i = -1; //this will increment when loop finishes
                }
                else {
                    index = this.checkParameter(expected, actual, actualType, index);
                }
            }
            else {
                if(expected.optional) {
                    index = this.checkParameter(expected, expected.default, this.determineVariableType(expected.type, expected.default), i);
                }
                else {
                    throw new CustomError('MISSING_PARAMETER', expected.name);
                }
            }
        }
        return true;
    }
    determineVariableType(value, expectedType) {
        if(typeof value === 'undefined') {
            return 'undefined';
        }
        if(Number.isInteger(parseInt(value))) {
            return 'number';
        }
        if(expectedType == 'rest') {
            return 'rest';
        }
        return 'string';
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