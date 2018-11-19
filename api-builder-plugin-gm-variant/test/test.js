const fs = require('fs');
const path = require('path');
const nodeModule = require('../src')();
const action = require('../src/action');
const expect = require('chai').expect;
const { mocknode, validate } = require('axway-flow-sdk');

const axwayjpg='data:image/jpeg;base64,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';

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
			expect(mocknode('img')).to.exist;
		});

		// It's vital to ensure that the generated node flownodes are valid for use
		// in API Builder. Your unit tests should always include this validation
		// to avoid potential issues when API Builder loads your node.
		it('[TEST-2] should define valid flownodes', () => {
			expect(validate(flownodes)).to.not.throw;
		});
	});

	describe('#datauri', () => {
		it('[TEST-3] should return the hash', () => {
			const buffer = fs.readFileSync(path.join(__dirname, '.', 'axway.jpeg'));
			return mocknode(flownodes).node('img').invoke('datauri', { content: buffer })
				.then((data) => {
					expect(data).to.deep.equal({
						next: [ null, axwayjpg ]
					});
				});
		}).timeout(10000);
	});
});


