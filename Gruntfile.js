module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			
			max: {
				options: {
					beautify: true,
					sourceMap: true,
					mangle: false,
					enclose: {
						'window': 'window'
					}
				},
				src: ['src/core.js', 'src/**/*.js'],
				dest: 'dist/volcano.js'
			},
			min: {
				options: {
					sourceMap: true,
					enclose: {
						'window': 'window'
					}
				},
				src: ['src/core.js', 'src/**/*.js'],
				dest: 'dist/volcano.min.js'
			}
		},
		watch: {
			js: {
				files: ['src/**/*.js'],
				tasks: ['uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['uglify']);
}