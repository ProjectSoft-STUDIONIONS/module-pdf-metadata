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
				"clean:main",
				"copy:main",
				"concat:main",
				"uglify:main",
				"less:main",
				"autoprefixer:main",
				"group_css_media_queries:main",
				"cssmin:main",
				"replace:main",
				"compress:main",
			],
			page: [
				"clean:page",
				"copy:page",
				"concat:page",
				"uglify:page",
				"less:page",
				"autoprefixer:page",
				"group_css_media_queries:page",
				"cssmin:page",
				"pug:page",
			],
			full: [
				"clean",
				"copy",
				"concat",
				"uglify",
				"less",
				"autoprefixer",
				"group_css_media_queries",
				"cssmin",
				"pug",
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
			page: [
				'test/',
				'tests/',
			],
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'node_modules/pdf-lib/dist',
						src: [
							'pdf-lib.min.js',
							'pdf-lib.min.js.map',
						],
						dest: '<%= globalConfig.gosave %>/js/',
					},
					{
						expand: true,
						cwd: 'src/docs/fonts',
						src: [
							'Montserrat-*.*',
							'NunitoSans-*.*',
						],
						dest: '<%= globalConfig.gosave %>/fonts/',
					},
				],
			},
			page: {
				files: [
					{
						expand: true,
						cwd: 'src/docs/js',
						src: [
							'main.js',
						],
						dest: 'docs/js/',
					},
					{
						expand: true,
						cwd: 'src/docs/fonts',
						src: [
							'*.*',
						],
						dest: 'docs/fonts/',
					},
					{
						expand: true,
						cwd: 'node_modules/pdf-lib/dist',
						src: [
							'pdf-lib.min.js',
							'pdf-lib.min.js.map',
						],
						dest: 'docs/js/',
					},
					{
						expand: true,
						cwd: 'assets/modules/pdf-metadata/images/',
						src: [
							'*.svg',
						],
						dest: 'docs/images/',
					},
				],
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
			page: {
				src: [
					'src/js/main.js',
					'src/docs/js/main.js',
				],
				dest: 'docs/js/main.js',
			}
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
			page: {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'docs/js/main.js',
						],
						dest: 'docs/js',
						filter: 'isFile',
						rename: function (dst, src) {
							return dst + '/' + src.replace('.js', '.min.js');
						},
					},
				],
			},
		},
		less: {
			main: {
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
			page: {
				options : {
					compress: false,
					ieCompat: false,
					plugins: [],
					modifyVars: {
						//'hashes': versions + update,
						'fontpath': '../fonts',
						'imgpath': 'images',
					},
				},
				files : {
					'docs/css/main.css' : [
						'src/docs/less/main.less',
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
			main: {
				files: {
					'test/css/main.css' : [
						'test/css/main.css',
					],
				},
			},
			page: {
				files: {
					'docs/css/main.css' : [
						'docs/css/main.css',
					],
				},
			},
		},
		group_css_media_queries: {
			main: {
				files: {
					'<%= globalConfig.gosave %>/css/main.css': ['test/css/main.css'],
				},
			},
			page: {
				files: {
					'docs/css/main.css' : ['docs/css/main.css'],
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
			page: {
				files: {
					'docs/css/main.min.css' : ['docs/css/main.css'],
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
						{
							match: /{description}/g,
							replacement: `${PACK.description}`,
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
		pug: {
			page: {
				options: {
					doctype: 'html',
					client: false,
					pretty: "", //"\t",
					separator:  "", //"\n",
					data: function(dest, src) {
						return {
							"description": `${PACK.description}`,
							"version": `v${PACK.version}`,
							//"hash": `=` + grunt.template.date(new Date().getTime(), `yyyy-mm-dd'T'HH-MM-ss'Z'`),
							"hash": `=` + URL.createObjectURL(new Blob([])).slice(-36).toLowerCase().replace(/-/g, ''),
						}
					},
				},
				files: [
					{
						expand: true,
						cwd: __dirname + '/src/docs/pug/',
						src: [ '*.pug' ],
						dest: __dirname + '/docs/',
						ext: '.html',
					},
				],
			},
		},
	});
	grunt.registerTask('default',	gc.default);
	grunt.registerTask('page',	gc.page);
	grunt.registerTask('full',	gc.full);
}
