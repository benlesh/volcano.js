var NAME_ANNOTATIONS_REGEXP = /^\s*(?:@include\((.*)\))?(.*)$/;
var CLASS_NAME_REGEXP = /^[A-Z][A-Za-z0-9]+$/;
var CONST_NAME_REGEXP = /^[A-Z0-9_]+$/;
var VALUE_NAME_REGEXP = /^[a-z][A-Za-z0-9]+$/;

function parseName(name) {
    NAME_ANNOTATIONS_REGEXP.lastIndex = 0;
	var parts = NAME_ANNOTATIONS_REGEXP.exec(name);
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

    return undefined;
}

var construct = function(ctor, args) {
    var outputType = ctor.bind.apply(ctor, [null].concat(args));
    return new outputType();
};

var create = {
    'class': function createClass(type) {
        var deps = type.package.getDependencies(type.dependencies);
        return construct(type.init, deps);
    },
    'const': function createConst(type) {
        if(!type.value) {
            type.value = type.init;
        }
        return type.value; //TODO: return a copy.
    },
    'calculatedValue': function createCalculatedValue(type) {
        var deps = type.package.getDependencies(type.dependencies);
        if(!type.value) {
            type.value = type.init.apply(this, deps);
        }
        return type.value;
    },
    'value': function createValue(type){
        if(!type.value) {
            type.value = type.init;
        }
        return type.value;
    }
};

function splitManifest(manifest) {
	if(isArray(manifest)) {
		return {
			init: manifest[manifest.length - 1],
			dependencies: manifest.slice(0, manifest.length - 1)
		};
	} 
	return { init: manifest, dependencies: [] };
}

function Type(package, name, manifest) {
    var self = this;
    self.package = package;
    self.fullName = package.name + '.' + name;
    self.manifest = manifest;
    var nameDef = parseName(name);
	self.name = nameDef.name;
	var maniDef = splitManifest(manifest);
	self.init = maniDef.init;
	self.dependencies = distinct(concat(nameDef.dependencies, maniDef.dependencies));
	self.type = detectType(name, manifest);
    self.create = function(){
        return create[self.type](self);
    };
}


Type.parseName = parseName;
Type.detectType = detectType;