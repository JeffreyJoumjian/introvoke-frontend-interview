import { render, cleanup, fireEvent, act } from '@testing-library/react';
import React from 'react';
import Chat from '..';
import { SocketProvider } from '../../../Context/socket';

import { APIController } from '../../../utils/APIController';
import { getTimeSince } from '../../../utils/dates';
import ChatInputs from '../../ChatInputs';

// MOCKING HTML FUNCTIONS
const mockScrollIntoView = (window.HTMLElement.prototype.scrollIntoView = jest.fn());

// MOCKING API FUNCTIONS
const mockGetAllMessages = (APIController.getAllMessages = jest.fn());
const mockSendMessage = (APIController.sendMessage = jest.fn());



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

const newMessage = {
	username: 'test',
	message: 'this is a test message'
}
afterEach(() => cleanup);

describe('chat inputs', () => {

	afterEach(() => cleanup);

	test("clicking the send icon with correct input should send the message", async () => {
		await act(async () => {
			mockSendMessage.mockResolvedValueOnce(newMessage);

			const { getByTestId } = render(
				<SocketProvider>
					<ChatInputs />
				</SocketProvider>
			);

			const inpUsername = getByTestId("inp-name");
			const inpMessage = getByTestId("inp-message");
			const sendButton = (getByTestId("btn-send") as HTMLButtonElement);

			typeMessage(inpUsername, inpMessage, newMessage);

			fireEvent.click(sendButton);

			setTimeout(() => {
				expect(mockSendMessage).toHaveBeenCalledTimes(1);
				expect(mockSendMessage).toHaveBeenCalledWith(
					"/messages",
					newMessage
				);
			}, 100);
		});
	});

	test("clicking the send icon with incorrect input should not send the message", async () => {

		mockSendMessage.mockResolvedValueOnce(newMessage);

		const { getByTestId } = render(
			<SocketProvider>
				<ChatInputs />
			</SocketProvider>
		);

		const inpUsername = getByTestId("inp-name");
		const inpMessage = (getByTestId("inp-message") as HTMLInputElement);
		const sendButton = getByTestId("btn-send");

		typeMessage(inpUsername, inpMessage, {
			username: '',
			message: ''
		});
		fireEvent.click(sendButton);
		expect(inpMessage.value).toEqual('');

		typeMessage(inpUsername, inpMessage, {
			username: '',
			message: "this is a test message"
		});
		fireEvent.click(sendButton);
		expect(inpMessage.value).toEqual('this is a test message');

		typeMessage(inpUsername, inpMessage, {
			username: 'test',
			message: ''
		});
		fireEvent.click(sendButton);
		expect(inpMessage.value).toEqual('');

		expect(mockSendMessage).toHaveBeenCalledTimes(0);

	});
});


describe('chat component', () => {

	test("chat component renders successfully with initial messages from server",
		async () => {

			const message = {
				id: "test-id",
				username: "test",
				message: "this is a test message",
				createdTime: Date.now(),
				updatedTime: Date.now
			};

			mockGetAllMessages.mockResolvedValueOnce([message]);

			const { findByText, findByTestId } = render(
				<SocketProvider>
					<Chat />
				</SocketProvider>
			);

			// the messages from the server should be in the document
			await findByTestId(`message-${message.id}`);
			await findByText(message.username);
			await findByText(message.message);
			await findByText(getTimeSince(message.createdTime));

			expect(mockGetAllMessages).toHaveBeenCalledTimes(1);
			expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
		});

});