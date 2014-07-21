module.exports = function(grunt) {

    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),
        
		less: {
			'default': { 
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2,
				},
				files: {
					"themes/default/default.css": "themes/default/default.less"
				}
			},
			'thumbnail': { 
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2,
				},
				files: {
					"themes/thumbnail/thumbnail.css": "themes/thumbnail/thumbnail.less"
				}
			},
			'thumbnail_scroll': { 
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2,
				},
				files: {
					"themes/thumbnail_scroll/thumbnail.css": "themes/thumbnail_scroll/thumbnail.less"
				}
			}
		},
		uglify: {
			options: {
				sourceMap: true,
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				        '<%= grunt.template.today("yyyy-mm-dd") %> - © Julian Handl - MIT License */'
			},
			build: {
				files: {
					'mostslider.min.js': ['mostslider.js']
				}
			}
		},
		
		watch: {
			styles: {
				files: ['themes/**/*.less'],
				tasks: ['less'],
				options: {
					spawn: true
				}
			},
			scripts: {
				files: ['mostslider.js'],
				tasks: ['uglify'],
				options: {
					spawn: true
				}
			}
		}
        
    });    
    
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default', ['watch']);

};