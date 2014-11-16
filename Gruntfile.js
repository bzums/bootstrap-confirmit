module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            build: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['src/*.*'],
                    dest: 'dist/',
                    filter: 'isFile'
                }]
            }
        },
        uglify: {
            options: {
                banner: '<%= pkg.banner %>',
                sourceMap: 'dist/<%= pkg.name %>.min.js.map',
                sourceMappingURL: '<%= pkg.name %>.min.js.map'
            },
            build: {
                files: {
                    'dist/<%= pkg.name %>.min.js': 'src/<%= pkg.name %>.js',
                }
            }
        },
        cssmin: {
            minify: {
                src: ['src/<%= pkg.name %>.css'],
                dest: 'dist/<%= pkg.name %>.min.css',
            }
        }
    });

    grunt.registerTask('compile', ['uglify', 'cssmin', 'copy']);
};
