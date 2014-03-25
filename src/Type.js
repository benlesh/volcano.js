var NAME_ANNOTATIONS_REGEXP;
var CLASS_NAME_REGEXP = /^[A-Z][A-Za-z0-9]+$/;
var CONST_NAME_REGEXP = /^[A-Z0-9_]+$/;
var VALUE_NAME_REGEXP = /^[a-z][A-Za-z0-9]+$/;

function parseName(name) {
	var parts = /^\s*(?:@include\((.*)\))?(.*)$/.exec(name);
	var include = parts[1];
	name = parts[2];
	return {
		name: name,
		dependencies: include
	};
}

function detectType(name, manifest) {
	if (CLASS_NAME_REGEXP.test(name)) {
		return 'class';
	}

	if (CONST_NAME_REGEXP.test(name)) {
		return 'const';
	}

	if (VALUE_NAME_REGEXP.test(name)) {
		if (isArray(manifest) || isFunction(manifest)) {
			return 'calculatedValue';
		} else {
			return 'value';
		}
	}
}

function splitManifest(manifest) {
	if(isArray(manifest)) {
		return {
			init: manifest[manifest.length - 1],
			dependencies: manifest.slice(0, manifest.length - 1)
		};
	} 
	return { init: manifest, dependencies: [] };
}

function Type(name, manifest) {
	var nameDef = parseName(name);
	this.name = nameDef.name;
	this.dependencies = nameDef.dependencies;
	this.manifest = manifest;
	var maniDef = splitManifest(manifest);
	this.init = maniDef.init;
	this.dependencies = distinct(concat(this.dependencies, maniDef.dependencies));
	this.type = detectType(name, manifest)
}


Type.parseName = parseName;
Type.detectType = detectType;