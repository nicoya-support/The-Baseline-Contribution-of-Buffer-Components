// All molecular weights ("molarmass") must be given in g/mol
// All densities ("density") and solubilities ("solubility") must be given in g/L

let cuvetteOffsets = {
	"0.01": {
		"m": -0.0000235,
		"b": 0.01841
	},
	"0.1": {
		"m": -0.000038,
		"b": 0.02271
	},
	"0.2": {
		"m": -0.0000203,
		"b": 0.01872
	},
	"0.5": {
		"m": -0.0001704,
		"b": 0.09107
	},
	"1": {
		"m": -0.0001261,
		"b": 0.07637
	},
	"2": {
		"m": -0.0001654,
		"b": 0.08744
	},
	"4": {
		"m": -0.0001995,
		"b": 0.09129
	},
	"10": {
		"m": -0.0002366,
		"b": 0.10109
	}
}

let components = {
	"Other": {
		"Water": {
			"active": true,
			"model": "Default",
			"params": {
				"expT": [0.04308, 0.089787],
				"expX0": [158.11, 92.017],
				"sigT": [0.42558, 0.057856],
				"sigX0": [172.04, 198.32]
			},
			"density": 997,
			"refconcunit": "% (v/v)",
			"refpathunit": "mm",
			"units": ["percentvolume"],
			"defaultunit": "% (v/v)",
			"conc": 0,
			"unit": null
		},
		"Ascorbic Acid": {
			"active": false,
			"model": "Default",
			"params": {
				"gaussT": [2.7546, 4.8139],
				"gaussX0": [182.33, 247.77],
				"gaussSD": [12.426, 18.227]
			},
			"solubility": 330,
			"molarmass": 176.124,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},
		"EDTA Disodium Salt": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.1074, 0.073847],
				"expX0": [249.69, 252.64],
				"sigT": [0.37886, 0.092014],
				"sigX0": [187.34, 245.79]
			},
			"molarmass": 338.225,
			"refconcunit": "M",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "M",
			"conc": 0,
			"unit": null
		},
		"Guanidine Hydrochloride": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.084587],
				"expX0": [272.34],
				"sigT": [0.37385],
				"sigX0": [190.61],
				"gaussT": [208.28, 0.0023014],
				"gaussX0": [174.58, 221.04],
				"gaussSD": [9.7972, 2.4531],
				"offset": 0.0008
			},
			"solubility": 2150,
			"molarmass": 95.54,
			"refconcunit": "M",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "M",
			"conc": 0,
			"unit": null
		},
		"Imidazole": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.12839],
				"expX0": [190.16],
				"sigT": [0.055968],
				"sigX0": [190.04],
				"gaussT": [6.0923, 3.7202, 2.9616],
				"gaussX0": [192.82, 213.87, 205.62],
				"gaussSD": [10.825, 5.5367, 4.8107],
				"offset": 0.0001637
			},
			"solubility": 633,
			"molarmass": 68.077,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},
		"Urea": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.12717, 0.00004863],
				"expX0": [232.68, 192.71],
				"sigT": [0.2187, 0.14269],
				"sigX0": [190.93, 191.22]
			},
			"solubility": 545,
			"molarmass": 60.06,
			"refconcunit": "M",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "M",
			"conc": 0,
			"unit": null
		}
		//~ "Dummy": {
			//~ "active": false,
			//~ "model": "constant",
			//~ "params": {
				//~ "constant": 0.5
			//~ },
			//~ "molarmass": 300,
			//~ "density": 0.6,
			//~ "refconcunit": "mM",
			//~ "refpathunit": "mm",
			//~ "units": ["molar", "mass", "percentvolume", "percentweight", "percentmass"],
			//~ "defaultunit": "mM",
			//~ "conc": 0,
			//~ "unit": null
		//~ }
	},
	"Organic Solvents": {
		"DMSO": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.078461],
				"expX0": [215.65],
				"sigT": [0.25073],
				"sigX0": [228.96],
				"gaussT": [45.312, 11.641],
				"gaussX0": [184.52, 208.22],
				"gaussSD": [6.397, 7.0398],
				"offset": 0.0020203
			},
			"density": 1100.4,
			"refconcunit": "% (v/v)",
			"refpathunit": "mm",
			"units": ["percentvolume"],
			"defaultunit": "% (v/v)",
			"conc": 0,
			"unit": null
		},
		"Ethanol": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.33987, 0.11255],
				"expX0": [181.58, 201.61],
				"sigT": [-0.027579, -0.066386],
				"sigX0": [183.86, 290.78],
				"offset": -0.00003847
			},
			"density": 789,
			"refconcunit": "% (v/v)",
			"refpathunit": "mm",
			"units": ["percentvolume"],
			"defaultunit": "% (v/v)",
			"conc": 0,
			"unit": null
		}
	},
	"Amino Acids": {
		"Alanine": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.099556, 0.49465, 0.13167],
				"expX0": [196.78, 157.78, 187.89],
				"sigT": [0.31813, 0.21183, 0.14053],
				"sigX0": [186.57, 198.65, 233.56],
				"offset": 0.00000797
			},
			"solubility": 167.2,
			"molarmass": 89.09,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"Arginine": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.48554, 0.27521],
				"expX0": [31.469, 205.31],
				"sigT": [0.2477, 0.21189],
				"sigX0": [198.51, 211.22],
				"gaussT": [0.22035],
				"gaussX0": [199.46],
				"gaussSD": [12.155],
				"offset": 0.00010429
			},
			"solubility": 148.7,
			"molarmass": 174.2,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"Glycine": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.10122, 0.030052, 0.33341],
				"expX0": [171.37, 302.79, 197.95],
				"sigT": [0.15042, 0.26177, 0.31189],
				"sigX0": [229.86, 195.93, 184.87],
				"offset": 0.000033525
			},
			"solubility": 249.9,
			"molarmass": 75.07,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"Histidine": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.18292, 0.26911, 0.026985],
				"expX0": [181.76, 200, 230.16],
				"sigT": [0.55198, 1.3898, 0.41955],
				"sigX0": [185.54, 149.99, 226.52],
				"gaussT": [1.0129, 1.3217],
				"gaussX0": [214.18, 203.89],
				"gaussSD": [5.7377, 7.569],
				"offset": 0.00016855
			},
			"solubility": 45.6,
			"molarmass": 155.1546,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"Proline": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.22334, 0.036374, 0.0000000008153],
				"expX0": [186.33, 291.62, 215.48],
				"sigT": [0.20458, 0.31323, 0.46829],
				"sigX0": [237.78, 208.12, 200.08],
				"offset": 0.000050728
			},
			"solubility": 162,
			"molarmass": 115.13,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},		
		"Sodium Glutamate": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.074797, 0.23868],
				"expX0": [247.44, 226.26],
				"sigT": [0.11945, 0.4283],
				"sigX0": [216.24, 188.67],
				"offset": 0.014851
			},
			"solubility": 100,
			"molarmass": 169.111,
			"refconcunit": "M",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		}
	},
	"Buffers": {
		"Acetate Buffer": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.063864, 0.078929],
				"expX0": [271.57, 227.79],
				"sigT": [0.29143, 0.18231],
				"sigX0": [184.91, 229.29],
				"offset": 0.0025681
			},
			"customMaxima": {
				"M": 0.2
			},
			"refconcunit": "M",
			"refpathunit": "mm",
			"units": ["molar"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"Citrate Buffer": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.078383, -0.61442, 9.4238, 0.13594],
				"expX0": [266.79, 219.7, 210.34, 242.3],
				"sigT": [0.28998, 9.3196, 0.13406, 0.20126],
				"sigX0": [187.57, 210.25, 213.93, 241.44],
				"offset": 0.0052856
			},
			"customMaxima": {
				"M": 0.2
			},
			"refconcunit": "M",
			"refpathunit": "mm",
			"units": ["molar"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"HEPES": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.70699, 0.10307],
				"expX0": [120.01, 155.7],
				"sigT": [0, 1.0206],
				"sigX0": [225.77, 249.21],
				"gaussT": [0.57304],
				"gaussX0": [174.41],
				"gaussSD": [15.574]
			},
			"customMaxima": {
				"M": 0.2
			},
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"MES": {
			"active": false,
			"model": "Default",
			"params": {
				"gaussT": [0.3674, 0.16472],
				"gaussX0": [106.1, 177.11],
				"gaussSD": [32.543, 13.322]
			},
			"customMaxima": {
				"M": 0.2
			},
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"PBS (1x)": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.40273],
				"expX0": [185.21],
				"sigT": [3.1999],
				"sigX0": [222.25]
			},
			"refconcunit": "% (v/v)",
			"refpathunit": "mm",
			"units": ["percentvolume"],
			"defaultunit": "% (v/v)",
			"conc": 0,
			"unit": null
		},
		"Potassium Phosphate Buffer": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.58626, 0.66787, 0.65356, 0.20082],
				"expX0": [154.45, 210, 148.29, 194.64],
				"sigT": [0.56504, 0.26236, 0.80855, 1.7512],
				"sigX0": [210.12, 198.6, 177.38, 250.16],
				"offset": 0.001946
			},
			"customMaxima": {
				"M": 0.2
			},
			"refconcunit": "M",
			"refpathunit": "mm",
			"units": ["molar"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"Sodium Phosphate Buffer": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [1.005, 0.22778],
				"expX0": [155.38, 181.01],
				"sigT": [0.15074, 0.15143],
				"sigX0": [199.89, 197.48]
			},
			"customMaxima": {
				"M": 0.2
			},
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"Tris Buffer": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [18.711, 0.52872, 0.13037],
				"expX0": [174.75, 187.76, 203.75],
				"sigT": [0.28916, 0.22678, 0.16083],
				"sigX0": [195.5, 205.07, 182.12]
			},
			"customMaxima": {
				"M": 0.2
			},
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		}
	},
	"Salts": {
		"Calcium Chloride": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.18231, 0.51237, 0.01, 0.30269],
				"expX0": [181.96, 191.18, 218.8, 116.5],
				"sigT": [0.3313, 3.0406, 2.0962, 18.721],
				"sigX0": [190.39, 233.59, 167.08, 205.15],
				"gaussT": [0.00025149],
				"gaussX0": [181.14],
				"gaussSD": [20.537],
				"offset": 0.000022837
			},
			"solubility": 745,
			"molarmass": 110.98,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"Magnesium Chloride": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.11228],
				"expX0": [186.9],
				"sigT": [0.29214],
				"sigX0": [185.84]
			},
			"solubility": 543,
			"molarmass": 95.211,
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"Magnesium Sulfate": {
			"active": false,
			"model": "Default",
			"params": {
				"gaussT": [0.030675],
				"gaussX0": [177.41, 175],
				"gaussSD": [7.3581, 8]
			},
			"solubility": 351,
			"density": 2660,
			"molarmass": 120.366,
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"Sodium Chloride": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0],
				"expX0": [189.94],
				"sigT": [0.39187],
				"sigX0": [183.32]
			},
			"solubility": 360,
			"density": 2170,
			"molarmass": 58.443,
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		},
		"Potassium Chloride": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.11863],
				"expX0": [179.41],
				"sigT": [0.31583],
				"sigX0": [187.03]
			},
			"solubility": 277.7,
			"molarmass": 74.5513,
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mM",
			"conc": 0,
			"unit": null
		}
	},
	"Sugars and Polyols": {
		"α-Cyclodextrin": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.22217, 0.035733],
				"expX0": [170.09, 0],
				"sigT": [0.30889, 2.1927],
				"sigX0": [190.67, 280.02],
				"gaussT": [0.00090807],
				"gaussX0": [182.22],
				"gaussSD": [19.679],
				"offset": 0.00038174
			},
			"solubility": 216,
			"molarmass": 182.17,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},
		"β-Cyclodextrin": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.076199, 0.39703],
				"expX0": [159.09, 0.0000000000012501],
				"sigT": [0.244, 2.1927],
				"sigX0": [180.13, 280.02],
				"gaussT": [0.0016414],
				"gaussX0": [192.02],
				"gaussSD": [17.753],
				"offset": 0.00056943
			},
			"solubility": 216,
			"molarmass": 182.17,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},
		"Dextran": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.12529],
				"expX0": [185.79],
				"sigT": [0.2257],
				"sigX0": [182.6],
				"gaussT": [0.0082817, 0.0055613],
				"gaussX0": [192.46, 281.41],
				"gaussSD": [21.918, 36.29],
			},
			"customMaxima": {
				"% (w/v)": 50
			},
			"refconcunit": "% (w/v)",
			"refpathunit": "mm",
			"units": ["percentweight"],
			"defaultunit": "% (w/v)",
			"conc": 0,
			"unit": null
		},
		"Glucose": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.10013],
				"expX0": [152.31],
				"sigT": [0.25004],
				"sigX0": [184.19]
			},
			"solubility": 909,
			"density": 1540,
			"molarmass": 180.156,
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},
		"Maltodextrin": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.22452],
				"expX0": [187.34],
				"sigT": [0.0039521],
				"sigX0": [104.84],
				"gaussT": [0.010126, 0.0055118],
				"gaussX0": [210.46, 252.68],
				"gaussSD": [9.8884, 35.539]
			},
			"customMaxima": {
				"% (w/v)": 50
			},			
			"refconcunit": "% (w/v)",
			"refpathunit": "mm",
			"units": ["percentweight"],
			"defaultunit": "% (w/v)",
			"conc": 0,
			"unit": null
		},		
		"Mannitol": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [1.2817, 0.38001],
				"expX0": [172.45, 188.09],
				"sigT": [0.23488, 0.00000019717],
				"sigX0": [193.58, 199.99],
				"gaussT": [0.000034242],
				"gaussX0": [234.11],
				"gaussSD": [15.848]
			},
			"solubility": 216,
			"molarmass": 182.17,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},
		"Sorbitol": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.18457],
				"expX0": [166.96],
				"sigT": [0.20622],
				"sigX0": [194.55],
				"offset": 0.000029094
			},
			"solubility": 2350,
			"molarmass": 182.17,
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},
		"Sucrose": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.072796],
				"expX0": [147.97],
				"sigT": [0.26656],
				"sigX0": [184.19],
				"offset": 0.000006
			},
			"solubility": 2010,
			"molarmass": 342.3,
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar", "mass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},
		"Trehalose": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.048329],
				"expX0": [132.56],
				"sigT": [0.30848],
				"sigX0": [180.51],
				"offset": 0.000005
			},
			"solubility": 689,
			"density": 1580,
			"molarmass": 342.3,
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar", "mass", "percentvolume", "percentweight", "percentmass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		}
	},
	"Surfactants": {
		"CHAPS": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.96615, 2.4251, 0.090805, 0.095192],
				"expX0": [169.99, 178.42, 184.4, 180.85],
				"sigT": [0.000001, 0.22456, 0.12495, 0.15367],
				"sigX0": [170.02, 180.6, 193.15, 225.05],
				"gaussT": [0.4778],
				"gaussX0": [192.2],
				"gaussSD": [7.132],
				"offset": 0.00000064482
			},
			"molarmass": 614.88,
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar", "mass", "percentvolume", "percentweight", "percentmass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},
		"Polysorbate 20": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.040802, 0.21613],
				"expX0": [98.556, 190.88],
				"sigT": [0.090516, 0.28179],
				"sigX0": [209.57, 186.39],
				"gaussT": [0.0042087],
				"gaussX0": [217.85],
				"gaussSD": [10.915],
				"offset": 0.0010793
			},
			"density": 110,
			"molarmass": 1.22754,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass", "percentvolume", "percentweight", "percentmass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},	
		"Polysorbate 80": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.064624],
				"expX0": [185.22],
				"sigT": [0.16106],
				"sigX0": [196.74],
				"gaussT": [0.26723, 0.18256, 0.13439],
				"gaussX0": [192.85, 226.07, 239.77],
				"gaussSD": [6.9755, 11.52, 8.0947],
			},
			"density": 106,
			"molarmass": 1.310,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass", "percentvolume", "percentweight", "percentmass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},	
		"Sodium Deoxycholate": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.099973, 0.38277, 0.091823, 0.010367],
				"expX0": [160, 169.92, 180.05, 189.92],
				"sigT": [0.77876, 0, 0.045763, 0.34],
				"sigX0": [160, 169.67, 185.2, 185.21]
			},
			"solubility": 330,
			"molarmass": 414.55,
			"refconcunit": "mM",
			"refpathunit": "mm",
			"units": ["molar", "mass", "percentweight", "percentmass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},	
		"Sodium Dodecyl Sulfate": {
			"active": false,
			"model": "Default",
			"params": {
				"expT": [0.017104],
				"expX0": [222.14],
				"sigT": [0.1856],
				"sigX0": [153.67],
				"gaussT": [0.00062027, 0.00024733],
				"gaussX0": [196.98, 207.51],
				"gaussSD": [5.6319, 17.287],
				"offset": 0.00010923
			},
			"solubility": 150,
			"molarmass": 288.38,
			"refconcunit": "mg/mL",
			"refpathunit": "mm",
			"units": ["molar", "mass", "percentweight", "percentmass"],
			"defaultunit": "mg/mL",
			"conc": 0,
			"unit": null
		},
		"Triton X-100": {
			"active": false,
			"model": "Default",
			"params": {
				"gaussT": [80.806, 18.079, 0.8509],
				"gaussX0": [193.63, 224.72, 269.2],
				"gaussSD": [6.5557, 5.7645, 12.061]
			},
			"customMaxima": {
				"% (w/v)": 10
			},			
			"refconcunit": "% (w/v)",
			"refpathunit": "mm",
			"units": ["percentweight"],
			"defaultunit": "% (w/v)",
			"conc": 0,
			"unit": null
		}
	}
}