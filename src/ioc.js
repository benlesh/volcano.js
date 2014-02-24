namespace('volcano', function(ns) {
    ns.iocSingleton = function() {
        return {
            register: register,
            inject: inject,
            getInjection: getInjection
        };
    };

    register('ioc', 'volcano.ioc');
});