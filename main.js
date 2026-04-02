// To-Do:
// Find a way to deal with dilutions of alternative solvents
// Fix issue with some data sets (e.g., kinks)

let focusedComponent = null; // The buffer component the drop-down menu of which was focussed most recently
let pathlength = parseFloat(document.getElementById("pathlengthsel").value); // Path length as selected by user
const pathlengthunit = document.getElementById("pathlengthunit").innerText; // Displayed unit for the path length; change in html, if a different one is desired
const selectionLabel = "---Please Select---"; // String used for pending selection of buffer component
const concDigits = 2; // Displayed precision / decimal digits for concentration values
const maxComponents = 5; // Maximum number of buffer componentes that may be added in addition to the main solvent

const coloursDef = { // Colour definitions
	"APLpurple": "rgba(158,36,123,1)",
	"APLblue": "rgba(0,90,157,1)",
	"APLstone": "rgba(171,181,146,1)",
	"APLolive": "rgba(113,144,112,1)",
	"APLdarkblue": "rgba(48,85,108,1)",
	"APLgreen": "rgba(149,192,61,1)",
	"APLred": "rgba(181,23,38,1)",
	"APLorange": "rgba(247,148,36,1)",
	"NICOcyan": "rgba(103,203,223,1)",
	"NICOyellow": "rgba(233,194,89,1)",
	"red": "rgba(255,0,0,1)",
	"orange": "rgba(255,128,0,1)",
	"green": "rgba(0,255,0,1)",
	"blue": "rgba(0,0,255,1)",
	"pink": "rgba(255,0,255,1)",
	}
const excludedColor = coloursDef["yellow"];
const colours = ["NICOcyan", "red", "orange", "green", "blue", "pink"]; // This array defines the order in which colours are being used in the list of buffer components

// Executed when document is ready
function initialise() {
	// Get component options from values.js and update html accordingly
	let componentOptions = getComponentOptions(false);
	$('.componentselect').replaceWith(componentOptions);
	// Reference divs for controls of first component
	let controlsFirst = $('div.component:first').children('div');
	// Automatically select water for first entry
	controlsFirst.children('.componentselect').val('Water');
	// Pre-set concentration to 100
	controlsFirst.children('.concentrationinput').val('100');
	// Also set corresponding slider
	controlsFirst.children('.slider').val('100');
	// Set step for input field of first entry
	controlsFirst.children('.concentrationinput').attr('step', Math.pow(10, -concDigits));
	// Set step for slider of first entry
	controlsFirst.children('.slider').attr('step', Math.pow(10, -concDigits));
	
	// Disable controls for first entry
	// Disable slider for first entry
	controlsFirst.children('.slider').prop('disabled', true);
	// Disable input field for first entry
	controlsFirst.children('.concentrationinput').attr("disabled", true);
	// Disable dropdown menu for unit scale
	controlsFirst.children('.unitselect').attr("disabled", true);
	
	// Remove onChange attribute from slider and input field (otherwise this would be called for any changes that are made via the backend)
	controlsFirst.children('.slider').removeAttr("onChange");
	controlsFirst.children('.concentrationinput').removeAttr("onChange");
	
	// Change options for first entry to limit to water and other solvents
	updateFirstComponentOptions();
	
	// Update option available in unit drop-down menus
	updateUnitOptions();
	// Update colour indicators in front of component entries that serve as a legend for the plot
	updateColourIndicators();
	// Update the plot
	updatePlot();
	
	// Set function for add button
	$('.add-btn').click(function(){
		// Clone last component entry and append it
		let clone = $('div.component:last').clone(true);
		$('.entries').append(clone);
		
		// Add button for deletion of component
		let delButtonDiv = "<div class='delbuttondiv'>\n<button class='button' onclick='onDelClick(this)'>&minus;</button>\n</div>\n"
		$('.delbuttondiv:last').replaceWith(delButtonDiv);
		
		// Reference divs for controls of last component
		let controlsLast = $('div.component:last').children('div');
		
		// Replace selection option with selection options including default select option
		let componentOptions = getComponentOptions(true);
		controlsLast.children('.componentselect').replaceWith(componentOptions);
		
		// Set defaults for new entry
		controlsLast.children('.componentselect').selectedIndex = 0;
		controlsLast.children('.concentrationinput').attr('step', Math.pow(10, -concDigits));
		controlsLast.children('.concentrationinput').val(0);
		controlsLast.children('.slider').attr('step', Math.pow(10, -concDigits));
		controlsLast.children('.slider').val('0');
		
		// Add onChange events
		controlsLast.children('.concentrationinput').attr("onChange", "onConcChange(event);");
		controlsLast.children('.slider').attr("onChange", "onSliderChange(event);");
		
		// Update
		updateComponentOptions();
		// Update option available in unit drop-down menus
		updateUnitOptions();
		updateUnselected();
		// Update colour indicators in front of component entries that serve as a legend for the plot
		updateColourIndicators();
		
		// Hide add button if max limit of components has been reached
		let numberComponents = $('.component').length
		if (numberComponents > maxComponents) {
			$('.add-btn').css("display", "none");
		}
	});
}

// Clear text selection; this is executed upon interaction with sliders to make sure it won't be accidentally attempted to drag a text selection that was created by aiming badly
function clearTextSelection() {
	if (window.getSelection) {
		if (window.getSelection().empty) { // Chrome
			window.getSelection().empty();
		} else if (window.getSelection().removeAllRanges) { // Firefox
			window.getSelection().removeAllRanges();
		}
	} else if (document.selection) { // IE
		document.selection.empty();
	}
}

// Update plot when absorbance threshold is being changed
function onAbsChange(input) {
	// Make sure that entered value is between min and max
	let inputAbsorbance = parseFloat(document.getElementById("absorbance").value);
	let minAbsorbance = document.getElementById("absorbance").min;
	let maxAbsorbance = document.getElementById("absorbance").max;
	if (inputAbsorbance < minAbsorbance) {
		document.getElementById("absorbance").value = minAbsorbance;
	} else if (inputAbsorbance > maxAbsorbance) {
		document.getElementById("absorbance").value = maxAbsorbance;
	}
	updatePlot();
}

// For any entries for which a component hasn't been selected: Disable controls, set concentration input to zero, and set unit selection to "-"
function updateUnselected() {
	let unselected = $(".componentselect option[value='select']:selected").parent();
	unselected.each(function(index, value) {
		let controls = getControls(value);
		let currUnitSelect = controls.children('.unitselect');
		let blankUnitOption = "<select class='unitselect' disabled onChange='onUnitChange(event);'>\n<option value='select'>-</option >\n</select>\n";
		currUnitSelect.replaceWith(blankUnitOption);
		currUnitSelect.attr("disabled", true);
		
		let currConcInput = controls.children('.concentrationinput');
		currConcInput.val(0);
		currConcInput.attr("disabled", true);
		
		let currSlider = controls.children('.slider');
		currSlider.attr("disabled", true);
	});
}

// Executed when delete entry button is clicked
function onDelClick(button) {
	let controls = getControls(button);
	let currComponentOpt = controls.children('.componentselect').children('optgroup').children('option').filter(":selected");
	let currComponent = currComponentOpt.val();
	let currentCategory = currComponentOpt.parent().attr('label');
	// Remove corresponding entry
	$(button).parent('div').parent('div').remove();
	// Set main solvent concentration to 100 if it's the only solvent left
	updateMainSolventConcentration();
	if (currComponent !== undefined) {
		// Deactivate deleted component
		toggleComponent(currComponent);
		// Update components list
		updateComponentOptions();
		// Set stored concentration for deleted component back to zero
		components[currentCategory][currComponent].conc = 0;
	}
	// Update the plot
	updatePlot();
	// Update colour indicators in front of component entries that serve as a legend for the plot
	updateColourIndicators();
	// Show add button
	$('.add-btn').css("display", "block");
}

function getSolventDensity() {
	let currSolventDensity, currSolventConc, totalSolventDensity = 0;
	for (const [category, categoryvals] of Object.entries(components)) {
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			if (components[category][component].active == true && (category == "Organic Solvents" || component == "Water")) {
				currSolventDensity = components[category][component].density;
				currSolventConc = getConcInput(component).val();
				totalSolventDensity += currSolventConc / 100 * currSolventDensity;
			}
		}
	}
	return totalSolventDensity;
}

// Update colours of colour indicators to follow defined order (we want to keep things simple, so users are not allowed to change colors)
function updateColourIndicators() {
	let counter = 0;
	$(".component").each(function(){
		currColourIndicator = $(this).children('div').children('.colourindicator');
		currColourIndicator.css("color", coloursDef[colours[counter]]);
		counter += 1;
	});
}

// Calculate cut-on wavelength according to specified absorbance threshold and precision
function getCutOnWL(refAbs = 2, precision = stepWL) {
	let lowerAbs, higherAbs, minAbs, maxAbs, minWL, maxWL, yVals, cutWLs;
	
	let ranges = [[startWL - 10, endWL]];
	let start, end, newRanges;

	let maxPrecision = 0.0001;
	let stepDigits = 0;
	let step = Math.pow(10, -stepDigits);
	while(step >= precision / 100 && step >= maxPrecision * 10) {
		newRanges = [];
		for (rangeIdx = 0; rangeIdx < ranges.length; rangeIdx++) {
			start = ranges[rangeIdx][0];
			end = ranges[rangeIdx][1];
			let summedYvals = [];
			let pointsNumber = Math.round((end - start) / step + 1);
			let xVals = getXvalues(start, end, step);
			for (var i = 0; i < pointsNumber; i++) {
				summedYvals.push(0);
			}
			for (const [category, categoryvals] of Object.entries(components)) {
				for (const [component, componentvals] of Object.entries(categoryvals)) {
					if (components[category][component].active == true && components[category][component].model != null) {
						yVals = getYvalues(component, start, end, step);
						// Add to summed spectrum
						summedYvals = summedYvals.map(function (num, idx) {
							return num + yVals[idx];
						});
					}
				}
			}
			
			let offsets = getCuvetteOffsets(start, end, step);
			
			// Add cuvette-specific offset to summed spectrum
			summedYvals = summedYvals.map(function (num, idx) {
				return num + offsets[idx];
			});
			
			// Find any pairs of consecutive wavelengths where absorbance values are above and below target
			// True: Absorbance value increases, False: Absrobance value decreases
			let lowerWLs = summedYvals.map((val, idx) => summedYvals[idx + 1] >= refAbs && summedYvals[idx] < refAbs ? [xVals[idx], xVals[idx + 1], true] : undefined).filter(x => x !== undefined);
			let higherWLs = summedYvals.map((val, idx) => summedYvals[idx + 1] < refAbs && summedYvals[idx] >= refAbs ? [xVals[idx], xVals[idx + 1], false] : undefined).filter(x => x !== undefined);

			// Remove rounding errors
			lowerWLs = lowerWLs.map((val, idx) => [parseFloat(val[0].toFixed(-Math.log10(step))), parseFloat(val[1].toFixed(-Math.log10(step))), val[2]]);
			higherWLs = higherWLs.map((val, idx) => [parseFloat(val[0].toFixed(-Math.log10(step))), parseFloat(val[1].toFixed(-Math.log10(step))), val[2]]);
			
			newRanges = newRanges.concat(lowerWLs.concat(higherWLs));
		}
		ranges = newRanges;
		stepDigits += 1;
		step = Math.pow(10, -stepDigits);
	}
	cutWLs = ranges.map((val, idx) => [val[0] + (val[1] - val[0]) / 2, val[2]]);
	cutWLs = cutWLs.sort((a, b) => a[0] - b[0]); // Sort by ascending wavelength
	return cutWLs;
}

// Get dynamic html for components drop-down menu based on components specified in values.js
function getComponentOptions(selectoption = true) {
	let disabledString = "";
	let options = "<select class='componentselect' onFocus='onComponentFocus(this);' onBlur='onComponentBlur(this);' onChange='onComponentChange(event);'>\n";
	if (selectoption) {
		options += "<option value='select'>" + selectionLabel + "</option >\n";
	}
	for (const [category, categoryvals] of Object.entries(components)) {
		options += "<optgroup label='" + category + "'>\n";
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			options += "<option value='" + component + "'>" + component + "</option >\n";
		}
		options += "</optgroup>\n";
	}
	options += "</select>\n";
	return options;
}

// Executed when a component drop-down menu gets focus
function onComponentFocus(element) {
	element.size = "8"; // Limit length of components drop-down menu
	element.style.zIndex = "1"; // Make sure drop-down menu is going to be on top
	element.style.height = "auto";
	// Store most recently focussed component
	if (element.value == selectionLabel) {
		focusedComponent = null
	} else {
		focusedComponent = element.value;
	}
}

// Executed when a component drop-down menu loses focus
function onComponentBlur(element) {
	element.size = "1"; // Reset length of components drop-down menu
	element.style.height = "26px"; // Reset height of drop-down menu
	element.style.zIndex = "0"; // Bring drop-down menu to back
}

// Execute when a selection is made in a component drop-down menu
function onComponentChange(event) {
	let element = event.target;
	element.blur();
	let selectedComponent = element.value;
	let controls = getControls(element);
	// Activate all input controls if previous selection was "---Please Select---"
	if (focusedComponent == "select") {
		controls.children('.slider').prop('disabled', false);
		controls.children('.concentrationinput').attr("disabled", false);
		controls.children('.unitselect').attr("disabled", false);
	}
	// Deactivate previously selected component
	if (focusedComponent != null) {
		toggleComponent(focusedComponent);
	}
	// Activate newly selected component
	toggleComponent(selectedComponent);
	// Get categories of previously and currently selected component
	let prevCategory, selectedCategory;
	for (const [category, categoryvals] of Object.entries(components)) {
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			if (component == focusedComponent) {
				prevCategory = category;
			}
			if (component == selectedComponent) {
				selectedCategory = category;
			}
		}
	}
	// Set concentration of newly selected component to zero if it's a solvent
	if (selectedCategory == "Organic Solvents" || selectedComponent == "Water") {
		// Set slider maximum to 100
		let currSlider = $(element).parent().parent().children('div').children('.slider');
		currSlider.attr('max', 100);
		if (prevCategory != "Organic Solvents" && focusedComponent != "Water") {
			components[selectedCategory][selectedComponent].conc = 0;
		}
	}
	updateComponentOptions();
	updateFirstComponentOptions();
	// Update option available in unit drop-down menus
	updateUnitOptions();
	let input = controls.children('.concentrationinput');
	updateConc(input);
	updateMainSolventConcentration();
	// Update the plot
	updatePlot();
	// Update colour indicators in front of component entries that serve as a legend for the plot
	updateColourIndicators();
	updateUnselected();
}

// Update plot if path length is changed
function onPathlengthChange() {
	pathlength = parseFloat(document.getElementById("pathlengthsel").value);
	// Update the plot
	updatePlot();
}

// Executed when a concentration slider is changed
function onSliderChange(event) {
	clearTextSelection();
	let slider = event.target;
	let controls = getControls(slider);
	let currInput = controls.children('.concentrationinput');
	let currSlider = controls.children('.slider');
	let currSliderVal = currSlider.val();
	newConc = currSliderVal;
	let currComponentOpt = controls.children('.componentselect').children('optgroup').children('option').filter(":selected");
	let currComponent = currComponentOpt.val();
	let currCategory = currComponentOpt.parent().attr('label');
	let currUnitOpt = controls.children('.unitselect').children('option').filter(":selected");
	let currUnit = currUnitOpt.val();
	// Check if requested value is beyond solubility of component, if applicable
	let solubilityCheck = solubilityReached(currComponent, currCategory, currUnit, newConc);
	if (solubilityCheck != null) {
		newConc = parseFloat(solubilityCheck.toFixed(concDigits));
		$(slider).val(newConc);
		warning("Solubility reached!");
	}
	currInput.val(newConc);
	updateMainSolvent(slider);
	// Update the plot
	updatePlot();	
}

function getCustomMax(currComponent, currCategory, currUnit) {
	let customMaxima = null;
	categoryloop: for (const [category, categoryvals] of Object.entries(components)) {
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			if (component == currComponent) {
				if ("customMaxima" in components[category][component]) {
					customMaxima = components[category][component].customMaxima;
				}
				break categoryloop;
			}
		}
	}
	let customMaximum = null;
	if (customMaxima != null) {
		maximumloop: for (const [unit, maximum] of Object.entries(customMaxima)) {
			if (unit == currUnit) {
				customMaximum = maximum;
				break maximumloop;
			}
		}
	}
	return customMaximum;
}

// Executed when a selection for a concentration unit drop-down menu is made
function onUnitChange(event) {
	let menu = event.target;
	let controls = getControls(menu);
	let currComponentOpt = controls.children('.componentselect').children('optgroup').children('option').filter(":selected");
	let currComponent = currComponentOpt.val();
	let currCategory = currComponentOpt.parent().attr('label');
	let oldUnit = components[currCategory][currComponent].unit;
	let currInput = controls.children('.concentrationinput');
	let currConc = parseFloat(currInput.val());
	let currUnit = $(menu).children('option').filter(":selected").val();
	let currUnitType = null;
	let currUnitIdx = null;
	for (const [type, props] of Object.entries(units)) {
		props.scales.forEach(function (scale, i) {
			if (scale == currUnit) {
				currUnitType = type;
				currUnitIdx = i;
			}
		});
	}
	let currMax = units[currUnitType].maxima[currUnitIdx];
	let customMax = getCustomMax(currComponent, currCategory, currUnit);
	if (customMax != null) {
		currMax = customMax;
	}
	let currFactor = units[currUnitType].factors[currUnitIdx];
	let oldConc = components[currCategory][currComponent].conc;
	let molarmass = components[currCategory][currComponent].molarmass;
	let density = components[currCategory][currComponent].density;
	let newConc = currConc;
	// Convert between molar / mass concentration if applicable
	if ($('#conversioncheckbox').is(":checked")) { // XXX Not always working correctly!
		let oldUnitType, newUnitType, currConcScaleFactor, oldConcScaleFactor, concScaleFactor, unitTypeFactor;
		for (const [type, props] of Object.entries(units)) {
			if (props.scales.includes(oldUnit)) {
				oldUnitType = type;
			}
			if (props.scales.includes(currUnit)) {
				newUnitType = type;
			}
		}
		unitTypeFactor = getConcUnitTypeConversionFactor(oldUnitType, newUnitType, molarmass, density);
		currConcScaleFactor = getUnitScaleConversionFactor(currUnit); // New unit
		oldConcScaleFactor = getUnitScaleConversionFactor(oldUnit); // Old unit
		concScaleFactor = oldConcScaleFactor / currConcScaleFactor;
		newConc = oldConc * concScaleFactor * unitTypeFactor;
	}
	// Prevent change of unit scale to result in concentration beyond allowed maximum
	if (newConc > currMax) {
		newConc = currMax;
		warning("Maximum of allowed input concentration reached!");
	}
	newConc = newConc.toFixed(concDigits);
	// Check if current value is beyond solubility of component, if applicable
	let solubilityCheck = solubilityReached(currComponent, currCategory, currUnit, newConc);
	if (solubilityCheck != null) {
		newConc = parseFloat(solubilityCheck.toFixed(concDigits));
		warning("Solubility reached!");
	}
	currInput.val(newConc);
	// Set maximum of range slider according to unit scale
	let currSlider = controls.children('.slider');
	currSlider.attr('max', currMax);
	// Update slider
	currSlider.val(newConc);
	// Update stored unit selection
	components[currCategory][currComponent].unit = currUnit;
	// Update stored concentration
	components[currCategory][currComponent].conc = newConc;
	// Update the plot
	updatePlot();
}

// Updates controls for main solvent (i.e., first value in components list) in response to changes for another solvent (i.e., maintain a sum of 100% (v/v) for all solvents)
function updateMainSolvent(element) {
	let oldConc = null;
	let controls = getControls(element);
	let controlsFirst = $('.component:first').children('div');
	let currConcInput = controls.children('.concentrationinput');
	// Get new requested element value
	let currConc = parseFloat(currConcInput.val());
	
	//  In case the adjusted component is a solvent: Check new requested solvent concentration and adjust main solvent concentration as required if possible
	let mainSolventOpt = controlsFirst.children('.componentselect').children('optgroup').children('option').filter(":selected");
	let mainSolventComponent = mainSolventOpt.val();
	let currComponentOpt = controls.children('.componentselect').children('optgroup').children('option').filter(":selected");
	let currComponent = currComponentOpt.val();
	let currCategory = currComponentOpt.parent().attr('label');
	if ((currCategory == "Organic Solvents" || currComponent == "Water") && currComponent != mainSolventComponent) { // Making sure that automatic changes to main solvent concentration don't trigger this function again, otherwise infinite loop would result
		// Get old stored value for concentration
		categoryloop: for (const [category, categoryvals] of Object.entries(components)) {
			for (const [component, componentvals] of Object.entries(categoryvals)) {
				if (component == currComponent) {
					oldConc = parseFloat(components[category][component].conc);
					break categoryloop;
				}
			}
		}
		// Get current concentration for main solvent
		let mainSolventCategory = mainSolventOpt.parent().attr('label');
		let mainSolventInput = controlsFirst.children('.concentrationinput');
		let mainSolventSlider = controlsFirst.children('.slider');
		let mainSolventConc = parseFloat(mainSolventInput.val());
		
		// Only allow change if there's still enough main solvent to replace
		let newConc, newMainSolventConc;
		if (mainSolventConc - currConc + oldConc >= 0) {
			newConc = parseFloat(currConc);
			newMainSolventConc = mainSolventConc - (currConc - oldConc);
			newMainSolventConc = parseFloat(newMainSolventConc.toFixed(concDigits));
		} else {
			// Set to possible maximum
			newConc = parseFloat(oldConc) + parseFloat(mainSolventConc);
			newConc = parseFloat(newConc.toFixed(concDigits));
			newMainSolventConc = 0;
			$(element).val(newConc);
			let elementType = $(element).prop("class");
			if (elementType == "slider") {
				currConcInput.val(newConc);
			}
		}
		// Make sure main solvent concentration can never be >100
		if (newMainSolventConc > 100) {
			newMainSolventConc = 100;
		}
		// Update main solvent slider
		mainSolventSlider.val(newMainSolventConc);
		// Update main solvent concentration
		mainSolventInput.val(newMainSolventConc);
		// Update stored concentration
		components[currCategory][currComponent].conc = newConc;
		// Adjust main solvent concentration accordingly
		components[mainSolventCategory][mainSolventComponent].conc = newMainSolventConc;
	}
}

// Executed when a concentration input changes
function onConcChange(event) {
	let input = event.target;
	updateConc(input);
}

// Update options available in the unit drop-down menus based on information for components
function updateUnitOptions() {
	let currentUnitsel, currentUnit, allowedUnits;
	for (const [category, categoryvals] of Object.entries(components)) {
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			if (components[category][component].active == true) {
				currentUnitsel = getUnitSelection(component);
				currentUnit = currentUnitsel.val();
				allowedUnits = [];
				// First, remove any existing options
				currentUnitsel.children('option').remove();
				// Now insert all allowed options
				for (const [type, props] of Object.entries(units)) {
					if (components[category][component].units.includes(type)) {
						props.scales.forEach(function (scale, i) {
							allowedUnits.push(scale);
							currentUnitsel.append($('<option>', {value: scale, text: scale}));
						});
					}
				}			
				// Keep previously selected unit if allowed for different component, too
				if (allowedUnits.includes(currentUnit)) {
					currentUnitsel.val(currentUnit);
				}
				// Set default unit if no unit had been set previously
				if ("defaultunit" in components[category][component] && currentUnit == "select") {
					currentUnitsel.val(components[category][component]["defaultunit"]);
				}
			}
		}
	}
}

// Enable / disable components in components drop-down menus based on whether they are activated or not
// E.g., components that are already in the list will be disabled to prevent duplicates
function updateComponentOptions() {
	for (const [category, categoryvals] of Object.entries(components)) {
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			if (components[category][component].active == true) {
				$(".componentselect option[value='" + component + "']").attr("disabled", true);
			} else {
				$(".componentselect option[value='" + component + "']").attr("disabled", false);
			}
		}
	}
}

// Only enable not-yet selected solvents in the component drop-down menu for the main solvent (i.e., first component list entry), i.e., disable all non-solvents or solvents that have already been selected
function updateFirstComponentOptions() {
	for (const [category, categoryvals] of Object.entries(components)) {
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			if (components[category][component].active != true && (category == "Organic Solvents" || component == "Water")) {
				$(".componentselect:first option[value='" + component + "']").attr("disabled", false);
			} else {
				$(".componentselect:first option[value='" + component + "']").attr("disabled", true);
			}
		}
	}
}

// Activate / deactivate component
function toggleComponent(target) {
	categoryloop: for (const [category, categoryvals] of Object.entries(components)) {
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			if (component == target) {
				let currState = components[category][component].active;
				components[category][component].active = !currState;
				break categoryloop;
			}
		}
	}
}