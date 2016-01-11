module.exports = function (grunt) {
    var files = [
        "js/main.js",
        "js/modal.js",
        "js/ui-bootstrap-custom-0.12.1.min.js"
    ];

    var withounBrowserify = ['static/js/br_app.js', 'bower_components/materialize/bin/materialize.js'];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            compress: {
                options: {
                    keepSpecialComments: "0"
                },
                files: {
                    "static/css/app.css": [
                        "bower_components/angular-chart.js/dist/angular-chart.css",
                        "node_modules/materialize-css/bin/materialize.css",
                        "node_modules/bootstrap/dist/css/bootstrap.css",
                        "bower_components/angular-modal/modal.css",
                        "node_modules/ng-table/ng-table.css",
                        "tmp/app.css"
                    ]
                }
            }
        },
        less: {
            app: {
                files: {
                    "tmp/app.css": [
                        "css/application.less"
                    ]
                }
            }
        },
        concat: {
            develop: {
                files: {
                    "static/js/app.js": files
                }
            },
            ignoringBrowserify: {
                files: {
                    "static/js/vendor_app.js": withounBrowserify
                }
            }
        },
        browserify: {
            main: {
                src: 'static/js/app.js',
                dest: 'static/js/br_app.js'
            }
        },
        uglify: {
            release: {
                options: {
                    preserveComments: false,
                    wrap: false,
                    mangle: false
                },
                files: {
                    "static/js/app.js": files
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-browserify');


    // Default task.
    grunt.registerTask("default", ["less", "cssmin", "concat:develop", 'browserify', "concat:ignoringBrowserify"]);
    // Release task
    grunt.registerTask("release", ["default", "uglify:release"]);

};
