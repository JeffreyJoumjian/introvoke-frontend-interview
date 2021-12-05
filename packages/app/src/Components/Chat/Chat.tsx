

import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { useSocket } from '../../Context/socket';

import { APIController } from "../../utils/APIController";
import * as APITypes from '../../types';

import Message from "./Message";

const Chat: React.FC = () => {

	const socket = useSocket();

	const [messages, setMessages] = useState<APITypes.Message[]>([]);
	const [, forceUpdate] = useReducer(x => x + 1, 0);


	const scrollTo = useRef<HTMLDivElement>(null);
	const scrollIntoView = useCallback(() => {
		if (scrollTo.current)
			scrollTo.current.scrollIntoView({ behavior: 'auto' });
	}, []);

	// set up socket.io
	useEffect(() => {
		socket.off('message-created').on('message-created', (message: APITypes.Message) => {
			setMessages([...messages, message]);
			console.log(messages.length);
			scrollIntoView();
		});

		return () => {
			socket.off('message-created');
		}

	}, [messages, scrollIntoView]);


	// get initial messages from server
	useEffect(() => {
		async function getMessagesFromServer() {
			let res = await APIController.getAllMessages();

			if (res) {
				setMessages(res);
				scrollIntoView();
			}
		}
		getMessagesFromServer();
	}, []);

	// rerender every 1-5 minutes to see the time changes
	useEffect(() => {
		let interval: NodeJS.Timeout;

		interval = setInterval(() => {
			forceUpdate();
			console.log('updating');
		}, 60000);

		return () => clearInterval(interval);
	}, [])

	const mapMessages = (messages: APITypes.Message[]) => (
		messages.map(message => <Message key={message.id} {...message} />)
	);

	return (
		<div className="chat-container px-1 pt-2 flex flex-col gap-15">
			{messages && messages.length && mapMessages(messages)}
			<div ref={scrollTo} className="scrollTo" />
		</div>
	);
}

export default Chat;