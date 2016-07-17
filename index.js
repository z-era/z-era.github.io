function init() {
	$("#musics li").on("click", function() {
    	$(this).find("audio")[0].play();
     	$(this).siblings().each(function() {
     		$(this).find("audio")[0].pause();
     	});
	});
}

window.onload = init;