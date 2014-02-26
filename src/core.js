var volcano = {};

var noop = function() {}

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

function last(arr) {
    return arr[arr.length - 1];
}

function exceptLast(arr) {
    return arr.slice(0, arr.length - 1);
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

window.volcano = window.$v = volcano;