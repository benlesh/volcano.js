!function(window) {
    function LoopContext() {
        var broken = !1;
        this.break = function() {
            broken = !0;
        }, this.broken = function() {
            return broken;
        }, this.reset = function() {
            broken = !1;
        };
    }
    function typeCheck(o, type) {
        return typeof o === type;
    }
    function isUndefined(o) {
        return typeCheck(o, "undefined");
    }
    function isObject(o) {
        return typeCheck(o, "object");
    }
    function isString(o) {
        return typeCheck(o, "string");
    }
    function isBoolean(o) {
        return typeCheck(o, "boolean");
    }
    function isFunction(o) {
        return typeCheck(o, "function");
    }
    function objectString(o) {
        return Object.prototype.toString.call(o);
    }
    function objectCheck(o, expected) {
        return objectString(o) === "[object " + expected + "]";
    }
    function isArray(o) {
        return objectCheck(o, "Array");
    }
    function isDate(o) {
        return objectCheck(o, "Date");
    }
    function slice(o, start, end) {
        return [].slice.call(o, start, end);
    }
    function forEach(collection, fn) {
        var loopContext = new LoopContext();
        if (isArray(collection)) for (var i = 0; i < collection.length && (fn(collection[i], i, collection, loopContext), 
        !loopContext.broken()); i++) ; else if (isObject(collection)) {
            for (var key in collection) if (collection.hasOwnProperty(key) && (fn(collection[key], key, collection, loopContext), 
            loopContext.broken())) break;
        } else if (isFunction(collection)) for (var key in collection) if (collection.hasOwnProperty(key) && -1 === [ "name", "length" ].indexOf(key) && (fn(collection[key], key, collection, loopContext), 
        loopContext.broken())) break;
    }
    function extend(deep, target, sources) {
        isObject(deep) ? (target = deep, deep = !1, sources = slice(arguments, 1)) : sources = slice(arguments, 2), 
        forEach(sources, function(source) {
            forEach(source, function(key, value) {
                deep && isObject(value) ? extend(deep, target[key], value) : target[key] = value;
            });
        });
    }
    var volcano = {};
    window.volcano = window.$v = volcano;
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
        typeCheck: typeCheck,
        objectCheck: objectCheck
    };
    extend(volcano, {
        util: util
    });
}(window);
//# sourceMappingURL=volcano.map