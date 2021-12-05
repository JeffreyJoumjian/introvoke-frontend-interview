import * as APITypes from '../types';

const APIController = {
	getAllMessages: async (): Promise<APITypes.Message[] | undefined> => {
		try {
			let req = await fetch('/messages');
			let res = await req.json();

			return res?.length > 0 ? res : undefined;
		}
		catch (e: any) {
			console.log(e.stack)
			return undefined;
		}
	},

	sendMessage: async (message: APITypes.NewMessage): Promise<APITypes.Message | APITypes.RequestError | undefined> => {
		try {
			let req = await fetch('/messages', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(message)
			});

			let res = await req.json();

			return res;
		}
		catch (e: any) {
			console.log(e.stack);
			return undefined;
		}
	}
};

export { APIController };
