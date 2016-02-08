module.exports = function (grunt) {
    var files = [
        "js/main.js",
        "js/modal.js",
        "js/ui-bootstrap.js"
    ];

    var withoutBrowserify = ['static/js/br_app.js', 'static/js/translations.js', 'bower_components/underscore/underscore.js', 'bower_components/materialize/bin/materialize.js'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nggettext_extract: {
            pot: {
                files: {
                    'po/template.pot': [
                        'js/**/*.js',
                        '*.html',
                        'partials/*.html',
                        'partials/modals/*.html',
                        'template/tooltip/*.html'
                    ]
                }
            },
        },
        nggettext_compile: {
            all: {
                options: {
                    module: 'liskApp'
                },
                files: {
                    'static/js/translations.js': ['po/*.po']
                }
            }
        },
        cssmin: {
            release: {
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
            release: {
                files: {
                    "tmp/app.css": [
                        "css/application.less"
                    ]
                }
            }
        },
        concat: {
            release: {
                files: {
                    "static/js/app.js": files
                }
            },
            withoutBrowserify: {
                files: {
                    "static/js/vendor_app.js": withoutBrowserify
                }
            }
        },
        browserify: {
            release: {
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

    grunt.loadNpmTasks("grunt-angular-gettext");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask("default", ["nggettext_extract", "nggettext_compile", "less", "cssmin", "concat:release", 'browserify', "concat:withoutBrowserify"]);
    grunt.registerTask("release", ["default", "uglify:release"]);
};
