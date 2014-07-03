$(document).ready(function(){
	
	// OLD BROWSERS
	var oldIE = false;
	if ($('html').is('.ie6, .ie7, .ie8')) {
        oldIE = true;
    }
    
    $("#main-trigger").click(function(){
	    $("#portal-globalnav").slideToggle(200);
    });
    
});