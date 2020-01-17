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
			},
			"My Mysql": {
				client: "mysql",
				connection: {
					host : '127.0.0.1',
					port: 3306,
					user : 'mysql',
					password : 'mysql',
					database : 'demo'
				},
				include: [
					"pet",
					"owner"
				]
			}		
		}
	}
};