$(function() {
    
    // Table zoom scaling START
	var _zoomLevel = 100;
	var oDiv = document.getElementById("ipi-table");
	$("#zoom_in").click(function(e){
		_zoomLevel += 10;
		if (typeof oDiv.style.MozTransform == "string")
			oDiv.style.MozTransform = "scale(" + (_zoomLevel / 100) + ")";
		else if (typeof oDiv.style.zoom == "string")
			oDiv.style.zoom = _zoomLevel  + "%";
	});

	$("#zoom_out").click(function(e){
		_zoomLevel -= 10;
		if (typeof oDiv.style.MozTransform == "string")
			oDiv.style.MozTransform = "scale(" + (_zoomLevel / 100) + ")";
		else if (typeof oDiv.style.zoom == "string")
			oDiv.style.zoom = _zoomLevel  + "%";
	});
	// Table zoom scaling END

});