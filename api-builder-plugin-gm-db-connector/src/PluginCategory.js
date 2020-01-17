const knex = require('knex');
const { listTables } = require('./knexUtils');
const PluginTable = require('./PluginTable');


class PluginCategory {
	/**
	 * A single category in the configuration.
	 * @param {object} pluginConfig The plugin configuration.
	 * @param {object} logger The logger.
	 */
	constructor(category, config, logger) {
		this.config = {
			...JSON.parse(JSON.stringify(config)),
			category
		};
		this.logger = logger;
	}

   	/**
	 * Load the category.
	 * @returns {object} The plugin nodes and schema.
	 */
	async load() {
        this.logger.info(`Loading ${this.config.category}`);
        this.logger.info(`Connecting to ${this.config.client} database ${this.config.connection.host}:${this.config.connection.port}`);
        
        const connection = knex({
            client: this.config.client,
            connection: this.config.connection
        });
    
		const tables = await this.validateTables(connection);
		const details = {
			schemas: [],
			flownodes: {}
		};

		for (const table of tables) {
			const cfg = { ...this.config, table };
			const pt = new PluginTable(connection, cfg, this.logger);
			const { flownodes, schema }  = await pt.toNode();
			details.flownodes = {
				...details.flownodes,
				...flownodes
			};
			details.schemas.push(schema);
		}
    
		return details;
	}

	/**
	 * Validate the table configuration.
	 * @param {knex} connection The knex connection.
	 * @returns {string[]} The list of tables.
	 * @private
	 */
	async validateTables(connection) {
		const availableTables = await listTables(connection)
		let includedTables = [];
		if (!this.config.include || (this.config.include && this.config.include === '*')) {
			includedTables = availableTables;
		} else if (this.config.include && Array.isArray(this.config.include)) {
			// Make sure all the requested tables exist
			const invalidTables = this.config.include.filter(t => !availableTables.includes(t));
			if (invalidTables.length > 0) {
				throw new Error(`Table(s) not found: ${invalidTables.join(', ')}.`);
			}
			includedTables = this.config.include;
		} else {
			throw new Error('Invalid configuration for included tables.');
		}
		return includedTables;
	}
}
module.exports = PluginCategory;
