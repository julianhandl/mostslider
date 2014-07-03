(function ( $ ) {
 
    $.fn.textColumns = function( options ) {
 
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
        }, options );
 
        return this.each(function() {
        
	       var container = $(this);
		    var cols = container.find(".text-col");
		    var cols_number = cols.length;
		    var text = container.attr('data-text');
		    
		    
		    
		    function fill_cols(){
		    	var active_cols = cols.filter(":visible");
		    	var signs_per_col = Math.round(text.length/active_cols.length);
		    	
		    	cols.attr('data-index','');
		    	active_cols.each(function(index){
				    $(this).attr('data-index',index);
			    });
			    for(var i = 0; i < active_cols.length; i++){
			    	var col_text = '';
			    	
			    	if(i == 0){
				    	col_text = text.substring(0, getPosition(text, signs_per_col));
			    	}
			    	else{
				    	col_text = text.substring(getPosition(text, signs_per_col * (i)), getPosition(text, signs_per_col * (i+1)));
			    	}
			    	
			    	var col = container.find("[data-index='" + (i) + "']");
			    	col.html(col_text);
				    
			    }
		    }
		    function getPosition(string, start) {
		    	var next_gap = string.indexOf(' ', start)
		    	if(next_gap < 0){
			    	next_gap = text.length;
		    	}
		    	return next_gap;
		    	//return string.split(search_string, n).join(search_string).length;
			}
		    
		    fill_cols();
		    
	    });
 
    };
 
}( jQuery ));

$(".textCol").each(function(){
	    
	    
	    
    });