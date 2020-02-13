const expect = require('chai').expect;
// import * as bundle from '../built/filter.bundle';
import Config from '../built/lib/config';
import {Filter} from '../built/lib/filter';

const testWords = {
  'example': { matchMethod: 0, repeat: true, sub: 'demo' },
  'placeholder': { matchMethod: 0, repeat: false, sub: 'variable' },
  'sample': { matchMethod: 1, repeat: false, sub: 'piece' },
  'word': { matchMethod: 2, repeat: true, sub: 'idea' }
}

describe('Filter', function() {
  describe('generateWordList()', function() {
    it('should generate a sorted word list RegExp list', function() {
      let filter = new Filter;
      filter.cfg = new Config({ words: Object.assign({}, testWords) });
      filter.generateWordList();
      expect(filter.wordList.length).to.equal(4);
      expect(filter.wordList).to.eql(['placeholder', 'example', 'sample', 'word']);
    });
  });

  describe('generateRegexpList()', function() {
    describe('Global matching', function() {
      it('should return RegExp list for global exact match', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 0 });
        filter.generateWordList();
        filter.generateRegexpList();
        expect(filter.wordRegExps.length).to.equal(4);
        expect(filter.wordRegExps).to.eql([/\bplaceholder\b/gi, /\be+x+a+m+p+l+e+\b/gi, /\bsample\b/gi, /\bw+o+r+d+\b/gi]);
      });

      it('should return RegExp list for global exact match and be idempotent', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 0 });
        filter.init();
        expect(filter.wordRegExps.length).to.equal(4);
        expect(filter.wordRegExps).to.eql([/\bplaceholder\b/gi, /\be+x+a+m+p+l+e+\b/gi, /\bsample\b/gi, /\bw+o+r+d+\b/gi]);
        filter.init();
        expect(filter.wordRegExps.length).to.equal(4);
        expect(filter.wordRegExps).to.eql([/\bplaceholder\b/gi, /\be+x+a+m+p+l+e+\b/gi, /\bsample\b/gi, /\bw+o+r+d+\b/gi]);
      });

      it('should return RegExp list for global part match', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 1 });
        filter.init();
        expect(filter.wordRegExps.length).to.equal(4);
        expect(filter.wordRegExps).to.eql([/placeholder/gi, /e+x+a+m+p+l+e+/gi, /sample/gi, /w+o+r+d+/gi]);
      });

      it('should return RegExp list for global part match (default)', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0 });
        filter.init();
        expect(filter.wordRegExps.length).to.equal(4);
        expect(filter.wordRegExps).to.eql([/placeholder/gi, /e+x+a+m+p+l+e+/gi, /sample/gi, /w+o+r+d+/gi]);
      });

      it('should return RegExp list for global whole match (substitution filter)', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 1, globalMatchMethod: 2 });
        filter.init();
        expect(filter.wordRegExps.length).to.equal(4);
        expect(filter.wordRegExps).to.eql([
          /\b[\w-]*placeholder[\w-]*\b/gi,
          /\b[\w-]*e+x+a+m+p+l+e+[\w-]*\b/gi,
          /\b[\w-]*sample[\w-]*\b/gi,
          /\b[\w-]*w+o+r+d+[\w-]*\b/gi
        ]);
      });
    });

    describe('Per-word matching', function() {
      it('should return RegExp list for per-word matching', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 3 });
        filter.cfg.words['^regexp.*?$'] = { matchMethod: 4, repeat: false, words: ['substitute'] };
        filter.init();
        expect(filter.wordRegExps.length).to.equal(5);
        expect(filter.wordRegExps).to.eql([/\bplaceholder\b/gi, /^regexp.*?$/gi, /\be+x+a+m+p+l+e+\b/gi, /sample/gi, /\b[\w-]*w+o+r+d+[\w-]*\b/gi]);
      });
    });
  });

  describe('replaceText()', function() {
    describe('Censor Filter', function() {
      it('Should filter an exact word and preserveFirst', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 3, censorCharacter: '*', censorFixedLength: 0, preserveFirst: true, preserveLast: false });
        filter.init();
        expect(filter.replaceText('this is a placeholder placeholder.')).to.equal('this is a p********** p**********.');
      });

      it('Should filter an exact word with (-) characters and no preserveFirst or preserveLast', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 3, censorCharacter: '-', censorFixedLength: 0, preserveFirst: false, preserveLast: false });
        filter.init();
        expect(filter.replaceText('A cool example sentence.')).to.equal('A cool ------- sentence.');
      });

      it('Should filter an partial word with preserveFirst and preserveLast and update stats', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 3, censorCharacter: '*', censorFixedLength: 0, preserveFirst: true, preserveLast: true });
        filter.init();
        expect(filter.counter).to.equal(0);
        expect(filter.replaceText('this sample is a pretty good sampler to sample.')).to.equal('this s****e is a pretty good s****er to s****e.');
        expect(filter.counter).to.be.above(0);
      });

      it('Should filter a partial word ending with punctuation', function() {
        let filter = new Filter;
        debugger;
        filter.cfg = new Config({ words: {'this!': { matchMethod: 1 }}, filterMethod: 0, censorCharacter: '_', globalMatchMethod: 3 });
        filter.init();
        expect(filter.replaceText('I love allthis! Do you?')).to.equal('I love all_____ Do you?');
        expect(filter.replaceText('I love this! Do you?')).to.equal('I love _____ Do you?');
      });

      it('Should filter a whole word with (_) characters and fixed length (3) and not update stats', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 3, censorCharacter: '_', censorFixedLength: 3, preserveFirst: false, preserveLast: false });
        filter.init();
        expect(filter.counter).to.equal(0);
        expect(filter.replaceText('Words used to be okay, but now even a word is bad.', false)).to.equal('___ used to be okay, but now even a ___ is bad.');
        expect(filter.counter).to.equal(0);
      });

      it('Should filter a whole word ending with punctuation', function() {
        let filter = new Filter;
        debugger;
        filter.cfg = new Config({ words: {'this!': { matchMethod: 2 }}, filterMethod: 0, censorCharacter: '_', globalMatchMethod: 3 });
        filter.init();
        expect(filter.replaceText('I love allthis! Do you?')).to.equal('I love ________ Do you?');
        expect(filter.replaceText('I love this! Do you?')).to.equal('I love _____ Do you?');
      });

      it('Should filter an RegExp and fixed length (5) with preserveLast', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 3, censorCharacter: '_', censorFixedLength: 5, preserveFirst: false, preserveLast: true });
        filter.cfg.words['^The'] = { matchMethod: 4, repeat: false, words: ['substitute'] };
        filter.init();
        expect(filter.replaceText('The best things are always the best.')).to.equal('____e best things are always the best.');
      });

      describe('Unicode characters', function() {
        it('Should filter an exact word and preserveFirst', function() {
          let filter = new Filter;
          filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 3, censorCharacter: '*', censorFixedLength: 0, preserveFirst: true, preserveLast: false });
          filter.cfg.words['врата'] = { matchMethod: 0, repeat: true, words: ['door'] };
          filter.init();
          expect(filter.replaceText('this even works on unicode words like врата, cool huh?')).to.equal('this even works on unicode w**** like в****, cool huh?');
        });

        it('Should filter an partial word with preserveFirst and preserveLast', function() {
          let filter = new Filter;
          filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 3, censorCharacter: '*', censorFixedLength: 0, preserveFirst: true, preserveLast: true });
          filter.cfg.words['котка'] = { matchMethod: 1, repeat: true, words: ['cat'] };
          filter.init();
          expect(filter.replaceText('The коткаs in the hat')).to.equal('The к***аs in the hat');
        });

        it('Should filter a whole word with (_) characters and preserveFirst', function() {
          let filter = new Filter;
          filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 3, censorCharacter: '_', censorFixedLength: 0, preserveFirst: true, preserveLast: false });
          filter.cfg.words['куче'] = { matchMethod: 2, repeat: true, words: ['dog'] };
          filter.init();
          expect(filter.replaceText('The bigкучеs ran around the yard.')).to.equal('The b_______ ran around the yard.');
        });

        it('Should filter a whole word with (*) characters', function() {
          let filter = new Filter;
          filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 0, globalMatchMethod: 3, censorCharacter: '*', censorFixedLength: 0, preserveFirst: false, preserveLast: false });
          filter.cfg.words['словен'] = { matchMethod: 2, repeat: false };
          filter.init();
          debugger;
          expect(filter.replaceText('За пределами Словении этнические словенцы компактно')).to.equal('За пределами ******** этнические ******** компактно');
        });
      });
    });

    describe('Substitute Filter', function() {
      it('Should filter an exact word with substitions marked and preserveCase', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 1, globalMatchMethod: 3, substitutionMark: true, preserveCase: true });
        filter.init();
        expect(filter.replaceText('I love having good examples as an Example.')).to.equal('I love having good examples as an [Demo].');
      });

      it('Should filter an exact word with substitions marked and preserveCase with repeated characters', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 1, globalMatchMethod: 3, substitutionMark: true, preserveCase: true });
        filter.init();
        expect(filter.replaceText('I love having good examples as an Exxaammppllee.')).to.equal('I love having good examples as an [Demo].');
      });

      it('Should filter an exact word ending with punctuation', function() {
        let filter = new Filter;
        filter.cfg = new Config(
          {
            filterMethod: 1,
            globalMatchMethod: 3,
            substitutionMark: false,
            preserveCase: true,
            words: {
              'this!': { matchMethod: 0, repeat: false, sub: 'that!' },
              '!bang': { matchMethod: 0, repeat: true, sub: '!poof' },
              '!another!': { matchMethod: 0, repeat: false, sub: '$znother#' }
            },
          }
        );
        filter.init();
        expect(filter.replaceText('I love This! Do you?')).to.equal('I love That! Do you?');
        expect(filter.replaceText('I love this!')).to.equal('I love that!');
        expect(filter.replaceText('Go out with a !baangg')).to.equal('Go out with a !poof');
        expect(filter.replaceText('Go out with a !Bang!')).to.equal('Go out with a !Bang!');
        expect(filter.replaceText('!ANOTHER! so cool!')).to.equal('$ZNOTHER# so cool!');
      });

      it('Should filter an partial word with substitions not marked and preserveCase', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 1, globalMatchMethod: 3, substitutionMark: false, preserveCase: true });
        filter.init();
        expect(filter.replaceText('This Sample is a pretty good sampler to sample.')).to.equal('This Piece is a pretty good piecer to piece.');
      });

      it('Should filter an partial word with defaultSubstitution not marked and preserveCase', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), defaultSubstitution: 'censored', filterMethod: 1, globalMatchMethod: 3, substitutionMark: false, preserveCase: true });
        filter.cfg.words['this'] = { matchMethod: 0, repeat: true, sub: '' };
        filter.init();
        expect(filter.replaceText('This Sample is a pretty good sampler to sample.')).to.equal('Censored Piece is a pretty good piecer to piece.');
      });

      it('Should filter an partial word with substitions not marked, not repeated, and preserveCase and update stats', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 1, globalMatchMethod: 3, substitutionMark: false, preserveCase: true });
        filter.init();
        expect(filter.counter).to.equal(0);
        expect(filter.replaceText('This Sample is a pretty good sampler to saammppllee.')).to.equal('This Piece is a pretty good piecer to saammppllee.');
        expect(filter.counter).to.be.above(0);
      });

      it('Should filter an partial word with substitions marked and not preserveCase and not update stats', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 1, globalMatchMethod: 3, substitutionMark: true, preserveCase: false });
        filter.init();
        expect(filter.counter).to.equal(0);
        expect(filter.replaceText('This Sample is a pretty good sampler to sample.', false)).to.equal('This [piece] is a pretty good [piece]r to [piece].');
        expect(filter.counter).to.equal(0);
      });

      describe('Unicode characters', function() {
        it('Should filter an exact word with substitions marked and preserveCase with repeated characters', function() {
          let filter = new Filter;
          filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 1, globalMatchMethod: 3, substitutionMark: true, preserveCase: true });
          filter.cfg.words['врата'] = { matchMethod: 0, repeat: true, sub: 'door' };
          filter.init();
          expect(filter.replaceText('this even works on unicode WORDS like Врата, cool huh?')).to.equal('this even works on unicode [IDEA] like [Door], cool huh?');
        });
      });
    });

    describe('Remove Filter', function() {
      it('Should filter an exact word and update stats', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 2, globalMatchMethod: 3 });
        filter.init();
        expect(filter.counter).to.equal(0);
        expect(filter.replaceText('A cool, example sentence.')).to.equal('A cool, sentence.');
        expect(filter.counter).to.be.above(0);
      });

      it('Should filter an partial word and not update stats', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 2, globalMatchMethod: 3 });
        filter.init();
        expect(filter.counter).to.equal(0);
        expect(filter.replaceText('This Sample is a pretty good sampler to sample.', false)).to.equal('This is a pretty good to.');
        expect(filter.counter).to.equal(0);
      });

      it('Should filter an partial word ending with punctuation', function() {
        let filter = new Filter;
        filter.cfg = new Config({filterMethod: 2, globalMatchMethod: 3, words: {'this!': { matchMethod: 1, repeat: false }}});
        filter.init();
        expect(filter.replaceText('I love allthis! Do you?')).to.equal('I love Do you?');
        expect(filter.replaceText('I love this! Do you?')).to.equal('I love Do you?');
      });

      it('Should filter a RegExp', function() {
        let filter = new Filter;
        filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 2, globalMatchMethod: 3 });
        filter.cfg.words['this and everything after.*$'] = { matchMethod: 4, repeat: false, words: ['substitute'] };
        filter.init();
        expect(filter.replaceText('Have you ever done this and everything after it?')).to.equal('Have you ever done ');
      });

      it('Should filter an exact word ending with punctuation', function() {
        let filter = new Filter;
        filter.cfg = new Config({filterMethod: 2, globalMatchMethod: 3, words: {'this!': { matchMethod: 0, repeat: false }}});
        filter.init();
        expect(filter.replaceText('I love This! Do you?')).to.equal('I love Do you?');
        expect(filter.replaceText('I love this!')).to.equal('I love');
      });

      describe('Unicode characters', function() {
        it('Should filter an exact word', function() {
          let filter = new Filter;
          filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 2, globalMatchMethod: 3 });
          filter.cfg.words['врата'] = { matchMethod: 0, repeat: true, words: ['door'] };
          filter.init();
          expect(filter.replaceText('This even works on врата. cool huh?')).to.equal('This even works on. cool huh?');
          expect(filter.replaceText('This even works on врата, cool huh?')).to.equal('This even works on, cool huh?');
          expect(filter.replaceText('This even works on врата?')).to.equal('This even works on?');
        });

        it('Should filter an entire word with a partial match', function() {
          let filter = new Filter;
          filter.cfg = new Config({ words: Object.assign({}, testWords), filterMethod: 2, globalMatchMethod: 3 });
          filter.cfg.words['врата'] = { matchMethod: 1, repeat: true, words: ['door'] };
          filter.init();
          expect(filter.replaceText('This even works on with-врата. Cool huh?')).to.equal('This even works on. Cool huh?');
          expect(filter.replaceText('The вратаs in the hat')).to.equal('The in the hat');
          expect(filter.replaceText('вратаs. in the hat')).to.equal('. in the hat');
          expect(filter.replaceText('вратаs')).to.equal('');
        });
      });
    });
  });
});