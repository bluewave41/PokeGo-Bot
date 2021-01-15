module.exports = {
    build(items) {
        let description = '';
        for(var i=0;i<items.length;i++) {
            let item = items[i];
            description += `- ${item.emoji} ${item.name}\n`;
        }
        return description;
    }
}