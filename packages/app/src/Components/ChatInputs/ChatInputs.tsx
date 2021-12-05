import React, { useState, useRef } from 'react';
import { Send as SendIcon } from 'react-ionicons'

import { onChangeHandler } from '../../@types';
import { APIController } from '../../utils/APIController';

import './ChatInputs.css';
import * as APITypes from '../../@types';

const ChatInputs: React.FC = () => {

	const [state, setState] = useState({
		username: '',
		message: ''
	});

	const messageRef = useRef<HTMLInputElement>(null);

	function clearMessage(inputElement: HTMLInputElement) {
		setState({ ...state, message: '' });
		inputElement.value = '';
	}

	const onChangeHandler: onChangeHandler = (e) => {
		setState({ ...state, [e.target.name]: e.target.value.trim() });
	}


	const onSendHandler = async (e: any) => {
		const { username, message } = state;

		// if didn't clicked enter => don't send
		if (e?.type === 'keydown' && e?.key !== "Enter")
			return;

		// if clicked enter or clicked send button
		if (username && message) {
			let res = await APIController.sendMessage({ username, message });

			// clear message if successful
			if ((res as APITypes.Message)?.message) {
				if (messageRef?.current)
					clearMessage(messageRef.current);
			}
		}

	}

	const { message, username } = state;
	const isDisabled = !(message && username);

	return (
		<div className="inputs-container">
			<input
				className="p-1"
				type="text"
				name="username"
				placeholder="Enter your username..."
				onChange={onChangeHandler}
				data-testid="inp-name"
			/>
			<div className="send-message-container flex align-center">
				<input
					ref={messageRef}
					className="p-1"
					type="text"
					name="message"
					placeholder="Type your message..."
					onChange={onChangeHandler}
					onKeyDown={onSendHandler}
					data-testid="inp-message"
				/>
				<button
					disabled={isDisabled}
					data-testid="btn-send"
					className="mx-1"
					onClick={onSendHandler}
				>
					<SendIcon
						color={isDisabled ? '#b1b1b1' : '#00b3ff'}
						height="24px"
						width="24px"
					/>
				</button>
			</div>
		</div>
	);
}

export default ChatInputs;