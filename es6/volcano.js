import { isUndefined } from './utils'
import { Namespace } from './Namespace'

let namespaces = {};

function namespace(name, types) {
    var ns = namespaces[name];
    if(!ns) {
        ns = namespaces[name] = new Namespace(name);
    }

    if(!isUndefined(types)) {
        ns.addTypes(types);
    }
}

export var volcano = {
    namespace: namespace
};