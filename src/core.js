var volcano = {};

function LoopContext() {
    var self = this;
    var stopped = false;

    self.stop = function () {
        stopped = true;
    };

    self.isStopped = function () {
        return stopped;
    };
}

function slice(o, start, end) {
    return [].slice.call(o, start, end);
}

function isBoolean(o) {
    return typeof o === 'boolean';
}

function objectString(o) {
    return Object.prototype.toString.call(o);
}

function isArray(o) {
    return objectString(o) === '[object Array]';
}

function isObject(o) {
    return typeof o === 'object';
}

function isFunction(o) {
    return typeof o === 'function';
}

function isString(o) {
    return typeof o === 'string';
}

function isUndefined(o) {
    return typeof o === 'undefined';
}

function forEach(o, fn) {
    if (!o) {
        return;
    }

    var loopContext = new LoopContext();

    if (isArray(o)) {
        for (var i = 0; i < o.length; i++) {
            fn(o[i], i, o, loopContext);
            if (loopContext.isStopped()) {
                break;
            }
        }
    } else if (isObject(o)) {
        for (var key in o) {
            if (o.hasOwnProperty(key)) {
                fn(o[key], key, o, loopContext);
                if (loopContext.isStopped()) {
                    break;
                }
            }
        }
    }
}

function map(o, fn) {
    if (!o || !isArray(o)) {
        return undefined;
    }

    var result = [];
    forEach(o, function (v, k, o, c) {
        result.push(fn(v, k, o, c));
    });

    return result;
}

function first(o, predicate) {
    var result;

    forEach(o, function (v, k, o, c) {
        if (predicate(v, k, o, c)) {
            result = v;
            c.stop();
        }
    });

    return result;
}

function any(o, predicate) {
    return !!first(o, predicate);
}

function extend(target) {
    var deep = false;
    var sources;

    if (isUndefined(target)) {
        target = {};
    }

    if (isBoolean(target)) {
        deep = target;
        target = src;
        sources = slice(arguments, 2);
    } else {
        sources = slice(arguments, 1);
    }

    forEach(sources, function (source) {
        forEach(source, function (value, key) {
            if (deep && isObject(value)) {
                target[key] = target[key] || {};
                extend(deep, target[key], value);
            } else {
                target[key] = value;
            }
        });
    });
}

volcano.__namespaces__ = {};

function namespace(name, arg, arg2) {
    var ns = volcano.__namespaces__[name] = volcano.__namespaces__[name] || {};
    if (arg) {
        if (isObject(arg)) {
            extend(ns, arg);
        } else if (isString(arg)) {
            ns[arg] = arg2;
        } else if (isFunction(arg)) {
            arg(ns);
        }
    }
    return ns;
}

// IOC
volcano.__iocContainer__ = {};

var __iocState__ = volcano.__iocState__ = {
    dirty: true,
    chain: null
};

function parseFullName(fullName) {
    var parts = fullName.split('.');
    return {
        fullName: fullName,
        namespace: parts.slice(0, parts.length - 1).join('.'),
        type: parts[parts.length - 1]
    };
}

function register(iocKey, fullName) {
    volcano.__iocContainer__[iocKey] = parseFullName(fullName);
    __iocState__.dirty = true;
}

function inject() {
    if(isArray(arguments[0])) {
        return inject.apply(this, arguments[0]);
    }
    if(__iocState__.dirty) {
        updateDependencies();
    }
    var iocKeys = slice(arguments, 0, arguments.length - 1);
    var fn = arguments[arguments.length - 1];
    window.console.log(iocKeys, fn);
    var injections = map(iocKeys, getInjection);
    return function() {
        return fn.apply(this, injections);
    };
}

function getInjection(iocKey) {
    var resolve;
    var iocManifest = volcano.__iocContainer__[iocKey];
    var namespaceMember = volcano.__namespaces__[iocManifest.namespace][iocManifest.type];
    if (!iocManifest.value) {
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
    return iocManifest.value;
}

function updateDependencies() {
    var dc = new DependencyChain();

    window.console.log('updateDependencies');

    forEach(volcano.__iocContainer__, function(manifest, iocKey) {
        window.console.log('ud: ', manifest, iocKey);
        dc.add(iocKey, manifest, getDependencies(manifest.namespace, manifest.type));
    });

    dc.prioritized();
    __iocState__.chain = dc;
}

function getDependencies(namespace, typeName) {
    return volcano.__namespaces__[namespace][typeName].dependencies;
}


// End IOC


function bootstrap(startup) {
    processNamespaces();
    register('$start', startup);
    var start = getInjection('$start');
    if (!isArray(start.main) && !isFunction(start.main)) {
        throw new Error(startup + ' does not have a function main()');
    }
    inject(start.main)();
}

function processNamespaces() {
    forEach(volcano.__namespaces__, function (ns, namespace) {
        forEach(ns, function (o, name, ns) {
            if (!isObject(o) || !(o instanceof NamespaceMember)) {
                var namespaceMember = new NamespaceMember(name, o);
                ns[name] = namespaceMember;
            }
        });
    });
}

var CONSTNAME_REGEXP = /^[A-Z][A-Z_0-9]?$/;
var CLASSNAME_REGEXP = /^[A-Z][A-Za-z0-9]+$/;
var SINGLETONNAME_REGEXP = /^[a-z][A-Za-z-0-9]*Singleton$/;
var VARNAME_REGEXP = /^[a-z][A-Za-z-0-9]*$/;

function NamespaceMember(name, o) {
    var self = this;
    self.name = name;
    self.original = o;

    if (CONSTNAME_REGEXP.test(name)) {
        self.type = 'const';
        self.value = o;
    } else if (CLASSNAME_REGEXP.test(name)) {
        self.type = 'class';

        if (isFunction(o)) {
            self.ctor = o;
        } else if (isArray(o)) {
            self.dependencies = o.slice(0, o.length - 2);
            self.ctor = o[o.length - 1];
        }
        if (!self.ctor) {
            throw new Error('invalid class declaration');
        }
    } else if (SINGLETONNAME_REGEXP.test(name)) {
        self.type = 'singleton';
        var x = o;
        if (isArray(o)) {
            self.dependencies = o.slice(0, o.length - 2);
            x = o[o.length - 1];
        }

        if (isFunction(x)) {
            self.init = x;
        } else if (isObject(x)) {
            self.instance = x;
        }
    } else if (VARNAME_REGEXP.test(name)) {
        self.type = 'var';

        if (isArray(o)) {
            self.dependencies = o.slice(0, o.length - 2);
            self.init = o[o.length - 1];
        } else {
            self.value = o;
        }
    } else {
        throw new Error('invalid name ' + name);
    }
}


extend(volcano, {
    extend: extend,
    forEach: forEach,
    map: map,
    first: first,
    any: any,
    isArray: isArray,
    isBoolean: isBoolean,
    isFunction: isFunction,
    isObject: isObject,
    isString: isString,
    slice: slice,
    objectString: objectString,
    namespace: namespace,
    bootstrap: bootstrap,
    register: register,
    inject: inject,
    getInjection: getInjection
});

window.volcano = window.$v = volcano;

var volcanoNamespace = namespace('volcano');