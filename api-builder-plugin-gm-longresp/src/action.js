function sendTime(request, cb) {
	console.log(this);
	try {
		if (!this.done) {
			const msg = new Date().toString() + '\n';
			console.log(`Sending: ${msg}`);
			request.res.write(msg);
			request.res.flush();
			setTimeout(() => sendTime.call(this, request, cb), 2000);
		} else {
			cb.next();
		}
	} catch (ex) {
		cb(ex);
	}
}

function feed(req, cb) {
	const request = req.params.req;
	const ctx = {
		done: false
	};
	request.on('close', () => { 
		console.log('Client closed');
		ctx.done = true;
	})

	sendTime.call(ctx, request, cb);
}

exports = module.exports = {
	feed
};