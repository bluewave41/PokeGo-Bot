const User = require("~/knex/models/User");
const CustomError = require("./errors/CustomError");
const PokemonData = require('~/data/PokemonData');

module.exports = {
    validateParameters(parameters, expectedTypes) {
        for(var i=0;i<parameterList.length;i++) {
            let parameter = parameters[i];
            if(typeof parameter == 'undefined' || parameters[i] == '') { //parameter doesn't exist
                throw new CustomError('MISSING_PARAMETER', parameterList[i]);
            }
        }
    },
    isNumeric(value) {
        let parsed = parseInt(value);
        if(!Number.isInteger(parsed) || parsed <= 0 ) {
            return false;
        }
        return parsed;
    },
    doParametersExist(parameterList, parameters) {
        for(var i=0;i<parameterList.length;i++) {
            if(typeof parameters[parameterList[i]] == 'undefined' || parameters[parameterList[i]] == '') {
                throw new CustomError('MISSING_PARAMETER', parameterList[i]);
            }
        }
        return true;
    },
    checkLength(parameter, min, max, error) {
        if(min) {
            if(parameter.length < min) {
                throw new CustomError(error);
            }
        }
        if(max) {
            if(parameter.length > max) {
                throw new CustomError(error);
            }
        }
        return parameter;
    },
    findElement(source, needle, index, error) {
        let element;
        if(index) {
            element = source.find(el => el[index].toLowerCase() == needle.toLowerCase());
        }
        else {
            element = source.find(el => el.toLowerCase() == needle.toLowerCase());
        }
        if(!element) {
            throw new CustomError(error);
        }
        return element;
    },
    haveSufficientCandy(candy, amount, error) {
        if(candy-amount < 0) {
            throw new CustomError(error);
        }
        return true;
    },
    generateRandomString(length) {
        return [...Array(length)].map(() => Math.random().toString(36)[2]).join('').toUpperCase()
    },
    getIdFromName(name) {
        for(var i=1;i<152;i++) {
            if(PokemonData[i].name.toLowerCase() == name.toLowerCase()) {
                return i;
            }
        }
        return false;
    },
    msToTime(time){
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
      
        let hours = Math.floor(time / hour % 24);
        let minutes = Math.floor(time / minute % 60);
        let seconds = Math.floor(time / second % 60);
       
      
        return {hours: hours, minutes: minutes, seconds: seconds}
    },
    async isAdmin(userId) {
        const user = await User.query().select('admin')
            .where('userId', userId).first();
        if(!user || !user.admin) {
            throw new CustomError('NOT_ADMIN');
        }
        return true;
    },
    // Returns a random integer between min and max
    // Using Math.round() will give you a non-uniform distribution!
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    isConfirmResponse(response) {
        switch(response.toLowerCase()) {
            case 'y':
            case 'confirm':
                return true;
        }
        return false;
    },
    sanitizeString(string) {
        if(!string) {
            return '';
        }
        string = string.replace(/@/, '');
        return string;
    },
}