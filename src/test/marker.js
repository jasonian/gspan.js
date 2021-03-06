import expect from 'expect.js';
import Marker from '../download/marker';

describe('Marker', () => {
  let marker;

  before(() => {
    marker = new Marker();
  });

  it('Parses emphasis', function () {
    expect(marker.mark('... *bold*, _italicized_, and *regular_ text ...')).to.be('... **bold**, *italicized*, and \\*regular\\_ text ...');
  });

  it('Parses named links', function () {
    expect(marker.mark('... [a named link in]http://site.com?id=asd ...')).to.be('... [a named link in](http://site.com?id=asd) ...');
  });

  it('Parses named links with punctuation', function () {
    expect(marker.mark('... [a named, ?? link in.]http://site.com?id=asd ...')).to.be('... [a named, ?? link in.](http://site.com?id=asd) ...');
  });

  it('Parses unnamed links', function () {
    expect(marker.mark('... http://site.com ...')).to.be('... [http://site.com](http://site.com) ...');
  });

  it('Parses underscore link', function () {
    expect(marker.mark('... http://site_underscore.com ...')).to.be('... [http://site_underscore.com](http://site_underscore.com) ...');
  });

  it('Leaves bracketed text alone', function () {
    expect(marker.mark('... this is [a] test ...')).to.be('... this is [a] test ...');
  });

  it('Parses long named link', function () {
    expect(marker.mark(
      '... [a named link]http://site.com?id=4URLCutterjhightowering5130' +
      'gjaexpandedlongishx6farZoff16ei10FwdURLdShortlinks6' +
      'URL8268e33jt4553drawnZout30blURLvi1enduringtowering' +
      '6Doiopi2lengthyNutshellURLRubyURL0enlargedhigh5rncl' +
      'astingIs ...'
    )).to.be(
      '... [a named link](http://site.com?id=4URLCutterjhightowering5' +
      '130gjaexpandedlongishx6farZoff16ei10FwdURLdShortlin' +
      'ks6URL8268e33jt4553drawnZout30blURLvi1enduringtower' +
      'ing6Doiopi2lengthyNutshellURLRubyURL0enlargedhigh5r' +
      'nclastingIs) ...'
    );
  });

  it('Parses long unnamed link', function () {
    expect(marker.mark(
      '... http://site.com?id=4URLCutterjhightowering5130' +
      'gjaexpandedlongishx6farZoff16ei10FwdURLdShortlinks6' +
      'URL8268e33jt4553drawnZout30blURLvi1enduringtowering' +
      '6Doiopi2lengthyNutshellURLRubyURL0enlargedhigh5rncl' +
      'astingIs ...'
    )).to.be(
      '... [http://site.com?id=4URLCutterjhightowering5130g' +
      'jaexpandedlongishx6farZoff16ei10FwdURLdShortlinks6U' +
      'RL8268e33jt4553drawnZout30blURLvi1enduringtowering6' +
      'Doiopi2lengthyNutshellURLRubyURL0enlargedhigh5rncla' +
      'stingIs](http://site.com?id=4URLCutterjhightowering5' +
      '130gjaexpandedlongishx6farZoff16ei10FwdURLdShortlin' +
      'ks6URL8268e33jt4553drawnZout30blURLvi1enduringtower' +
      'ing6Doiopi2lengthyNutshellURLRubyURL0enlargedhigh5r' +
      'nclastingIs) ...'
    );
  });

  it('Parses complex paragraphs', function () {
    expect(marker.mark(
      'this is a test of *bold* and _italic_ *text\n' +
      'and a _unamed link https://politico.com ' +
      'and a [named link]https://www.politico.com\n' +
      'and a loooooong named link [named link]' +
      'http://site.com?id=4URLCutterjhightowering5' +
      '130gjaexpandedlongishx6farZoff16ei10FwdURLdShortlin' +
      'ks6URL8268e33jt4553drawnZout30blURLvi1enduringtower' +
      'ing6Doiopi2lengthyNutshellURLRubyURL0enlargedhigh5r' +
      'nclastingIs\n' +
      'and a loooooong unamed link ' +
      'http://site.com?id=4URLCutterjhightowering5' +
      '130gjaexpandedlongishx6farZoff16ei10FwdURLdShortlin' +
      'ks6URL8268e33jt4553drawnZout30blURLvi1enduringtower' +
      'ing6Doiopi2lengthyNutshellURLRubyURL0enlargedhigh5r' +
      'nclastingIs\n'
    )).to.be(
      'this is a test of **bold** and *italic* \\*text\n' +
      'and a \\_unamed link [https://politico.com](https://politico.com) ' +
      'and a [named link](https://www.politico.com)\n' +
      'and a loooooong named link [named link]' +
      '(http://site.com?id=4URLCutterjhightowering5' +
      '130gjaexpandedlongishx6farZoff16ei10FwdURLdShortlin' +
      'ks6URL8268e33jt4553drawnZout30blURLvi1enduringtower' +
      'ing6Doiopi2lengthyNutshellURLRubyURL0enlargedhigh5r' +
      'nclastingIs)\n' +
      'and a loooooong unamed link ' +
      '[http://site.com?id=4URLCutterjhightowering5' +
      '130gjaexpandedlongishx6farZoff16ei10FwdURLdShortlin' +
      'ks6URL8268e33jt4553drawnZout30blURLvi1enduringtower' +
      'ing6Doiopi2lengthyNutshellURLRubyURL0enlargedhigh5r' +
      'nclastingIs]' +
      '(http://site.com?id=4URLCutterjhightowering5' +
      '130gjaexpandedlongishx6farZoff16ei10FwdURLdShortlin' +
      'ks6URL8268e33jt4553drawnZout30blURLvi1enduringtower' +
      'ing6Doiopi2lengthyNutshellURLRubyURL0enlargedhigh5r' +
      'nclastingIs)\n'
    );
  });
});
