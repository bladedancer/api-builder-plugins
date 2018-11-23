const { CredentialManager } = require('@axway/axway-flow-authorization');
const APIBuilder = require('@axway/api-builder-runtime').getGlobal();

function addLoadHook(config) {
	// Please look the other way....
	let loadingFlows = false;
	delete APIBuilder.loadingFlows;
	Object.defineProperty(APIBuilder, 'loadingFlows', {
		configurable: true,
		get: function () { return loadingFlows; },
		set: function (val) {
			loadingFlows = val;
			// Trigger load
			loadVariants(config);
		}
	});
}

function loadVariants(config) {
	const specs = APIBuilder.getRegisteredNodeSpecs();

	Object.entries(config.variants).forEach(([name, variant]) => {
		const base = specs[variant.base];
		const baseNode = APIBuilder.flowManager.getRegisteredNode(base.type);
		const spec = JSON.parse(JSON.stringify(base));
		spec.category = 'variant';
		spec.name = name;
		
		// TODO: Register flownode will blat over this
		// spec.type = `${base.type}#${encodeURIComponent(name)}`;
	
		// Curry action
		Object.keys(spec.methods).forEach(method => {
			// Spec override
			const override = variant.methods[method] || variant.methods['*'];
			
			const curryFns = [];

			// override authorizations
			const specAuth = spec.methods[method].authorization;
			if (override && override.authorization && specAuth && Object.keys(specAuth.properties).length > 0) {
				Object.entries(override.authorization).forEach(([authName, credentialName]) => {
					if (specAuth.properties.hasOwnProperty(authName)) {
						delete specAuth.properties[authName];
						specAuth.required = (specAuth.required || []).filter(name => name !== authName);
						curryFns.push((req) => ( 
							req.authorizations = req.authorizations || {},
							req.authorizations[authName] = CredentialManager.getCredential(credentialName)));
					}
				});
			}

			// override parameters
			const specParam = spec.methods[method].parameter;
			if (override && override.parameter && specParam && Object.keys(specParam.properties).length > 0) {
				Object.entries(override.parameter).forEach(([paramName, paramValue]) => {
					if (specParam.properties.hasOwnProperty(paramName)) {
						delete specParam.properties[paramName];
						specParam.required = (specParam.required || []).filter(name => name !== paramName);
						curryFns.push((req) => (
							req.params = req.params || {},
							req.params[paramName] = paramValue));
					}
				});
			}

			if (curryFns.length > 0) {
				spec.methods[method].action = (req, cb) => {
					curryFns.forEach(curryFn => curryFn(req));
					return baseNode.prototype[method](req, cb);
				};
			} else {
				// Passthrough
				spec.methods[method].action = baseNode.prototype[method];
			}
		});

		APIBuilder.registerNode({
			name: 'api-builder-plugin-gm-variant',
			specs: {
				[name]: spec
			}
		});
	});
}

exports = module.exports = addLoadHook;
