describe('basic dependency injection and declaration tests', function () {

    var calls, mainCtrl, otherThing;

    beforeEach(function () {
        calls = [];

        $v.package('mainPackage', ['subPackage'], {
            MainCtrl: ['testService', 'blahService', function (testService, blahService) {
                calls.push('MainCtrl');

                testService.foo();

                blahService();
            }],
            OtherThing: ['testService', 'blahService', function(testService, blahService) {
                calls.push('OtherThing');

                testService.foo();

                blahService();
            }]
        });

        $v.package('subPackage', {
            testService: function () {
                calls.push('creating testService');
                return {
                    foo: function () {
                        calls.push('foo');
                        return 'bar';
                    }
                }
            },
            blahService: function () {
                calls.push('creating blahService');
                return function () {
                    calls.push('blah');
                }
            }
        });

        volcano.update();

        mainCtrl = $v.package('mainPackage').type('MainCtrl').create();
        otherThing = $v.package('mainPackage').type('OtherThing').create();
    });

    afterEach(function () {
        $v.reset();
    })

    it('should create something', function () {
        expect(typeof mainCtrl).toBe('object');
        expect(typeof otherThing).toBe('object');
    });

    it('should call everything in a certain order', function () {
        expect(calls).toEqual([
            'creating testService',
            'creating blahService',
            'MainCtrl',
            'foo',
            'blah',
            'OtherThing',
            'foo',
            'blah'
        ]);
    })
});