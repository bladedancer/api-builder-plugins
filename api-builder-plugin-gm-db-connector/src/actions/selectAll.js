const path = require('path')

function selectAll(knex, sdk, table, columns, schema) {
    sdk
    .method('selectAll', {
        name: 'Select All',
        description: 'Select all rows.'
    })
    .output('next', {
        name: 'Next',
        context: '$.selected',
        schema: schema
    })
    .output('error', {
        name: 'Error',
        context: '$.error',
        description: 'The select failed.',
        schema: {}
    })
    .action(action.bind(null, knex, table, columns));
}

async function action(knex, table, columns, req, cb) {
    try {
        const selected = await knex.select(columns).from(table);
        cb.next(null, selected);
    } catch (err) {
        cb.error(null, err);
    }
}

module.exports = selectAll;
