import { render, cleanup, act } from '@testing-library/react';

import Chat from '../Chat';
import { SocketProvider } from '../../../Context/socket';

import { getTimeSince } from '../../../utils/dates';


import {
	mockGetAllMessages,
	mockScrollIntoView,
} from '../../../utils/mocks';


describe('chat component', () => {

	afterEach(() => cleanup);

	test("chat component renders successfully with initial messages from server",
		async () => {

			const message = {
				id: "test-id",
				username: "test",
				message: "this is a test message",
				createdTime: Date.now(),
				updatedTime: Date.now
			};

			await act(async () => {

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
			});

			expect(mockGetAllMessages).toHaveBeenCalledTimes(1);
			expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
		}
	);

	// test if message is received correctly from server using sockets?
	// => read that this is an implementation detail and should not be tested
});