function select(knex, req, cb) {
	const query = knex.select(req.params.columns).from(req.params.table);

	query.then(results => {
		cb.next(null, results);
	});
}

exports = module.exports = {
	select
};
