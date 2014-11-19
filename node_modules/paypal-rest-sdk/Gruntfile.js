module.exports = function (grunt) {

	"use strict";

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		meta: {
			banner: "/*!\n * <%= pkg.name %>\n * <%= pkg.description %>\n * @version <%= pkg.version %> - <%= grunt.template.today(\'yyyy-mm-dd\') %>\n * @author <%= pkg.author.name %> <<%= pkg.author.url %>>\n */\n"
		},
		jshint: {
			all: {
				src: ["lib/*.js", "test/*.js", "samples/**/*.js"],
				options: {
					jshintrc: ".jshintrc"
				}
			}
		},
		simplemocha: {
			options: {
				timeout: 30000,
			},
			all: {
				src: 'test/*.js'
			}
		}
	});

	// Load grunt tasks from npm packages
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks('grunt-simple-mocha');

	// Default task.
	grunt.registerTask("default", ["jshint", "simplemocha"]);

};
