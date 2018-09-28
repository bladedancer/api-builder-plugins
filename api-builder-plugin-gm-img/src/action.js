const DataURI = require('datauri');

exports = module.exports = async function (req, cb) {
	const datauri = new DataURI();
	if (typeof req.params.content === 'string') {
		datauri.format('.jpg', Buffer.from(req.params.content, 'utf8'));
	} else {
		datauri.format('.jpg', req.params.content);
	}
	cb.next(null, datauri.content);
};
