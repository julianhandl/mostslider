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
            hideArrows: true
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
        //AUTOPLAY INTERVAL
        var autoplay;


        /***************/
        /***** CSS *****/
        /***************/
        
        //LET THE SLIDER DIV FIT THE SLIDER-WRAPPER
        slider.css({"position": "relative","width": "100%","height": "100%"});
        //STYLE THE SLIDES AND SET A ID/INDEX
        slider.children().each(function(index){
        	//DIFFERENT ANIMATIONS
        	switch (settings.animation) { 
	        	//FADE, SLIDE-DOWN
	        	default: 
	        		$(this).css({"width":"100%",
	        			 "height":"auto",
	        			 "position":"absolute",
	        			 "z-index":0,
	        			 "display":"none"}).attr("id",index+1);
	        			 
	        		// OVERTHING THISSOLUTION!?!?!?!?!?
	        		$(this).find("img").css({"width":"100%",
	        			 "height":"auto"});
	        		break;
	        }
        });
        // SET SLIDER HEIGHT
        slider.css("height",slider.find("#1").height());
        $(window).resize(function(){
	        slider.css("height",slider.find("#1").height());
        });
        
        //STYLE THE INNER EFFECT ELEMENTS
        slider.find(".middle").each(function(){
	        $(this).css({"position": "absolute","top": "50%","margin": "auto","margin-top": $(this).height()/2*(-1)});
        });
        slider.find(".fade").each(function(){
	        $(this).css("display","none");
        });
        slider.find(".from-left").each(function(){
	        $(this).css("opacity",0);
        });
        slider.find(".from-right").each(function(){
	        $(this).css("opacity",0);
        });
        
        
        /*******************/
        /***** INSERTS *****/
        /*******************/
        
        //INSERT BULLETS
        slider.append('<div id="bullets" />');
        for (var i=1;i<=children_number;i++){ 
			slider.find("#bullets").append('<div class="bullet" id="' + i + '" />');
			if(i==1){
				$('#bullets > #1').addClass("selected");
			}
		}
        
        // INSERT ARROWS
        slider.prepend('<div id="slider-nav"><div id="left" /><div id="right" /></div>');
        // HIDE/SHOW ARROWS
        if(settings.hideArrows == true){
        	slider.find("#slider-nav").css("display","none");
	        slider.mouseenter(function(){
	        	slider.find("#slider-nav").fadeIn(200);
	        });
	        slider.mouseleave(function(){
		        slider.find("#slider-nav").fadeOut(200);
	        });
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
					slider.find('> #' + last).css("z-index",0);
					// GET CURRENT SLIDE IN FORGOUND AND MOVE
					switch (settings.animation) {
						//FADE
						case 'fade':
							slider.find('> #' + current).css("z-index",5).fadeIn(settings.aniSpeed,function(){
								//HIDE LAST SLIDE
							    slider.find('> #' + last).css("display","none");
							    slider.showInner(current);
							    slider.hideInner(last);
							});
							break;
							
						//SLIDE DOWN
						case 'slidedown':
							slider.find('> #' + current).css("z-index",5).slideDown(settings.aniSpeed,function(){
								//HIDE LAST SLIDE
							    slider.find('> #' + last).css("display","none");
							    slider.showInner(current);
							    slider.hideInner(last);
							});
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
	        slider.goTo(next);
	        
	        return slider;
        }
        
        // SHOW INNER ELEMENTS
        this.showInner = function (slide){
        	// FADE
	        $('#' + slide + ' .fade').fadeIn();
	        // from-Left
	        $('#' + slide + ' .from-left').each(function(){
	        	
		        $(this).css({"margin-left":"-30px"});
		        $(this).animate({
			        "margin-left": "0px",
			        "opacity": 1
		        });
	        });
	        // from-Right
	        $('#' + slide + ' .from-right').each(function(){
	        	
		        $(this).css({"margin-left":"30px"});
		        $(this).animate({
			        "margin-left": "0px",
			        "opacity": 1
		        });
	        });
	        
	        return slider;
        }
        // HIDE INNER ELEMENTS
        this.hideInner = function (slide){
	        $('#' + slide + ' .fade').css("display","none");
	        $('#' + slide + ' .from-left').css("opacity",0);
	        $('#' + slide + ' .from-light').css("opacity",0);
	        
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