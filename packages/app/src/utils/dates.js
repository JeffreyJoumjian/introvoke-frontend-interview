import formatDistanceToNow from 'date-fns/formatDistanceToNow'

function getTimeSince(createdTime) {
	let result = formatDistanceToNow(createdTime, {
		addSuffix: true
	});

	return result.replace("less than a minute ago", "now");
}

export { getTimeSince };