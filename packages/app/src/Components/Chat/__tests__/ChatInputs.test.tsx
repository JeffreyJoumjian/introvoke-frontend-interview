import { render, cleanup, fireEvent, act } from '@testing-library/react';
import ChatInputs from '../../ChatInputs';

import {
	mockSendMessage
} from '../../../utils/mocks';

// a sample new message sent to the server upon successful send
const newMessage = {
	username: 'test',
	message: 'this is a test message'
}

// used to fill in the input fields provided with the data provided
function typeMessage(
	inpUsername: HTMLElement, inpMessage: HTMLElement,
	message: {
		username: string,
		message: string,
	}
): void {


	fireEvent.change(inpUsername, {
		target: {
			name: "username",
			value: message.username
		}
	});

	fireEvent.change(inpMessage, {
		target: {
			name: "message",
			value: message.message
		}
	});
}

describe('chat inputs', () => {

	afterEach(() => cleanup);

	test("send button should not be available with missing inputs", () => {
		const { getByTestId } = render(
			<ChatInputs />
		);

		const inpUsername = getByTestId("inp-name");
		const inpMessage = (getByTestId("inp-message") as HTMLInputElement);
		const btnSend = (getByTestId("btn-send") as HTMLButtonElement);

		typeMessage(inpUsername, inpMessage, {
			username: '',
			message: ''
		});
		expect(btnSend).toHaveProperty("disabled");

		typeMessage(inpUsername, inpMessage, {
			username: '',
			message: "this is a test message"
		});
		expect(btnSend).toHaveProperty("disabled");

		typeMessage(inpUsername, inpMessage, {
			username: 'test',
			message: ''
		});
		expect(btnSend).toHaveProperty("disabled");

		expect(mockSendMessage).toHaveBeenCalledTimes(0);
	});

	test("send button should be available with complete inputs", async () => {
		act(() => {
			mockSendMessage.mockResolvedValueOnce(newMessage);

			const { getByTestId } = render(
				<ChatInputs />
			);

			const inpUsername = getByTestId("inp-name");
			const inpMessage = getByTestId("inp-message");
			const btnSend = getByTestId("btn-send");

			typeMessage(inpUsername, inpMessage, newMessage);

			setTimeout(() => {
				expect(btnSend).toHaveProperty("disabled");
			}, 100);
		});
	});

	test("clicking the send icon with incomplete input should not send the message", async () => {

		const { getByTestId } = render(
			<ChatInputs />
		);

		const inpUsername = getByTestId("inp-name");
		const inpMessage = (getByTestId("inp-message") as HTMLInputElement);
		const btnSend = getByTestId("btn-send");

		typeMessage(inpUsername, inpMessage, {
			username: '',
			message: ''
		});
		fireEvent.click(btnSend);
		expect(inpMessage.value).toEqual(''); // value should not have changed => !submitted

		typeMessage(inpUsername, inpMessage, {
			username: '',
			message: "this is a test message"
		});
		fireEvent.click(btnSend);
		expect(inpMessage.value).toEqual('this is a test message'); // value should not have changed => !submitted

		typeMessage(inpUsername, inpMessage, {
			username: 'test',
			message: ''
		});
		fireEvent.click(btnSend);
		expect(inpMessage.value).toEqual(''); // value should not have changed => !submitted

		expect(mockSendMessage).toHaveBeenCalledTimes(0);

	});

	test("clicking the send icon with complete input should send the message", async () => {
		act(() => {
			mockSendMessage.mockResolvedValueOnce(newMessage);

			const { getByTestId } = render(
				<ChatInputs />
			);

			const inpUsername = getByTestId("inp-name");
			const inpMessage = getByTestId("inp-message");
			const btnSend = getByTestId("btn-send");

			typeMessage(inpUsername, inpMessage, newMessage);

			fireEvent.click(btnSend);

			setTimeout(() => {
				expect((inpMessage as HTMLInputElement).value).toBeUndefined();
				expect(mockSendMessage).toHaveBeenCalledTimes(1);
				expect(mockSendMessage).toHaveBeenCalledWith(
					"/messages",
					newMessage
				);
			}, 100);
		});
	});

	test("hitting enter with incomplete input should not send the message", async () => {

		const { getByTestId } = render(
			<ChatInputs />
		);

		const inpUsername = getByTestId("inp-name");
		const inpMessage = (getByTestId("inp-message") as HTMLInputElement);

		typeMessage(inpUsername, inpMessage, {
			username: '',
			message: ''
		});
		fireEvent.keyDown(inpUsername, {
			key: 'Enter', code: 'Enter'
		});
		expect(inpMessage.value).toEqual(''); // value should not have changed => !submitted

		typeMessage(inpUsername, inpMessage, {
			username: '',
			message: "this is a test message"
		});
		fireEvent.keyDown(inpUsername, {
			key: 'Enter', code: 'Enter'
		});
		expect(inpMessage.value).toEqual('this is a test message'); // value should not have changed => !submitted

		typeMessage(inpUsername, inpMessage, {
			username: 'test',
			message: ''
		});
		fireEvent.keyDown(inpUsername, {
			key: 'Enter', code: 'Enter'
		});
		expect(inpMessage.value).toEqual(''); // value should not have changed => !submitted

		expect(mockSendMessage).toHaveBeenCalledTimes(0);

	});

	test("hitting enter with complete input should send the message", async () => {
		act(() => {
			mockSendMessage.mockResolvedValueOnce(newMessage);

			const { getByTestId } = render(
				<ChatInputs />
			);

			const inpUsername = getByTestId("inp-name");
			const inpMessage = getByTestId("inp-message");

			typeMessage(inpUsername, inpMessage, newMessage);

			fireEvent.keyDown(inpUsername, {
				key: 'Enter', code: 'Enter'
			});

			setTimeout(() => {
				expect((inpMessage as HTMLInputElement).value).toBeUndefined();
				expect(mockSendMessage).toHaveBeenCalledTimes(1);
				expect(mockSendMessage).toHaveBeenCalledWith(
					"/messages",
					newMessage
				);
			}, 100);
		});
	});

});
