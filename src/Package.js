function Package(name) {
	this.name = name;
	this.__types = {};
	this.__dirty = false; // marker that dependencies need updated
	this.__dependencyChain = new DependencyChain();
}

Package.prototype.type = function(name, manifest) {
	var types = this.__types;
	if(manifest) {
		if(types[name]) {
			throw new Error('type "' + name + '" already exists');
		}
		this.__dirty = true;
		var type = new Type(name, manifest);
		types[name] = type;
		this.__dependencyChain.add(name, type, type.dependencies);
	}
	return types[name];
};

// injects dependencies retrieved from this package into 
// the function and return a function to that.
// TODO: This needs to be moved to volcano global object, and 
// handle a lot more.
Package.prototype.inject = function(dependencies, fn) {
	var pkg = this;
	return function() {
		var args =  map(dependencies, function(dependencyName) {
			return pkg.instance(dependencyName);
		});
		return fn.apply(this, args);
	};
};

// creates an instance of a type in the package.
Package.prototype.instance = function(typeName) {
	var type = this.type(typeName);
	if(!type) {
		throw new Error('type ' + typeName + ' not found');
	}
	return type.create();
};

// updates dependencies in the package.
Package.prototype.update = function() {
	var pkg = this;
	if(pkg.__dirty) {
		pkg.__orderedDependencies = pkg.__dependencyChain.prioritized();

		forEach(pkg.__orderedDependencies, function(scc, index, orderedDeps) {
			var type = scc.value;
			if(type.type === 'calculatedValue') {
				type.create = function(){
					if(!type.__instance) {
						type.__instance = pkg.inject(type.dependencies, type.init)();
					}
					return type.__instance;
				};
			}
		});	
	}
};

volcano.core.Package = Package;

volcano.__packages = {};
volcano.__packageDependencyChain = new DependencyChain();
volcano.__dirty = false;

volcano.package = function(name, arg1) {
	var pkg = volcano.__packages[name];
	var dependencies = [];
	var argsStart = 1;

	if (!pkg) {
		pkg = volcano.__packages[name] = new Package(name);
		if(isArray(arg1)) {
			dependencies = arg1;
			argsStart = 2;
		}

		volcano.__packageDependencyChain.add(name, pkg, dependencies);
		volcano.__dirty = true;
	}

	if(arguments.length >= argsStart) {
		var firstArg = arguments[argsStart];
		if (isString(firstArg)) {
			pkg.type(firstArg, arguments[argsStart + 1]);
		}

		if (isObject(firstArg)) {
			forEach(firstArg, function(manifest, name) {
				pkg.type(name, manifest);
			});
		}
	}

	return pkg;
}

volcano.update = function() {
	if(volcano.__dirty) {
		volcano.__orderedDependencies = volcano.__packageDependencyChain.prioritized();
		forEach(volcano.__orderedDependencies, function(scc) {
			var pkg = scc.value;

			//TODO: stuff.
		});
	}
}