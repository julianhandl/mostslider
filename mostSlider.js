(function ( $ ) {
	
	//DEFINE NAME ON THE FUNCTION
    $.fn.mostSlider = function( options ) {
 
        // GET THE OPTIONS
        var settings = $.extend({
            // SET DEFAULT
            animation: "fade",
            aniSpeed: 1000
        }, options );
 
        /*** VARIABLES ***/
        //CACHE THE SLIDER ELEMENT
        var slider = $(this);
        //CACHE THE SLIDERS WIDTH
        var width = slider.width();
        //CACHE THE SLIDERs CHILDREN/SLIDES
        var children = slider.children();
        //CACHE THE NUMBER OF CHILDREN/SLIDES
        var children_number = children.length;
        //CURRENT SLIDE
        var current = 1;

        /*** CSS ***/
        //LET THE SLIDER DIV FIT THE SLIDER-WRAPPER
        slider.css({"position": "relative","width": "100%","height": "100%"});
        //STYLE THE SLIDES AND SET A ID/INDEX
        slider.children().each(function(index){
        	//DIFFERENT ANIMATIONS
        	switch (settings.animation) { 
	        	//FADE, SLIDE-DOWN
	        	default: 
	        		$(this).css({"width":width,
	        			 "height":"auto",
	        			 "overflow":"hidden",
	        			 "position":"absolute",
	        			 "z-index":0,
	        			 "display":"none"}).attr("id",index+1);
	        		break;
	        }
        });
        // SHOW THE FIRST ELEMENT
        slider.find('#' + current).css("display","block");
        
        //INSERT BULLETS
        slider.append('<div id="bullets" />');
        for (var i=1;i<=children_number;i++)
		{ 
			slider.find("#bullets").append('<div class="bullet" id="' + i + '" />');
			if(i==1){
				$('#bullets > #1').addClass("selected");
			}
		}
        
        // INSERT ARROWS
        slider.prepend('<div id="slider-nav"><div id="left" /><div id="right" /></div>');
        
        // GO RIGHT
        slider.find("#right").click(function(e){
        	// START A QUEUE
	        $(this).queue(function(){
	        	//DIFFERENT ANIMATIONS
	        	switch (settings.animation) {
	        		//FADE 
	        		case 'fade': 
			        	var last = current; 
				        // IF SMALER THAN NUMBER OF CHILDREN, FADE TO NEXT ONE
				        if(current<children_number){
					        current += 1;
				        }
				        // IF HIGHER OR EQUAL TO NUMBER OF CHILDREN, SET CURRENT SLIDE TO FIRST ONE (LOOP)
				        else{
					        current = 1;
				        }
				        
				        // MOVE RIGHT
				        // SET BULLETS
				        slider.find('#bullets > #' + last).removeClass("selected");
				        slider.find('#bullets > #' + current).addClass("selected");
				        // SET LAST SLIDE TO NORMAL Z INDEX
				        slider.find('> #' + last).css("z-index",0);
				        // GET CURRENT SLIDE IN FORGOUND AND SLIDE
				        slider.find('> #' + current).css("z-index",5).fadeIn(settings.aniSpeed,function(){
				        	//HIDE LAST SLIDE
					        slider.find('> #' + last).css("display","none");
				        });
				        
				        // STOP/CLEAR THE QUEUE
				        $(this).clearQueue();
				        break;
				        
				    //SLIDE-DOWN
				    case 'slidedown':
				    	var last = current; 
				        // IF SMALER THAN NUMBER OF CHILDREN, FADE TO NEXT ONE
				        if(current<children_number){
					        current += 1;
				        }
				        // IF HIGHER OR EQUAL TO NUMBER OF CHILDREN, SET CURRENT SLIDE TO FIRST ONE (LOOP)
				        else{
					        current = 1;
				        }
				        
				        // MOVE RIGHT
				        // SET BULLETS
				        slider.find('#bullets > #' + last).removeClass("selected");
				        slider.find('#bullets > #' + current).addClass("selected");
				        // SET LAST SLIDE TO NORMAL Z INDEX
				        slider.find('> #' + last).css("z-index",0);
				        // GET CURRENT SLIDE IN FORGOUND AND SLIDE
				        slider.find('> #' + current).css("z-index",5).slideDown(settings.aniSpeed,function(){
				        	//HIDE LAST SLIDE
				        	slider.find('> #' + last).css("display","none");
				        });
				        
				        // STOP/CLEAR THE QUEUE
				        $(this).clearQueue();
				        break;
		        }
	        });
        });
        
        // GO LEFT
        slider.find("#left").click(function(e){
        	// START A QUEUE
	        $(this).queue(function(){
	        	//DIFFERENT ANIMATIONS
	        	switch (settings.animation) {
	        		//FADE 
	        		case 'fade': 
			        	var last = current; 
				        // IF SMALER THAN NUMBER OF CHILDREN, FADE TO NEXT ONE
				        if(current==1){
					        current = children_number;
				        }
				        // IF HIGHER OR EQUAL TO NUMBER OF CHILDREN, SET CURRENT SLIDE TO FIRST ONE (LOOP)
				        else{
					        current -= 1;
				        }
				        
				        // MOVE LEFT
				        // SET BULLETS
				        slider.find('#bullets > #' + last).removeClass("selected");
				        slider.find('#bullets > #' + current).addClass("selected");
				        // SET LAST SLIDE TO NORMAL Z INDEX
				        slider.find('> #' + last).css("z-index",0);
				        // GET CURRENT SLIDE IN FORGOUND AND FADE
				        slider.find('> #' + current).css("z-index",5).fadeIn(settings.aniSpeed,function(){
				        	//HIDE LAST SLIDE
					        slider.find('> #' + last).css("display","none");
				        });
				        
				        // STOP/CLEAR THE QUEUE
				        $(this).clearQueue();
				        break;
				    
				    //SLIDE-DOWN
				    case 'slidedown': 
			        	var last = current; 
				        // IF SMALER THAN NUMBER OF CHILDREN, FADE TO NEXT ONE
				        if(current==1){
					        current = children_number;
				        }
				        // IF HIGHER OR EQUAL TO NUMBER OF CHILDREN, SET CURRENT SLIDE TO FIRST ONE (LOOP)
				        else{
					        current -= 1;
				        }
				        
				        // MOVE LEFT
				        // SET BULLETS
				        slider.find('#bullets > #' + last).removeClass("selected");
				        slider.find('#bullets > #' + current).addClass("selected");
				        // SET LAST SLIDE TO NORMAL Z INDEX
				        slider.find('> #' + last).css("z-index",0);
				        // GET CURRENT SLIDE IN FORGOUND AND SLIDE
				        slider.find('> #' + current).css("z-index",5).slideDown(settings.aniSpeed,function(){
				        	//HIDE LAST SLIDE
					        slider.find('> #' + last).css("display","none");
				        });
				        
				        // STOP/CLEAR THE QUEUE
				        $(this).clearQueue();
				        break;
		        }
	        });
        });
 
    };
 
}( jQuery ));