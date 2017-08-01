module.exports = function (grunt) {
    console.log('vo day');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            dist: {
                options: {
                    banner: '/*! MyLib.js 1.0.0 | Aurelio De Rosa (@AurelioDeRosa) | MIT Licensed */'
                },
                files: {
                    'public/release/style.min.css': ['public/libs/angular-material/angular-material.min.css','public/libs/flexslider/flexslider.css','public/css/style.css']
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    sourceMap: true,
                    banner: '/*! MyLib.js 1.0.0 | Aurelio De Rosa (@AurelioDeRosa) | MIT Licensed */'
                },
                files: {
                    'public/release/main.min.js': [
                        'public/libs/jquery/dist/jquery.min.js',
                        'public/libs/angular/angular.min.js',
                        'public/js/socket.io-1.4.5.js',
                        'public/libs/angular-route/angular-route.min.js',
                        'public/libs/angular-resource/angular-resource.min.js',
                        'public/libs/angular-material/angular-material.min.js',
                        'public/libs/angular-aria/angular-aria.min.js',
                        'public/libs/angular-messages/angular-messages.min.js',
                        'public/libs/angular-animate/angular-animate.min.js',
                        'public/app/main.client.module.js',
                        'public/app/auth.client.module.js',
                        'public/app/configs/*.js',
                        'public/app/resources/*.js',
                        'public/app/filters/*.js',
                        'public/app/directives/*.js',
                        'public/app/controllers/*.js',
                        'public/libs/flexslider/jquery.flexslider.js',
                        'public/libs/angular-flexslider/angular-flexslider.js',
                        'public/libs/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
                        'public/libs/ng-img-crop/compile/minified/ng-img-crop.js',
                        'public/js/main.js',
                    ],
                }
            }
        },
        // processhtml: {
        //     dist: {
        //         options: {
        //             process: true,
        //             data: {
        //                 title: 'My app',
        //                 message: 'This is production distribution'
        //             }
        //         },
        //         files: {
        //             'dist/index.min.html': ['index.html']
        //         }
        //     }
        // },
        // htmlmin: {
        //     dist: {
        //         options: {
        //             removeComments: true,
        //             collapseWhitespace: true
        //         },
        //         files: {
        //             'dist/index.html': 'dist/index.min.html'
        //         }
        //     }
        // },
        //
        // clean: ['dist*//*.min.*']
        // img: {
        //     // using only dirs with output path
        //     task1: {
        //         src: 'public/sources/thumb/*.jpg',
        //         dest: 'dist/img'
        //     }
        // }
    });
    // grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.loadNpmTasks('grunt-img');
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    // grunt.loadNpmTasks('grunt-processhtml');
    // grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('default', ['cssmin','uglify']);//'processhtml','clean', 'htmlmin','img'
    grunt.registerTask('build', ['cssmin','uglify']);//'htmlmin', 'processhtml','img'
};