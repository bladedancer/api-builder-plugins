const nodeModule = require('../src')();
const action = require('../src/action');
const expect = require('chai').expect;
const { mocknode, validate } = require('axway-flow-sdk');

describe('api-builder-plugin-fn-foreach', () => {
	let flownodes;
	before(() => {
		return nodeModule.then(resolvedSpecs => {
			flownodes = resolvedSpecs;
		});
	});

	describe('#constructor', () => {
		it('[TEST-1] should define flownodes', () => {
			expect(flownodes).to.exist;
			expect(typeof action).to.equal('function');
			expect(mocknode('foreach')).to.exist;
		});

		// It's vital to ensure that the generated node flownodes are valid for use
		// in API Builder. Your unit tests should always include this validation
		// to avoid potential issues when API Builder loads your node.
		it('[TEST-2] should define valid flownodes', () => {
			expect(validate(flownodes)).to.not.throw;
		});
	});

	describe('#todo', () => {
		it('[TEST-3] should fail to with invalid argument', () => {
			// invoke foreach#todo and check that the default callback is
			// called: cb('invalid argument')
			return mocknode(flownodes).node('foreach').invoke('todo', { todo: undefined })
				.then((data) => {
					expect(data).to.deep.equal([ 'invalid argument' ]);
				});
		});

		it('[TEST-4] should succeed', () => {
			// invoke foreach#todo and check that the 'next' output callback is
			// called: cb.next(null, 'todo')
			return mocknode(flownodes).node('foreach').invoke('todo', { todo: 'stuff' })
				.then((data) => {
					expect(data).to.deep.equal({
						next: [ null, 'todo' ]
					});
				});
		});
	});
});
