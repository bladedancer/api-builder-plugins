function encode(req, cb) {
	return cb.next(null, encodeURI(req.params.uri));
}

function decode(req, cb) {
	let decoded;
	try {
		decoded = decodeURI(req.params.uri);
	} catch (ex) {
		return cb.error(null, ex);
	}
	return cb.next(null, decoded);
}

function encodeComponent(req, cb) {
	return cb.next(null, encodeURIComponent(req.params.string));
}

function decodeComponent(req, cb) {
	let decoded;
	try {
		decoded = decodeURIComponent(req.params.string);
	} catch (ex) {
		return cb.error(null, ex);
	}
	return cb.next(null, decoded);
}

exports = module.exports = {
	encode,
	decode,
	encodeComponent,
	decodeComponent
};
