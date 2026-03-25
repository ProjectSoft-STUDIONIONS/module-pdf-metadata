module.exports = function(grunt) {
	const fs = require('fs'),
		path = require('path'),
		util = require('util'),
		chalk = require('chalk'),
		PACK = grunt.file.readJSON('package.json'),
		gc = {
			version: `${PACK.version}`,
			assets: "assets/modules/pdf-metadata",
			gosave: "assets/modules/pdf-metadata",
			default: [
				"clean",
				"copy",
				"concat",
				"uglify",
				"less",
				"autoprefixer",
				"group_css_media_queries",
				"cssmin",
				"replace",
				"compress",
			],
		};
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	grunt.initConfig({
		globalConfig : gc,
		pkg : PACK,
		clean: {
			options: {
				force: true
			},
			main: [
				'test/',
				'tests/',
				'module-pdf-metadata.zip',
			],
		},
		copy: {
			js: {
				expand: true,
				cwd: 'node_modules/pdf-lib/dist',
				src: [
					'pdf-lib.min.js',
					'pdf-lib.min.js.map',
				],
				dest: '<%= globalConfig.gosave %>/js/',
			},
		},
		concat: {
			options: {
				separator: "\n",
			},
			main: {
				src: [
					'src/js/main.js',
				],
				dest: '<%= globalConfig.gosave %>/js/main.js',
			},
		},
		uglify: {
			options: {
				sourceMap: false,
				compress: {
					drop_console: false,
				},
				output: {
					ascii_only: true,
				},
			},
			main: {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'<%= globalConfig.gosave %>/js/main.js',
						],
						dest: '<%= globalConfig.gosave %>/js',
						filter: 'isFile',
						rename: function (dst, src) {
							return dst + '/' + src.replace('.js', '.min.js');
						},
					},
				],
			},
		},
		less: {
			css: {
				options : {
					compress: false,
					ieCompat: false,
					plugins: [],
					modifyVars: {
						//'hashes': versions + update,
						'fontpath': '/<%= globalConfig.assets %>/fonts',
						'imgpath': '/<%= globalConfig.assets %>/images',
					},
				},
				files : {
					'test/css/main.css' : [
						'src/less/main.less',
					],
				},
			},
		},
		autoprefixer:{
			options: {
				browsers: [
					"last 4 version",
				],
				cascade: true,
			},
			css: {
				files: {
					'test/css/main.css' : [
						'test/css/main.css',
					],
				},
			},
		},
		group_css_media_queries: {
			group: {
				files: {
					'<%= globalConfig.gosave %>/css/main.css': ['test/css/main.css'],
				},
			},
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1,
			},
			main: {
				files: {
					'<%= globalConfig.gosave %>/css/main.min.css' : ['<%= globalConfig.gosave %>/css/main.css'],
				},
			},
		},
		replace: {
			main: {
				options: {
					patterns: [
						{
							match: /{version}/g,
							replacement: `${PACK.version}`,
						},
						{
							match: /{date}/g,
							replacement: grunt.template.date(new Date().getTime(), 'yyyy-mm-dd'),
						},
					],
				},
				files: [
					{
						expand: true,
						cwd: __dirname + '/src/tpl/',
						src: [ '*.tpl' ],
						dest: __dirname + '/install/assets/modules/',
						ext: '.tpl',
					},
				],
			},
		},
		compress: {
			main: {
				options: {
					archive: 'module-pdf-metadata.zip',
				},
				files: [
					{
						expand: true,
						cwd: '.',
						src: [
							'assets/**',
							'assets/**/.*',
							'install/**',
						],
						dest: 'module-pdf-metadata/',
					},
				],
			},
		},
	});
	grunt.registerTask('default',	gc.default);
}
