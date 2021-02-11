class ItemState {
    constructor(title, description, pagination) {
        this.title = title;
        this.embed = {
            title: title,
            description: description,
        }
        if(pagination.entryCount > 0) {

        }
        this.pagination = pagination;
    }
}

module.exports = ItemState;