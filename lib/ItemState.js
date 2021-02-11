class ItemState {
    constructor(title, description, pagination) {
        this.title = title;
        this.embed = {
            title: title,
            description: description,
        }
        this.pagination = pagination;
    }
}

module.exports = ItemState;