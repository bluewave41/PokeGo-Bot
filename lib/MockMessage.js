class MockMessage {
    constructor(content='') {
        this.author = {
            username: 'tester',
            discriminator: '4444',
            id: '1',
        }
        this.guild = {
            id: '1'
        }
        this.content = content;
    }
}

module.exports = MockMessage;