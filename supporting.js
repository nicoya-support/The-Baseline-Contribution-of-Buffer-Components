// Get a reference to all control DIVs for a component based on a specified control
function getControls(control) {
	return $(control).parent().parent().children('div');
}

// Get index in buffer components list of specified component
function getListPos(component) {
	let currComponent;
	let counter = 0;
	let listPosition = null;
	$(".component").each(function(){
		currComponent = $(this).children('div').children('.componentselect').children('optgroup').children('option').filter(":selected").val();
		if (currComponent == component) {
			listPosition = counter;
		}
		counter += 1;
	});
	return listPosition;
}

// Checks whether a component is not the first in the list
function notFirstComponent(element) {
	let check;
	let prevComponents = $(element).parent().parent().prevAll('.component').length;
	if (prevComponents > 0) {
		check = true;
	} else {
		check = false;
	}
	return check;
}

// Get the unit drop-down menu for a specified component
function getUnitSelection(component) {
	return $('.componentselect option[value="' + component + '"]').filter(":selected").parent().parent().parent().parent().children('div').children('.unitselect');
}

// Get the concentration input for a specified component
function getConcInput(component) {
	return $('.componentselect option[value="' + component + '"]').filter(":selected").parent().parent().parent().parent().children('div').children('.concentrationinput');
}