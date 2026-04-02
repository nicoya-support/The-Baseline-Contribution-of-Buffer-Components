let xValues; // X-Values for plot
let Models = {}; // Holds functions for different data models (as defined below), to generate absorbance spectra from parameters 
const startWL = 180; // Starting wavelength for the plot
const endWL = 260; // Ending wavelength for the plot
const stepWL = 1; // Wavelength step / resolution for the plot
const maxAbs = 2.5; // Maximum of y-axis for absorbance
const sumColor = 'rgba(33,43,56,1)';
Chart.defaults.font.family = "Inter";

// Chart.js plot object
var absorbanceplot = new Chart("absorbanceplot", {
	type: "line",
	data: {
		labels: xValues,
		datasets: [{}]
	},
	options: {
		animation: false,
		plugins: {
			legend: {
				display: false
			},
			tooltip: {
				enabled: false
			}
		},
		scales: {
			x: {	type: 'linear',
				title : {
					display: true,
					text: 'Wavelength (nm)',
					color: sumColor
				},
				min: startWL,
				max: endWL,
				ticks: {
					stepSize: 10,
					color: sumColor
				},
				grid: {
					color: 'rgba(0,0,0,0.1)'
				},
				border: {
					color: sumColor
				}
			},
			y: {
				title : {
					display: true,
					text: 'Absorbance (A.U.)',
					color: sumColor
				},
				min: 0,
				max: maxAbs,
				ticks: {
					color: sumColor
				},
				grid: {
					color: 'rgba(0,0,0,0.1)'
				},
				border: {
					color: sumColor
				}
			}
		}
	}
});

// Update plot
function updatePlot() {
	let currRefAbs = $('.absorbanceinput').val();
	cutWLs = getCutOnWL(currRefAbs, 0.0001);
	
	// Update numerical display of wavelength ranges within which absorbance is beyond threshold
	let cutonWLtext = "";
	let start, end, ranges = [];
	for (i = 0; i < cutWLs.length; i++) {
		if (cutWLs[i][1] == false) {
			if (i == 0) {
				start = "";
				end = "<" + cutWLs[i][0].toFixed();
			} else {
				start = cutWLs[i - 1][0].toFixed() + "-";
				end = cutWLs[i][0].toFixed();
			}
			ranges.push(start + end);
		} else if (cutWLs[i][1] == true && i == cutWLs.length - 1) {
			start = ">" + cutWLs[i][0].toFixed();
			end = "";
			ranges.push(start + end);
		}
	}
	cutonWLtext = ranges.join(", ");
	if (!cutWLs.length) {
		cutonWLtext = "<" + endWL;
	}
	$("#excludedWLs").text(cutonWLtext);
	
	// Sum up contributions by all buffer components to get total absorbance spectrum
	let summedYvals = [];
	let pointsNumber = (endWL - startWL) / stepWL + 1;
	for (var i = 0; i < pointsNumber; i++) {
		summedYvals.push(0);
	}
	let yVals, newData = {}, newDataSets = [];
	newData.labels = getXvalues(startWL, endWL, stepWL);
	let colourIdx = 0;
	
	let offsets = getCuvetteOffsets();
	
	for (const [category, categoryvals] of Object.entries(components)) {
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			if (components[category][component].active == true && components[category][component].model != null) {
				yVals = getYvalues(component);
				// Add to summed spectrum
				summedYvals = summedYvals.map(function (num, idx) {
					return num + yVals[idx];
				});
				// Add cuvette-specific offset to yVals
				yVals = yVals.map(function (num, idx) {
					return num + offsets[idx];
				});
				newDataSets.push({
					fill: false,
					pointRadius: 0,
					borderColor: coloursDef[colours[getListPos(component)]],
					borderWidth: 1,
					data: yVals
				});
				colourIdx += 1;
			}
		}
	}
	
	// Add cuvette-specific offset to summed spectrum
	summedYvals = summedYvals.map(function (num, idx) {
		return num + offsets[idx];
	});
	// Add summed spectrum to datasets
	newDataSets.push({
		fill: false,
		pointRadius: 0,
		borderColor: "rgba(0,0,0,1)",
		borderWidth: 1,
		data: summedYvals
	});

	// Show horizontal line(s) for any wavelength intervals where absorbance is above threshold
	for (i = 0; i < cutWLs.length; i++) {
		if (cutWLs[i][1] == false) {
			if (i == 0) {
				start = startWL;
			} else {
				start = cutWLs[i - 1][0];
			}
			end = cutWLs[i][0];
		} else if (cutWLs[i][1] == true && i == cutWLs.length - 1) {
			start = cutWLs[i][0];
			end = endWL;
		} else {
			start = null;
			end = null;
		}
		if (start != null && end != null) {
			// Add horizontal line
			newDataSets.push({
				fill: false,
				pointRadius: 0,
				borderColor: excludedColor,
				borderDash: [6,3],
				borderWidth: 1,
				data: [{x: start, y: currRefAbs}, {x: end, y: currRefAbs}]
			});
		}
	}
	
	// Show a vertical line for each cutWL
	for (i = 0; i < cutWLs.length; i++) {
		if (cutWLs[i][0] > startWL && cutWLs[i][0] < endWL) {
			// Add vertical line
			newDataSets.push({
				fill: false,
				pointRadius: 0,
				borderColor: excludedColor,
				borderDash: [6,3],
				borderWidth: 1,
				data: [{x: cutWLs[i][0], y: 0}, {x: cutWLs[i][0], y: currRefAbs}]
			});
		}
	}
	
	newData.datasets = newDataSets;
	absorbanceplot.data = newData;
	absorbanceplot.update();
}

// Generate x-values from specified parameters
function getXvalues(start, end, step) {
	let xVals = [];
	let currValue;
	let pointsNumber = (end - start) / step + 1;
	for (var i = 0; i < pointsNumber; i++) {
		currValue = start + i * step;
		xVals.push(currValue);
	}
	return xVals;
}

// Calculate cuvette-specific offset originating from reflections at air/silica interfaces
function getCuvetteOffsets(start = startWL, end = endWL, step = stepWL) {
	let m = 0, b = 0;
	// Get x-values
	let xVals = getXvalues(start, end, step);
	for (const [key, params] of Object.entries(cuvetteOffsets)) {
		if (key == pathlength) {
			m = params.m;
			b = params.b;
		}
	}
	let offsets = [];
	xVals.forEach((xVal, idx) => offsets.push(m * xVal + b));
	return offsets;
}

// Get absorbance y-values for specified input component across the specified wavelength range based on information in values.js
function getYvalues(componentIn, start = startWL, end = endWL, step = stepWL) {
	let factor = 1, concFactor, selScaleFactor, selPathFactor, refScaleFactor, selConc, selUnit, refConcUnit, refPathUnit, model, params, molarmass, density, yVals = null;
	// Get x-values
	let xVals = getXvalues(start, end, step);
	// Get component-specific information, including data model etc.
	categoryloop: for (const [category, categoryvals] of Object.entries(components)) {
		for (const [component, componentvals] of Object.entries(categoryvals)) {
			if (componentIn == component) {
				model = components[category][component].model;
				params = components[category][component].params;
				molarmass = components[category][component].molarmass;
				density = components[category][component].density;
				refConcUnit = components[category][component].refconcunit;
				refPathUnit = components[category][component].refpathunit;
				break categoryloop;
			}
		}
	}
	if (model != null && Object.keys(params).length !== 0) {
		// Get y-values and offset values according to specified model based on normalised path length and concentration
		yVals = Models[model](xVals, params);
		// Get concentration factor
		selUnit = getUnitSelection(componentIn).val(); // Selected concentration unit
		selConc = getConcInput(componentIn).val(); // Input concentration value
		if (selConc == "") {	
			selConc = 0;
		}
		
		// Determine factor for conversion between mass concentration and molar concentration based on molecular weight etc.
		let selUnitType, refUnitType, unitScaleFactor = 1, unitTypeFactor = 1;
		for (const [type, props] of Object.entries(units)) {
			if (props.scales.includes(selUnit)) {
				selUnitType = type;
			}
			if (props.scales.includes(refConcUnit)) {
				refUnitType = type;
			}
		}
		
		unitTypeFactor = getConcUnitTypeConversionFactor(refUnitType, selUnitType, molarmass, density);
		unitTypeFactor = 1 / unitTypeFactor;
		
		selScaleFactor = getUnitScaleConversionFactor(selUnit); // Selected unit
		refScaleFactor = getUnitScaleConversionFactor(refConcUnit); // Reference unit
		unitScaleFactor = selScaleFactor / refScaleFactor;
		
		selPathFactor = getPathFactor(pathlengthunit); // Displayed path length unit (in html)
		refPathFactor = getPathFactor(refPathUnit); // Reference path length unit (should be mm)
		pathFactor = selPathFactor / refPathFactor;
		
		// Scale y-values according to selected path length and unit and add offset, if applicable
		yVals.forEach(function (y, i) {
			// All values are expected to be normalised to a reference path length of 1 mm, a reference concentration of 1, and the unit specified for each component
			yVals[i] = y * pathlength * pathFactor * selConc * unitScaleFactor * unitTypeFactor;
		});
	}
	return yVals;
}

// Data model yielding consant signal for testing purposes
Models.constant = function(xVals, params) {
	let yVals = [], offsetVals = [], offset;
	xVals.forEach(function (x, i) {
		yVals.push(params["constant"]);
	});
	return yVals;
}

// Default data model with up to 4 exponential functions weighted by corresponding sigmoidal functions, up to 4 gaussian functions, and an optional overall offset
Models.Default = function(xVals, params) {
	let yVals = Array(xVals.length).fill(0);
	let currExp, currSig, currGauss, currY;
	
	if ("expT" in params && "expX0" in params) {
		xVals.forEach(function (x, xIdx) {
			for (let i = 0; i < params["expT"].length; i++) {
				currExp = Math.exp(-params["expT"][i]*(x - params["expX0"][i]));
				if ("sigT" in params && "sigX0" in params) {
					currSig = 1 - 1/(1 + Math.exp(-params["sigT"][i]*(x - params["sigX0"][i])));
					if (i > 0) {
						currSig *= 1 / (1 + Math.exp(-params["sigT"][i - 1]*(x - params["sigX0"][i - 1])));
					}
				} else {
					currSig = 1;
				}
				currY = currExp * currSig;
				yVals[xIdx] += currY;
			}
		});
	}
	if ("gaussT" in params && "gaussX0" in params && "gaussSD" in params) {
		xVals.forEach(function (x, xIdx) {
			for (let i = 0; i < params["gaussT"].length; i++) {
				currGauss = 1 / (params["gaussSD"][i] * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * Math.pow((x - params["gaussX0"][i]) / params["gaussSD"][i], 2)) * Math.sqrt(2 * Math.PI) * params["gaussSD"][i] * params["gaussT"][i];
				currY = currGauss;
				yVals[xIdx] += currY;
			}
		});
	}
	if ("offset" in params) {
		xVals.forEach(function (x, xIdx) {
			currY = params["offset"];
			yVals[xIdx] += currY;
		});
	}
	return yVals;
}

// Data model with 3 exponential functions weighted by corresponding sigmoidal functions, and an overall sigmoidal function that adds a general weighting
//~ Models.Exp3Sig3Total = function(xVals, params) {
	//~ let yVals = [], y, exp1, exp2, exp3, sig1, sig2, sig3, sigTotal;
	//~ xVals.forEach(function (x, i) {
		//~ exp1 = Math.exp(-params["expT"][0]*(x - params["expX0"][0]));
		//~ sig1 = 1 - 1/(1 + Math.exp(-params["sigT"][0]*(x - params["sigX0"][0])));
		//~ exp2 = Math.exp(-params["expT"][1]*(x - params["expX0"][1]));
		//~ sig2 = 1/(1 + Math.exp(-params["sigT"][0]*(x - params["sigX0"][0]))) * (1 - 1/(1 + Math.exp(-params["sigT"][1]*(x - params["sigX0"][1]))));
		//~ exp3 = Math.exp(-params["expT"][2]*(x - params["expX0"][2]));
		//~ sig3 = 1/(1 + Math.exp(-params["sigT"][1]*(x - params["sigX0"][1])));
		//~ sigTotal = 1 - 1/(1 + Math.exp(-params["sigT"][2]*(x - params["sigX0"][2])));
		//~ y = (exp1 * sig1 + exp2 * sig2 + exp3 * sig3) * sigTotal;
		//~ yVals.push(y);
	//~ });
	//~ return yVals;
//~ }