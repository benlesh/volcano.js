volcano.__iocContainer__ = {};
var __iocState__ = volcano.__iocState__ = {
    dirty: true,
    chain: null
}

function register(iocKey, fullName) {
    var parts = fullName.split('.');
    volcano.__iocContainer__[icoKey] = {
        fullName: fullName,
        namespace: parts.slice(0, parts.length - 2).join('.'),
        type: parts[parts.length - 1]
    };
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
    var namespaceMember, resolve;
    var iocManifest = volcano.__iocContainer__[icoKey];
    if (!iocManifest.value) {
        namespaceMember = volcano.__namespaces__[iocManifest.namespace][icoManifest.type];
        switch(namespaceMember.type) {
            case 'var':
                if(namespaceMember.dependencies) {
                    resolve = namespaceMember.dependencies.concat([init]);
                    return inject(resolve)();
                }
                return namespaceMember.value;
            case 'const':
                return namespaceMember.value;
            case 'singleton':
                if(!namespaceMember.value) {
                    var init = namespaceMember.init;
                    if(namespaceMember.dependencies) {
                        resolve = namespaceMember.dependencies.concat([init]);
                        namespaceMember.value = inject(resolve)();
                    } else {
                        namespaceMember.value = init();
                    }
                }
                return namespaceMember.value;
            case 'class':
                var ctor = namespaceMember.ctor;
                if(namespaceMember.dependencies) {
                    resolve = namespaceMember.dependencies.concat([ctor]);
                    ctor = inject(resolve);
                }
                return new ctor();
        }
    }
    return icoManifest.value;
}

function updateDependencies() {
    var dc = new DependencyChain();

    forEach(__iocContainer__, function(manifest, iocKey) {
       dc.add(iocKey, manifest, getDependencies(manifest.namespace, manifest.type));
    });

    dc.prioritized();
    __iocState__.chain = dc;
}

function getDependencies(namespace, typeName) {
    return volcano.__namespaces__[namespace][typeName].dependencies;
}

extend(volcano, {
    register: register,
    inject: inject,
    getInjection: getInjection
});