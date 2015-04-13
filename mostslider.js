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
            // hide the arrows when mouse not on slider
            hideArrows: true,
            
            // FUNCTION
            // enable linking to slides via url
            linkable: false,
            
            // CONTENT
            // if content has transparancies
            transparency: false,
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
				'initialised': false,
				'init_width': 0,
				'init_height': 0,
				'ratio': 0,
				'slides': 0,
				'current_slide': 1,
				'sliding': false,
			}
			
			var images = $(this.slider.obj).find("img").length;
	        $(this.slider.obj).find("img").load(function(){
	        	if(root.slider.initialised==false){
		        	root.init();
		        }
	        }).each(function(index){
				if(this.complete && index == images-1){
					$(this).load();
				}
			});
	}
	
	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
			init: function () {
			
				var root = this;
				var slider = this.slider;
				
				// set aniMethod and Fallback
				root.slider.aniMethod = root.settings.aniMethod;
				if(slider.aniMethod == 'auto' && $("html.csstransitions").length > 0){
					root.slider.aniMethod = 'css';
				}
				else if(slider.aniMethod == 'css' && $("html.csstransitions").length > 0){
					root.slider.aniMethod = 'css';
				}
				else{
					root.slider.aniMethod = 'jQuery';
				}
				
				// wrap the slides
				$(slider.obj).wrapInner('<div id="slides-wrapper"><div id="slides" class="' + root.settings.animation + '" /></div>');
				// add bullet container
				$(slider.obj).append('<ul id="bullets" class="navi bullets" />');
				// add arrows
				if(root.settings.navigation == true){
					$(slider.obj).append('<div id="left" class="navi arrow" />').append('<div id="right" class="navi arrow" />');
				}
				
				// activate first slide
				if(root.settings.animation == 'fade'){
					$(slider.obj).find("#slides > *:first-child").addClass("active");
				}
					
				// set slides
				$(slider.obj).find("#slides > *").each(function(index){
					// set bg image
					if($(this).find("img").length > 0){
						$(this).find("img").addClass("bg");
					}
					// init css
					if(root.settings.animation == 'slide'){
						$(this).css({
							"left": 100 * index + '%',
						});
					}
					// get the heighest slide
					if($(this).find('img.bg').height() > slider.init_height){
						slider.init_height = $(this).find('img.bg').height();
						slider.init_width = $(this).find('img.bg').width();
					}
					// background centering
	    			if(root.settings.background_center == true && (root.settings.metrics.width > 0 && root.settings.metrics.width != '') && (root.settings.metrics.height > 0 && root.settings.metrics.height != '')){
		        		$(this).css({
		        			"width": "100%",
		        			"height": "100%",
			        		"background-image": 'url(' + $(this).find("img.bg").attr('src') + ')',
			        		"background-repeat":"no-repeat",
			        		"background-position":"center center",
			        		"background-size":"cover",
			        		"-webkit-background-size":"cover",
			        		"-moz-background-size":"cover",
			        		"-o-background-size":"cover",
		        		});
		        		if($("html.backgroundsize").length == 0){
			        		$(this).css({
				        		"filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + $(this).find("img.bg").attr('src') + ",sizingMethod='scale')",
				        		"-ms-filter": "\"progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + $(this).find("img.bg").attr('src') + ",sizingMethod='scale')\"",
			        		});
		        		}
		        		$(this).find("img.bg").hide();
	        		}
					// get number of slides
					slider.slides += 1;
					// add bullet
					$(slider.obj).find("#bullets").append('<li data-index="' + (index+1) + '" />');
				});
				
				// activate first bullet
				$(slider.obj).find("#bullets li:first-child").addClass("active");
				
				// init css
				if(root.slider.aniMethod == 'css'){
					switch(root.settings.animation){
						case 'slide':
							$(slider.obj).find("#slides").css({
								"transition": "left " + root.settings.aniSpeed.toString() + "ms ease",
							});
							break;
						case 'fade':
							$(slider.obj).find("#slides>*").css({
								"transition": "opacity " + root.settings.aniSpeed.toString() + "ms ease",
							});
							break;
					}
				}
				
				// give slider the correct ratio
				if(root.settings.metrics.width > 0 && root.settings.metrics.width != '' && root.settings.metrics.height > 0 && root.settings.metrics.height != ''){
					slider.init_width = root.settings.metrics.width;
					slider.init_height = root.settings.metrics.height;
				}
				
				slider.ratio = (slider.init_height/slider.init_width) * 100;
				$(slider.obj).css("padding-bottom", ( (slider.init_height/slider.init_width) * 100 ).toString() + '%');
				
				// bullet listener
				$(slider.obj).on('mousedown touchstart','#bullets > li',function(){
					root.goTo($(this).data("index"));
					root.restartAutoplay();
				});
				// arrow left
				$(slider.obj).on('mousedown touchstart','#left',function(){
					root.prev();
					if(root.settings.autoPlay == true){
						root.restartAutoplay();
					}
				});
				// arrow right
				$(slider.obj).on('mousedown touchstart','#right',function(){
					root.next();
					if(root.settings.autoPlay == true){
						root.restartAutoplay();
					}
				});
				
				// swiping
				var touch_start = 0;
				var swipe = '';
				$(slider.obj).on('touchstart','#slides',function(e){
					touch_start = e.originalEvent.touches[0].pageX;
					setTimeout(function(){
						if(swipe == 'left'){
							root.next();
							root.restartAutoplay();
							touch_start = 0;
							swipe = '';
						}
						else if(swipe == 'right'){
							root.prev();
							root.restartAutoplay();
							touch_start = 0;
							swipe = '';
						}
					}, 300);
				});
				$(slider.obj).on('touchmove','#slides',function(e){
					var touch_end = e.originalEvent.touches[0].pageX;
					if(touch_end - touch_start < 0){
						var diff = (touch_end - touch_start) * (-1);
						if(diff > 30){
							swipe = 'left';
						}
					}
					else if(touch_end - touch_start > 0){
						var diff = (touch_end - touch_start);
						if(diff > 30){
							swipe = 'right';
						}
					}
				});
				
				// autoplay
				var old_time = 0;
				var new_time = 0;
				// enter the slider
				/*
				$(slider.obj).on('mouseenter','#slides',function(){
					root.stopAutoplay();
					old_time = new Date();
					old_time = old_time.getTime();
				});
				// leave the slider
				$(slider.obj).on('mouseleave','#slides',function(){
					new_time = new Date();
					new_time = new_time.getTime();
					root.startAutoplay();
					if( new_time - old_time >= root.settings.pauseTime){
						root.next();
					}
					else if( new_time - old_time < root.settings.pauseTime){
						setTimeout(function(){
							root.next();
						}, root.settings.pauseTime - (new_time - old_time));
					}
				});
				*/
				
				// init autoplay
				if(this.settings.autoPlay == true){
					root.startAutoplay();
				}
				
				root.slider.initialised = true;
				
			},
			goTo: function (index) {
			
				var root = this;
				
				// if index isn't out of range and slider is not sliding
				if(index>0 && index<=this.slider.slides && this.slider.sliding == false){
				
					this.slider.sliding = true;
				
					switch(this.settings.animation){
						case 'slide':
							// css
							if(root.slider.aniMethod == 'css'){
								$(this.slider.obj).find("#slides").css("left", ((index-1)*100*(-1)).toString() + '%').bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
									root.slider.sliding = false;
								});
							}
							//jQuery
							else if(root.slider.aniMethod == 'jQuery'){
								$(this.slider.obj).find("#slides").animate({
									"left": ((index-1)*100*(-1)).toString() + '%',
								},function(){
									root.slider.sliding = false;
								});
							}
							break;
						case 'fade':
							// css
							if(root.slider.aniMethod == 'css'){
								var current_slide = root.slider.current_slide;
								$(this.slider.obj).find('#slides>*:nth-child(' + current_slide + ')').removeClass("active").css({
									"opacity": 1,
								});
								$(this.slider.obj).find('#slides>*:nth-child(' + index + ')').addClass("active").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
									$(root.slider.obj).find('#slides>*:nth-child(' + current_slide + ')').css({
										"opacity": "",
									});
									root.slider.sliding = false;
								});
							}
							else if(root.slider.aniMethod == 'jQuery'){
								var current_slide = root.slider.current_slide;
								$(this.slider.obj).find('#slides>*:nth-child(' + current_slide + ')').css({
									"z-index": 0,
									"opacity": 1,
								});
								$(this.slider.obj).find('#slides>*:nth-child(' + index + ')').css({
									"z-index": 10,
								}).animate({
									"opacity": 1,
								},root.settings.aniSpeed,function(){
									$(this).addClass("active").css({
										"z-index": "",
										"opacity": "",
									});
									$(root.slider.obj).find('#slides>*:nth-child(' + current_slide + ')').css({
										"z-index": "",
										"opacity": "",
									}).removeClass("active");
									root.slider.sliding = false;
								});
							}
							break;
					}
					
					root.slider.current_slide = index;
					$(this.slider.obj).find("#bullets li").removeClass("active").filter(':nth-child(' + index + ')').addClass("active");
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
			},
			stopAutoplay: function () {
				var root = this;
				clearInterval(root.autoplay);
			},
			startAutoplay: function () {
				var root = this;
				root.autoplay = setInterval(function(){
					root.next();
				}, root.settings.pauseTime);
			},
			restartAutoplay: function () {
				this.stopAutoplay();
				this.startAutoplay();
			},
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