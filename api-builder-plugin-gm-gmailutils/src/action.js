function formatMessage(req, cb) {
	const message =
`To: ${req.params.to || ''}
CC: ${req.params.cc || ''}
BCC: ${req.params.bcc || ''}
Subject: ${req.params.subject || ''}

${req.params.message || ''}
`;

	cb.next(null, {
		raw: new Buffer(message).toString('base64')
	});
}


exports = module.exports = {
	formatMessage
};