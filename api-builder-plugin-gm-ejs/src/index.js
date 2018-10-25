const sdk = require('axway-flow-sdk');
const { formatStr, formatObj } = require('./action');

function getFlowNodes() {
	const flownodes = sdk.init(module);

	// The unique name of your flow-node.  You can define multiple flow-nodes in this
	// file, but one is typical.
	flownodes.add('gm-ejs', {
		name: 'EJS',
		icon: 'icon.svg',
		description: 'Compose strings and objects using EJS templates. See http://ejs.co/.',
		category: 'extension'
	});

	// Format String Method
	flownodes
		.method('formatStr', {
			name: 'Format string',
			description: 'Compose a string by evaluating a template. See http://ejs.co/.'
		})
		.parameter('template',
			{
				description: 'The EJS template.',
				type: 'string',
				format: 'multiline'
			},
			true /* required */
		)
		.parameter('data',
			{
				description: 'The data to evaluate the template with. Use $ to access the entire context.',
				type: 'object'
			},
			true /* required */
		)
		.output('next', {
			name: 'Next',
			context: '$.value',
			schema: {}
		})
		.output('error', {
			name: 'Error',
			context: '$.error',
			description: 'This output is triggered if the evaluated template is not valid. The output value is error object.',
			schema: {}
		})
		.action(formatStr);

	// Format Object method
	flownodes
		.method('formatObj', {
			name: 'Format object',
			description: 'Compose an object by evaluating a template. The evaluated template is JSON parsed and so must be a valid JSON encoded string. See http://ejs.co/.'
		})
		.parameter('template',
			{
				description: 'The EJS template.',
				type: 'string',
				format: 'multiline'
			},
			true /* required */
		)
		.parameter('data',
			{
				description: 'The data to evaluate the template with. Use $ to access the entire context.',
				type: 'object'
			},
			true /* required */
		)
		.output('next', {
			name: 'Next',
			context: '$.value',
			schema: {}
		})
		.output('error', {
			name: 'Error',
			context: '$.error',
			description: 'This output is triggered if the evaluated template is not a valid JSON string. The output value is the error object.',
			schema: {}
		})
		.action(formatObj);

	return Promise.resolve(flownodes);
}

exports = module.exports = getFlowNodes;
