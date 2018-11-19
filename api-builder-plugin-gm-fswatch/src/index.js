const sdk = require('axway-flow-sdk');
const action = require('./action');

function getFlowNodes() {
	const flownodes = sdk.init(module);

	flownodes.add('gm-fswatch', {
		category: 'extension',
		name: 'Watch Filesystem',
		icon: 'icon.svg',
		description: 'Methods for file system watcher.'
	})
		.method('watchFolder', {
			name: 'Create Folder Watch',
			description: 'Watch the specified folder.'
		})
		.parameter('path', {
			description: 'The path to watch.',
			type: 'string'
		}, true)
		.parameter('flow', {
			description: 'The flow to trigger on change event.',
			type: 'string'
		}, true)
		.output('next', {
			name: 'next',
			description: 'The code completed successfully.',
			context: '$.return',
			schema: {}
		})
		.output('flowNotFound', {
			name: 'Flow not found',
			context: '$.error',
			schema: {
				type: 'string'
			}
		})
		.output('error', {
			name: 'Error',
			context: '$.error',
			schema: {}
		})
		.action(action.watchDir);

	return Promise.resolve(flownodes);
}

exports = module.exports = getFlowNodes;
