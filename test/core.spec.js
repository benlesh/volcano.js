describe('core', function () {
    it('should create $v and volcano, and they should be the same thing', function(){
    	expect(typeof $v).toBe('object');
    	expect($v).toBe(volcano);
    });

    it('should create the core namespace', function (){
    	expect(typeof $v.core).toBe('object');
    });
});
