import * as assert from 'assert';
import ArgumentPair, { skipEmptyArguments } from '../../functions/ArgumentPair';

suite('Extension Test Suite', () => {
	// test('skipEmptyArguments', () => {
	// 	assert.strictEqual([new ArgumentPair("a"), new ArgumentPair("b")],
	// 		skipEmptyArguments(null, new ArgumentPair("a"), undefined, new ArgumentPair("b")));
	// });

	test('Sole Ctor', () => {
		assert.strictEqual("a", new ArgumentPair("a").toString());
		assert.notStrictEqual("a", new ArgumentPair("b").toString());
	});

	test('Single Ctor', () => {
		assert.strictEqual("a b", new ArgumentPair("a", "b").toString());
		assert.notStrictEqual("b a", new ArgumentPair("a", "b").toString());
		assert.notStrictEqual("c d", new ArgumentPair("a", "b").toString());
		assert.notStrictEqual("a a", new ArgumentPair("a", "b").toString());
		assert.notStrictEqual("b b", new ArgumentPair("a", "b").toString());
	});

	test('Multiline Ctor', () => {
		assert.strictEqual("a b c d", new ArgumentPair("a", "b", "c", "d").toString());
	});

	test('Multiline Ctor Remove Duplicates', () => {
		assert.strictEqual("a b", new ArgumentPair("a", "b", "b", "b").toString());
	});

	test('Formatter Sole', () => {
		assert.strictEqual(`"a b"`, new ArgumentPair("a b").toString());
	});

	test('Formatter Single', () => {
		assert.strictEqual(`    a b`, new ArgumentPair("a", "b").toString({intendationSize: 4}));
		assert.strictEqual(`    a "b"`, new ArgumentPair("a", "b").toString({intendationSize: 4, quotation: true}));
	});

	test('Formatter Multiline', () => {
		assert.strictEqual(`    a b c`, new ArgumentPair("a", "b", "c").toString({intendationSize: 4}));
		assert.strictEqual(`    a "b" "c"`, new ArgumentPair("a", "b", "c").toString({intendationSize: 4, quotation: true}));
		assert.strictEqual(`    a\n        b\n        c`, new ArgumentPair("a", "b", "c").toString({intendationSize: 4, multiline: true}));
	});
});
