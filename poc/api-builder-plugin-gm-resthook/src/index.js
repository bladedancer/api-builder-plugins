const sdk = require('axway-flow-sdk');
const action = require('./action');
const APIBuilder = require('@axway/api-builder-runtime');

function getFlowNodes() {
	const flownodes = sdk.init(module);

	// The unique name of your flow-node.  You can define multiple flow-nodes in this
	// file, but one is typical.
	flownodes.add('gm-resthook', {
		name: 'Endpoint',
		icon: 'icon.svg',
		description: 'Dynamically bind a REST Endpoint'
	})
		.method('endpoint', {
			name: 'Endpoint',
			description: 'Create an endpoint.'
		})
		.parameter('path', {
			name: 'Path',
			description: 'The path to bind.',
			type: 'string'
		})
		.parameter('method', {
			name: 'Method',
			description: 'The method this listener this binds to.',
			scheam: {
				enum: [ 'GET', 'PUT', 'POST', 'DELETE' ]
			}			
		})
		.output('next', {
			name: 'Next',
			description: 'Next',
			context: '',
			schema: {}
		})
		.action(action);

	return Promise.resolve(flownodes);
}

function getFlowInput(req, flow, apibuilder) {
	const params = Object.keys(flow.parameter.properties);
	return params.reduce(
		(col, cur) => {
			col[cur] = req.query[cur];
			return col;
		}, {});
}

function invokeFlow(apibuilder, flowName) {

	// A middleware closure to invoke flow
	return (req, res, next) => {
		const reqlog = apibuilder.logger.scope(req);

		// if (produces && !req.accepts(produces)) {
		// 	res.status(406);
		// 	return next();
		// } else {
		const flow = apibuilder.flowManager.getFlow(flowName);
		const data = getFlowInput(req, flow);

		apibuilder.flowManager
			.flow(flowName, data, { logger: reqlog })
			.then(
				(result) => {
					const status = (+(result && result.status) || 200);
					const body = result && result.body;
					const headers = result && result.headers;

					// TODO: cast responses to match schema or enforce schema
					if (headers) {
						(Object.keys(headers)).forEach((key) => {
							reqlog.debug(chalk.green('Setting header', key, headers[key]));
							res.setHeader(key, headers[key]);
						});
						// expose the new headers added by the flow
						let exposeHeaders = res.get['Access-Control-Expose-Headers'];
						exposeHeaders = exposeHeaders ? exposeHeaders.split(/\s*,\s*/) : [];
						exposeHeaders = new Set([ ...exposeHeaders, ...Object.keys(headers) ]);
						exposeHeaders = [ ...exposeHeaders ].join(', ');
						res.setHeader('Access-Control-Expose-Headers', exposeHeaders);
					}

					res.status(status);
					if (body !== undefined) {
						res.setHeader('Content-Type', 'application/json; charset=utf-8');
						res.send(JSON.stringify(body));
					} else {
						res.send();
					}
				}
			)
			.catch((err) => {
				// Unexpected error processing the flow response
				reqlog.error(err);
				const body = { error: 'Server Error' };
				res.status(500).send(body);
			});
		//}
	};
}

function bindEndpoints(apibuilder) {
	// Get all the flows.
	const flows = apibuilder.getFlows();
	Object.entries(flows).forEach(([flowName, def]) => {
		if (!def.start) {
			return;
		}
		const node = def.nodes[def.start];
		if (node.type !== 'nodehandler://@bladedancer/api-builder-plugin-gm-resthook/gm-resthook') {
			return;
		}

		// Get the params endpoint
		const method = JSON.parse((node.parameters.find((p) => p.name === 'method') || {}).value || 'null');
		const path = JSON.parse((node.parameters.find((p) => p.name === 'path') || {}).value || 'null');

		// Need to bind an endpoint that invokes flow....
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('Magic Binding: ', method, path);
		apibuilder.app[method.toLowerCase()](
			path,
			invokeFlow(apibuilder, flowName)
		);
		
	});
}

// Bind all the handlers.
function bindHandlers() {
	const apibuilder = APIBuilder.getGlobal();
	apibuilder.on('listening', () => {
		// API Builder is up and running. Find flows with endpoint node and bind them.
		bindEndpoints(apibuilder);
	});
}

/**
 * Need to monkey patch reload so that we can capture events across the restart.
 */
const apibuilder = APIBuilder.getGlobal();
apibuilder.removeListener('reload', apibuilder.reload);
const originalReload = APIBuilder.prototype.reload;
console.log(apibuilder.reload.toString());
APIBuilder.prototype.reload = function (cb) {
	originalReload.bind(this)(function () {
		try {
			bindEndpoints(APIBuilder.getGlobal());
		} catch (ex) {
			console.error(ex);
		}
		cb && cb();
	});
};
apibuilder.on('reload', apibuilder.reload);

//
// Bind the handlers.
//
bindHandlers();

exports = module.exports = getFlowNodes;
