const APIBuilder = require('@axway/api-builder-runtime');
const chokidar = require('chokidar');

function watchDir(req, cb) {
	const server = APIBuilder.getGlobal();
	const flowName = req.params.flow;

	if (!server.getFlow(flowName)) {
		return cb.flowNotFound(null, flowName);
	}

	try {
		// Initialize watcher.
		const watcher = chokidar.watch(req.params.path, {
			ignored: /(^|[\/\\])\../,
			persistent: false
		});
		
		// Status
		watcher.on('ready', () => cb.next());
		//watcher.on('error', () => cb.error(null, error));

		// Trigger flow on these (this executes async to the flow that sets up the watcher
		// so no waiting for or processing of the results).
		const flow = (event, path, stats) => {
			server.flowManager.flow(flowName, {
				event,
				path,
				stats
			}, { logger: server.logger });
		}

		// Add event listeners.
		watcher
			.on('add', (path, stats) => flow('add', path, stats))
			.on('change', (path, stats) => flow('change', path, stats))
			.on('unlink', path => flow('unlink', path))
			.on('addDir', (path, stats) => flow('addDir', path, stats))
			.on('unlinkDir', path => flow('unlinkDir', path));
	} catch (ex) {
		cb.error(null, ex);
	}
};

exports = module.exports = {
	watchDir
};