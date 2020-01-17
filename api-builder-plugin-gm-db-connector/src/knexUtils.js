async function listTables(knex) {
    let query = "";
    let bindings = [];
    let tables = [];
    let results;

    switch(knex.client.constructor.name) {
        case 'Client_MSSQL':
            query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_catalog = ?',
            bindings = [ knex.client.database() ];
            results = await knex.raw(query, bindings)
            tables = results.rows.map((row) => row.table_name);
            break;
        case 'Client_MySQL':
        case 'Client_MySQL2':
            query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = ?';
            bindings = [ knex.client.database() ];
            results = await knex.raw(query, bindings)
            tables = results[0].map((row) => row.table_name);
            break;
        case 'Client_Oracle':
        case 'Client_Oracledb':
            query = 'SELECT table_name FROM user_tables';
            results = await knex.raw(query, bindings)
            tables = results.rows.map((row) => row.table_name);
            break;
        case 'Client_PG':
            query =  'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?';
            bindings = [ knex.client.database() ];
            results = await knex.raw(query, bindings)
            tables = results.rows.map((row) => row.table_name);
            break;
        case 'Client_SQLite3':
            query = "SELECT name AS table_name FROM sqlite_master WHERE type='table'";
            results = await knex.raw(query, bindings)
            tables = results.rows.map((row) => row.table_name);
            break;
    }

    return tables;
}

async function getColumnNames(knex, table) {
    const colInfo = await knex(table).columnInfo();
    return Object.keys(colInfo)
}

async function getTableSchema(knex, table) {
    const colInfo = await knex(table).columnInfo();
    
    // TODO: Better...
    const required = [];
    const properties = {};
    Object.entries(colInfo).forEach(([name, info]) => {
        properties[name] = {
            schema: toSchema(info.type)
        };
        if (!info.nullable && info.defaultValue === null) {
            required.push(name);
        }
    });

    return {
        id: table, // TODO
        type: 'object',
        properties,
        required
    }
}

// Incomplete list of type mappings...should be 
const TYPE_MAP = {
    'character varying': 'string',
    'varchar': 'string',
    'timestamp': 'string',
    'timestamp with timezone': 'string',
    'integer': 'number',
    'int': 'number'
}

function toSchema(dataType) {
    const type = TYPE_MAP[dataType];
    return type ? {
        type
    } : {};
}

module.exports = {
    listTables,
    getColumnNames,
    getTableSchema
};