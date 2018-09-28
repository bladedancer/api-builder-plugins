const md5 = require('md5');

exports = module.exports = async function (req, cb) {
	cb.next(null, md5(req.params.plaintext));
};
