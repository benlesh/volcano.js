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
	if (/^[A-Z][A-Za-z0-9]+$/.test(name)) {
		return 'class';
	}

	if (/^[A-Z][A-Z0-9_]+$/.test(name)) {
		return 'const';
	}

	if (/^[a-z][A-Za-z0-9]+$/.test(name)) {
		if (isArray(manifest) || isFunction(manifest)) {
			return 'singleton';
		} else {
			return 'value';
		}
	}
}

function Type(name, manifest) {
	var nameDef = parseName(name);
	this.name = nameDef.name;
	this.dependencies = nameDef.dependencies;
	this.manifest = manifest;
	this.type = detectType(name, manifest)
}

Type.parseName = parseName;
Type.detectType = detectType;