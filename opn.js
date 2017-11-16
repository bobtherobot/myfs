
// --------------
// myjs
// --------------
// By Mike Gieson
// www.gieson.com


/**
A cross-platform way to launch files from Node.

Direct copy of:
npmjs: 	https://www.npmjs.com/package/opn
github: https://github.com/sindresorhus/opn


### USAGE 

	const opn = require('opn');

	// Opens the image in the default image viewer
	opn('unicorn.png').then(() => {
		// image viewer closed
	});

	// Opens the url in the default browser
	opn('http://sindresorhus.com');

	// Specify the app to open in
	opn('http://sindresorhus.com', {app: 'firefox'});

	// Specify app arguments
	opn('http://sindresorhus.com', {app: ['google chrome', '--incognito']});


@class opn
@package myfs
@param {string} target - The URI to open.
@param {object} [opts] - Options
@param {array} [opts.app] - Specify the app to open the target with, or an array with the app and app arguments. 

The app name is platform dependent. Don't hard code it in reusable modules. For example, Chrome is google chrome on macOS, google-chrome on Linux and chrome on Windows.

@param {array} [opts.wait=true] - Wait for the opened app to exit before fulfilling the promise. If false it's fulfilled immediately when opening the app.

On Windows you have to explicitly specify an app for it to be able to wait.

@returns {promise}
 */

'use strict';
const path = require('path');
const childProcess = require('child_process');

module.exports = (target, opts) => {
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
			// `xdg-open` will block the process unless
			// stdio is ignored even if it's unref'd
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
