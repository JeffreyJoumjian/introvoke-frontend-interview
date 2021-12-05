import { render, cleanup } from '@testing-library/react';
import Message from '../Message';

import { getTimeSince } from '../../../utils/dates';


afterEach(() => cleanup);

test("should render Message component with details", () => {
	const message = {
		id: "test-id",
		message: "this is a test message",
		username: "test",
		createdTime: Date.now()
	};

	const { getByTestId, getByText } = render(<Message {...message} />);

	// COMPONENT
	// the message component should be in the document
	getByTestId(`message-${message.id}`)

	// USERNAME
	// the message username should be in the document
	getByText(message.username);

	// MESSAGE
	// the message text should be in the document
	getByText(message.message);

	// TIME
	// the message time should be in the document
	getByText(getTimeSince(message.createdTime));

});

export { };