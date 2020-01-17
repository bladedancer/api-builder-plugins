module.exports = {
	pluginConfig: {
		'@bladedancer/api-builder-plugin-gm-db-connector': {
			"My Postgres": {
				client: "pg",
				connection: {
					host : '127.0.0.1',
					port: 5432,
					user : 'postgres',
					password : 'postgres',
					database : 'postgres'
				},
				include: [
                    "address",
                    "person"
				]
			}
		}
	}
};