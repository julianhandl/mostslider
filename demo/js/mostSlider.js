(function ( $ ) {
	
	//DEFINE NAME ON THE FUNCTION
    $.fn.mostSlider = function( options ) {
 
        // GET THE OPTIONS
        var settings = $.extend({
            // SET DEFAULT
            animation: "fade",
            aniSpeed: 1000,
            autoPlay: true,
            pauseTime: 3000,
            thumbnails: false,
            navigation: true,
            hideArrows: true,
            contentClass: "content",
            sbsContent: false,
		    contentAniDelay: 500
        }, options );
 
 
        /*********************/
        /***** VARIABLES *****/
        /*********************/
        
        //CACHE THE SLIDER ELEMENT
        var slider = this;
        //CACHE THE SLIDERS WIDTH
        var width = slider.width();
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


        /***************/
        /***** CSS *****/
        /***************/
        
        //LET THE SLIDER DIV FIT THE SLIDER-WRAPPER
        slider.css({"position": "relative","width": "100%","height": "100%","line-height": "0"});
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
	        		
	        		//IFRAME (NOT FULLY WORKING)
	        		if($(this).is("iframe")){
		        		$(this).css({
			        		"width": slider.find("#1").width(),
			        		"height": slider.find("#1").height()
		        		});
	        		}
	        		
	        		// OVERTHING THISSOLUTION!?!?!?!?!?
	        		$(this).find("img.bg").css({"width":"100%",
	        			 "height":"auto"});
	        		break;
	        }
        });
        //SET WRAPER FOR SLIDE ANIMATION
        if(settings.animation == "slide"){
	        slider.wrapInner('<div id="slides" style="position:absolute;width:100%;height:100%;overflow:hidden;line-height:0;" />');
        }
        else{
	        slider.wrapInner('<div id="slides" style="line-height:0;" />');
        }
        // SET SLIDER HEIGHT
        slider.css("height",slider.find("#1").height());
        $(window).resize(function(){
	        slider.css("height",slider.find("#1").height());
        });
        
        //STYLE THE INNER EFFECT ELEMENTS
        
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
        
        
        /********************/
        /***** FUNCTION *****/
        /********************/
        
        // GO TO SLIDE
        this.goTo = function (index){
			slider.queue(function(){
				var last = current;
				index = parseInt(index);
				// IF SMALER THAN NUMBER OF CHILDREN, FADE TO NEXT ONE
				if((index <= children_number) && (index > 0) && (index != current) && (index != null) && (index != "")){
					current = index;
					
					// SET BULLETS
					slider.find('#bullets > #' + last).removeClass("selected");
					slider.find('#bullets > #' + current).addClass("selected");
					// SET LAST SLIDE TO NORMAL Z INDEX
					slider.find('#slides #' + last).css("z-index",0);
					// GET CURRENT SLIDE IN FORGOUND AND MOVE
					switch (settings.animation) {
						//FADE
						case 'fade':
							slider.find('#slides #' + current).css("z-index",5).fadeIn(settings.aniSpeed,function(){
								//HIDE LAST SLIDE
							    //slider.find('#slides #' + last).css("display","none");
							    slider.showInner(current);
							    slider.hideInner(last);
							});
							break;
							
						//SLIDE DOWN
						case 'slidedown':
							slider.find('#slides #' + current).css("z-index",5).slideDown(settings.aniSpeed,function(){
								//HIDE LAST SLIDE
							    slider.find('#slides #' + last).css("display","none");
							    slider.showInner(current);
							    slider.hideInner(last);
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
				$(this).clearQueue();
				
				return slider;
			});
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

			$('#' + slide + ' .' + settings.contentClass).each(function() {
			
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
	        $('#' + slide + ' .fade').css("display","none");
	        $('#' + slide + ' .from-top').css("opacity",0);
	        $('#' + slide + ' .from-bottom').css("opacity",0);
	        $('#' + slide + ' .from-left').css("opacity",0);
	        $('#' + slide + ' .from-right').css("opacity",0);
	        
	        return slider;
        }
        
        
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
        
        
        /***********************/
        /***** PREPERATION *****/
        /***********************/
        
        // SHOW THE FIRST ELEMENT
        slider.find('#' + current).css("display","block");
        slider.showInner(current);
        
        
        // RETURN
        return slider;
    };
 
}( jQuery ));