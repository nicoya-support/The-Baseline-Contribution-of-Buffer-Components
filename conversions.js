// This defines the units and their scales that may occur; must include all those appearing in values.js; individual allowed maxima for different scales are required for sliders; factors are required for correct conversions
const units = {
		"mass": {
			"scales": ["mg/mL", "μg/mL"],
			"factors": [1, 0.001],
			"maxima": [100, 100]
		},
		"molar": {
			"scales": ["M", "mM", "μM"],
			"factors": [1, 0.001, 0.000001],
			"maxima": [10, 100, 100]
		},
		"percentvolume": {
			"scales": ["% (v/v)"],
			"factors": [1],
			"maxima": [100]
		},
		"percentweight": {
			"scales": ["% (w/v)"],
			"factors": [1],
			"maxima": [100]
		}
		,
		"percentmass": {
			"scales": ["% (w/w)"],
			"factors": [1],
			"maxima": [100]
		}
}

// Get factor for conversion of concentration values based on unit and scale
function getUnitScaleConversionFactor(unit) {
	let concFactor;
	switch(unit) {
	case "M":
	concFactor = 1;
	break;
	case "mM":
	concFactor = 0.001;
	break;
	case "μM":
	concFactor = 0.000001;
	break;
	case "g/mL":
	concFactor = 1000;
	break;
	case "mg/mL":
	concFactor = 1;
	break;
	case "μg/mL":
	concFactor = 0.001;
	break;
	case "% (v/v)":
	concFactor = 1;
	break;
	case "% (w/v)":
	concFactor = 1;
	break;
	case "% (w/w)":
	concFactor = 1;
	break;
	default:
	concFactor = null;
	}
	return concFactor;
}

// Get factor for conversion of absorbance values based on path length
function getPathFactor(unit) {
	let pathFactor;
	switch(unit) {
	case "cm":
	pathFactor = 10;
	break;
	case "mm":
	pathFactor = 1;
	break;
	default:
	pathFactor = null;
	}
	return pathFactor;
}

/*
molar => mass
	c [mol/L] * MW [g/mol] = c [g/L]
molar => percentvolume
	c [mol/L] * MW [g/mol] = c [g/L]
	c [g/L] / d [g/L] = c [L/L]
	c [L/L] * 100 = c [% (v/v)]
molar => percentweight
	c [mol/L] * MW [g/mol] = c [g/L]
	c [g/L] / 10 = c [g/100mL] = c [% (w/v)]
molar => percentmass
	c [mol/L] * MW [g/mol] = c [g/L]
	c [g/L] / dW [g/L] = c [g/g]
	c [g/g] * 100 = c [% (w/w)]
*/

function getConcUnitTypeConversionFactor(fromType, toType, molarmass, density) {
	let solventDensity = getSolventDensity(); // In g/L
	let totalFactor = 1, currentFactor;
	for (const [type, props] of Object.entries(units)) {
		if (type != "mass") {
			switch (type) {
				case "molar":
				currentFactor = molarmass;
				break;
				case "percentvolume":
				currentFactor = density / 100;
				break;
				case "percentweight":
				currentFactor = 10;
				break;
				case "percentmass":
				currentFactor = solventDensity / 100;
				break;
			}
			if (fromType == type && toType != type) {
				totalFactor *= currentFactor;
			} else if (fromType != type && toType == type) {
				totalFactor /= currentFactor;
			}
		}
	}
	return totalFactor;
}