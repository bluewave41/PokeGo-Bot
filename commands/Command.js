const CustomError = require("../lib/errors/CustomError");
const Utils = require("../lib/Utils");
const User = require('~/knex/models/User');

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

        if(expected.type == 'number' && expected.max && actual > expected.max) {
            throw new CustomError('INVALID_RANGE_CHOICE', expected.max);
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
                        rest += this.msg.parameters[i] + (expected.separator || '');
                    }
                    else {
                        break;
                    }
                }
                //remove any trailing spaces from separator
                this[expected.name] = rest.trim();
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
            let actual = expected.sanitize ? Utils.sanitizeString(this.msg.parameters[index])
                : this.msg.parameters[index] //what is the actual parameter?
            if(actual) {
                actual = actual.toLowerCase();
            }
            const actualType = this.determineVariableType(actual, expected.type); //what type is it?
            //test if the parameter matches the given function
            if(typeof expected.possible == 'function') {
                //if it doesn't match
                if(!expected.possible(actual)) {
                    //and if it wasn't optional
                    if(!expected.optional) {
                        throw new CustomError('INVALID_CHOICE', expected.name);
                    }
                    else {
                        continue;
                    }
                }
            }
            else if(expected.possible && !expected.possible.includes(actual)) {
                throw new CustomError('INVALID_CHOICE', expected.name);
            }
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
        if(/^\d+$/.test(value) && Number.isInteger(parseInt(value))) {
            return 'number';
        }
        if(expectedType == 'rest') {
            return 'rest';
        }
        return 'string';
    }
    async run() {}
    async handlePagination(lastMessageId) {
        if(this.pagination.entryCount > this.pagination.MAX_ENTRIES) {
            await User.query().update({
                page: 1,
                maxPage: Math.ceil(this.pagination.entryCount/this.pagination.MAX_ENTRIES)
            })
            .where('userId', this.msg.userId);

            const message = await this.msg.channel.messages.fetch(lastMessageId);
            for(var i=0;i<this.pagination.emojis.length;i++) {
                message.react(this.pagination.emojis[i]);
            }
        }
    }
}

module.exports = Command;