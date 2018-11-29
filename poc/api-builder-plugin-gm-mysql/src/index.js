const sdk = require('axway-flow-sdk');
const action = require('./action');
const knex = require('knex');

function getFlowNodes(config) {
	const flownodes = sdk.init(module);

	const connection = knex({
		client: 'mysql2',
		connection: config.connection
	});

	flownodes.add('gm-mysql', {
		category: 'extension',
		name: 'MySQL',
		icon: 'icon.svg',
		description: 'Methods for interacting with MySQL.'
	})
		.method('select', {
			name: 'SELECT',
			description: 'Select data.'
		})
		.parameter('columns', {
			description: 'The columns to select.',
			type: 'array',
			items: {
				type: 'string'
			}
		}, true)
		.parameter('table', {
			description: 'The table to query.',
			type: 'string'
		}, true)
		.output('next', {
			name: 'Next',
			description: 'The query was successful.',
			context: '$.data',
			schema: {}
		})
		.action(action.select.bind(null, connection));


	return Promise.resolve(flownodes);
}

exports = module.exports = getFlowNodes;
