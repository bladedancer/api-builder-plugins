const sdk = require('axway-flow-sdk');
const action = require('./action');

function getFlowNodes() {
	const flownodes = sdk.init(module);

	flownodes.add('long-resp', {
		category: 'extension',
		name: 'Long response',
		icon: 'icon.svg',
		description: 'Testing a node that keeps going forever.'
	})
		.method('feed', {
			name: 'Feed',
			description: 'Start feeding a response.'
		})
		.parameter('req', {
			description: 'The request object.',
			schema: {}
		}, false)
		.output('next', {
			name: 'Next',
			description: 'Should never fire',
			context: '',
			schema: {}
		})
		.action(action.feed);

	return Promise.resolve(flownodes);
}

exports = module.exports = getFlowNodes;
