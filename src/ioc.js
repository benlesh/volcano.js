volcano.__iocContainer__ = {};
var __iocState__ = volcano.__iocState__ = {
    dirty: true,
    chain: null
}

function parseFullName(fullName) {
    var parts = fullName.split('.');
    return {
        fullName: fullName,
        package: parts.slice(0, parts.length - 1).join('.'),
        type: parts[parts.length - 1]
    }
}

function register(iocKey, fullName) {
    volcano.__iocContainer__[iocKey] = parseFullName(fullName);
    __iocState__.dirty = true;
}

function inject() {
    if(__iocState__.dirty) {
        updateDependencies();
    }
    var iocKeys = slice(arguments, 0, arguments.length - 2);
    var fn = arguments[arguments.length - 1];
    var injections = map(iocKeys, getInjection);
    return function() {
        return fn.apply(this, injections);
    };
}

function getInjection(iocKey) {
    var resolve;
    var iocManifest = volcano.__iocContainer__[iocKey];
    var packageMember = volcano.__packages__[iocManifest.package][iocManifest.type];
    if (!iocManifest.value) {
        switch(packageMember.type) {
            case 'var':
                if(packageMember.dependencies) {
                    resolve = packageMember.dependencies.concat([init]);
                    return inject(resolve)();
                }
                return packageMember.value;
            case 'const':
                return packageMember.value;
            case 'singleton':
                if(!packageMember.value) {
                    var init = packageMember.init;
                    if(packageMember.dependencies) {
                        resolve = packageMember.dependencies.concat([init]);
                        packageMember.value = inject(resolve)();
                    } else {
                        packageMember.value = init();
                    }
                }
                return packageMember.value;
            case 'class':
                var ctor = packageMember.ctor;
                if(packageMember.dependencies) {
                    resolve = packageMember.dependencies.concat([ctor]);
                    ctor = inject(resolve);
                }
                return new ctor();
        }
    }
    return icoManifest.value;
}

function updateDependencies() {
    var dc = new DependencyChain();

    forEach(volcano.__iocContainer__, function(manifest, iocKey) {
       dc.add(iocKey, manifest, getDependencies(manifest.package, manifest.type));
    });

    dc.prioritized();
    __iocState__.chain = dc;
}

function getDependencies(package, typeName) {
    return volcano.__packages__[package][typeName].dependencies;
}

extend(volcano, {
    register: register,
    inject: inject,
    getInjection: getInjection
});