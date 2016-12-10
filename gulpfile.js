let $        = require("gulp-load-plugins")();
let gulp     = require("gulp");
let sourcemaps = require("gulp-sourcemaps");
let ngAnnotate = require("gulp-ng-annotate");

let paths 	= {
	bowerJs: [
		"./app/bower_components/angular/angular.js",
		"./app/bower_components/angular-animate/angular-animate.js",
		"./app/bower_components/angular-aria/angular-aria.js",
		"./app/bower_components/angular-messages/angular-messages.js",
		"./app/bower_components/angular-material/angular-material.js"
	],
	js: [
		"./app/app.module.js",
		"./app/app.config.js",
		"./app/components/components.module.js",
		"./app/components/**/*.js",
		"./app/common/common.module.js",
		"./app/common/**/*.js"
	]
};

gulp.task("server", function() {
	gulp.src("./")
		.pipe($.webserver({
			port: 8079,
			host: "0.0.0.0",
			fallback: "index.html",
			livereload: false,
			open: false
		}))
	;
});

gulp.task("bowerJsConcat", function() {
	return gulp.src(paths.bowerJs)
		.pipe(sourcemaps.init())
			.pipe($.concat("./app/bowerComponents.js"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("./"));
});

gulp.task("appJsConcat", function() {
	return gulp.src(paths.js)
		.pipe(sourcemaps.init())
			.pipe($.concat("./app/app.js"))
			.pipe(ngAnnotate())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("./"));
});

gulp.task("default", ["server"], function () {
	// Watch JavaScript
	gulp.watch(paths.js, ["appJsConcat"]);
});