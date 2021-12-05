import React, { useState } from 'react'
import { getTimeSince } from "../../utils/dates";

import './Message.css';

interface MessageProps {
	id: string,
	message: string,
	username: string,
	createdTime: number
}

const MESSAGE_COLORS = [
	"#FF595E", "#FFCA3A", "#1982c4", "#8AC926", "#6A4C93"
]

function getRandomColor() {
	return MESSAGE_COLORS[Math.floor(Math.random() * MESSAGE_COLORS.length)];
}

const Message: React.FC<MessageProps> = ({ id, message, username, createdTime }) => {

	const [color,] = useState<string>(getRandomColor());

	return (
		<div className="message flex flex-col gap-5" data-testid={`message-${id}`}>
			<div className="message-meta flex align-center gap-10">
				<h2 className="message-user" style={{ color }}>
					{username}
				</h2>
				<p className="message-time">{getTimeSince(createdTime)}</p>
			</div>
			<p className="message-text">{message}</p>
		</div>
	);
}

export default Message;