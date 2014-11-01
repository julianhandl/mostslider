/* MOSTSLIDER
/* © by Julian Handl
/* MIT Licence
*/

/**** TO DO ****

- rework autoplay and add option to stop autoplay on hover

/***************/

(function ( $ ) {
	
	//DEFINE NAME ON THE FUNCTION
    $.fn.mostSlider = function( options ) {
 
        // GET THE OPTIONS
        var settings = $.extend({
            // SET DEFAULT
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
        }, options );
 
 
        /*********************/
        /***** VARIABLES *****/
        /*********************/
        
        //CACHE THE SLIDER ELEMENT
        var slider = this;
        //CACHE THE SLIDERS WIDTH
        var width = slider.width();
        //SLIDERS CURRENT WIDTH
        var current_width = 0;
        //SLIDER RATION
        var ratio = settings.metrics.height / settings.metrics.width;
        //CACHE THE SLIDERs CHILDREN/SLIDES
        var children = slider.children();
        //CACHE THE NUMBER OF CHILDREN/SLIDES
        var children_number = children.length;
        //CURRENT SLIDE
        var current = 1;
        //SLIDE DIRECTION
        var direction = "right";
        //AUTOPLAY INTERVAL
        var autoplay;
        //CURRENTLY SLIDING
        var sliding = false;
        //INITIALISED?
        var initialised = false;
        //OLD IE BROWSER
        var oldIE = false;
		if ($('html').is('.ie6, .ie7, .ie8') || $('body').is('.ie6, .ie7, .ie8')) {
	        oldIE = true;
	    }
	    
	    // aniMethod Fallback and auto
	    switch (settings.aniMethod){
		    case 'jQuery':
		    	settings.aniMethod = 'jQuery';
		    	break;
		    case 'css':
		    	if( (!$('html').hasClass('csstransitions')) && (settings.aniFallback == true) ){
				    settings.aniMethod = 'jQuery';
			    }
			    break;
			case 'auto':
				if( $('html').hasClass('csstransitions') ){
					settings.aniMethod = 'css';
				}
				else{
					settings.aniMethod = 'jQuery';
				}
				break;
	    }


        /*****************/
        /***** INITS *****/
        /*****************/
        
        
        //LET THE SLIDER DIV FIT THE SLIDER-WRAPPER
        slider.css({"position": "relative","width": "100%","line-height": "0"});
        
        //STYLE THE SLIDES AND SET A ID/INDEX
        slider.children().each(function(index){
        
        	// RESPONSIVE IMAGES
        	if(settings.responsive_images = true){
        		var window_width = $(window).width();
        		
        		$(this).find("img[data-responsive-images='true']").each(function(){
	        		// DESKTOP
	        		if(window_width >= settings.responsive_break_desktop){
		        		$(this).attr("src",$(this).attr("data-image-desktop"));
	        		}
	        		// TABLET
	        		else if(window_width >= settings.responsive_break_tablet){
		        		$(this).attr("src",$(this).attr("data-image-tablet"));
	        		}
        		});
    		}
        
        	
        	// CSS FOR SLIDES
    		$(this).css({"width":"100%",
    			 "height":"auto",
    			 "line-height":"auto",
    			 "position":"absolute",
    			 "z-index":0,
    			 "display":"none",
    			 "overflow":"hidden"}).attr("id",index+1);
    		// SPECIAL SETTINGS FOR CSS METHOD
    		if(settings.aniMethod == 'css'){
    			
    			if(settings.animation == 'fade'){
	    			$(this).css({
			    		'opacity': 0,
			    		'display': 'block',
		    		});
    			}
    		}
    		
    		/*****************/
    		/* SPECIAL CASES */
    		/*****************/
    		
    		//IFRAME (NOT FULLY WORKING)
    		if($(this).is("iframe")){
        		$(this).css({
	        		"width": slider.find("#1").width(),
	        		"height": slider.find("#1").height()
        		});
    		}
    		//SLIDE IS IMAGE
    		$(this).find("> img:only-child").css({
    			"width":"100%",
    			"height":"auto"
        	});
        	
    		//SLIDE IS IMAGE IN LINK
    		$(this).find("> a > img:only-child").css({
    			"width":"100%",
    			"height":"auto"
        	});
    		
    		// BACKGROUND IMAGES
    		if($(this).find("img.portrait").length > 0){
        		$(this).find("img.portrait").css({
        			"width":"auto",
        			"height":"100%"
        		});
        		settings.transparancy = true
    		}
    		
    		// BACKGROUND IMAGES
    		if($(this).find("img.bg").length > 0){
    		
    			// IF BACKGROUND CENTERING ACTIVE AND METRICS ARE SET (experimental)
    			if(settings.background_center == true && (settings.metrics.width > 0 && settings.metrics.width != '') && (settings.metrics.height > 0 && settings.metrics.height != '')){
	        		$(this).css({
		        		"background-image": 'url(' + $(this).find("img.bg").attr('src') + ')',
		        		"background-repeat":"no-repeat",
		        		"background-position":"center center",
		        		"background-size":"cover",
		        		"-webkit-background-size":"cover",
		        		"-moz-background-size":"cover",
		        		"-o-background-size":"cover",
	        		});
	        		if(oldIE){
		        		$(this).css({
			        		"filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + $(this).find("img.bg").attr('src') + ",sizingMethod='scale')",
			        		"-ms-filter": "\"progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + $(this).find("img.bg").attr('src') + ",sizingMethod='scale')\"",
		        		});
	        		}
	        		$(this).find("img.bg").hide();
        		}
        		// DEFAULT BG HANDLING
        		else{
	        		$(this).find("img.bg").css({
	        			"width":"100%",
	        			"height":"auto"
	        		});
        		}
    		}
	        		
        	
        	//SOCIAL BUTTONS
	        if(settings.socialButtons == true){
				// INSERT CONTAINER FOR SOCIAL BUTTONS
				$(this).prepend('<div class="social" />');
				
				var data_social = "none";
				if($(this).attr('data-social') != undefined){
					data_social = $(this).attr('data-social');
				}
				
				// FACEBOOK
				if(data_social.indexOf('facebook') >= 0 && settings.twitterID != ""){
				
					var url = document.URL;
					var number = parseInt(index) + 1;
					if(url.indexOf('?') > 0){
						url = url + "&slider=" + number;
					}
					else{
						url = url + "?slider=" + number;
					}
					url = url.replace(/\:/g, '%3A').replace(/\//g, '%2F').replace(/\=/g, '%3D').replace(/\?/g, '%3F').replace(/\-/g, '%2D');
					
					//slider.parent().prepend('<div id="fb-root"></div>');
					$(this).find(".social").prepend('<div id="facebook"><iframe src="//www.facebook.com/plugins/like.php?href=' + url + '&amp;width=130&amp;height=21&amp;colorscheme=light&amp;layout=button_count&amp;data-layout=simple&amp;action=like&amp;show_faces=false&amp;send=false" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:130px; height:21px;" allowTransparency="true"></iframe></div>');
				}
				
				// PINTEREST
				if(data_social.indexOf('pinterest') >= 0 && settings.socialUrl != "" && $(this).find(".pinterest").length == 1){
				
					// URL OF SITE
					var url = settings.socialUrl.replace(/:/g,'%3A').replace(/\//g,'%2F');
					// IMAGE OBJECT
					var img = $(this).find(".pinterest");
					// ABSOLUTE URL TO IMAGE
					var src = img.get(0).src.replace(/:/g,'%3A').replace(/\//g,'%2F');
					// IMAGE DESCRIPTION
					var description = img.attr('alt');
					if(description == "undefined"){
						description = "";
					}
					
					// BILD LINK FOR PINTEREST
		    		$(this).find(".social").prepend('<div id="pinterest"><a href="//pinterest.com/pin/create/button/?url=' + url + '&media=' + src + '&description=' + description + '" data-pin-do="buttonPin" data-pin-config="none"><img src="//assets.pinterest.com/images/pidgets/pin_it_button.png" /></a></div>');
		    		
				}
				
				// TWITTER
				if(data_social.indexOf('twitter') >= 0 && settings.twitterID != ""){
					
					var url = document.URL;
					var number = parseInt(index) + 1;
					if(url.indexOf('?') > 0 && url.search("slider=")>0){
						slider_url = url.substr(url.search("slider="), 8)
						url = url.replace(slider_url,'slider=' + number);
					}
					else if(url.indexOf('?') > 0 && url.search("slider=") < 0){
						url = url + "&slider=" + number;
					}
					else{
						url = url + "?slider=" + number;
					}
				
					$(this).find(".social").prepend('<div id="twitter"><a href="https://twitter.com/share" class="twitter-share-button" data-text="' + url + '" data-url="' + url + '" data-via="' + settings.twitterID + '" data-lang="de" data-count="none">Twittern</a></div>');
					
				}		
				
			}
	        
        });
        //SET WRAPER FOR SLIDE ANIMATION
        if(settings.animation == "slide"){
        	// WRAP SLIDES DIV WITH ANOTHER DIV THAT CONTAINS THE ABSOLUTE DIV. SO THUMBNAILS CAN BE POSITIONED CORRECTLY.
	        slider.wrapInner('<div style="position:relative;width:100%;height:100%;" id="slides-wrapper"><div id="slides" style="position:absolute;width:100%;height:100%;overflow:hidden;line-height:0;" /></div>');
        }
        else{
	        slider.wrapInner('<div id="slides" style="line-height:0;overflow:hidden;" />');
        }
        
        
        
        // VERY SERIOUS BUSINESS HERE! MAGIC MAGIC MAGIC! THINK TWICE BEFORE TOUCHING
        // SET SLIDER HEIGHT
        // IF SET, DO NOTHING, IF NOT SET, SET TO FIRST CHILD
        this.init = function(){
        
        	slider.css("display","block");
        	
	        if((settings.metrics.width > 0) && (settings.metrics.height > 0)){
		        if((slider.width() < settings.metrics.width) && (settings.solidHeight == false)){
		        	var tmp = ratio*slider.width();
			        slider.find("#slides").css("height",tmp).children().css("height",tmp);
			        
			        if(settings.animation == "slide"){
				        slider.css("height",tmp);
			        }
		        }
		        else{
					slider.find("#slides").css("height",settings.metrics.height).children().css("height",settings.metrics.height);
		        }
	        }
	        else{
	        	var tmp = slider.find("#slides #1").height();
		        slider.css("height",tmp).find("#slides").css("height",tmp);
	        }
	        initialised = true;
	        current_width = slider.width();
        }
        
        // RESIZING
        $(window).resize(function(){
        
        	// DETECT IF SLIDER NEEDS TO BE RESIZED
        	if( current_width != slider.width() ){
		        if((settings.metrics.width > 0) && (settings.metrics.height > 0)){
			        if((slider.width() < settings.metrics.width) && (settings.solidHeight == false)){
			        	var new_height = ratio*slider.width();
				        slider.find("#slides").css("height",new_height).children().css("height",new_height);
			        }
			        else{
				        slider.find("#slides").css("height",settings.metrics.height).children().css("height",settings.metrics.height);
			        }
		        }
		        else{
		        	var new_height = slider.find("#slides #1").height();
			        slider.css("height",new_height).find("#slides").css("height",new_height);
		        }
	        }
        });
        
        // SERIOUS BUSINESS ENDING HERE
        
        
        
        
        //STYLE THE INNER EFFECT ELEMENTS
        slider.find(".center").each(function(){
	        $(this).css("display:","inline-block");
        });
        slider.find(".fade").each(function(){
	        $(this).css({
	        	"opacity": 0,
	        	"margin": 0,
	        });
        });
        slider.find(".from-top").each(function(){
	        $(this).css({
	        	"opacity": 0,
	        	"margin-top": "-20px",
	        });
        });
        slider.find(".from-bottom").each(function(){
	        $(this).css({
	        	"opacity": 0,
	        	"margin-top": "20px",
	        });
        });
        slider.find(".from-left").each(function(){
	        $(this).css({
	        	"opacity": 0,
	        	"margin-left": "-30px",
	        	"margin-right": "30px",
	        });
        });
        slider.find(".from-right").each(function(){
	        $(this).css({
	        	"opacity": 0,
	        	"margin-left": "30px",
	        });
        });
        
        
        
        
        /*******************/
        /***** INSERTS *****/
        /*******************/
        
        // NAVIGATION
        if(settings.navigation == true){
	        //INSERT BULLETS
	        slider.append('<div id="bullets" />');
	        for (var i=1;i<=children_number;i++){ 
	        	if(settings.thumbnails == true){
	        		if(settings.thumb_bg == true){
		        		slider.find("#bullets").append('<div class="bullet" style="background-image:url(' + slider.find("#slides #" + i).attr('data-thumb') + ');" id="' + i + '"></div>');
	        		}
	        		else{
			        	slider.find("#bullets").append('<div class="bullet" id="' + i + '"><img src="' + slider.find("#slides #" + i).attr('data-thumb') + '" /></div>');
		        	}
	        	}
	        	else{
		        	slider.find("#bullets").append('<div class="bullet" id="' + i + '" />');
	        	}
				if(i==1){
					$('#bullets > #1').addClass("selected");
				}
			}
        
	        // INSERT ARROWS
	        slider.prepend('<div id="left" class="slider-nav" /><div id="right" class="slider-nav" />');
	        // HIDE/SHOW ARROWS
	        if(settings.hideArrows == true){
	        	slider.find(".slider-nav").css("opacity",0);
		        slider.mouseenter(function(){
		        	if(settings.aniMethod == 'jQuery'){
			        	slider.find(".slider-nav").animate({"opacity":1},200);
		        	}
		        	else if(settings.aniMethod == 'css'){
			        	var nav = slider.find(".slider-nav");
			        	nav.css({
				        	"transition": "opacity 200ms ease",
					        "opacity": 1,
			        	});
		        	}
		        });
		        slider.mouseleave(function(){
		        	if(settings.aniMethod == 'jQuery'){
			        	slider.find(".slider-nav").animate({"opacity":0},200);
		        	}
			        else if(settings.aniMethod == 'css'){
			        	var nav = slider.find(".slider-nav");
			        	nav.css({
				        	"opacity": 0,
			        	});
		        	}
		        });
	        }
        }
        
        // SOCIAL
        if(settings.facebook == true && settings.socialButtons == true){
	        slider.prepend('<div id="fb-root"></div>');
        }
        
        
        /***************************/
        /***** PUBLIC FUNCTION *****/
        /***************************/
        
        // ALL SLIDES FOR GOTO FUNCTION - IMPORTANT FOR CSS TRANSITIONEND BIND
        var slides = slider.find('#slides > *');
        
        // GO TO SLIDE
        this.goTo = function (index){
        
        	if(sliding == false){
        		sliding = true;
        
				slider.queue(function(){
				
					var last = current;
					index = parseInt(index);
					
					// IF SMALER THAN NUMBER OF CHILDREN, FADE TO NEXT ONE
					if((index <= children_number) && (index > 0) && (index != current) && (index != null) && (index != "")){
						current = index;
						
						// HIDE INNER ELEMENTS
						slider.hideInner(current);
						
						// SET BULLETS
						slider.find('#bullets > #' + last).removeClass("selected");
						slider.find('#bullets > #' + current).addClass("selected");
						// SET LAST SLIDE TO NORMAL Z INDEX
						slider.find('#slides #' + last).css("z-index",0);
						
						// GET CURRENT SLIDE IN FORGOUND AND MOVE
						switch (settings.animation) {
							//FADE
							case 'fade':
							
								var current_slide_obj = slider.find('#slides #' + current);
								var last_slide_obj = slider.find('#slides #' + last);
								
								function fade_jquery(){
									// TRANSPARANCY JQUERY ANIMATION
									if(settings.transparancy == true){
										current_slide_obj.css("z-index",5).fadeIn(settings.aniSpeed);
										last_slide_obj.css("z-index",5).fadeOut(settings.aniSpeed,function(){
											//HIDE LAST SLIDE
										    slider.showInner(current);
										    slider.hideInner(last);
										    sliding = false;
										});
									}
									// STANDARD JQUERY ANIMATION
									else{
										current_slide_obj.css("z-index",5).fadeIn(settings.aniSpeed, function(){
											//HIDE LAST SLIDE
										    last_slide_obj.css("display","none");
										    slider.showInner(current);
										    slider.hideInner(last);
										    sliding = false;
										});
									}
								}
								function fade_css(){
								
									// If transition endend as bind fires multiple times for each transition
									var transition_end = false;
									
									if(settings.transparancy == true){
										current_slide_obj.css({
											'transition': 'opacity ' + settings.aniSpeed + 'ms linear',
											"z-index": 5,
											"opacity": 1,
										});
										last_slide_obj.css({
											'transition': 'opacity ' + settings.aniSpeed + 'ms linear',
											"z-index": 5,
											"opacity": 0,
										}).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
											if(transition_end == false){
												last_slide_obj.css({
													"z-index": 0,
													'transition': '',
												});
												current_slide_obj.css({
													'transition': ''
												})
												slider.showInner(current);
											    slider.hideInner(last);
											    sliding = false;
											    transition_end = true;
										    }
										});
									}
									else{
										current_slide_obj.css({
											'transition': 'opacity ' + settings.aniSpeed + 'ms ease',
											"z-index": 5,
											"opacity": 1,
										}).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(event){
											// execute only if transition_end wasn't set
											if(transition_end == false){
												current_slide_obj.css({
													'transition': ''
												})
												last_slide_obj.css({
													'transition': '',
													"z-index": 0,
													"opacity": 0,
												});
												
												slider.showInner(current);
											    slider.hideInner(last);
											    
											    sliding = false;
											    transition_end = true;
										    }
										});
									}
								}
								
								switch (settings.aniMethod) {
									case 'jQuery':
										fade_jquery();
										break;
									case 'css':
										fade_css();
										break;
								}

								break;
								
								
							//SLIDE
							case 'slide':
								var current_slide_obj = slider.find('#slides #' + current);
								var last_slide_obj = slider.find('#slides #' + last);
								
								function slide_jquery(){
									// SLIDE DIRECTION
									switch(direction){
										//RIGHT
										case "right":
											current_slide_obj.css({"margin-left":last_slide_obj.width(),"display":"block"}).animate({
												"margin-left": 0
											},settings.aniSpeed);
											last_slide_obj.css("margin-left",0).animate({
												"margin-left": last_slide_obj.width()*(-1)
											},settings.aniSpeed,function(){
												//HIDE LAST SLIDE
											    last_slide_obj.css({"z-index":0,"display":"none"});
											    slider.showInner(current);
											    slider.hideInner(last);
											    sliding = false;
											});
											break;
											
										//LEFT
										case "left":
											current_slide_obj.css({"margin-left":last_slide_obj.width()*(-1),"display":"block"}).animate({
												"margin-left": 0
											},settings.aniSpeed);
											last_slide_obj.css("margin-left",0).animate({
												"margin-left": last_slide_obj.width()
											},settings.aniSpeed,function(){
												//HIDE LAST SLIDE
											    last_slide_obj.css({"z-index":0,"display":"none"});
											    slider.showInner(current);
											    slider.hideInner(last);
											    sliding = false;
											});
											break;
									}
								}
								function slide_css(){
								
									// If transition endend as bind fires multiple times for each transition
									var transition_end = false;
								
									// SLIDE DIRECTION
									switch(direction){
										//RIGHT
										case "right":
											
											var obj_width = last_slide_obj.width();
											
											current_slide_obj.css({
												"margin-left": obj_width,
												"display": "block",
											});
											last_slide_obj.css({
												"margin-left": 0,
												"display": "block",
											})
											
											setTimeout(function(){
												current_slide_obj.css({
													'transition': 'margin ' + settings.aniSpeed + 'ms ease-in-out',
													"margin-left": 0,
													"z-index": 10,
												});
												last_slide_obj.css({
													'transition': 'margin ' + settings.aniSpeed + 'ms ease-in-out',
													"margin-left": (obj_width * (-1)) + 'px',
												});
											}, 0);
											
											slides.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
												if(transition_end == false){
													last_slide_obj.css({
														"display":"none",
														"margin":""
													});
													current_slide_obj.css({
														"margin-left": 0,
														"transition": '',
														"display": "block",
													});
													slider.showInner(current);
												    slider.hideInner(last);
													sliding = false;
													transition_end = true;
												}
												
											});
											
											break;
											
										//LEFT
										case "left":
											
											var obj_width = last_slide_obj.width();
											
											current_slide_obj.css({
												"margin-left": (obj_width * (-1)),
												"display": "block",
											});
											last_slide_obj.css({
												"margin-left": 0,
												"display": "block",
											})
											
											setTimeout(function(){
												current_slide_obj.css({
													'transition': 'margin ' + settings.aniSpeed + 'ms ease-in-out',
													"margin-left": 0,
													"z-index": 10,
												});
												last_slide_obj.css({
													'transition': 'margin ' + settings.aniSpeed + 'ms ease-in-out',
													"margin-left": obj_width + 'px',
												});
											}, 0);
											
											slides.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
												if(transition_end == false){
													last_slide_obj.css({
														"display":"none",
														"margin":""
													});
													current_slide_obj.css({
														"margin-left": 0,
														"transition": '',
														"display": "block",
													});
													slider.showInner(current);
												    slider.hideInner(last);
													sliding = false;
													transition_end = true;
												}
												
											});
											
											break;
									}
								}
								
								switch (settings.aniMethod) {
									case 'jQuery':
										slide_jquery();
										break;
									case 'css':
										slide_css();
										break;
								}
								
								break;
								
						}
						
					}
					else{
						if(index != current){
							console.log('ERROR in goTo Function: ' + index + ' is an unvalid index. (mostSlider)');
						}
						sliding = false;
					}
				
					// STOP/CLEAR THE QUEUE
					slider.clearQueue();
				
					return slider;
				});
			}
        }
        
        // GO RIGHT
        this.next = function (){
	        var next;
        	// IF SMALLER THAN NUMBER OF CHILDREN, SET NEXT SLIDE TO +1
        	if(current<children_number){
		        next = current+1;
	        }
	        // IF HIGHER OR EQUAL TO NUMBER OF CHILDREN, SET NEXT SLIDE TO FIRST ONE (LOOP)
	        else{
		        next = 1;
	        }
	        
	        // GO TO NEXT SLIDE
	        direction = "right";
	        slider.goTo(next);
	        
	        return slider;
        }
        // GO LEFT
        this.prev = function (){
	        var next;
        	// IF CURRENT SLIDE IS 1 SET NEXT SLIDE TO LAST SLIDE (LOOP)
        	if(current<=1){
		        next = children_number;
	        }
	        // IF BIGGER THAN 1, SET NEXT SLIDE TO PREVIOUS One
	        else{
		        next = current-1;
	        }
	        
	        // GO TO NEXT SLIDE
	        direction = "left";
	        slider.goTo(next);
	        
	        return slider;
        }
        
        // SHOW INNER ELEMENTS
        this.showInner = function (slide){
        	
        	var delay = 0;
        	
        	//SET DELAY IF SBSCONTENT IS TRUE
        	if(settings.sbsContent == true){
	        	delay = settings.contentAniDelay;
        	}
        	
        	var time = 0;

			slider.find('#' + slide + ' .' + settings.contentClass).each(function() {
			
				var content_element = $(this);
				
				setTimeout( function(){
					//ANIMATING CONTENT
					
					//FADE
					if(content_element.hasClass('fade')){
						if(settings.aniMethod == 'jQuery'){
							content_element.animate({
								"opacity": 1,
							});
						}
						else if(settings.aniMethod == 'css'){
							content_element.css({
								"transition": "opacity 400ms ease-in-out",
						        "opacity": 1
					        });
						}
					}
					
					//FROM TOP
					else if(content_element.hasClass('from-top')){
						if(settings.aniMethod == 'jQuery'){
							content_element.animate({
						        "margin-top": "0px",
						        "opacity": 1
					        });
						}
						else if(settings.aniMethod == 'css'){
							setTimeout(function(){
								content_element.css({
									"transition": "margin-top 400ms ease-in-out, opacity 400ms ease-in-out",
							        "margin-top": "0px",
							        "opacity": 1
						        });
							}, 0);
				        }
					}
					
					//FROM BOTTOM
					else if(content_element.hasClass('from-bottom')){
						if(settings.aniMethod == 'jQuery'){
							content_element.animate({
						        "margin-top": "0px",
						        "opacity": 1
					        });
						}
						else if(settings.aniMethod == 'css'){
							setTimeout(function(){
								content_element.css({
									"transition": "margin-top 400ms ease-in-out, opacity 400ms ease-in-out",
							        "margin-top": "0px",
							        "opacity": 1
						        });
							}, 0);
				        }
					}
					
					//FROM LEFT
					else if(content_element.hasClass('from-left')){
						if(settings.aniMethod == 'jQuery'){
							content_element.animate({
						        "margin-right": "0px",
						        "margin-left": "0px",
						        "opacity": 1
					        });
						}
						else if(settings.aniMethod == 'css'){
							setTimeout(function(){
								content_element.css({
									"transition": "margin-left 400ms ease-in-out, margin-right 400ms ease-in-out, opacity 400ms ease-in-out",
							        "margin-left": "0px",
							        "margin-right": "0px",
							        "opacity": 1
						        });
							}, 0);
				        }
					}
					
					//FROM RIGHT
					else if(content_element.hasClass('from-right')){
						if(settings.aniMethod == 'jQuery'){
							content_element.animate({
						        "margin-left": "0px",
						        "opacity": 1
					        });
						}
						else if(settings.aniMethod == 'css'){
							setTimeout(function(){
								content_element.css({
									"transition": "margin-left 400ms ease-in-out, opacity 400ms ease-in-out",
							        "margin-left": "0px",
							        "opacity": 1
						        });
							}, 0);
				        }
					}
					
					// REMOVE TRANSITION
					/*content_element.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
						content_element.css({
							"transition": ""
						});
					});*/
					
					//END ANIMATING CONTENT
				}, time)
				time += delay;
			});
        	        
	        return slider;
        }
        // HIDE INNER ELEMENTS
        this.hideInner = function (slide){
	        slider.find('#' + slide + ' .fade').css({
	        	"opacity": 0,
	        	"margin": 0,
	        });
	        slider.find('#' + slide + ' .from-top').css({
	        	"opacity": 0,
	        	"margin-top": "-20px",
	        });
	        slider.find('#' + slide + ' .from-bottom').css({
	        	"opacity": 0,
	        	"margin-top": "20px",
	        });
	        slider.find('#' + slide + ' .from-left').css({
	        	"opacity": 0,
	        	"margin-left": "-30px",
	        	"margin-right": "30px",
	        });
	        slider.find('#' + slide + ' .from-right').css({
	        	"opacity": 0,
	        	"margin-left": "30px",
	        });
	        
	        return slider;
        }
        
        
        /****************************/
        /***** PRIVATE FUNCTION *****/
        /****************************/
        

        
        
        /**********************/
        /***** NAVIGATION *****/
        /**********************/
        
        // GO RIGHT
        slider.find("#right").click(function(){
	       	slider.next();
	       	// RESTART AUTOPLAY
	       	if(settings.autoPlay == true){
		        clearInterval(autoplay);
		        startAutoplay();
	        }
        });
        
        // GO LEFT
        slider.find("#left").click(function(){
	        slider.prev();
	        // RESTART AUTOPLAY
	        if(settings.autoPlay == true){
		        clearInterval(autoplay);
		        startAutoplay();
	        }
        });
        
        // BULLET NAVIGATION
        slider.find(".bullet").click(function(){
        	// DIRECTION
        	if($(this).attr("id") > current){
	        	direction = "right";
        	}
        	else{
	        	direction = "left";
        	}
	        slider.goTo($(this).attr("id"));
	        // RESTART AUTOPLAY
	        if(settings.autoPlay == true){
		        clearInterval(autoplay);
		        startAutoplay();
	        }
        });
        
        
        /********************/
        /***** AUTOPLAY *****/
        /********************/
        
        function startAutoplay(){
	        autoplay=setInterval(function(){
	        	slider.next()
	        },settings.pauseTime + settings.aniSpeed);
        }
        if(settings.autoPlay == true){
	        startAutoplay();
        }
        
        
        /*******************/
        /***** INITIAL *****/
        /*******************/
        
        // LOAD SOCIAL PLUGINS IF NEEDED
        if(settings.socialButtons == true){
	        getSocialPlugins();
        }
        
        // SHOW THE FIRST ELEMENT
        if(settings.aniMethod == 'jQuery'){
        	slider.find('#slides #' + current).css("display","block");
        }
        else if(settings.aniMethod == 'css'){
        	if(settings.animation == 'fade'){
		        slider.find('#slides #' + current).css({
		        	"opacity": 1,
		        	"z-index": 5,
		        });
	        }
	        else{
		        slider.find('#slides #' + current).css({
		        	"display": "block",
		        	"z-index": 10,
		        });
	        }
        }
        
        slider.find('#bullets #' + current).addClass('selected');
        slider.showInner(current);
        
        // NAVIGATE SO SLIDE IF SET IN URL
        if(settings.linkable == true){
        	
        	// GET URL PARAMETER
        	var param = getURLParameter('slider');
        	// SLIDE TO GIVEN NUMBER IF A VALID SLIDE
        	if(param > 0 && param <= children_number){
        		slider.goTo(param);
        	}
        	
        }
        
        //INITIALIZE HEIGHT WHEN IMAGES ARE LOADED AND FIRE LOAD EVENT WHEN IMAGED ARE CACHED
        var images = slider.find("img").length;
        slider.find("img").load(function(){
        	if(initialised==false){
	        	slider.init();
	        }
        }).each(function(index){
			if(this.complete && index == images-1){
				$(this).load();
			}
		});
        
        
        // RETURN
        return slider;
    };
 
}( jQuery ));

// GET URL PARA
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function getSocialPlugins(){
	// PINTEREST
	(function(d){
	  var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
	  p.type = 'text/javascript';
	  p.async = true;
	  p.src = '//assets.pinterest.com/js/pinit.js';
	  f.parentNode.insertBefore(p, f);
	}(document));
	
	// FACEBOOK
	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/de_DE/all.js#xfbml=1";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
	// TWITTER
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
}
