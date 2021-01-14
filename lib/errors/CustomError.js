const ErrorList = require('~/data/Lists/ErrorList');

class CustomError extends Error {
    constructor(error, replace) {
        super(error);
        this.replace = replace;
        this.name = 'CustomError';
    }
    getMessage() {
        const replacements = [].concat(this.replace || []);
        let errorMessage = ErrorList[this.message];
        if(!errorMessage) {
            return `I got ${this.message} but it wasn't in the list.`;
        }
        for(var i=0;i<replacements.length;i++) {
            errorMessage = errorMessage.replace('{replace}', replacements[i]);
        }
        return errorMessage;
    }
}

module.exports = CustomError;