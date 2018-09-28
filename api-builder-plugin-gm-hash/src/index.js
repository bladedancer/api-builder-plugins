const sdk = require('axway-flow-sdk');
const action = require('./action');

function getFlowNodes() {
	const flownodes = sdk.init(module);

	flownodes.add('hash', {
		category: 'core',
		name: 'Hash',
		icon: 'icon.svg',
		description: 'Hash functions.'
	})
		.method('md5', {
			name: 'MD5',
			description: 'Perform a MD5 hash.'
		})
		.parameter('plaintext', {
			description: 'The plain text to hash.',
			type: 'string'
		}, true)
		.output('next', {
			name: 'Next',
			description: 'The hashed value',
			context: '$.hash',
			schema: {
				type: 'string'
			}
		})
		.action(action);

	return Promise.resolve(flownodes);
}

exports = module.exports = getFlowNodes;
