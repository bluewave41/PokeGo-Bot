module.exports = {
    build(spriteList) {
        let description = '';
        for(var i=0;i<spriteList.length;i++) {
            let sprite = spriteList[i];
            switch(sprite.encounterType) {
                case 'pokemon':
                    description += `${i+1}. ${sprite.emoji} ${sprite.name} ${sprite.shiny ? ':sparkles:' : ''}\n`;
                    break;
                case 'pokestop':
                    if(sprite.type == 0) { //pokestop
                        description += `${i+1}. <:pokestop:792793085259022348> Pokestop\n`;
                    }
                    else { //gym
                        description += `${i+1}. <:gym:810862364379316255> Gym\n`;
                    }
                    
                    break;
                case 'rocket':
                    description += `${i+1}. <:grunt:797519975866040350> Grunt\n`;
            }
        }
        return description;
    }
}