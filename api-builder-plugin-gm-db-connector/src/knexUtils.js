async function listTables(knex) {
    let query = "";
    let bindings = [];

    switch(knex.client.constructor.name) {
        case 'Client_MSSQL':
            query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_catalog = ?',
            bindings = [ knex.client.database() ];
            break;
        case 'Client_MySQL':
        case 'Client_MySQL2':
            query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = ?';
            bindings = [ knex.client.database() ];
            break;
        case 'Client_Oracle':
        case 'Client_Oracledb':
            query = 'SELECT table_name FROM user_tables';
            break;
        case 'Client_PG':
            query =  'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?';
            bindings = [ knex.client.database() ];
            break;
        case 'Client_SQLite3':
            query = "SELECT name AS table_name FROM sqlite_master WHERE type='table'";
            break;
    }

    const results = await knex.raw(query, bindings)
    return results.rows.map((row) => row.table_name);
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
            schema: {} // TODO
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

module.exports = {
    listTables,
    getColumnNames,
    getTableSchema
};