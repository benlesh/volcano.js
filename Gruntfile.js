module.exports = function (grunt) {
    'use strict';

    function wrap(fileArray) {
        var copy = fileArray.slice(0);
        copy.unshift('src/intro.txt');
        copy.push('src/outro.txt');
        return copy;
    }

    var srcFiles = [
        'src/core.js',
        'src/namespace.js',
        'src/DependencyChain.js',
        'src/volcano/**/*.js'
    ];

    grunt.initConfig({
        jshint: {
            all: ['src/**/*.js', 'test/**/*.spec.js']
        },
        concat: {
          all: {
              src: wrap(srcFiles),
              dest: 'dist/volcano.js'
          }
        },
        uglify: {
            min: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dist/volcano.min.js': 'dist/volcano.js'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dev/volcano-dev.min.js': srcFiles
                }
            }
        },
        watch: {
            src: {
                files: 'src/**/*.js',
                tasks: ['concat', 'uglify:min', 'uglify:dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('dev', ['watch']);
}