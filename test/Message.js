class Message {
	constructor(content) {
		this.guild = {
			id: 1,
		}
		this.author = {
			id: 1,
			username: 'test',
			discriminator: '0000'
		}
		this.content = content;
	}
}

module.exports = Message;