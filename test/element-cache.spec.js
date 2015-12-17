var assert = require('chai').assert;
var sinon = require('sinon');
var ElementsCache = require('../src/index');

describe('ElementsCache', function() {
  beforeEach(function() {
    this.elementCache = ElementsCache();
    this.native = {
      appendChild: sinon.spy(),
      getAttribute: sinon.stub(),
      setAttribute: sinon.spy(),
      removeAttribute: sinon.spy()
    };
    document = {
      getElementById: sinon.stub().withArgs('app').returns(this.native),
      createTextNode: sinon.stub().withArgs('This is some text').returns('Text Node!')
    };
  });

  it('caches element wrapper', function() {
    var wrapper1 = this.elementCache('app');
    var wrapper2 = this.elementCache('app');
    assert.equal(wrapper1, wrapper2);
  });

  it('takes value from property on get if it exists', function() {
    this.native['className'] = 'hidden';
    assert.equal(this.elementCache('app').get('className'), 'hidden');
  });

  it('takes value from attribute on get if property does not exist and caches it', function() {
    this.native.getAttribute.withArgs('class').returns('hidden');
    assert.equal(this.elementCache('app').get('class'), 'hidden');
    assert.equal(this.elementCache('app').get('class'), 'hidden');
    assert(this.native.getAttribute.calledOnce);
  });

  it('sets values only when they change', function() {
    this.elementCache('app').set({ class: 'large', style: 'color: red;' });
    this.elementCache('app').set({ class: 'large' });
    this.elementCache('app').set({ class: 'small' });
    assert.deepEqual(this.native.setAttribute.args[0], ['class', 'large']);
    assert.deepEqual(this.native.setAttribute.args[1], ['style', 'color: red;']);
    assert.deepEqual(this.native.setAttribute.args[2], ['class', 'small']);
  });

  it('sets text by appending text node', function() {
    this.elementCache('app').set({ text: 'This is some text' });
    assert(this.native.appendChild.calledWith('Text Node!'));
    assert(this.native.setAttribute.notCalled);
  });

  it('sets property if it exists', function() {
    this.native.height = 250;
    this.elementCache('app').set({ height: 135 });
    assert.equal(this.native.height, 135);
  });

  it('prefers to setAttribute for style', function() {
    this.native.style = 'color: red;';
    this.elementCache('app').set({ style: 'color: blue;' });
    assert.equal(this.native.style, 'color: red;');
    assert.deepEqual(this.native.setAttribute.args[0], ['style', 'color: blue;']);
  });

  it('removes attribute if it is set to null', function() {
    this.elementCache('app').set({ style: null });
    assert(this.native.removeAttribute.calledWith('style'));
    assert(this.native.setAttribute.notCalled);
  });
});
