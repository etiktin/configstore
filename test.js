/* eslint-env mocha */
'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var pathExists = require('path-exists');
var Configstore = require('./');
var configstorePath = new Configstore('configstore-test').path;

function deleteFile(path) {
	try {
		fs.unlinkSync(path);
	} catch (e) {
		// Don't care
	}
}

beforeEach(function () {
	deleteFile(configstorePath);
	this.conf = new Configstore('configstore-test');
});

it('.set() and .get()', function () {
	this.conf.set('foo', 'bar');
	assert.equal(this.conf.get('foo'), 'bar');
});

it('.del()', function () {
	this.conf.set('foo', 'bar');
	this.conf.del('foo');
	assert.notEqual(this.conf.get('foo'), 'bar');
});

it('.clear()', function () {
	this.conf.set('foo', 'bar');
	this.conf.set('foo1', 'bar1');
	this.conf.clear();
	assert.equal(this.conf.size, 0);
});

it('.all', function () {
	this.conf.set('foo', 'bar');
	assert.equal(this.conf.all.foo, 'bar');
});

it('.size', function () {
	this.conf.set('foo', 'bar');
	assert.equal(this.conf.size, 1);
});

it('.path', function () {
	this.conf.set('foo', 'bar');
	assert(pathExists.sync(this.conf.path));
});

it('should use default value', function () {
	var conf = new Configstore('configstore-test', {foo: 'bar'});
	assert.equal(conf.get('foo'), 'bar');
});

it('support global namespace path option', function () {
	var conf = new Configstore('configstore-test', {}, {globalConfigPath: true});
	var regex = /configstore-test(\/|\\)config.json$/;
	assert(regex.test(conf.path));
});

it('support custom path', function () {
	var configPath = path.join(__dirname, 'configstore-custom.json');

	// Remove possible residues from previous runs
	deleteFile(configPath);

	var conf = new Configstore(configPath);
	conf.set('foo', 'bar');
	var exists = pathExists.sync(configPath);
	deleteFile(configPath);
	assert(exists);
});

it('make sure `.all` is always an object', function () {
	fs.unlinkSync(configstorePath);
	assert.doesNotThrow(function () {
		this.conf.get('foo');
	}.bind(this));
});

it('should throw when using default onError handler', function () {
	var conf = new Configstore('configstore-test');

	// An object with a reference to self (circular), should cause an error during
	// serialization (JSON.stringify)
	var obj = {a: 1, b: 2};
	obj.selfRef = obj;

	assert.throws(function () {
		conf.set('foo', obj);
	});
});

it('should not throw when using a custom onError handler', function () {
	var conf = new Configstore('configstore-test', null, {
		onError: function (err, confInstance) {
			assert(typeof err.message === 'string', 'err.message is a string');
			assert(Object.prototype.toString.call(err) === '[object Error]',
				'err is of type Error');
			assert(conf === confInstance, 'conf === confInstance');
		}
	});

	// An object with a reference to self (circular), should cause an error during
	// serialization (JSON.stringify)
	var obj = {a: 1, b: 2};
	obj.selfRef = obj;

	assert.doesNotThrow(function () {
		conf.set('foo', obj);
	});
});
