const sdk = require('axway-flow-sdk');
const action = require('./action');

function getFlowNodes() {
	const flownodes = sdk.init(module);

	flownodes.add('gm-encodeuri', {
		category: 'extension',
		name: 'Encode URI',
		icon: 'icon.svg',
		description: 'Methods for URI encoding and decoding.'
	})
		.method('encodeuri', {
			name: 'Encode URI',
			description: 'encodeURI the string.'
		})
		.parameter('uri', {
			description: 'The URI to pass to encodeURI.',
			type: 'string'
		}, true)
		.output('next', {
			name: 'Next',
			description: 'The URI was encoded successfully.',
			context: '$.encoded',
			schema: {
				type: 'string'
			}
		})
		.action(action.encode)

		.method('decodeuri', {
			name: 'Decode URI',
			description: 'decodeURI the string.'
		})
		.parameter('uri', {
			description: 'The URI to pass to decodeURI.',
			type: 'string'
		}, true)
		.output('next', {
			name: 'Next',
			description: 'The URI was decoded successfully.',
			context: '$.decoded',
			schema: {
				type: 'string'
			}
		})
		.output('error', {
			name: 'Error',
			description: 'The URI could not be decoded. ',
			context: '$.decoded',
			schema: {}
		})
		.action(action.decode)

		.method('encodeuricomponent', {
			name: 'Encode URI Component',
			description: 'encodeURIComponent the string.'
		})
		.parameter('string', {
			description: 'The string to call encodeURIComponent with.',
			type: 'string'
		}, true)
		.output('next', {
			name: 'Next',
			description: 'The string was encoded successfully.',
			context: '$.encoded',
			schema: {
				type: 'string'
			}
		})
		.action(action.encodeComponent)

		.method('decodeuricomponent', {
			name: 'Decode URI Component',
			description: 'Perform a decodeURIComponent on the string.'
		})
		.parameter('string', {
			description: 'The string to pass to decodeURIComponent.',
			type: 'string'
		}, true)
		.output('next', {
			name: 'Next',
			description: 'The string was decoded successfully.',
			context: '$.decoded',
			schema: {
				type: 'string'
			}
		})
		.output('error', {
			name: 'Error',
			description: 'The string could not be decoded. ',
			context: '$.decoded',
			schema: {}
		})
		.action(action.decodeComponent);

	return Promise.resolve(flownodes);
}

exports = module.exports = getFlowNodes;
