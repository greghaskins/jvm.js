module.exports = function (grunt) {
  'use strict';

  var testJavaFiles = ['test/**/*.java'];

  // Project configuration
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    ' Licensed <%= props.license %> */\n',
    // Task configuration
    jshint: {
      options: {
        node: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        eqnull: true,
        globals: {
          "it" : false,
          "xit" : false,
          "describe" : false,
          "xdescribe" : false,
          "beforeEach" : false,
          "afterEach" : false,
          "expect" : false,
          "spyOn" : false
        },
        boss: true
      },
      gruntfile: {
        src: 'gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
      }
    },
    run_java: {
      options: {
        stdout: true,
        stderr: true,
        stdin: false,
        failOnError: true
      },
      compile_test_classes: {
        command: "javac",
        javaOptions: {
          "classpath": []
        },
        sourceFiles: []
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: ['<%= jshint.lib_test.src %>'],
        tasks: ['jshint:lib_test', 'karma']
      },
      test_java: {
        files: testJavaFiles,
        tasks: ['test_compile', 'karma']
      }
    }
  });

  // These plugins provide necessary tasks
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-run-java');

  // Find *.java files used for tests
  grunt.registerTask('gather_test_java', function() {
    var files = grunt.file.expand(testJavaFiles);
    grunt.config(['run_java', 'compile_test_classes', 'sourceFiles'], files);
  });

  // Default task
  grunt.registerTask('test_compile',
    ['gather_test_java', 'run_java:compile_test_classes']);
  grunt.registerTask('default', ['jshint', 'test_compile', 'karma']);
};
