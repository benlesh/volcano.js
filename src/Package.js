function Package(name, dependencies) {
    this.name = name;
    this.dependencies = dependencies || [];
    this.__types = {};
}

Package.prototype = {
    type: function (name, manifest) {
        var types = this.__types;
        if (manifest) {
            if (types[name]) {
                throw new Error('type "' + name + '" already exists');
            }
            types[name] = new Type(this, name, manifest);
        }
        return types[name];
    },
    getDependencies: function (names) {
        var pkg = this;
        return filter(map(names, function (name) {
            var parts = /^(?:(.*)\.)?([^\.]+)$/.exec(name);
            if (parts) {
                var packageName = parts[1];
                var typeName = parts[2];
                var type;
                if(!isUndefined(packageName)) {
                   type = volcano.package(packageName).type(typeName);
                } else {
                    var i = 0;
                    while(!type && i < pkg.dependencies.length) {
                        packageName = pkg.dependencies[i++];
                        type = volcano.package(packageName).type(typeName);
                    }
                    if(!type) {
                        throw new Error('type not found: ' + typeName);
                    }
                }
                return type.create();
            }
            return null;
        }), identity);
    },
    update: function () {
        var pkg = this;
        if (pkg.__dirty) {
            var allDependencies = volcano.__dependencyChain;
            forEach(pkg.__types, function (type) {
                allDependencies.add(type.fullName, type, type.dependencies);
            });

            volcano.__orderedTypes = allDependencies.prioritized();
        }
    }
};

volcano.core.Package = Package;

volcano.package = function (name, arg1) {
    var pkg = volcano.__packages[name];
    var dependencies = [];
    var argsStart = 1;

    if (!pkg) {
        if (isArray(arg1)) {
            dependencies = arg1;
            argsStart = 2;
        }

        pkg = volcano.__packages[name] = new Package(name, dependencies);

        volcano.__packageDependencyChain.add(name, pkg, dependencies);
        volcano.__dirty = true;
    }

    if (arguments.length >= argsStart) {
        var firstArg = arguments[argsStart];
        if (isString(firstArg)) {
            pkg.type(firstArg, arguments[argsStart + 1]);
        }

        if (isObject(firstArg)) {
            forEach(firstArg, function (manifest, name) {
                pkg.type(name, manifest);
            });
        }
    }

    return pkg;
};

volcano.update = function () {
    if (volcano.__dirty) {
        volcano.__orderedPackages = volcano.__packageDependencyChain.prioritized();
        forEach(volcano.__orderedPackages, function (scc) {
            var pkg = scc.value;
            pkg.update();
        });
    }
};

volcano.reset = function () {
    volcano.__packages = {};
    volcano.__packageDependencyChain = new DependencyChain();
    volcano.__dependencyChain = new DependencyChain();
    volcano.__dirty = false;
};

volcano.reset();