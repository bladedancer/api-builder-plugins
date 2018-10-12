exports = module.exports = async function (req, cb) {
	try {
		const func = new Function('"use strict"; return ' + req.params.function)();
		const inputs = req.params.inputs;
		const result = func(inputs);
		cb.next(null, result);
	} catch (ex) {
		cb(ex);
	}
};
