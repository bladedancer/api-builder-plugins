'use strict';

const Mustache = require('mustache');

function format(req) {
	const template = req.params.template;
	const data = req.params.data;
	return Mustache.render(template, data);
}

exports = module.exports = {
	formatStr(req, cb) {
		try {
			cb.next(null, format(req));
		} catch (e) {
			cb.error(null, e);
		}
	},
	formatObj(req, cb) {
		let val = req.params.template;
		try {
			val = format(req);
			cb.next(null, JSON.parse(val));
		} catch (e) {
			cb.error(null, e);
		}
	}
};
