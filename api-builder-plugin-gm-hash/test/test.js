const nodeModule = require('../src')();
const action = require('../src/action');
const expect = require('chai').expect;
const { mocknode, validate } = require('axway-flow-sdk');

describe('api-builder-plugin-fn-hash', () => {
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
			expect(mocknode('hash')).to.exist;
		});

		// It's vital to ensure that the generated node flownodes are valid for use
		// in API Builder. Your unit tests should always include this validation
		// to avoid potential issues when API Builder loads your node.
		it('[TEST-2] should define valid flownodes', () => {
			expect(validate(flownodes)).to.not.throw;
		});
	});

	describe('#md5', () => {
		it('[TEST-3] should return the hash', () => {
			return mocknode(flownodes).node('hash').invoke('md5', { plaintext: 'hashthis' })
				.then((data) => {
					expect(data).to.deep.equal({
						next: [ null, '000242dc7a5257e1f265578cdcc6c3fd' ]
					});
				});
		});
	});
});
