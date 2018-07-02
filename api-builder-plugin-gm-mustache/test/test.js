const nodeModule = require('../src')();
const action = require('../src/action');
const expect = require('chai').expect;
const { mocknode, validate } = require('axway-flow-sdk');

describe('api-builder-plugin-gm-objectfilter', () => {
	let plugin;
	before(() => {
		return nodeModule.then(resolvedSpecs => {
			plugin = resolvedSpecs;
		});
	});

	describe('#constructor', () => {
		it('[TEST-1] should define node specs', () => {
			expect(plugin).to.exist;
			expect(typeof action.formatStr).to.equal('function');
			expect(typeof action.formatObj).to.equal('function');
			expect(mocknode('gm-mustache')).to.exist;
		});

		// It's vital to ensure that the generated node flownodes are valid for use
		// in API Builder. Your unit tests should always include this validation
		// to avoid potential issues when API Builder loads your node.
		it('[TEST-2] should define valid flownodes', () => {
			expect(validate(plugin)).to.not.throw;
		});
	});

	describe('Mustsache', () => {
		it('[MUSTACHE-2] should define gm-mustache spec.', () => {
			const spec = plugin.flownodes['gm-mustache'];
			expect(spec).to.exist;
			expect(spec.name).to.equal('Mustache');
			expect(spec.description).to.equal('Compose strings and objects using Mustache templates. See http://mustache.github.io/.');
			expect(spec.icon).to.exist;
			expect(spec.category).to.equal('core');
			expect(Object.keys(spec.methods)).to.have.members([ 'formatStr', 'formatObj' ]);
		});

		it('[MUSTACHE-3] should format template with values from object', () => {
			const template = 'Hello {{firstname}} {{surname}}';
			const data = { firstname: 'Clark', surname: 'Kent' };

			return mocknode(plugin).node('gm-mustache').invoke('formatStr', { template, data })
				.then((result) => {
					expect(result).to.deep.equal({
						next: [ null, 'Hello Clark Kent' ]
					});
				});
		});

		it('[MUSTACHE-4] should format template with values from string array', () => {
			const template = '{{people}}';
			const data = {
				people: [ 'tom', 'dick', 'harry' ]
			};

			return mocknode(plugin).node('gm-mustache').invoke('formatStr', { template, data })
				.then((result) => {
					expect(result).to.deep.equal({
						next: [ null, 'tom,dick,harry' ]
					});
				});
		});

		it('[MUSTACHE-5] should format template with values from object array', () => {
			const template = '{{#people}}{{name}},{{/people}}';
			const data = {
				people: [
					{ name: 'tom' },
					{ name: 'dick' },
					{ name: 'harry' }
				]
			};

			return mocknode(plugin).node('gm-mustache').invoke('formatStr', { template, data })
				.then((result) => {
					expect(result).to.deep.equal({
						next: [ null, 'tom,dick,harry,' ]
					});
				});
		});

		it('[MUSTACHE-6] should error on format of invalid template', () => {
			const template = '{{#people}}{{/animals}}';
			const data = {
				people: [ 'tom', 'dick', 'harry' ]
			};

			return mocknode(plugin).node('gm-mustache').invoke('formatStr', { template, data })
				.then((result) => {
					expect(result).to.have.property('error');
					expect(result.error[0]).to.be.null;
					expect(result.error[1].message).to.be.equal('Unclosed section "people" at 11');
				});
		});

		it('[MUSTACHE-7] should format object from template', () => {
			const template = `{
				"name": "{{first}} {{last}}",
				"age": {{age}},
				"gender": "{{#male}}m{{/male}}{{^male}}f{{/male}}"
			}`;
			const data = {
				first: 'Clark',
				last: 'Kent',
				age: 27,
				male: true
			};

			return mocknode(plugin).node('gm-mustache').invoke('formatObj', { template, data })
				.then((result) => {
					expect(result).to.deep.equal({
						next: [ null, {
							name: 'Clark Kent',
							age: 27,
							gender: 'm'
						} ]
					});
				});
		});

		it('[MUSTACHE-8] should format object should trigger error if template is not valid', () => {
			const template = `{
				"name": "{{first}} {{last}}",
				"age": {{age}},
				"gender": "{{#male}}m{{/badmale}}{{^male}}f{{/male}}"
			}`;
			const data = {
				first: 'Clark',
				last: 'Kent',
				age: 27,
				male: true
			};

			return mocknode(plugin).node('gm-mustache').invoke('formatObj', { template, data })
				.then((result) => {
					expect(result).to.have.property('error');
					expect(result.error[0]).to.be.null;
					expect(result.error[1].message).to.be.equal('Unclosed section "male" at 81');
				});
		});
	});
});
