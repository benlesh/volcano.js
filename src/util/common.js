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

function forEach(collection, fn) {
	var loopContext = new LoopContext();

	if (isArray(collection)) {
		for (var i = 0; i < collection.length; i++) {
			fn(collection[i], i, collection, loopContext);
			if (loopContext.broken()) {
				break;
			}
		}
	} else if (isObject(collection)) {
		for (var key in collection) {
			if (collection.hasOwnProperty(key)) {
				fn(collection[key], key, collection, loopContext);
				if (loopContext.broken()) {
					break;
				}
			}
		}
	} else if (isFunction(collection)) {
		for (var key in collection) {
			if (collection.hasOwnProperty(key) && ['name', 'length'].indexOf(key) === -1) {
				fn(collection[key], key, collection, loopContext);
				if (loopContext.broken()) {
					break;
				}
			}
		}
	}
}

function extend(deep, target, source) {
	if (isObject(deep)) {
		target = deep;
		deep = false;
		sources = slice(arguments, 1);
	} else {
		sources = slice(arguments, 2);
	}

	forEach(sources, function(source) {
		forEach(source, function(key, value) {
			if (deep && isObject(value)) {
				extend(deep, target[key], value);
			} else {
				target[key] = value;
			}
		})
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
	typeCheck: typeCheck,
	objectCheck: objectCheck
};

extend(volcano, {
	util: util
});