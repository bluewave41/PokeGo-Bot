class ItemResponse {
    constructor(used, embed) {
        this.used = used;
        this.embed = embed;
    }
    setEmbed(embed) {
        this.embed = embed;
    }
    setEncounter(encounter) {
        this.encounter = encounter;
    }
    setPagination(pagination) {
        this.pagination = pagination;
    }
}

module.exports = ItemResponse;