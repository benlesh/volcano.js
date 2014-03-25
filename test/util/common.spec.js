describe('extend', function (){
	it('should extend an object', function (){
		var foo = { bar: 'wee' };
		var blah = { blah: 'blah' };
		$v.util.extend(blah, foo);
		expect(blah.bar).toBe('wee');
	});

	it('should deep extend an object', function (){
		var foo = {
			child: {
				same: 'same',
				diff: 'same'
			}
		};
		var bar = {
			child: {
				diff: 'diff',
				added: 'added'
			}
		};

		$v.util.extend(true, foo, bar);

		expect(foo.child.same).toBe('same');
		expect(foo.child.diff).toBe('diff');
		expect(foo.child.added).toBe('added');
	});

	it('should extend multiple objects', function (){
		var a = { fromA: 'fromA' };
		var b = { fromB: 'fromB' };
		var c = { fromC: 'fromC' };

		$v.util.extend(a, b, c);

		expect(a.fromA).toBe('fromA');
		expect(a.fromB).toBe('fromB');
		expect(a.fromC).toBe('fromC');
	});



	it('should extend multiple objects with a bool as first argument', function (){
		var a = { fromA: 'fromA' };
		var b = { fromB: 'fromB' };
		var c = { fromC: 'fromC' };

		$v.util.extend(false, a, b, c);

		expect(a.fromA).toBe('fromA');
		expect(a.fromB).toBe('fromB');
		expect(a.fromC).toBe('fromC');
	});
});

describe('forEach', function (){
	it('should loop through arrays', function(){
		var arr = [1,2,3,4,5];
		var i = 0;
		$v.util.forEach(arr, function(value, index, forArr, context) {
			expect(value).toBe(arr[index]);
			expect(forArr).toBe(arr);
			expect(index).toBe(i++);
			expect(context instanceof LoopContext).toBe(true);
		});
	});

	it('should loop through objects', function() {
		var obj = {
			'a': 1,
			'b': 2,
			'c': 3
		};
		var i = 0;

		$v.util.forEach(obj, function(value, key, forObj, context) {
			expect(value).toBe(obj[key]);
			expect(forObj).toBe(obj);
			expect(key).toBe('abc'[i++]);
			expect(context instanceof LoopContext).toBe(true);
		});
	});

	it('should loop properties of Function *except* name and length', function(){
		function fn(){}
		fn.a = 1;
		fn.b = 2;
		fn.c = 3;
		var i = 0;

		$v.util.forEach(fn, function(value, key, forFn, context) {
			expect(value).toBe(fn[key]);
			expect(forFn).toBe(fn);
			// this will fail if it's name or length
			expect(key).toBe('abc'[i++]);
			expect(context instanceof LoopContext).toBe(true);
		});
	});
});

describe('map', function (){
	it('should map arrays', function (){
		var arr = [1,2,3,4];
		var arr2 = map(arr, function(x) {
			return x + 1;
		});
		expect(arr2).toEqual([2,3,4,5]);
	});
});

describe('filter', function (){
	it('should filter an array', function (){
		var arr = [1,2,3,4,5,6];
		var arr2 = filter(arr, function(x) {
			return x % 2 == 0;
		});
		expect(arr2).toEqual([2,4,6]);
	});
});

describe('reduce', function (){
	it('should reduce an array', function (){
		var arr = [1,2,3];
		var i = 0;

		var result = reduce(arr, function(prev, current, index, array, context) {
			expect(context instanceof LoopContext).toBe(true);
			expect(index).toBe(i++);
			expect(array).toBe(arr);
			return prev + current;
		}, 12);

		expect(result).toBe(18);
	});
});

describe('concat', function() {
	it('should concat multiple arrays', function (){
		var a = [1,2,3,4];
		var b = [5,6,7];
		var c = [8,9];
		var x = concat(a, b, c);
		expect(x).toEqual([1,2,3,4,5,6,7,8,9]);
	});
});

describe('distinct', function (){
	it('should reduce the array to a distinct set of values', function (){
		var a = [1, 'a', 1, 'b', 1, 'c', 'a'];
		var x = distinct(a);
		expect(x).toEqual([1,'a','b','c']);
	});
});

describe('indexOf', function (){
	it('should return the index of an item in an array', function (){
		var a = [1,2,3,4,5,6,7];
		var i = indexOf(a, 6);
		expect(i).toBe(5);
	});
});