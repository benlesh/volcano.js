function typeCheck(o, type) {
    return typeof o === type;
}

function isUndefined(o) {
    return typeCheck(o, 'undefined');
}

function isObject(o) {
    return typeCheck(o, 'object');
}

function isString(o) {
    return typeCheck(o, 'string');
}

function isNumber(o) {
    return typeCheck(o, 'number');
}

function isBoolean(o) {
    return typeCheck(o, 'boolean');
}

function isFunction(o) {
    return typeCheck(o, 'function');
}

function objectString(o) {
    return Object.prototype.toString.call(o);
}

function objectCheck(o, expected) {
    return objectString(o) === '[object ' + expected + ']';
}

function isArray(o) {
    return objectCheck(o, 'Array');
}

function isDate(o) {
    return objectCheck(o, 'Date');
}

function slice(o, start, end) {
    return [].slice.call(o, start, end);
}

function map(collection, fn) {
    var result = [];
    forEach(collection, function () {
        result.push(fn.apply(this, arguments));
    });
    return result;
}

function any(collection, fn) {
    var result = false;
    forEach(collection, function (v, i, coll, context) {
        if (fn.apply(this, arguments)) {
            result = true;
            context.stop();
        }
    });
    return result;
}

function filter(collection, fn) {
    var result = [];
    forEach(collection, function (value) {
        if (fn.apply(this, arguments)) {
            result.push(value);
        }
    });
    return result;
}

function forEach(collection, fn) {
    var loopContext = new LoopContext();
    var key, isFunc;

    if (isArray(collection)) {
        for (var i = 0; i < collection.length; i++) {
            fn(collection[i], i, collection, loopContext);
            if (loopContext.stopped()) {
                break;
            }
        }
    } else if (isObject(collection) || (isFunc = isFunction(collection))) {
        for (key in collection) {
            if (collection.hasOwnProperty(key) && (!isFunc || ['name', 'length'].indexOf(key) === -1)) {
                fn(collection[key], key, collection, loopContext);
                if (loopContext.stopped()) {
                    break;
                }
            }
        }
    }
}

function reduce(collection, fn, initialValue) {
    var reduced = initialValue || null;
    forEach(collection, function () {
        var args = slice(arguments, 0);
        args.unshift(reduced);
        reduced = fn.apply(this, args);
    });
    return reduced;
}

function concat(a, b) {
    a = a || [];
    var left = slice(a);
    var rights = slice(arguments, 1);
    forEach(rights, function (right) {
        left = left.concat(right);
    });
    return left;
}

function indexOf(collection, item) {
    var i = -1;
    forEach(collection, function (value, index, arr, context) {
        if (value === item) {
            i = index;
            context.stop();
        }
    });
    return i;
}

function identity(x) {
    return x;
}

function noop() {
}

function distinct(arr) {
    var result = [];
    forEach(arr, function (value) {
        if (indexOf(result, value) === -1) {
            result.push(value);
        }
    });
    return result;
}

function extend(a, b) {
    var deep, target, sources;

    if (isObject(a)) {
        target = a;
        sources = slice(arguments, 1);
    } else {
        deep = a;
        target = b;
        sources = slice(arguments, 2);
    }

    forEach(sources, function (source) {
        forEach(source, function (value, key) {
            if (deep && isObject(value)) {
                extend(deep, target[key], value);
            } else {
                target[key] = value;
            }
        });
    });
}

var util = {
    isUndefined: isUndefined,
    isObject: isObject,
    isFunction: isFunction,
    isArray: isArray,
    isBoolean: isBoolean,
    isDate: isDate,
    isString: isString,
    extend: extend,
    forEach: forEach,
    map: forEach,
    filter: filter,
    any: any,
    typeCheck: typeCheck,
    objectCheck: objectCheck,
    isNumber: isNumber
};

extend(volcano, {
    util: util
});
