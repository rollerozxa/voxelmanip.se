
// toggle visibility of element with id `id`,
// reflecting the status in id `feedback`.
function toggleVis(id, feedback) {
	// descriptive variables yes
	var x = document.getElementById(id);
	var y = document.getElementById(feedback);

	if (x.style.display == "none") {
		x.style.display = "block";
		y.innerHTML = 'Göm';
	} else {
		x.style.display = "none";
		y.innerHTML = 'Visa';
	}
}
