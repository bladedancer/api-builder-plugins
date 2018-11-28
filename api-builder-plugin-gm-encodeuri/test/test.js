const nodeModule = require('../src')();
const action = require('../src/action');
const expect = require('chai').expect;
const { mocknode, validate } = require('axway-flow-sdk');

describe('api-flownodes-plugin-gm-encodeuri', () => {
	let plugin;
	before(() => {
		return nodeModule.then(resolvedSpecs => {
			plugin = resolvedSpecs;
		});
	});

	describe('Spec', () => {
		it('[ENCODEURI-1] should define node specs', () => {
			expect(plugin).to.exist;
			expect(typeof action.encode).to.equal('function');
			expect(typeof action.decode).to.equal('function');
			expect(typeof action.encodeComponent).to.equal('function');
			expect(typeof action.decodeComponent).to.equal('function');
			expect(mocknode('gm-encodeuri')).to.exist;
		});

		// It's vital to ensure that the generated node flownodes are valid for use
		// in API Builder. Your unit tests should always include this validation
		// to avoid potential issues when API Builder loads your node.
		it('[ENCODEURI-2] should define valid flownodes', () => {
			expect(validate(plugin)).to.not.throw;
		});

		it('[ENCODEURI-3] should define gm-encodeuri spec.', () => {
			const spec = plugin.flownodes['gm-encodeuri'];
			expect(spec).to.exist;
			expect(spec.name).to.equal('Encode URI');
			expect(spec.description).to.equal('Methods for URI encoding and decoding.');
			expect(spec.icon).to.exist;
			expect(spec.category).to.equal('extension');
			expect(Object.keys(spec.methods)).to.have.members([
				'encodeuri',
				'decodeuri',
				'encodeuricomponent',
				'decodeuricomponent'
			]);
		});
	});

	describe('Methods', () => {
		it('[ENCODEURI-4] should uri encode a string.', () => {
			return mocknode(plugin).node('gm-encodeuri').invoke('encodeuri', { uri: 'http://foo.bar.com/Not Uri Encoded%' })
				.then((result) => {
					expect(result).to.deep.equal({
						next: [ null, 'http://foo.bar.com/Not%20Uri%20Encoded%25' ]
					});
				});
		});

		it('[ENCODEURI-5] should uri decode a string.', () => {
			return mocknode(plugin).node('gm-encodeuri').invoke('decodeuri', { uri: 'http://foo.bar.com/Not%20Uri%20Encoded%25' })
				.then((result) => {
					expect(result).to.deep.equal({
						next: [ null, 'http://foo.bar.com/Not Uri Encoded%' ]
					});
				});
		});

		it('[ENCODEURI-6] should error when decoding invalid uri.', () => {
			return mocknode(plugin).node('gm-encodeuri').invoke('decodeuri', { uri: 'http://foo.bar.com/Not%20Uri%20Encoded%' })
				.then((result) => {
					expect(result.error).to.be.not.null;
					expect(result.error[0]).to.be.null;
					expect(result.error[1]).to.be.an('Error');
				});
		});

		it('[ENCODEURI-7] should encode a URI componenet.', () => {
			return mocknode(plugin).node('gm-encodeuri').invoke('encodeuricomponent', { string: 'http://foo.bar.com/Not Uri Encoded%' })
				.then((result) => {
					expect(result).to.deep.equal({
						next: [ null, 'http%3A%2F%2Ffoo.bar.com%2FNot%20Uri%20Encoded%25' ]
					});
				});
		});

		it('[ENCODEURI-8] should decodea URI component..', () => {
			return mocknode(plugin).node('gm-encodeuri').invoke('decodeuricomponent', { string: 'http%3A%2F%2Ffoo.bar.com%2FNot%20Uri%20Encoded%25' })
				.then((result) => {
					expect(result).to.deep.equal({
						next: [ null, 'http://foo.bar.com/Not Uri Encoded%' ]
					});
				});
		});

		it('[ENCODEURI-9] should error when decoding invalid uri component.', () => {
			return mocknode(plugin).node('gm-encodeuri').invoke('decodeuricomponent', { string: 'Not encoded%' })
				.then((result) => {
					expect(result.error).to.be.not.null;
					expect(result.error[0]).to.be.null;
					expect(result.error[1]).to.be.an('Error');
				});
		});
	});
});
