
var __dirname = import.meta.dirname;
import * as path from 'path';
import * as childProcess from 'child_process';
function launch (target, opts) {
	if (typeof target !== 'string') {
		return Promise.reject(new Error('Expected a `target`'));
	}
	opts = Object.assign({wait: true}, opts);
	let cmd;
	let appArgs = [];
	let args = [];
	const cpOpts = {};
	if (Array.isArray(opts.app)) {
		appArgs = opts.app.slice(1);
		opts.app = opts.app[0];
	}
	if (process.platform === 'darwin') {
		cmd = 'open';
		if (opts.wait) {
			args.push('-W');
		}
		if (opts.app) {
			args.push('-a', opts.app);
		}
	} else if (process.platform === 'win32') {
		cmd = 'cmd';
		args.push('/c', 'start', '""');
		target = target.replace(/&/g, '^&');
		if (opts.wait) {
			args.push('/wait');
		}
		if (opts.app) {
			args.push(opts.app);
		}
		if (appArgs.length > 0) {
			args = args.concat(appArgs);
		}
	} else {
		if (opts.app) {
			cmd = opts.app;
		} else {
			cmd = path.join(__dirname, 'xdg-open');
		}
		if (appArgs.length > 0) {
			args = args.concat(appArgs);
		}
		if (!opts.wait) {
			cpOpts.stdio = 'ignore';
		}
	}
	args.push(target);
	if (process.platform === 'darwin' && appArgs.length > 0) {
		args.push('--args');
		args = args.concat(appArgs);
	}
	const cp = childProcess.spawn(cmd, args, cpOpts);
	if (opts.wait) {
		return new Promise((resolve, reject) => {
			cp.once('error', reject);
			cp.once('close', code => {
				if (code > 0) {
					reject(new Error('Exited with code ' + code));
					return;
				}
				resolve(cp);
			});
		});
	}
	cp.unref();
	return Promise.resolve(cp);
};

export default  launch;