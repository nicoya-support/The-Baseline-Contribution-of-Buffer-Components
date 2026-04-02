// Make sure that main solvent concentration is going to make sense
function updateMainSolventConcentration(conc = 100) {
	let numberSolvents = 0;
	for (const [category, categoryvals] of Object.entries(components)) {
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			if (components[category][component].active == true && (category == "Organic Solvents" || component == "Water")) {
				numberSolvents += 1;
			}
		}
	}
	// Set main solvent concentration to 100% if it's the only solvent
	if (numberSolvents == 1) {
		let controlsFirst = $('.component:first').children('div');
		let mainSolventInput = controlsFirst.children('.concentrationinput');
		let mainSolventSlider = controlsFirst.children('.slider');
		let mainSolventOpt = controlsFirst.children('.componentselect').children('optgroup').children('option').filter(":selected");
		let mainSolventComponent = mainSolventOpt.val();
		let mainSolventCategory = mainSolventOpt.parent().attr('label');
		// Update stored concentration
		components[mainSolventCategory][mainSolventComponent].conc = conc;
		// Update main solvent slider
		mainSolventSlider.val(conc);
		// Update main solvent concentration
		mainSolventInput.val(conc);
	}
}

// Updates the concentration and corresponding controls for a component based on some constraints
function updateConc(input) {
	updateMainSolvent(input);
	
	let controls = getControls(input);
	let currComponentOpt = controls.children('.componentselect').children('optgroup').children('option').filter(":selected");
	let currComponent = currComponentOpt.val();
	
	if (currComponent !== undefined) {
		let currCategory = currComponentOpt.parent().attr('label');
		
		// See if there's another unit scale that can be set automatically if input value is larger than allowed maximum
		let currConc = $(input).val();
		let currSlider = controls.children('.slider');
		let currUnitOpt = controls.children('.unitselect').children('option').filter(":selected");
		let currUnit = currUnitOpt.val();
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
		let newConc;
		if (currConc >= currMax) {
			let potentialAlternatives = units[currUnitType].factors.toSpliced(currUnitIdx, 1).filter((val) => val > currFactor);
			let alternativeIdx = -1;
			if (potentialAlternatives.length) {
				alternativeIdx = units[currUnitType].factors.indexOf(Math.min(...potentialAlternatives));
			}
			let newMax;
			if (alternativeIdx != -1) {
				// Select alternative scale
				let unitSel = getUnitSelection(currComponent);
				unitSel.val(units[currUnitType].scales[alternativeIdx]);
				// Convert input value accordingly
				let convertedConc = currConc / units[currUnitType].factors[alternativeIdx] * units[currUnitType].factors[currUnitIdx];
				$(input).val(convertedConc.toFixed(concDigits));
				// Set maximum of range slider according to unit scale
				newMax = units[currUnitType].maxima[alternativeIdx];
				currSlider.attr('max', newMax);
				newConc = convertedConc.toFixed(concDigits);
			} else {
				newMax = currMax;
				newConc = currMax;
				$(input).val(newConc);
				warning("Maxium of allowed input concentration reached!");
			}
			currSlider.attr('max', newMax);
		} else if (currConc < 0) {
			newConc = 0;
			$(input).val(newConc);
		} else {
			newConc = currConc;
		}
		// Check if requested value is beyond solubility of component, if applicable
		let solubilityCheck = solubilityReached(currComponent, currCategory, currUnit, newConc);
		if (solubilityCheck != null) {
			newConc = parseFloat(solubilityCheck.toFixed(concDigits));
			$(input).val(solubilityCheck);
			warning("Solubility reached!");
		}
		// Set maximum of range slider according to unit scale
		currSlider.attr('max', currMax);
		// Update slider
		currSlider.val(newConc);
		// Update stored concentration
		components[currCategory][currComponent].conc = newConc;
		// Update the plot
		updatePlot();
	}
}

// Check whether an input concentration for a component is beyond its solubility, if known
function solubilityReached(currComponent, currCategory, currUnit, checkConc) {
	let solubility = null;
	categoryloop: for (const [category, categoryvals] of Object.entries(components)) {
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			if (component == currComponent) {
				if ("solubility" in components[category][component]) {
					solubility = components[category][component].solubility;
				}
				break categoryloop;
			}
		}
	}
	if (solubility != null) {
		let convertedSolubility;
		// Convert stored solubility (g/L) to current unit and scale
		
		let newUnitType, currSolScaleFactor, oldSolScaleFactor, solScaleFactor, unitTypeFactor;
		for (const [type, props] of Object.entries(units)) {
			if (props.scales.includes(currUnit)) {
				newUnitType = type;
			}
		}
		
		let molarmass = components[currCategory][currComponent].molarmass;
		let density = components[currCategory][currComponent].density;
		
		unitTypeFactor = getConcUnitTypeConversionFactor("mass", newUnitType, molarmass, density);
		currSolScaleFactor = getUnitScaleConversionFactor(currUnit); // New unit
		oldSolScaleFactor = getUnitScaleConversionFactor("mg/mL"); // Old unit
		solScaleFactor = oldSolScaleFactor / currSolScaleFactor;
		convertedSolubility = solubility * solScaleFactor * unitTypeFactor;
		
		if (checkConc > convertedSolubility) {
			return convertedSolubility;
		} else {
			return null;
		}
	} else {
		return null;
	}
}

// Required for fading warning message, e.g., informing user that maximum allowed concentration has been reached
function fadeout() {
  document.getElementById('warning').style.opacity = '0';
  document.getElementById('warning').style.transition = '1s opacity';
}

// Trigger warning message
function warning(text) {
	document.getElementById('warningtext').innerText = text;
	document.getElementById('warning').style.opacity = '1';
	document.getElementById('warning').style.transition = '';
	window.setTimeout(fadeout, 2000);
}