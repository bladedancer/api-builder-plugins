const sdk = require('axway-flow-sdk');
const action = require('./action');

function getFlowNodes() {
	const flownodes = sdk.init(module);

	flownodes.add('code', {
		category: 'extension',
		name: 'Code',
		icon: 'icon.svg',
		description: 'Loop over items and execute specified flow.'
	})
		.method('exec', {
			name: 'Execute',
			description: 'Execute the code.'
		})
		.parameter('function', {
			description: 'The function.',
			type: 'string',
			format: 'multiline'
		}, true)
		.parameter('inputs', {
			description: 'Spec is static so going to have to pass all the inputs as a JSON encoded object.',
			type: 'object'
		}, true)
		.output('next', {
			name: 'next',
			description: 'The code completed successfully.',
			context: '$.return',
			schema: {}
		})
		.output('error', {
			name: 'Error',
			context: '$.error',
			schema: {}
		})
		.action(action);

	return Promise.resolve(flownodes);
}

exports = module.exports = getFlowNodes;
