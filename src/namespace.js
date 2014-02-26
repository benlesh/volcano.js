var __namespaces__ = {};

var CLASS_TYPE = /^[A-Z][A-Za-z0-9]*$/;
var CONST_TYPE = /^[A-Z][A-Z0-9_]+$/;
var STATIC_TYPE = /^[a-z][A-Za-z0-9]*$/;
var FUNC_TYPE = /^\$[a-z][A-Za-z0-9]*$/;
var VALIDATE_NAMESPACE_NAME = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/;

/* ----------------------|   attrs    |-|  visibility         |-| forced   |--| shorthand  |-|  name       |-*/
var TYPE_DECLARATION = /^((\{.*\})\s*)?((private|protected)\s+)?((forced)\s+)?(\!)?([_*])?([A-Za-z0-9_$]+)$/;


function namespace(name, arg1, arg2) {
    if (!VALIDATE_NAMESPACE_NAME.test(name)) {
        throw new Error('invalid namespace name: ' + name);
    }

    var ns = __namespaces__[name] = __namespaces__[name] || new VNamespace(name);

    if (isObject(arg1)) {
        forEach(arg1, function(original, typeName) {
            ns.type(createType(typeName, original));
        });
    } else if (isString(arg1)) {
        ns.type(createType(arg1, arg2));
    }

    return ns;
}


function VNamespace(name) {
    var self = this;
    self.name = name;
    var types = {};

    self.type = function(vType) {
        debugger;
        if (vType instanceof VType) {
            types[vType.name] = vType;
            vType.namespace = self;
            return vType;
        } else if (isString(vType)) {
            return types[vType];
        }
    };
}

function VConstType(definition) {
    var self = this;
    self.type = 'constant';
    self.instance = definition;
}

function VClassType(definition) {
    var self = this;
    self.type = 'class';
    if (isArray(definition)) {
        self.ctor = last(definition);
        self.dependencies = exceptLast(definition);
    } else if (isFunction(definition)) {
        self.ctor = definition;
    }
}

function VFunctionType(definition) {
    var self = this;
    self.type = 'function';
    if (isArray(definition)) {
        self.unbound = last(definition);
        self.dependencies = exceptLast(definition);
        self.instance = null;
    } else if (isFunction(definition)) {
        self.instance = definition;
    }
}

function VStaticType(definition) {
    var self = this;
    self.type = 'static';
    self.instance = null;
    if (isArray(definition)) {
        self.initializer = last(definition);
        self.dependencies = exceptLast(definition);
    } else if (isFunction(definition)) {
        self.initializer = definition;
    } else if (isObject(definition)) {
        self.instance = definition;
    }
}

function VType(name, definition) {
    var self = this;
    self.namespace = null;
    self.declarationName = name;
    self.definition = definition;

    TYPE_DECLARATION.lastIndex = 0;
    var parts = TYPE_DECLARATION.exec(name);

    if (parts) {
        self.attrs = parts[2] && JSON.parse(parts[2]);
        self.visibility = 'public';
        self.forced = !! (parts[6] || parts[7]);
        if (parts[4] === 'private' || parts[8] === '_') {
            self.visibility = 'private';
        } else if (parts[4] === 'protected' || parts[8] === '*') {
            self.visibility = 'protected';
        }

        self.name = parts[9];
    }
}

function createType(name, definition) {
    var vType = new VType(name, definition);
    var typeName = vType.name;
    if (CONST_TYPE.test(typeName)) {
        VConstType.prototype = vType;
        return new VConstType(definition);
    } else if (CLASS_TYPE.test(typeName)) {
        VClassType.prototype = vType;
        return new VClassType(definition);
    } else if (FUNC_TYPE.test(typeName)) {
        VFunctionType.prototype = vType;
        return new VFunctionType(definition);
    } else if (STATIC_TYPE.test(self.name)) {
        VStaticType.prototype = vType;
        return new VStaticType(vType);
    }
    return vType;
}

extend(volcano, {
    __namespaces__: __namespaces__,
    namespace: namespace,
    vType: VType,
    VNamespace: VNamespace,
    VStaticType: VStaticType,
    VFunctionType: VFunctionType,
    VClassType: VClassType,
    VConstType: VConstType
});