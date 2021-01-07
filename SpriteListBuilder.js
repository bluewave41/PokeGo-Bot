module.exports = {
    build(spriteList) {
        let description = '';
        for(var i=0;i<spriteList.length;i++) {
            let sprite = spriteList[i];
            switch(sprite.type) {
                case 'pokemon':
                    description += `${i+1}. ${sprite.emoji} ${sprite.name} ${sprite.shiny ? ':sparkles:' : ''}\n`;
                    break;
                case 'pokestop':
                    description += `${i+1}. <:pokestop:792793085259022348> Pokestop\n`;
                    break;
            }
        }
        return description;
    }
}