const path = require('path')

function insertObject(knex, sdk, table, columns, schema) {
    sdk
    .method('insertObj', {
        name: 'Insert Object',
        description: 'Insert an object as a row.'
    })
    .parameter('value', 
        {
            description: "The object to insert.",
            type: 'object',
            schema: schema
        },
        true /* required */
    )
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
    try {
        const inserted = await knex(table)
            .returning(columns)
            .insert(req.params.value);
        cb.next(null, inserted);
    } catch (err) {
        cb.error(null, err);
    }
}

module.exports = insertObject;
