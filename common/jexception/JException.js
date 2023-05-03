
class JException {
	#messages;
	#cause;

	constructor(...messages) {
		this.#message = [...messages];
	};

	get cause() {return this.#cause};
	get message() {return messages[0]};
	get messages() {return [...this.#messages]};

	addMessage = (message) => this.#messages.push(message);
	setCause = (cause) => this.#cause = cause;
};

export default JException;
