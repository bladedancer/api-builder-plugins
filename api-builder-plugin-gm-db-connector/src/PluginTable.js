const { SDK } = require('@axway/api-builder-sdk');
const { getColumnNames, getTableSchema } = require('./knexUtils');
const actions = require('./actions')
const path = require('path')

class PluginTable {
	/**
	 * Create the plugin.
	 * @param {object} pluginConfig The plugin configuration.
	 * @param {object} options The plugin options
	 */
	constructor(knex, config, logger) {
        this.knex = knex;
        this.config = config;
        this.logger = logger;
        
        this.category = this.config.category;
        this.table = this.config.table;
	}

    getIcon() {
        let icon = path.join(__dirname, "icon.svg");
        if (this.knex.client.driverName === "pg") {
            icon = path.join(__dirname, "postgressql.svg");
        }
        return icon;
    }

    /**
     * Create a node for the database table.
     * @returns {object} The node and schema.
     */
    async toNode() {
        const sdk = new SDK();
        this.columns = await getColumnNames(this.knex, this.table);
        this.schema = await getTableSchema(this.knex, this.table);
        
        // Define the node
        sdk.add(this.table, {
            name: this.table,
            icon: this.getIcon(),
            category: this.category
        })
        Object.values(actions).forEach(action => action(this.knex, sdk, this.table, this.columns, this.schema));

        return {
            flownodes: sdk.flownodes,
            schema: this.schema
        }
    }

}

module.exports = PluginTable;
