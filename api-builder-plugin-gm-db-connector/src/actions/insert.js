const path = require('path')

function insert(knex, sdk, table, columns, schema) {
    sdk
    .method('insert', {
        name: 'Insert',
        description: 'Insert into table.'
    });

    columns.forEach(col => {
        sdk.parameter(col,
            {
                ...schema.properties[col].schema
            },
            schema.required.includes(col));
        });

    sdk
    .output('next', {
        name: 'Next',
        context: '$.inserted',
        schema: schema
    })
    .output('error', {
        name: 'Error',
        context: '$.error',
        description: 'The insert failed.',
        schema: {}
    })
    .action(action.bind(null, knex, table, columns));
}

async function action(knex, table, columns, req, cb) {
    const value = {};
    columns.forEach(col => {
        value[col] = req.params[col];
    });
    try {
        const inserted = await knex(table)
            .returning(columns)
            .insert(value);
        cb.next(null, inserted);
    } catch (err) {
        cb.error(null, err);
    }
}

module.exports = insert;
