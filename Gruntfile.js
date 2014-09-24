'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
          'dist/js/timeline.min.js': ['src/js/svg.js', 'src/js/branch.js', 'src/js/timeline.js']
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'dist/css/timeline.min.css': ['src/css/*.css']
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify', "cssmin"]);

};
