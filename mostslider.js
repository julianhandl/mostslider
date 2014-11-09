// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.
	
	// window and document are passed through as local variable rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).
	
	// Create the defaults once
	var pluginName = "mostSlider",
		defaults = {
			// ANIMATION
            // animation effect
            animation: "fade",
            // animation speed
            aniSpeed: 1000,
            // animation method / jQuery, css, auto
            aniMethod: "auto",
            // sets if animation method should consider a fallback if selected method is not supported
            aniFallback: true,
            // put slider image as background and center it - only avilable if metrics are set
            background_center: false,
            
            // SPEED
            // slide automatically
            autoPlay: true,
            // time between slide
            pauseTime: 3000,
            
            // METRICS
            // slider width and height
            metrics: {
            	// RATIO
            	// max width
	            width: 0,
	            // max height
	            height: 0,
            },
            // stay the same height during resize
            solidHeight: false,
            
            // NAVIGATION
            // use bullets as thumbnails
            thumbnails: false,
            // put thumbnailimage in background
            thumb_bg: false,
            // en/disable navigation
            navigation: true,
            // hide the arrows
            hideArrows: true,
            
            // FUNCTION
            // enable linking to slides via url
            linkable: false,
            
            // CONTENT
            // if content has transparancies
            transparancy: false,
            // specify the content class or animated content
            contentClass: "content",
            // proceed content animation StepByStey
            sbsContent: false,
            // time between each content animation step
		    contentAniDelay: 300,
		    
		    // IMAGES
		    // user different images for different slider sizes
		    responsive_images: false,
		    // breakpoint between mobile and tablet (min tablet)
		    responsive_break_tablet: 481,
		    // breakpoint between tablet and desktop (min desktop)
            responsive_break_desktop: 1024,
		    
		    // enable social button for each slide
		    socialButtons: false,
		    // url for social buttons
		    socialUrl: "",
		    // twitter id
		    twitterID: ""
	};
	
	// The actual plugin constructor
	function Plugin ( element, options ) {
			this.element = element;
			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			var root = this;
			
			this.slider = {
				'obj': element,
				'aniMethod': '',
				'init_height': 0,
				'ratio': 0,
				'slides': 0,
				'current_slide': 1,
				'sliding': false,
			}
			
			this.init();
			
			setInterval(function(){
				root.next();
			}, this.settings.pauseTime);
	}
	
	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
			init: function () {
			
				var obj = this;
				var slider = this.slider;
				
				// set aniMethod and Fallback
				
				// wrap the slides
				$(slider.obj).wrapInner('<div id="slides" />');
				$(slider.obj).append('<ul id="bullets" />');
					
				// set slides
				$(slider.obj).find("#slides > *").each(function(index){
					// init css
					switch(obj.settings.animation){
						case 'slide':
							// css for slides
							$(this).css({
								"left": 100 * index + '%',
							});
							break;
						case 'fade':
							$(this).css({
								"opacity": 0,
							});
							if(index == 0){
								// set first slide
								$(this).css({
									"z-index": 10,
									"opacity": 1
								});
							}
							break;
					}
					// get the heighest slide
					if($(this).height() > slider.init_height){
						slider.init_height = $(this).height();
					}
					// get number of slides
					slider.slides += 1;
					// set bg image
					if($(this).find("img").length > 0){
						$(this).find("img").addClass("bg");
					}
					// add bullet
					$(slider.obj).find("#bullets").append('<li data-index="' + (index+1) + '" />');
				});
				
				// init css
				switch(obj.settings.animation){
					case 'slide':
						$(slider.obj).find("#slides").css({
							"transition": "left " + obj.settings.aniSpeed.toString() + "ms ease",
						});
						break;
					case 'fade':
						$(slider.obj).find("#slides>*").css({
							"transition": "opacity " + obj.settings.aniSpeed.toString() + "ms ease",
						});
						break;
				}
				
				// give slider the correct ratio
				slider.ratio = (slider.init_height/$(slider.obj).width()) * 100;
				$(slider.obj).css("padding-bottom", ( (slider.init_height/$(slider.obj).width()) * 100 ).toString() + '%');
				
				$(document).on('mousedown touchstart','#bullets > li',function(){
					obj.goTo($(this).data("index"));
				});
				
			},
			goTo: function (index) {
			
				var root = this;
				var current_slide = this.slider.current_slide;
				
				// if index isn't out of range and slider is not sliding
				if(index>0 && index<=this.slider.slides && this.slider.sliding == false){
				
					this.slider.sliding = true;
				
					switch(this.settings.animation){
						case 'slide':
							// css
							if(this.settings.aniMethod == 'css'){
								$(this.slider.obj).find("#slides").css("left", ((index-1)*100*(-1)).toString() + '%').bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
									root.slider.sliding = false;
								});
							}
							//jQuery
							else if(this.settings.aniMethod == 'jQuery'){
								$(this.slider.obj).find("#slides").animate({
									"left": ((index-1)*100*(-1)).toString() + '%',
								},function(){
									root.slider.sliding = false;
								});
							}
							break;
						case 'fade':
							// css
							if(this.settings.aniMethod == 'css'){
								$(this.slider.obj).find('#slides>*:nth-child(' + this.slider.current_slide + ')').css({
									"z-index": 0,
								});
								$(this.slider.obj).find('#slides>*:nth-child(' + index + ')').css({
									"z-index": 10,
									"opacity": 1
								}).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
									$(root.slider.obj).find('#slides>*:nth-child(' + current_slide + ')').css({
										"opacity": 0,
									});
									root.slider.sliding = false;
								});
							}
							else if(this.settings.aniMethod == 'jQuery'){
								
							}
							break;
					}
					
					this.slider.current_slide = index;
				}
			},
			next: function () {
				if(this.slider.current_slide < this.slider.slides){
					this.goTo(this.slider.current_slide + 1);
				}
				else if(this.slider.current_slide == this.slider.slides){
					this.goTo(1);
				}
			},
			prev: function () {
				if(this.slider.current_slide > 1){
					this.goTo(this.slider.current_slide - 1);
				}
				else if(this.slider.current_slide == 1){
					this.goTo(this.slider.slides);
				}
			}
	});
	
	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function ( options ) {
			this.each(function() {
					if ( !$.data( this, "plugin_" + pluginName ) ) {
							$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
					}
			});
	
			// chain jQuery functions
			return this;
	};

})( jQuery, window, document );