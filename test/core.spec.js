describe('$v.namespace', function () {

    beforeEach(function (){
        //clear namespaces before each test.
        $v.__namespaces__ = {};
    });

    describe('$v.namespace(str)', function () {
        describe('and no namespace already exists', function () {
            var ns;

            beforeEach(function () {
                ns = $v.namespace('namespace1');
            });

            it('should return an empty namespace', function () {
                expect(ns).toEqual({});
            });

            it('should be able to retrieve the namespace', function () {
                expect($v.namespace('namespace1')).toBe(ns);
            });
        });

        describe('when a namespace already exists', function () {
            beforeEach(function () {
                $v.namespace('ns1', { FOO: 'bar' });
                $v.namespace('ns1', {});
            });

            it('should not overwrite the existing namespace', function () {
                expect($v.namespace('ns1')).toEqual({ FOO: 'bar' });
            });
        });
    });

    describe('$v.namespace(str, obj)', function () {
        describe(' when the namespace does not exist yet', function () {
            var ns;

            beforeEach(function () {
                ns = $v.namespace('namespace1', { FOO: 'bar' });
            });

            it('should create a new namespace', function () {
                expect(ns).toEqual({ FOO: 'bar' });
            });
        });

        describe('when a namespace already exists', function () {
            beforeEach(function () {
                $v.namespace('ns1', { FOO: 'bar' });
                $v.namespace('ns1', { FIZZ: 'buzz' });
            });

            it('should extend the existing namespace', function () {
                expect($v.namespace('ns1')).toEqual({ FOO: 'bar', FIZZ: 'buzz' });
            });
        })
    });

    describe('$v.namespace(str, "FOO", 123)', function () {
        var ns;

        beforeEach(function () {
            ns = $v.namespace('ns1', 'FOO', 123);
        });

        it('should add the value 123 as FOO to the namespace', function () {
            expect(ns.FOO).toBe(123);
        });
    });

    describe('$v.namespace(str, fn)', function () {
        var spy, ns;

        beforeEach(function () {
            spy = jasmine.createSpy('argument function');
            ns = $v.namespace('ns1', spy);
        });

        it('shoutoBeld pass the namespace to the function', function () {
            expect(spy).toHaveBeenCalledWith($v.namespace('ns1'));
        })
    });
});
