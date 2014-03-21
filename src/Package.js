function Package(name) {
	this.name = name;
	this.__types = {};
	this.__dirty = false; // marker that dependencies need updated
}

Package.prototype.addType = function(name, manifest) {
	var types = this.__types;
	if(types[name]) {
		throw new Error('type "' + name + '" already exists');
	}
	this.__dirty = true;
	types[name] = new Type(name, manifest);
};

volcano.core.Package = Package;

volcano.__packages = {};

volcano.package = function(name, arg1, arg2) {
	var pkg = volcano.__packages[name];

	if (!pkg) {
		pkg = volcano.__packages[name] = new Package(name);
	}

	if (isString(arg1)) {
		pkg.addType(arg1, arg2);
	}

	if (isObject(arg1)) {
		forEach(arg1, function(manifest, name) {
			pkg.addType(name, manifest);
		});
	}

	return pkg;
}