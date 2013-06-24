(function ( $ ) {
	
	//DEFINE NAME ON THE FUNCTION
    $.fn.mostSlider = function( options ) {
 
        // GET THE OPTIONS
        var settings = $.extend({
            // SET DEFAULT
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
	        $(this).css({"width":width,
	        			 "height":"auto",
	        			 "overflow":"hidden",
	        			 "position":"absolute",
	        			 "display":"none"}).attr("id",index+1);
        });
        // SHOW THE FIRST ELEMENT
        slider.find('#' + current).css("display","block");
        
        // INSERT ARROWS
        slider.prepend('<div class="slider-nav"><div id="left" /><div id="right" /></div>');
        
        // GO RIGHT
        slider.find("#right").click(function(e){
        	// START A QUEUE
	        $(this).queue(function(){
	        	// FADE OUT THE CURRENT SLIDE
		        slider.find('#' + current).fadeOut(settings.aniSpeed);
		        // IF SMALER THAN NUMBER OF CHILDREN, FADE TO NEXT ONE
		        if(current<children_number){
			        current += 1;
		        }
		        // IF HIGHER OR EQUAL TO NUMBER OF CHILDREN, SET CURRENT SLIDE TO FIRST ONE (LOOP)
		        else{
			        current = 1;
		        }
		        // FADE IN THE NEXT SLIDE
		        slider.find('#' + current).fadeIn(settings.aniSpeed);
		        // STOP/CLEAR THE QUEUE
		        $(this).clearQueue();
	        });
        });
        
        // GO LEFT
        slider.find("#left").click(function(e){
        	// START A QUEUE
	        $(this).queue(function(){
	        	// FADE OUT THE CURRENT SLIDE
		        slider.find('#' + current).fadeOut(settings.aniSpeed);
		        // IF FIRST SLIDE, THEN GO TO LAST SLIDE (LOOP)
		        if(current==1){
			        current = children_number;
		        }
		        // IF NOT FIRST SLIDE, SET CURRENT SLIDE TO PREVIOUS ONE
		        else{
			        current -= 1;
		        }
		        // FADE IN THE NEXT SLIDE
		        slider.find('#' + current).fadeIn(settings.aniSpeed);
		        // STOP/CLEAR THE QUEUE
		        $(this).clearQueue();
	        });
        });
 
    };
 
}( jQuery ));