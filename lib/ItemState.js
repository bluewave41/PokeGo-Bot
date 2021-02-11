class ItemState {
    constructor(title, description, pagination) {
        this.title = title;
        this.embed = {
            title: title,
            description: description,
        }
        if(pagination.entryCount > 0) {
            this.embed.footer = `Page ${page} of ${Math.ceil(result.count/25)} - ${result.count} results.`;
        }
        this.pagination = pagination;
    }
}

module.exports = ItemState;