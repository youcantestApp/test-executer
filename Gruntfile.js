'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		js: ['Gruntfile.js', 'queue-consumer.js', 'src/**/*.js'],
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			js: {
				files: watchFiles.js,
      	tasks: ['newer:babel'],
				options: {
					livereload: true
				}
			},
		},
    babel: {
        dist: {
            files: [{
                expand: true,
                cwd: 'src/',
                src: ['**/*.js'],
                dest: 'dist/'
            }]
        }
    },
    nodemon: {
			dev: {
				script: 'dist/queue-consumer.js',
				options: {
					nodeArgs: ['--debug', '--harmony'],
					ext: 'js',
					watch: watchFiles.js
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		}
  });

  if (grunt.cli.tasks[0] === "newer:babel") {
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-newer');
  }
  else {
    require('load-grunt-tasks')(grunt, {scope: 'dependencies'});
  }

  grunt.option('force',true);

  grunt.registerTask('build', ['newer:babel']);
  grunt.registerTask('run', ['concurrent:default']);

  grunt.registerTask('default', ['build', 'run']);

};
