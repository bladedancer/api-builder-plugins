const sdk = require('axway-flow-sdk');
const action = require('./action');

function getFlowNodes() {
	const flownodes = sdk.init(module);

	flownodes.add('img', {
		category: 'extension',
		name: 'Image',
		icon: 'icon.svg',
		description: 'Image functions.'
	})
		.method('datauri', {
			name: 'Data URI',
			description: 'Convert an image to a data uri.'
		})
		.parameter('content', {
			description: 'The image content.',
			type: 'string'
		}, true)
		.output('next', {
			name: 'Next',
			description: 'The image data uri',
			context: '$.img',
			schema: {
				type: 'string'
			}
		})
		.action(action);

	return Promise.resolve(flownodes);
}

exports = module.exports = getFlowNodes;
