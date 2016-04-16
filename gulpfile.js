'use strict';

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gulp = require('gulp');
var less = require('gulp-less');
var jade = require('gulp-jade');
var clean = require('gulp-clean');
var filter = require('gulp-filter');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var es = require('event-stream');
var rename = require('gulp-rename');


var PATHS = {
	build: {
		javascripts: __dirname + '/src/public/build/javascripts',
		stylesheets: __dirname + '/src/public/build/css',
		views: __dirname + '/src/public/build',
		index: __dirname + '/src/public',
	},
	assets: {
		javascripts: __dirname + '/src/public/assets/javascripts',
		stylesheets: __dirname + '/src/styles',
		views: __dirname + '/src/views'
	}
};


/*
 __   ___  __        ___  __  
/__` |__  |__) \  / |__  |__) 
.__/ |___ |  \  \/  |___ |  \ 
															
*/

//only start after build is done
gulp.task('browser-sync', ['build'], function() {

  return browserSync.init({
    server: {
      baseDir: "./src/public"
    },
    port: 8080
  });
});

/*
 __   __   __     ___       __        __  
/  ` /__` /__`     |   /\  /__` |__/ /__` 
\__, .__/ .__/     |  /~~\ .__/ |  \ .__/ 
                                          																					 
*/

//only start task after clean is done
gulp.task('compile-css', ['clean-css'], function() {
	return gulp.src(PATHS.assets.stylesheets + '/**/*.less')
		.pipe(less({
			compress: false
		}))
		.pipe(gulp.dest(PATHS.build.stylesheets))
		.pipe(filter('**/*.css')) // filter the stream to ensure only CSS files passed.
});

/*
										 __   __   __     __  ___    ___       __        __  
	 |  /\  \  /  /\  /__` /  ` |__) | |__)  |      |   /\  /__` |__/ /__` 
\__/ /~~\  \/  /~~\ .__/ \__, |  \ | |     |      |  /~~\ .__/ |  \ .__/ 
																																				 
*/

gulp.task('browserify', ['clean-js'], function() {
		
	var options = {
		entries: [PATHS.assets.javascripts + '/app.js'],
		debug: false
	};

	return browserify(options)
		.bundle().on('error', errorHandler)
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest(PATHS.build.javascripts))

});

/*
___  ___        __            ___  ___  __  
 |  |__   |\/| |__) |     /\   |  |__  /__` 
 |  |___  |  | |    |___ /~~\  |  |___ .__/ 
                                            
*/


gulp.task('templates', ['clean-templates'], function() {

  gulp.src([PATHS.assets.views + '/**/*.jade', PATHS.assets.views + '!/index.jade'])
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(PATHS.build.views))
});

gulp.task('index', ['templates'], function() {
	gulp.src(PATHS.assets.views + '/index.jade')
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(PATHS.build.index))
})


/*
          ___  __        ___  __   __  
|  |  /\   |  /  ` |__| |__  |__) /__` 
|/\| /~~\  |  \__, |  | |___ |  \ .__/ 
  
*/

//only start after build is complete
gulp.task('watch', ['build'], function() {
	gulp.watch(PATHS.assets.stylesheets + '/**/*.less', ['clean-css', 'compile-css', browserSync.reload]);
	gulp.watch(PATHS.assets.javascripts + '/**/*.js', ['clean-js', 'browserify', browserSync.reload]);
	gulp.watch(PATHS.assets.views + '/**/*.jade', ['clean-templates', 'templates', browserSync.reload]);
});


/*

 __        ___           
/  ` |    |__   /\  |\ | 
\__, |___ |___ /~~\ | \|                         

*/

gulp.task('clean', ['clean-js', 'clean-css', 'clean-templates']);

gulp.task('clean-js', function() {
	return gulp.src([PATHS.build.javascripts], {read: false})
		.pipe(clean());	
});

gulp.task('clean-css', function() {
	return gulp.src([PATHS.build.stylesheets], {read: false})
		.pipe(clean());
});

gulp.task('clean-templates', function() {
	return gulp.src([PATHS.build.views + '/**/*.html'], {read: false})
		.pipe(clean());
})

/*
 __   __        __   __        ___     __   __                         __   __  
/  ` /  \ |\ | /__` /  \ |    |__     /  ` /  \  |\/|  |\/|  /\  |\ | |  \ /__` 
\__, \__/ | \| .__/ \__/ |___ |___    \__, \__/  |  |  |  | /~~\ | \| |__/ .__/ 
																																								
Console Commands
*/

gulp.task('build', ['clean', 'compile-css', 'templates', 'index', 'browserify']);

//cleans, performs build, and watches for changes with live reload
gulp.task('dev', ['build', 'browser-sync', 'watch']);



// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}

