# gulp-polyfiller

[![npm version badge](https://img.shields.io/npm/v/gulp-polyfiller.svg)](https://www.npmjs.org/package/gulp-polyfiller)
[![Build Status](https://travis-ci.org/Polyfiller/gulp-polyfiller.png)](https://travis-ci.org/Polyfiller/gulp-polyfiller)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE.txt)


> Gulp task for [Polyfiller](https://github.com/Polyfiller/polyfiller) 


## Getting Started
If you haven't used [Gulp](ht   tp://gulpjs.com/) before, be sure to check out the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/README.md) guide, as it explains how to create a `gulpfile` as well as install and use Gulp plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install --save-dev gulp-polyfiller
```


### Usage Example

```js
var gulp = require('gulp');
var polyfiller = require('gulp-polyfiller');

gulp.task('default', function () {
	polyfiller
		.bundle(['Promise', 'Fetch'])
		.pipe(gulp.dest('polyfills.js'));
});
```

Or:

```js
var gulp = require('gulp');
var polyfiller = require('gulp-polyfiller');

gulp.task('default', function () {
	gulp.src("*.js")
		// push polyfills file after all scripts
		.pipe(polyfiller(['Promise', 'Fetch']))
		// run then any tasks on your scripts
		.pipe(concat())
		.pipe(gulp.dest('bundle.js'));
});

```


### API

>
```js 
polyfiller(features, [options]);
```

#### features

Type: `Array`

List of features you want to bundle.

#### Options

Type: `Object`.

Options for bundle process. All of options are the options for the [Polyfiller](https://github.com/Polyfiller/polyfiller) itself, except these ones:


#### path

Type: `string` <br />

Changes the stream's output `File.path` property


#### process

Type: `Function(Object:feature, String:name, Array:features)` <br />

This option as an advanced way to control the file contents that are created.

```js
....
{
	process: function (feature, name, features) {
		return feature.source;
	}
}
....
```

For more details see the [Polyfiller](https://github.com/Polyfiller/polyfiller) documentation

### Tests

```
npm install && npm test
```


### License

MIT

Plugin submitted by [Sergey Kamardin](https://github.com/gobwas)
