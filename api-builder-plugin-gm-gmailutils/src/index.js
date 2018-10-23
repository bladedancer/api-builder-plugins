const sdk = require('axway-flow-sdk');
const action = require('./action');

function getFlowNodes() {
	const flownodes = sdk.init(module);

	flownodes.add('gmail-utils', {
		category: 'extension',
		name: 'Gmail Utils',
		icon: 'icon.svg',
		description: 'Gmail helper functions.'
	})
		.method('formatMessage', {
			name: 'Format Message',
			description: 'Create a Message object.'
		})
		.parameter('to', {
			description: 'The TO recipient.',
			type: 'string'
		}, false)
		.parameter('cc', {
			description: 'The CC recipient.',
			type: 'string'
		}, false)
		.parameter('bcc', {
			description: 'The BCC recipient.',
			type: 'string'
		}, false)
		.parameter('subject', {
			description: 'The Subject.',
			type: 'string'
		}, false)
		.parameter('message', {
			description: 'The message body.',
			type: 'string'
		}, false)
		.output('next', {
			name: 'Next',
			description: 'The formatted message',
			context: '$.message',
			schema: {
				type: 'object'
			}
		})
		.action(action.formatMessage);

	return Promise.resolve(flownodes);
}

exports = module.exports = getFlowNodes;
