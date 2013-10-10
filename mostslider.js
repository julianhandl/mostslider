(function ( $ ) {
	
	//DEFINE NAME ON THE FUNCTION
    $.fn.mostSlider = function( options ) {
 
        // GET THE OPTIONS
        var settings = $.extend({
            // SET DEFAULT
            // ANIMATION
            animation: "fade",
            aniSpeed: 1000,
            
            // SPEED
            autoPlay: true,
            pauseTime: 3000,
            
            // METRICS
            metrics: {
            	// RATIO
	            width: 0,
	            height: 0
            },
            
            // NAVIGATION
            thumbnails: false,
            navigation: true,
            hideArrows: true,
            
            // FUNCTION
            linkable: false,
            
            // CONTENT
            transparancy: false,
            contentClass: "content",
            sbsContent: false,
		    contentAniDelay: 300,
		    
		    socialButtons: false,
		    socialUrl: "",
		    /* facebook: false, */
		    twitter: false,
		    twitterID: "",
		    pinterest: false
        }, options );
 
 
        /*********************/
        /***** VARIABLES *****/
        /*********************/
        
        //CACHE THE SLIDER ELEMENT
        var slider = this;
        //CACHE THE SLIDERS WIDTH
        var width = slider.width();
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


        /*****************/
        /***** INITS *****/
        /*****************/
        
        
        
        //LET THE SLIDER DIV FIT THE SLIDER-WRAPPER
        slider.css({"position": "relative","width": "100%","line-height": "0"});
        
        //STYLE THE SLIDES AND SET A ID/INDEX
        slider.children().each(function(index){
        
        	//DIFFERENT ANIMATIONS
        	switch (settings.animation) { 
	        	//FADE, SLIDE-DOWN
	        	default: 
	        		$(this).css({"width":"100%",
	        			 "height":"auto",
	        			 "line-height":"auto",
	        			 "position":"absolute",
	        			 "z-index":0,
	        			 "display":"none"}).attr("id",index+1);
	        		
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
	        		
	        		// MAKE BG CLASS SETABLE!?!?!?!?!?
	        		$(this).find("img.bg").css({
	        			"width":"100%",
	        			"height":"auto"
	        		});
	        		
	        		break;
	        }
        	
        	//SOCIAL BUTTONS
	        if(settings.socialButtons == true){
				// INSERT CONTAINER FOR SOCIAL BUTTONS
				$(this).prepend('<div class="social" />');
				
				// PINTEREST
				if(settings.pinterest == true && settings.socialUrl != "" && $(this).find(".pinterest").length == 1){
				
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
				
				// FACEBOOK NOT WORKING
				/* if(settings.facebook == true && settings.socialUrl != ""){
				
					var url = document.URL;
					var number = parseInt(index) + 1;
					if(url.indexOf('?') > 0){
						url = url + "&slider=" + number;
					}
					else{
						url = url + "?slider=" + number;
					}
					
					slider.prepend('<div id="fb-root"></div>');
					$(this).find(".social").prepend('<div id="facebook"><div class="fb-like" data-href="' + url + '" data-width="450" data-layout="button_count" data-show-faces="true" data-send="true"></div></div>');
				} */
				
				// TWITTER
				if(settings.twitter == true){
					
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
	        slider.wrapInner('<div id="slides" style="position:absolute;width:100%;height:100%;overflow:hidden;line-height:0;" />');
        }
        else{
	        slider.wrapInner('<div id="slides" style="line-height:0;overflow:hidden;" />');
        }
        
        
        
        // SET SLIDER HEIGHT
        // IF SET, DO NOTHING, IF NOT SET, SET TO FIRST CHILD
        function initHeight(){
	        if((settings.metrics.width > 0) && (settings.metrics.height > 0)){
		        if(slider.width() < settings.metrics.width){
		        	var tmp = ratio*slider.width();
			        slider.css("height",tmp).find("#slides").css("height",tmp).children().css("height",tmp);
		        }
		        else{
			        slider.css("height",settings.metrics.height).find("#slides").css("height",settings.metrics.height).children().css("height",settings.metrics.height);
		        }
	        }
	        else{
	        	var tmp = slider.find("#slides #1").height();
		        slider.css("height",tmp).find("#slides").css("height",tmp).css("height",tmp);
	        }
	        initialised = true;
        }
        // RESIZING
        $(window).resize(function(){
	        if((settings.metrics.width > 0) && (settings.metrics.height > 0)){
		        if(slider.width() < settings.metrics.width){
			        slider.css("height",ratio*slider.width()).find("#slides").css("height",ratio*slider.width()).children().css("height",ratio*slider.width());
		        }
		        else{
			        slider.css("height",settings.metrics.height).find("#slides").css("height",settings.metrics.height).children().css("height",settings.metrics.height);
		        }
	        }
	        else{
		        slider.css("height",slider.find("#slides #1").height()).find("#slides").css("height",slider.find("#slides #1").height());
	        }
        });
        
        
        
        
        //STYLE THE INNER EFFECT ELEMENTS
        slider.find(".center").each(function(){
	        $(this).css("display:","inline-block");
        });
        slider.find(".fade").each(function(){
	        $(this).css("display","none");
        });
        slider.find(".from-top").each(function(){
	        $(this).css({"opacity":0,"margin-top":0});
        });
        slider.find(".from-bottom").each(function(){
	        $(this).css({"opacity":0,"margin-top":0});
        });
        slider.find(".from-left").each(function(){
	        $(this).css({"opacity":0,"margin-top":0});
        });
        slider.find(".from-right").each(function(){
	        $(this).css({"opacity":0,"margin-top":0});
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
		        	slider.find("#bullets").append('<div class="bullet" id="' + i + '"><img src="' + slider.find("#slides #" + i).attr('data-thumb') + '" /></div>');
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
        	slider.find(".slider-nav").css("display","none");
	        slider.mouseenter(function(){
	        	slider.find(".slider-nav").fadeIn(200);
	        });
	        slider.mouseleave(function(){
		        slider.find(".slider-nav").fadeOut(200);
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
								if(settings.transparancy == true){
									slider.find('#slides #' + current).css("z-index",5).fadeIn(settings.aniSpeed);
									slider.find('#slides #' + last).css("z-index",5).fadeOut(settings.aniSpeed,function(){
										//HIDE LAST SLIDE
									    
									    slider.showInner(current);
									    slider.hideInner(last);
									    sliding = false;
									});
								}
								else{
									slider.find('#slides #' + current).css("z-index",5).fadeIn(settings.aniSpeed,function(){
										//HIDE LAST SLIDE
									    slider.find('#slides #' + last).css("display","none");
									    slider.showInner(current);
									    slider.hideInner(last);
									    sliding = false;
									});
								}
								break;
								
							//SLIDE DOWN
							case 'slidedown':
								slider.find('#slides #' + current).css("z-index",5).slideDown(settings.aniSpeed,function(){
									//HIDE LAST SLIDE
								    slider.find('#slides #' + last).css("display","none");
								    slider.showInner(current);
								    slider.hideInner(last);
								    sliding = false;
								});
								break;
								
							//SLIDE UP
							case 'slideup':
								slider.find('#slides #' + current).css({"z-index":5,"display":"block"});
								slider.find('#slides #' + last).css("z-index",10).slideUp(settings.aniSpeed,function(){
									//HIDE LAST SLIDE
								    slider.find('#slides #' + last).css({"z-index":0,"display":"none"});
								    slider.showInner(current);
								    slider.hideInner(last);
								    sliding = false;
								});
								break;
								
							//SLIDE
							case 'slide':
								var current_slide = slider.find('#slides #' + current);
								var last_slide = slider.find('#slides #' + last);
								
								// SLIDE DIRECTION
								switch(direction){
									//RIGHT
									case "right":
										current_slide.css({"margin-left":last_slide.width(),"display":"block"}).animate({
											"margin-left": 0
										},settings.aniSpeed);
										last_slide.css("margin-left",0).animate({
											"margin-left": last_slide.width()*(-1)
										},settings.aniSpeed,function(){
											//HIDE LAST SLIDE
										    last_slide.css({"z-index":0,"display":"none"});
										    slider.showInner(current);
										    slider.hideInner(last);
										    sliding = false;
										});
										break;
										
									//LEFT
									case "left":
										current_slide.css({"margin-left":last_slide.width()*(-1),"display":"block"}).animate({
											"margin-left": 0
										},settings.aniSpeed);
										last_slide.css("margin-left",0).animate({
											"margin-left": last_slide.width()
										},settings.aniSpeed,function(){
											//HIDE LAST SLIDE
										    last_slide.css({"z-index":0,"display":"none"});
										    slider.showInner(current);
										    slider.hideInner(last);
										    sliding = false;
										});
										break;
								}
								
								break;
								
						}
						
					}
					else{
						console.log('ERROR in goTo Function: ' + index + ' is an unvalid index. (mostSlider)');
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
						content_element.fadeIn();
					}
					
					//FROM TOP
					else if(content_element.hasClass('from-top')){
						content_element.css({"margin-top":"-20px"});
				        content_element.animate({
					        "margin-top": "0px",
					        "opacity": 1
				        });
					}
					
					//FROM BOTTOM
					else if(content_element.hasClass('from-bottom')){
						content_element.css({"margin-top":"20px"});
				        content_element.animate({
					        "margin-top": "0px",
					        "opacity": 1
				        });
					}
					
					//FROM LEFT
					else if(content_element.hasClass('from-left')){
						content_element.css({"margin-right":"30px"});
				        content_element.animate({
					        "margin-right": "0px",
					        "opacity": 1
				        });
					}
					
					//FROM RIGHT
					else if(content_element.hasClass('from-right')){
						content_element.css({"margin-left":"30px"});
				        content_element.animate({
					        "margin-left": "0px",
					        "opacity": 1
				        });
					}
					
					//END ANIMATING CONTENT
				}, time)
				time += delay;
			});
        	        
	        return slider;
        }
        // HIDE INNER ELEMENTS
        this.hideInner = function (slide){
	        slider.find('#' + slide + ' .fade').css("display","none");
	        slider.find('#' + slide + ' .from-top').css("opacity",0);
	        slider.find('#' + slide + ' .from-bottom').css("opacity",0);
	        slider.find('#' + slide + ' .from-left').css("opacity",0);
	        slider.find('#' + slide + ' .from-right').css("opacity",0);
	        
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
        
        // SHOW THE FIRST ELEMENT
        slider.find('#' + current).css("display","block");
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
        slider.find("img").load(function(){
        	if(initialised==false){
	        	initHeight();
	        }
        }).each(function(){
			if(this.complete){
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

// PINTEREST
(function(d){
  var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
  p.type = 'text/javascript';
  p.async = true;
  p.src = '//assets.pinterest.com/js/pinit.js';
  f.parentNode.insertBefore(p, f);
}(document));

// FACEBOOK
/* (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/de_DE/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); */

// TWITTER
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');