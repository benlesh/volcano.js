describe('package creation and handling', function (){
	beforeEach(function (){
		// clear out packages.
		$v.__packages = {};
	});

	describe('volcano.package()', function (){
		it('should create a Package', function (){
		var pkg = $v.package('myPackage'); //snicker
		expect(pkg instanceof Package).toBe(true);
		expect(pkg.name).toBe('myPackage');
	});

		describe('when called as volcano.package("packName", "typeName", obj)', function (){
			it('should create a package and add a type', function (){
				var pkg = $v.package('packName', 'typeName', { some: 'value' });

				expect(pkg.name).toBe('packName');
				expect(pkg.__types['typeName'].name).toBe('typeName');
				expect(pkg.__types['typeName'].type).toBe('value');
				expect(pkg.__types['typeName'].manifest).toEqual({ some: 'value' });
			});
		});
	});

	describe('package.type("typeName")', function (){
		it('should set and get the type', function (){
			var pkg = $v.package('testPkg');
			var a = pkg.type('typeName', { some: 'value' });
			var b = pkg.type('typeName');
			expect(a).toBe(b);
		});
	});

});