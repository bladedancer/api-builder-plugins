const nodeModule = require('../src')();
const action = require('../src/action');
const expect = require('chai').expect;
const { mocknode, validate } = require('axway-flow-sdk');

describe('api-flownodes-plugin-gm-code', () => {
	let plugin;
	before(() => {
		return nodeModule.then(resolvedSpecs => {
			plugin = resolvedSpecs;
		});
    });

	describe('#constructor', () => {
		it('[TEST-1] should define node specs', () => {
			expect(plugin).to.exist;
			expect(typeof action.execute).to.equal('function');
			expect(mocknode('gm-code')).to.exist;
		});

		// It's vital to ensure that the generated node flownodes are valid for use
		// in API Builder. Your unit tests should always include this validation
		// to avoid potential issues when API Builder loads your node.
		it('[TEST-2] should define valid flownodes', () => {
			expect(validate(plugin)).to.not.throw;
		});
    });
    
    describe('Code', () => {
		it('[CODE-1] should define gm-code spec.', () => {
			const spec = plugin.flownodes['gm-code'];
			expect(spec).to.exist;
			expect(spec.name).to.equal('Code');
			expect(spec.description).to.equal('Methods for Javascript code execution.');
			expect(spec.icon).to.exist;
			expect(spec.category).to.equal('extension');
			expect(Object.keys(spec.methods)).to.have.members([ 'execute' ]);
        });

        it('[CODE-2] should execute function with supplied values', () => {
			const inputs = { name: 'Fred', greeting: 'Hello' };
			const func = 'function greet({ name, greeting }) { return `${greeting} ${name}`; }';

			return mocknode(plugin).node('gm-code').invoke('execute', { 
                    'function': func,
                    inputs
                })
				.then((result) => {
					expect(result).to.deep.equal({
						next: [ null, 'Hello Fred' ]
					});
				});
        });
        
        it('[CODE-3] should execute function and error with exception', () => {
			const inputs = { name: 'Fred', greeting: 'Hello' };
			const func = 'function greet({ name, greeting }) { throw new Error("expected"); }';

			return mocknode(plugin).node('gm-code').invoke('execute', { 
                    'function': func,
                    inputs
                })
				.then((result) => {
                    expect(result.error).to.be.not.null;
                    expect(result.error[0]).to.be.null;
                    expect(result.error[1]).to.be.an('Error');
                    expect(result.error[1].message).to.equal('expected');
				});
		});
    });
});