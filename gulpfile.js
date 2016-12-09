var $        = require("gulp-load-plugins")();
var gulp     = require("gulp");

gulp.task("server", function() {
	gulp.src("./")
		.pipe($.webserver({
			port: 8079,
			host: "0.0.0.0",
			fallback: "index.html",
			livereload: true,
			open: true
		}))
	;
});

gulp.task("default", ["server"]);