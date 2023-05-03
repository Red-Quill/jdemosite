/**
 * Upstream notifications
 * Application core can send notifications to be shown in the UI
 */

let lastId = 0;

class NotificationService {
	#listeners;

	constructor() {
		this.#listeners = [];
	};

	registerListener = (listener) => {
		if(listener._notificationServiceListenerId) return;
		const _id = ++lastId;
		listener._notificationServiceListenerId = _id;
		this.#listeners.push({ _id,listener });
	};

	removeListener = (listener) => {
		const _removeId = listener._notificationServiceListenerId;
		this.#listeners = this.#listeners.filter( ({ _id }) => _id !== _removeId);
	};

	showNotification = (message) => {
		console.log("note:",message,this.#listeners);
		for(const { listener } of this.#listeners) listener(message);
	};
};



export default NotificationService;
