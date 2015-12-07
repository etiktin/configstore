# configstore [![Build Status](https://secure.travis-ci.org/yeoman/configstore.svg?branch=master)](http://travis-ci.org/yeoman/configstore)

> Easily load and persist config without having to think about where and how

Config is stored in a JSON file located in `$XDG_CONFIG_HOME` or `~/.config`.  
Example: `~/.config/configstore/some-id.json`


## Usage

```js
const Configstore = require('configstore');
const pkg = require('./package.json');

// Init a Configstore instance with an unique ID (e.g. package name) and
// optionally some default values
const conf = new Configstore(pkg.name, {foo: 'bar'});

conf.set('awesome', true);

console.log(conf.get('awesome'));
//=> true

console.log(conf.get('foo'));
//=> bar

conf.del('awesome');

console.log(conf.get('awesome'));
//=> undefined
```


## API

### Configstore(idOrPath, [defaults], [options])

Create a new Configstore instance `config`.

#### idOrPath

Type: `string`

Name of your package or some other unique ID. It can also be an absolute path to
the config file (e.g. `/foo/bar/config.json` or `c:\foo\bar\config.json`).
Passing a path is useful if your app has a designated place to store user data
(e.g. if you are using [Electron](http://electron.atom.io/), you can store the
config under the [`userData`](https://github.com/atom/electron/blob/master/docs/api/app.md#appgetpathname)
directory).

#### defaults

Type: `object`

Default content to init the config store with.

#### options

Type: `object`

##### globalConfigPath

Type: `boolean`  
Default: `false`

Store the config at `$CONFIG/package-name/config.json` instead of the default
`$CONFIG/configstore/package-name.json`. This is not recommended as you might
end up conflicting with other tools, rendering the "without having to think"
idea moot.

##### onError

Type: `function`
Default: The default handler throws on error

When a read/write error occurs we pass it to the onError handler. The handler's
signature is `(err, conf)`, where err is an `Error` and conf is the
current config instance. Use a custom onError handler if you don't want to throw
on errors (e.g. you are working with non-essential data) or if you want to
implement some custom handling (e.g. send errors to server).

### config.set(key, value)

Set an item.

### config.get(key)

Get an item.

### config.del(key)

Delete an item.

### config.clear()

Delete all items.

### config.all

Get all items as an object or replace the current config with an object:

```js
conf.all = {
	hello: 'world'
};
```

### config.size

Get the item count.

### config.path

Get the path to the config file. Can be used to show the user where the config
file is located or even better open it for them.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)  
Copyright Google
