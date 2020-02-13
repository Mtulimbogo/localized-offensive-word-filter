export default class Config {
  advancedDomains: string[];
  censorCharacter: string;
  censorFixedLength: number;
  customAudioSites: { [site: string]: AudioSite };
  defaultSubstitution: string;
  defaultWordMatchMethod: number;
  defaultWordRepeat: boolean;
  disabledDomains: string[];
  filterMethod: number;
  filterWordList: boolean;
  globalMatchMethod: number;
  muteAudio: boolean;
  muteAudioOnly: boolean;
  muteMethod: number;
  password: string;
  preserveCase: boolean;
  preserveFirst: boolean;
  preserveLast: boolean;
  showCounter: boolean;
  showSubtitles: number;
  showSummary: boolean;
  showUpdateNotification: boolean;
  substitutionMark: boolean;
  words: { [key: string]: WordOptions; };
  youTubeAutoSubsMin: number;

  static readonly filterMethods = {
    censor: 0,
    substitute: 1,
    remove: 2
  };

  static readonly matchMethods = {
    exact: 0,
    partial: 1,
    whole: 2,
    'Per-Word': 3,
    'RegExp': 4
  };

  static readonly _defaults = {
    advancedDomains: [],
    censorCharacter: '',
    censorFixedLength: 0,
    customAudioSites: null,
    defaultSubstitution: '',
    defaultWordMatchMethod: 0,
    defaultWordRepeat: false,
    disabledDomains: [],
    filterMethod: 0, // ['Censor', 'Substitute', 'Remove'];
    filterWordList: true,
    globalMatchMethod: 3, // ['Exact', 'Partial', 'Whole', 'Per-Word', 'RegExp']
    muteAudio: false, // Filter audio
    muteAudioOnly: false,
    muteMethod: 0, // 0: Mute Tab, 1: Video Volume
    password: null,
    preserveCase: true,
    preserveFirst: true,
    preserveLast: false,
    showCounter: true,
    showSubtitles: 0,
    showSummary: true,
    showUpdateNotification: true,
    substitutionMark: false,
    youTubeAutoSubsMin: 0
  };

  static  _maneno = {
    'ass': { matchMethod: 0, repeat: true, sub: 'butt' },
    'asses': { matchMethod: 0, repeat: false, sub: 'butts' },
    'asshole': { matchMethod: 1, repeat: true, sub: 'jerk' },
    'badass': { matchMethod: 1, repeat: true, sub: 'cool' },
    'bastard': { matchMethod: 1, repeat: true, sub: 'idiot' },
    'bitch': { matchMethod: 1, repeat: true, sub: 'bench' },
    'cocksucker': { matchMethod: 1, repeat: true, sub: 'suckup' },
    'cunt': { matchMethod: 1, repeat: true, sub: 'expletive' },
    'dammit': { matchMethod: 1, repeat: false, sub: 'dangit' },
    'damn': { matchMethod: 1, repeat: false, sub: 'dang' },
    'dumbass': { matchMethod: 1, repeat: true, sub: 'idiot' },
    'fag': { matchMethod: 0, repeat: true, sub: 'gay' },
    'faggot': { matchMethod: 1, repeat: true, sub: 'gay' },
    'fags': { matchMethod: 0, repeat: true, sub: 'gays' },
    'fuck': { matchMethod: 1, repeat: true, sub: 'freak' },
    'goddammit': { matchMethod: 1, repeat: true, sub: 'dangit' },
    'hell': { matchMethod: 0, repeat: true, sub: 'heck' },
    'jackass': { matchMethod: 1, repeat: true, sub: 'jerk' },
    'nigga': { matchMethod: 0, repeat: true, sub: 'bruh' },
    'nigger': { matchMethod: 0, repeat: true, sub: 'man' },
    'niggers': { matchMethod: 0, repeat: true, sub: 'people' },
    'piss': { matchMethod: 1, repeat: true, sub: 'pee' },
    'pissed': { matchMethod: 1, repeat: true, sub: 'ticked' },
    'pussies': { matchMethod: 0, repeat: true, sub: 'softies' },
    'pussy': { matchMethod: 0, repeat: true, sub: 'softie' },
    'shit': { matchMethod: 1, repeat: true, sub: 'crap' },
    'slut': { matchMethod: 1, repeat: true, sub: 'tramp' },
    'tits': { matchMethod: 1, repeat: true, sub: 'chest' },
    'twat': { matchMethod: 1, repeat: true, sub: 'dumbo' },
    'whore': { matchMethod: 1, repeat: true, sub: 'tramp' },
    'bolo': { matchMethod: 0, repeat: true, sub: 'maumbile ya kiume' },
    'bwege': { matchMethod: 1, repeat: true, sub: 'maumbile ya kiume' },
    'fala': { matchMethod: 0, repeat: true, sub: '' },
    'fara': { matchMethod: 0, repeat: true, sub: '' },
    'fira': { matchMethod: 1, repeat: true, sub: 'kinyume na maumbile' },
    'firwa': { matchMethod: 1, repeat: true, sub: 'kinyume na maumbile' },
    'kuma': { matchMethod: 0, repeat: true, sub: 'maumbile ya kike' },
    'kumalake': { matchMethod: 1, repeat: true, sub: '' },
    'kumalamsenge': { matchMethod: 1, repeat: true, sub: '' },
    'kumamae': { matchMethod: 1, repeat: true, sub: '' },
    'kundu': { matchMethod: 0, repeat: true, sub: '' },
    'Kusagana': { matchMethod: 0, repeat: true, sub: '' },
    'Kutomba': { matchMethod: 0, repeat: true, sub: '' },
    'Kutombana': { matchMethod: 0, repeat: true, sub: '' },
    'Kahaba': { matchMethod: 0, repeat: true, sub: '' },
    'malaya': { matchMethod: 1, repeat: true, sub: '' },
    'matako': { matchMethod: 1, repeat: true, sub: 'makalio' },
    'mavuzi': { matchMethod: 1, repeat: true, sub: 'nywele za sehemu ya siri' },
    'mbolo': { matchMethod: 1, repeat: true, sub: 'maumbile ya kiume' },
    'mboo': { matchMethod: 0, repeat: true, sub: 'maumbile ya kiume' },
    'mfiraji': { matchMethod: 0, repeat: true, sub: '' },
    'mfirwaji': { matchMethod: 0, repeat: true, sub: '' },
    'mjanechuo': { matchMethod: 0, repeat: true, sub: '' },
    'mkundu': { matchMethod: 1, repeat: true, sub: '' },
    'mngese': { matchMethod: 0, repeat: true, sub: '' },
    'msagaji': { matchMethod: 0, repeat: true, sub: '' },
    'msenge': { matchMethod: 0, repeat: true, sub: '' },
    'mxenge': { matchMethod: 0, repeat: true, sub: '' },
    'msengenyaji': { matchMethod: 0, repeat: true, sub: '' },
    'mshenzi': { matchMethod: 1, repeat: true, sub: '' },
    'nyoko': { matchMethod: 0, repeat: true, sub: '' },
    'nyoo': { matchMethod: 0, repeat: true, sub: '' },
    'pumbu': { matchMethod: 0, repeat: true, sub: '' },
    'senge': { matchMethod: 0, repeat: true, sub: '' },
    'shahawa': { matchMethod: 1, repeat: true, sub: 'manii' },
    'shenzi': { matchMethod: 0, repeat: true, sub: '' },
    'tako': { matchMethod: 0, repeat: true, sub: 'kalio' },
    'tiana': { matchMethod: 0, repeat: true, sub: '' },
    'tiwa': { matchMethod: 0, repeat: true, sub: '' },
    'tomb': { matchMethod: 1, repeat: true, sub: 'tendo la ndoa' },
    'tomba': { matchMethod: 1, repeat: true, sub: 'tendo la ndoa' },
    'tombana': { matchMethod: 1, repeat: true, sub: 'tendo la ndoa' },
    'tombwa': { matchMethod: 1, repeat: true, sub: 'tendo la ndoa' },
    'uboo': { matchMethod: 0, repeat: true, sub: 'maumbile ya kiume' },
    'ubolo': { matchMethod: 0, repeat: true, sub: 'maumbile ya kiume' },
    'kisimi': { matchMethod: 0, repeat: true, sub: '' },
    'kicmi': { matchMethod: 0, repeat: true, sub: '' },
    'kixmi': { matchMethod: 0, repeat: true, sub: '' },
    'usenge': { matchMethod: 0, repeat: true, sub: '' },
    'ufiraji': { matchMethod: 0, repeat: true, sub: '' },
    'ufirwaji': { matchMethod: 0, repeat: true, sub: '' },
    'tahira': { matchMethod: 0, repeat: true, sub: '' }
  };

static _defaultWords = Config._maneno;

  static readonly _filterMethodNames = ['Censor', 'Substitute', 'Remove'];
  static readonly _matchMethodNames = ['Exact', 'Partial', 'Whole', 'Per-Word', 'Regular-Expression'];
  static readonly _maxBytes = 6500;
  static readonly _maxWords = 100;
  static readonly _wordsPattern = /^_words\d+/;

  constructor(config) {
    if (typeof config === 'undefined') {
      throw new Error('Cannot be called directly. call build()');
    }
    for(let k in config) this[k]=config[k];
  }

  addWord(str: string, options?: WordOptions) {
    str = str.trim().toLowerCase();
    if (Object.keys(this.words).includes(str)) {
      return false; // Already exists
    } else if (options) {
      options.sub = options.sub.trim().toLowerCase();
      this.words[str] = options;
      return true;
    } else {
      this.words[str] = {matchMethod: this.defaultWordMatchMethod, repeat: this.defaultWordRepeat, sub: ''};
      return true;
    }
  }

  repeatForWord(word: string): boolean {
    if (this.words[word].repeat === true || this.words[word].repeat === false) {
      return this.words[word].repeat;
    } else {
      return this.defaultWordRepeat;
    }
  }

  sanitizeWords() {
    let sanitizedWords = {};
    Object.keys(this.words).sort().forEach((key) => {
      sanitizedWords[key.trim().toLowerCase()] = this.words[key];
    });
    this.words = sanitizedWords;
  }
}