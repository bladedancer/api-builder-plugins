const PluginCategory = require('./PluginCategory');

/**
 * Resolves the API Builder plugin.
 * @returns {object} An API Builder plugin.
 */
async function getPlugin(pluginConfig, options = {}) {
	const { logger } = options;
	const nodes = {
		schema: [],
		flownodes: {}
	};

	const categories = Object.keys(pluginConfig).filter(c => c !== 'proxy');
	
	for (const category of categories) {
		const pc = new PluginCategory(category, pluginConfig[category], logger)
		const { flownodes, schemas } = await pc.load();
		nodes.schema.concat(...schemas);
		nodes.flownodes = {
			...nodes.flownodes,
			...flownodes
		};
	}

	return nodes;
}

module.exports = getPlugin;
