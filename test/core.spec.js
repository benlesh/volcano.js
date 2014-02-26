describe('$v.namespace', function() {
    'use strict';

    beforeEach(function() {
        //clear namespaces before each test.
        $v.__namespaces__ = {};
    });

    describe('adding types', function (){
        it('should handle meta attributes', function() {
            $v.namespace('foo.bar', {
                '{ "attr": 1, "whatever": 2 }\
                TAGGED_CONSTANT' : 'Some super awesome value I guess'
            });

            var type = $v.namespace('foo.bar').type('TAGGED_CONSTANT');
            expect(type.attrs).toEqual({ attr: 1, whatever: 2 });
            expect(type instanceof $v.VConstType).toBe(true);
            expect(type.type).toBe('constant');
            expect(type.forced).toBe(false);
            expect(type.visibility).toBe('public');
            expect(type.instance).toBe('Some super awesome value I guess');
        })
    });

    describe('constant types', function() {
        it('should properly handle default constant declarations', function() {
            $v.namespace('foo.bar', 'DEFAULT_CONST', 'badger, badger, badger');
            var type = $v.namespace('foo.bar').type('DEFAULT_CONST');
            expect(type.attrs).toEqual(undefined);
            expect(type instanceof $v.VConstType).toBe(true);
            expect(type.type).toBe('constant');
            expect(type.forced).toBe(false);
            expect(type.visibility).toBe('public');
            expect(type.instance).toBe('badger, badger, badger');
        });

        describe('shorthand', function() {
            it('should handle private constant declarations', function() {
                $v.namespace('foo.bar', '_PRIVATE_CONST', 'this is private');
                var type = $v.namespace('foo.bar').type('PRIVATE_CONST');
                expect(type.attrs).toEqual(undefined);
                expect(type instanceof $v.VConstType).toBe(true);
                expect(type.type).toBe('constant');
                expect(type.forced).toBe(false);
                expect(type.visibility).toBe('private');
                expect(type.instance).toBe('this is private');
            });

            it('should handle protected constant declarations', function() {
                $v.namespace('foo.bar', '*PROTECTED_CONST', 'this is protected');
                var type = $v.namespace('foo.bar').type('PROTECTED_CONST');
                expect(type.attrs).toEqual(undefined);
                expect(type instanceof $v.VConstType).toBe(true);
                expect(type.type).toBe('constant');
                expect(type.forced).toBe(false);
                expect(type.visibility).toBe('protected');
                expect(type.instance).toBe('this is protected');
            });

            it('should handle a forced private constant declarations', function() {
                $v.namespace('foo.bar', '!_PRIVATE_CONST', 'this is private');
                var type = $v.namespace('foo.bar').type('PRIVATE_CONST');
                expect(type.attrs).toEqual(undefined);
                expect(type instanceof $v.VConstType).toBe(true);
                expect(type.type).toBe('constant');
                expect(type.forced).toBe(true);
                expect(type.visibility).toBe('private');
                expect(type.instance).toBe('this is private');
            });

            it('should handle a forced protected constant declarations', function() {
                $v.namespace('foo.bar', '!*PROTECTED_CONST', 'this is protected');
                var type = $v.namespace('foo.bar').type('PROTECTED_CONST');
                expect(type.attrs).toEqual(undefined);
                expect(type instanceof $v.VConstType).toBe(true);
                expect(type.type).toBe('constant');
                expect(type.forced).toBe(true);
                expect(type.visibility).toBe('protected');
                expect(type.instance).toBe('this is protected');
            });
        });

        describe('long form', function() {
            it('should handle private constant declarations', function() {
                $v.namespace('foo.bar', 'private FOO_BAR', 'this is private');
                var type = $v.namespace('foo.bar').type('FOO_BAR');
                expect(type.attrs).toEqual(undefined);
                expect(type instanceof $v.VConstType).toBe(true);
                expect(type.type).toBe('constant');
                expect(type.forced).toBe(false);
                expect(type.visibility).toBe('private');
                expect(type.instance).toBe('this is private');
            });

            it('should handle protected constant declarations', function() {
                $v.namespace('foo.bar', 'protected FOO_BAR', 'this is protected');
                var type = $v.namespace('foo.bar').type('FOO_BAR');
                expect(type.attrs).toEqual(undefined);
                expect(type instanceof $v.VConstType).toBe(true);
                expect(type.type).toBe('constant');
                expect(type.forced).toBe(false);
                expect(type.visibility).toBe('protected');
                expect(type.instance).toBe('this is protected');
            });

            it('should handle forced private constant declarations', function() {
                $v.namespace('foo.bar', 'private forced FOO_BAR', 'this is private');
                var type = $v.namespace('foo.bar').type('FOO_BAR');
                expect(type.attrs).toEqual(undefined);
                expect(type instanceof $v.VConstType).toBe(true);
                expect(type.type).toBe('constant');
                expect(type.forced).toBe(true);
                expect(type.visibility).toBe('private');
                expect(type.instance).toBe('this is private');
            });

            it('should handle forced protected constant declarations', function() {
                $v.namespace('foo.bar', 'protected forced FOO_BAR', 'this is protected');
                var type = $v.namespace('foo.bar').type('FOO_BAR');
                expect(type.attrs).toEqual(undefined);
                expect(type instanceof $v.VConstType).toBe(true);
                expect(type.type).toBe('constant');
                expect(type.forced).toBe(true);
                expect(type.visibility).toBe('protected');
                expect(type.instance).toBe('this is protected');
            });
        });
    })
});