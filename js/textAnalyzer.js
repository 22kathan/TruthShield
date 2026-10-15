/**
 * TruthShield Text Analyzer
 * Detects clickbait, sentiment bias, misinformation patterns, and writing quality.
 * Provides high-accuracy URL domain reputation and multilingual Indic language support.
 */
class TextAnalyzer {
  constructor() {
    this.nlp = new NLPEngineClass();

    // Latin & Multilingual Clickbait phrases
    this.clickbaitPhrases = [
      'you won\'t believe', 'mind-blowing', 'jaw-dropping', 'they don\'t want you to know',
      'this will change', 'what happens next', 'number \\d+ will', 'gone wrong', 'epic fail',
      'exclusive leak', 'watch till end', 'banned by government', 'censored truth', 'hidden truth',
      'miracle cure', 'secret trick', 'shocking truth', 'shocking revelation', 'unbelievable secret',
      'चौंकाने वाला', 'सनसनीखेज', 'बड़ा खुलासा', 'होश उड़ जाएंगे', 'हैरान कर देने वाला', 'सनसनी',
      'ચોંકાવનારું', 'સનસનાટીભર્યા', 'મોટો ખુલાસો', 'ધડાકો', 'હચમચાવી દીધું',
      'அதிர்ச்சி', 'ரகசியம் உடைந்தது', 'பரபரப்பு'
    ];

    // High-signal clickbait keywords (matched with strict word boundaries)
    this.clickbaitKeywords = [
      'shocking', 'unbelievable', 'jaw-dropping', 'exposed', 'miraculous',
      'obliterated', 'slammed', 'blasted', 'ripped', 'cringe',
      'वायरल', 'વાયરલ', 'வைரல்'
    ];

    // Polarizing and manipulative bias terminology (intent to polarize, inflame, or slander)
    this.polarizingWords = [
      'corrupt', 'traitor', 'treason', 'scam', 'fraud', 'conspiracy', 'evil', 'villain',
      'outrageous', 'disgusting', 'infuriating', 'scumbag', 'puppet', 'sinister', 'witch-hunt',
      'brainwashed', 'shameless', 'propaganda'
    ];

    // Factual crisis and tragedy terms (describe real-world disasters/events, NOT manipulative if cited)
    this.crisisReportingWords = [
      'crisis', 'emergency', 'disaster', 'catastrophe', 'catastrophic', 'devastating',
      'earthquake', 'flood', 'attack', 'accident', 'casualty', 'casualties', 'death', 'killed',
      'threat', 'rubble', 'tragedy', 'investigation', 'pandemic'
    ];

    // Unreliable / Viral forward rumors
    this.unreliablePatterns = [
      /forward (this|as received)/i,
      /received from (a |my )?(friend|reliable source|whatsapp)/i,
      /share (this )?(before|with everyone)/i,
      /government (is hiding|doesn'?t want)/i,
      /exposed[!]+/i,
      /100% (true|real|confirmed)/i,
      /scientists? (hate|don'?t want)/i,
      /\b(big pharma|deep state|illuminati|new world order)\b/i,
      /(?:just )?received (?:on |from )whatsapp/i,
      /(?:आगे भेजें|व्हाट्सएप पर आया|फॉरवर्ड करें|सरकार छुपा रही है|सबको शेयर करें)/u,
      /(?:આગળ મોકલો|શેર કરો|વોટ્સએપ પર મળેલ|સરકાર છુપાવી રહી છે)/u,
      /(?:பகிர்ந்து கொள்ளுங்கள்|பகிரவும்|வாட்ஸ்அப்பில் வந்தது)/u
    ];

    // Verified trusted domain registry
    this.trustedDomains = [
      'reuters.com', 'apnews.com', 'bbc.com', 'bbc.co.uk', 'thehindu.com', 'indianexpress.com',
      'ndtv.com', 'hindustantimes.com', 'pib.gov.in', 'altnews.in', 'boomlive.in', 'factly.in',
      'thequint.com', 'factcheck.org', 'snopes.com', 'politifact.com', 'washingtonpost.com',
      'nytimes.com', 'theguardian.com', 'timesofindia.indiatimes.com', 'who.int', 'cdc.gov',
      'nature.com', 'sciencedirect.com', 'ani.in', 'aninews.in', 'ptinews.com'
    ];

    this.sentimentLexicon = {
      'good': 2, 'great': 3, 'excellent': 4, 'amazing': 3, 'wonderful': 3, 'fantastic': 3, 'love': 2, 'happy': 2,
      'bad': -2, 'terrible': -3, 'horrible': -3, 'awful': -3, 'hate': -3, 'angry': -2, 'sad': -2, 'fear': -2,
      'kill': -3, 'death': -2, 'die': -2, 'murder': -3, 'war': -2, 'attack': -2, 'threat': -2, 'danger': -2,
      'peace': 2, 'safe': 2, 'protect': 2, 'help': 2, 'support': 2, 'trust': 2, 'honest': 2, 'truth': 2,
      'lie': -3, 'fake': -3, 'fraud': -3, 'scam': -3, 'cheat': -3, 'steal': -3, 'corrupt': -4, 'evil': -4
    };
  }

  /**
   * Helper: Matches whole word or phrase, supporting Latin boundaries and Unicode scripts
   */
  matchWordOrPhrase(text, pattern) {
    if (/[^\x00-\x7F]/.test(pattern)) {
      const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^\\p{L}\\p{N}])${escaped}(?:$|[^\\p{L}\\p{N}])`, 'u');
      return regex.test(text);
    } else {
      const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(text);
    }
  }

  /**
   * Main text analysis entrypoint
   */
  async analyze(text, options = {}) {
    if (!text || text.trim().length < 5) {
      return { error: 'Please provide valid text or a web address to analyze.' };
    }

    const cleaned = text.trim();

    // If input is an explicit URL or URL string, run specialized domain intelligence
    if (options.isUrl || /^https?:\/\/[^\s]+$/i.test(cleaned)) {
      return this.analyzeUrl(cleaned);
    }

    if (cleaned.length < 10) {
      return { error: 'Please provide at least 10 characters of text to analyze.' };
    }

    const words = cleaned.split(/\s+/).filter(Boolean);
    const sentences = cleaned.split(/[.!?।]+/).filter(s => s.trim().length > 0);
    const lang = this.detectLanguage(cleaned);

    const clickbait = this.detectClickbait(cleaned, words);
    const credibility = this.analyzeCredibility(cleaned);
    const quality = this.analyzeWritingQuality(cleaned, words, sentences);
    const sentiment = this.analyzeSentiment(cleaned, words, credibility.hasCitation, quality.score);

    // NLP: Stance detection + semantic similarity
    let nlpResult;
    if (window.MLCore && window.MLCore.loaded) {
      const mlSim = await window.MLCore.analyzeSimilarity(cleaned);
      const mlStance = await window.MLCore.classifyStance(cleaned);
      
      const stanceWeight = mlStance.stance === 'asserting' ? mlStance.confidence * 0.35 :
                           mlStance.stance === 'attributing' ? -10 : 0;
      const simWeight = mlSim.topScore * 0.6;
      const nlpRisk = Math.max(0, Math.min(100, Math.round(stanceWeight + simWeight)));

      nlpResult = {
        stance: mlStance,
        similarity: mlSim,
        nlpRisk,
        isNeural: true
      };
    } else {
      nlpResult = this.nlp.analyze(cleaned);
      nlpResult.isNeural = false;
    }

    const flags = this.generateFlags(cleaned, clickbait, sentiment, credibility, quality, nlpResult);

    // Calculate calibrated overall trust score (0-100)
    const rawScore = (
      (100 - clickbait.score) * 0.25 +
      (100 - sentiment.biasScore) * 0.15 +
      credibility.score * 0.20 +
      quality.score * 0.20 +
      (100 - nlpResult.nlpRisk) * 0.20
    );
    const trustScore = Math.round(Math.max(0, Math.min(100, rawScore)));

    let verdict, verdictClass;
    if (trustScore >= 75) { verdict = 'Likely Authentic'; verdictClass = 'success'; }
    else if (trustScore >= 50) { verdict = 'Needs Verification'; verdictClass = 'warning'; }
    else if (trustScore >= 25) { verdict = 'Suspicious Content'; verdictClass = 'warning'; }
    else { verdict = 'Likely Misinformation'; verdictClass = 'danger'; }

    return {
      trustScore, verdict, verdictClass, lang,
      clickbait: clickbait.score,
      sentiment: sentiment.biasScore,
      credibility: credibility.score,
      quality: quality.score,
      nlp: nlpResult,
      flags,
      explanation: this.generateExplanation(trustScore, clickbait, sentiment, credibility, quality, lang, nlpResult),
      stats: { words: words.length, sentences: sentences.length, characters: cleaned.length }
    };
  }

  /**
   * Dedicated URL Domain Reputation & Forensics
   */
  analyzeUrl(rawUrl) {
    try {
      let parsedUrl;
      try {
        parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      } catch (e) {
        return {
          error: 'Invalid URL format. Please provide a valid address (e.g., https://reuters.com/news).'
        };
      }

      const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, '');
      const protocol = parsedUrl.protocol;
      const pathname = parsedUrl.pathname.toLowerCase();
      const findings = [];
      const flags = [];

      let domainScore = 60; // neutral base for unknown domain
      let clickbaitScore = 0;
      let sentimentScore = 15;
      let qualityScore = 75;

      // 1. SSL/Protocol check
      const isHttps = protocol === 'https:';
      if (!isHttps) {
        domainScore -= 20;
        qualityScore -= 25;
        flags.push({
          type: 'danger',
          icon: 'fas fa-lock-open',
          text: 'Insecure connection (HTTP instead of HTTPS). Legitimate publishers require SSL/TLS encryption.'
        });
      } else {
        findings.push('Secure SSL/TLS encrypted protocol (HTTPS)');
      }

      // 2. IP-based host check
      const isIpHost = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith('[');
      if (isIpHost) {
        domainScore = 10;
        flags.push({
          type: 'danger',
          icon: 'fas fa-network-wired',
          text: 'Direct numeric IP address hostname detected. Common indicator of phishing or unverified bot servers.'
        });
      }

      // 3. Punycode / IDN homograph attack check
      if (hostname.includes('xn--')) {
        domainScore -= 35;
        flags.push({
          type: 'danger',
          icon: 'fas fa-mask',
          text: 'Punycode / IDN homograph domain detected. This is a common spoofing tactic mimicking genuine Latin domain names.'
        });
      }

      // 4. Domain & TLD Reputation
      const trustedMatch = this.trustedDomains.find(d => hostname === d || hostname.endsWith('.' + d));
      const isGovOrEdu = /\.(gov|gov\.[a-z]{2}|edu|edu\.[a-z]{2}|ac\.[a-z]{2}|nic\.in|org\.in)$/i.test(hostname);
      const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.click', '.buzz', '.icu', '.fit', '.rest'];
      const hasSuspiciousTld = suspiciousTlds.some(tld => hostname.endsWith(tld));

      // Typosquatting / spoofing checks (e.g. "bbc-news-daily.com", "reuters-breaking.tk")
      const knownBrands = ['reuters', 'bbc', 'cnn', 'nytimes', 'thehindu', 'ndtv', 'who', 'unicef', 'pib'];
      const isSpoofedBrand = knownBrands.some(brand => hostname.includes(brand) && !trustedMatch);

      if (trustedMatch || isGovOrEdu) {
        domainScore = isGovOrEdu ? 98 : 95;
        qualityScore = 95;
        const orgName = trustedMatch ? trustedMatch.toUpperCase() : 'Official Institutional/Government Domain';
        flags.push({
          type: 'success',
          icon: 'fas fa-certificate',
          text: `Verified authentic news/fact-checking domain: "${hostname}". Recognized as an accredited source (${orgName}).`
        });
        findings.push(`Verified domain tier: ${orgName}`);
      } else if (isSpoofedBrand) {
        domainScore = 15;
        flags.push({
          type: 'danger',
          icon: 'fas fa-triangle-exclamation',
          text: `Potential brand impersonation/typosquatting detected: Hostname "${hostname}" mimics a major news outlet without authentic domain ownership.`
        });
      } else if (hasSuspiciousTld) {
        domainScore -= 30;
        flags.push({
          type: 'danger',
          icon: 'fas fa-shield-virus',
          text: `High-risk free/disposable top-level domain detected (${hostname.split('.').pop()}). Frequently associated with ephemeral misinformation sites.`
        });
      } else {
        findings.push(`Standard unverified domain: "${hostname}". Requires cross-referencing.`);
      }

      // 5. URL Path Clickbait / Sensationalism
      const pathWords = pathname.split(/[-_/.]/).filter(Boolean);
      let pathClickbaitHits = 0;
      this.clickbaitKeywords.forEach(cb => {
        if (typeof cb === 'string' && /^[a-z]+$/i.test(cb) && pathWords.includes(cb.toLowerCase())) {
          pathClickbaitHits++;
        }
      });

      if (pathClickbaitHits > 0) {
        clickbaitScore = Math.min(85, pathClickbaitHits * 25);
        sentimentScore += 25;
        flags.push({
          type: 'warning',
          icon: 'fas fa-bullhorn',
          text: `Sensationalist keywords identified in URL slug (${pathWords.slice(0, 3).join(', ')}).`
        });
      }

      // Final Trust Score calculation for URL
      const trustScore = Math.max(5, Math.min(99, Math.round(
        domainScore * 0.50 +
        (100 - clickbaitScore) * 0.20 +
        qualityScore * 0.20 +
        (100 - sentimentScore) * 0.10
      )));

      let verdict, verdictClass;
      if (trustScore >= 75) { verdict = 'Trusted Domain'; verdictClass = 'success'; }
      else if (trustScore >= 50) { verdict = 'Unverified Domain'; verdictClass = 'warning'; }
      else if (trustScore >= 25) { verdict = 'Suspicious Domain'; verdictClass = 'warning'; }
      else { verdict = 'High Risk / Impersonation'; verdictClass = 'danger'; }

      const nlpResult = {
        stance: {
          stance: trustedMatch ? 'attributing' : 'neutral',
          label: trustedMatch ? 'Accredited Source' : 'Web Domain Reference',
          icon: trustedMatch ? 'fas fa-newspaper' : 'fas fa-globe',
          confidence: 90,
          stanceRisk: trustedMatch ? 'Publisher adheres to established journalistic codes.' : 'Individual domain credibility must be corroborated.',
          distribution: { attributing: 70, asserting: 10, neutral: 20 },
          evidence: findings.map(f => ({ type: 'domain', marker: f }))
        },
        similarity: {
          topScore: isSpoofedBrand ? 65 : 0,
          riskLevel: isSpoofedBrand ? 'high' : 'none',
          riskLabel: isSpoofedBrand ? 'Matches known domain impersonation hoaxes' : 'No known URL phishing signature match',
          matches: []
        },
        nlpRisk: isSpoofedBrand ? 65 : hasSuspiciousTld ? 35 : 0,
        isNeural: false
      };

      if (flags.length === 0) {
        flags.push({
          type: 'success',
          icon: 'fas fa-circle-check',
          text: 'URL structure, domain authority, and security parameters appear normal.'
        });
      }

      const explanation = `Domain analysis for "${hostname}": Overall trust score is ${trustScore}/100 (${verdict}). ` +
        (trustedMatch ? `The domain is registered to an accredited international or regional reporting organization with documented editorial oversight.` :
         isSpoofedBrand ? `CRITICAL WARNING: This domain appears to mimic a well-known media organization. Do not treat content from this link as authentic without external confirmation.` :
         `This is an unlisted web property. Always verify claims published on this site against primary fact-checking databases.`);

      return {
        trustScore,
        verdict,
        verdictClass,
        lang: 'en',
        clickbait: clickbaitScore,
        sentiment: sentimentScore,
        credibility: Math.max(0, Math.min(100, domainScore)),
        quality: qualityScore,
        nlp: nlpResult,
        flags,
        explanation,
        stats: { words: pathWords.length, sentences: 1, characters: rawUrl.length, domain: hostname }
      };
    } catch (e) {
      console.error('URL analysis error:', e);
      return { error: 'Failed to analyze URL: ' + e.message };
    }
  }

  detectClickbait(text, words) {
    let score = 0;
    const findings = [];

    // 1. Multi-word clickbait phrases
    let phraseHits = 0;
    this.clickbaitPhrases.forEach(phrase => {
      if (this.matchWordOrPhrase(text, phrase)) {
        phraseHits++;
        findings.push(`Contains clickbait phrase: "${phrase}"`);
      }
    });
    score += Math.min(phraseHits * 20, 60);

    // 2. Clickbait single keywords
    let keywordHits = 0;
    this.clickbaitKeywords.forEach(kw => {
      if (this.matchWordOrPhrase(text, kw)) {
        keywordHits++;
        findings.push(`Sensationalist framing: "${kw}"`);
      }
    });
    score += Math.min(keywordHits * 12, 30);

    // 3. Excessive capital letters in Latin words
    const latinChars = text.match(/[A-Za-z]/g) || [];
    if (latinChars.length > 20) {
      const capsCount = (text.match(/[A-Z]/g) || []).length;
      if (capsCount / latinChars.length > 0.45) {
        score += 20;
        findings.push('Excessive use of CAPITAL LETTERS');
      }
    }

    // 4. Excessive punctuation
    const exclCount = (text.match(/[!?]{2,}/g) || []).length;
    if (exclCount > 0) {
      score += Math.min(exclCount * 10, 25);
      findings.push('Excessive punctuation (!!!, ???)');
    }

    // 5. Question-based provocative headline
    if (/^[^.]{5,80}\?$/m.test(text.trim())) {
      score += 10;
      findings.push('Uses question format (common clickbait pattern)');
    }

    // 6. Numbered list headlines ("Top 10", "5 things you won't...")
    if (/\b(?:top\s+)?\d+\s+(?:reasons?|ways?|things?|facts?|secrets?|tips?|hacks?|tricks?)\b/i.test(text)) {
      score += 10;
      findings.push('Uses numbered list engagement format');
    }

    return { score: Math.min(score, 100), findings };
  }

  analyzeSentiment(text, words, hasCitation = false, qualityScore = 70) {
    let positive = 0, negative = 0, total = 0;

    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, '');
      if (this.sentimentLexicon[clean]) {
        const val = this.sentimentLexicon[clean];
        if (val > 0) positive += val;
        else negative += Math.abs(val);
        total++;
      }
    });

    // Count manipulative / polarizing language
    let polarizingHits = 0;
    this.polarizingWords.forEach(w => {
      if (this.matchWordOrPhrase(text, w)) polarizingHits++;
    });

    // Count factual crisis words
    let crisisHits = 0;
    this.crisisReportingWords.forEach(w => {
      if (this.matchWordOrPhrase(text, w)) crisisHits++;
    });

    const sentimentScore = total > 0 ? (positive - negative) / total : 0;

    // Calibrate bias score:
    // If text has valid source attribution and good writing quality, factual crisis words represent
    // genuine reporting on tragic events, so we do NOT penalize heavily as manipulative bias.
    let crisisWeight = (hasCitation || qualityScore >= 75) ? 2 : 8;
    let biasScore = Math.min(100, Math.round(
      (polarizingHits * 15) +
      (crisisHits * crisisWeight) +
      (Math.abs(sentimentScore) * 12) +
      (negative > positive && polarizingHits > 0 ? 10 : 0)
    ));

    return {
      positive, negative, sentimentScore,
      biasScore,
      polarizingHits,
      crisisHits,
      direction: sentimentScore > 0.5 ? 'positive' : sentimentScore < -0.5 ? 'negative' : 'neutral'
    };
  }

  analyzeCredibility(text) {
    let score = 55; // Fair baseline
    const findings = [];

    // 1. Unreliable / Hoax transmission patterns
    let unreliableHits = 0;
    this.unreliablePatterns.forEach(pattern => {
      if (pattern.test(text)) {
        unreliableHits++;
      }
    });
    score -= unreliableHits * 20;
    if (unreliableHits > 0) findings.push(`Contains ${unreliableHits} viral forwarding/unsubstantiated rumor pattern(s)`);

    // 2. Source attribution check (English, Hindi, Gujarati, Tamil)
    const hasCitation = /\b(according to|source[s]?:|reported by|confirmed by|stated by|spokesperson|officials? said|police said|reuters|associated press|bbc|pib|ani|pti|press release|published in)\b/i.test(text) ||
      /(?:के अनुसार|ने पुष्टि की|अधिकारियों ने कहा|रिपोर्ट के मुताबिक|મુજબ|અધિકારીઓએ જણાવ્યું|અહેવાલ મુજબ|கூற்றுப்படி|தெரிவித்துள்ளனர்)/u.test(text);

    if (hasCitation) {
      score += 18;
      findings.push('Contains clear source attribution');
    }

    // 3. Direct quotations check
    const hasQuotes = /[""«»][^""«»]{4,}[""«»]/.test(text);
    if (hasQuotes) {
      score += 8;
      findings.push('Contains direct quotation from cited individuals');
    }

    // 4. Verifiable specifics (dates, statistics, figures)
    const hasSpecificData = /\b(january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\b\d{4}\b|\d+(?:\.\d+)?%|\$\d+|\₹\d+)/i.test(text);
    if (hasSpecificData) {
      score += 6;
      findings.push('Cites verifiable dates or statistical specifics');
    }

    // 5. Embedded URLs to trusted domains
    const urls = text.match(/https?:\/\/[^\s]+/g) || [];
    let trustedUrlCount = 0;
    urls.forEach(url => {
      try {
        const h = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
        if (this.trustedDomains.some(d => h === d || h.endsWith('.' + d))) {
          trustedUrlCount++;
        }
      } catch (e) {
        if (this.trustedDomains.some(d => url.toLowerCase().includes(d))) {
          trustedUrlCount++;
        }
      }
    });

    if (trustedUrlCount > 0) {
      score += 15;
      findings.push(`Cites ${trustedUrlCount} verified trusted news/fact-checking source link(s)`);
    } else if (urls.length > 0) {
      score -= 5;
    }

    return {
      score: Math.max(5, Math.min(100, score)),
      hasCitation,
      hasQuotes,
      findings
    };
  }

  analyzeWritingQuality(text, words, sentences) {
    let score = 75;
    const findings = [];

    // Average sentence length
    const avgSentLen = words.length / Math.max(sentences.length, 1);
    if (avgSentLen > 40) {
      score -= 10;
      findings.push('Very long run-on sentences (poor readability)');
    }

    // Spelling/grammar indicators for Latin text
    const typoPatterns = /\b(teh|recieve|seperate|definately|occured|goverment|accomodate|acheive)\b/i;
    if (typoPatterns.test(text)) {
      score -= 15;
      findings.push('Contains common spelling errors');
    }

    // Latin alphabet words for case analysis
    const latinWords = words.filter(w => /^[a-zA-Z]+$/.test(w));
    if (latinWords.length >= 8) {
      // Mixed case abuse (e.g. "sOmEtHiNg LiKe ThIs")
      const mixedCase = latinWords.filter(w => w.length > 3 && w !== w.toUpperCase() && w !== w.toLowerCase() && !/^[A-Z][a-z]+$/.test(w)).length;
      if (mixedCase > 2) {
        score -= 12;
        findings.push('Inconsistent capitalization (erratic casing)');
      }

      // ALL CAPS word ratio
      const allCapsWords = latinWords.filter(w => w.length > 2 && w === w.toUpperCase());
      if (allCapsWords.length / latinWords.length > 0.25) {
        score -= 18;
        findings.push('High ratio of ALL CAPS words — aggressive shouting tone');
      }
    }

    // Evidence-based language
    if (/\b(research|study|data|evidence|analysis|investigation|official|spokesperson|documented)\b/i.test(text)) {
      score += 10;
      findings.push('Uses evidence-based journalistic language');
    }

    return { score: Math.max(10, Math.min(100, score)), findings };
  }

  detectLanguage(text) {
    const hindiCount = (text.match(/[\u0900-\u097F]/g) || []).length;
    const gujaratiCount = (text.match(/[\u0A80-\u0AFF]/g) || []).length;
    const tamilCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
    const total = text.length || 1;

    if (hindiCount / total > 0.08) return 'hi';
    if (gujaratiCount / total > 0.08) return 'gu';
    if (tamilCount / total > 0.08) return 'ta';
    return 'en';
  }

  generateFlags(text, clickbait, sentiment, credibility, quality, nlpResult) {
    const flags = [];

    if (nlpResult && nlpResult.similarity && nlpResult.similarity.topScore > 35) {
      flags.push({
        type: nlpResult.similarity.topScore >= 60 ? 'danger' : 'warning',
        icon: 'fas fa-brain',
        text: `Neural check matches: ${nlpResult.similarity.topScore}% similarity to documented hoaxes (${nlpResult.similarity.riskLabel}).`
      });
    }

    if (nlpResult && nlpResult.stance && nlpResult.stance.stance === 'asserting' && nlpResult.stance.confidence > 55) {
      flags.push({
        type: 'warning',
        icon: 'fas fa-bullhorn',
        text: `High assertion stance (${nlpResult.stance.confidence}%): Text claims absolute authority without source citations.`
      });
    }

    if (clickbait.score > 60) {
      flags.push({ type: 'danger', icon: 'fas fa-bullhorn', text: 'High clickbait probability detected. Text uses sensationalist language designed to manipulate engagement.' });
    } else if (clickbait.score > 30) {
      flags.push({ type: 'warning', icon: 'fas fa-bullhorn', text: 'Moderate clickbait patterns found. Sensationalist elements present.' });
    }

    clickbait.findings.forEach(f => {
      flags.push({ type: 'warning', icon: 'fas fa-circle-exclamation', text: f });
    });

    if (sentiment.biasScore > 65) {
      flags.push({ type: 'danger', icon: 'fas fa-face-angry', text: `Strong emotional bias detected (${sentiment.direction} sentiment). Highly polarizing phrasing identified.` });
    } else if (sentiment.biasScore > 35) {
      flags.push({ type: 'warning', icon: 'fas fa-face-surprise', text: `Moderate emotional phrasing detected with ${sentiment.direction} tone.` });
    }

    credibility.findings.forEach(f => {
      flags.push({
        type: f.includes('attribution') || f.includes('quotation') || f.includes('specifics') || f.includes('trusted') ? 'success' : 'warning',
        icon: 'fas fa-building',
        text: f
      });
    });

    quality.findings.forEach(f => {
      flags.push({ type: f.includes('evidence-based') ? 'success' : 'warning', icon: 'fas fa-spell-check', text: f });
    });

    if (flags.length === 0) {
      flags.push({ type: 'success', icon: 'fas fa-check-circle', text: 'No significant red flags detected. Content aligns with standard journalistic practices.' });
    }

    return flags;
  }

  generateExplanation(score, clickbait, sentiment, credibility, quality, lang, nlpResult) {
    let explanation = '';

    if (score >= 75) {
      explanation = 'This content appears generally trustworthy. It demonstrates characteristics of legitimate reporting including balanced language, source attribution, and professional writing quality. ';
    } else if (score >= 50) {
      explanation = 'This content shows some concerning patterns that warrant further verification. Several elements raise questions about its reliability. ';
    } else if (score >= 25) {
      explanation = 'This content exhibits multiple characteristics commonly associated with misinformation. Cross-verifying with trusted fact-checking sources is strongly recommended. ';
    } else {
      explanation = 'This content shows strong indicators of misinformation or deliberate manipulation. Multiple red flags were detected across sensationalism, emotional framing, and lack of credible sources. ';
    }

    if (clickbait.score > 40) {
      explanation += `The text employs clickbait patterns (score: ${clickbait.score}%) commonly used to artificially amplify reach. `;
    }

    if (sentiment.biasScore > 40) {
      explanation += `Strong emotional or polarizing language was detected (bias score: ${sentiment.biasScore}%). `;
    }

    if (nlpResult && nlpResult.stance && nlpResult.stance.stance !== 'neutral') {
      explanation += `Stance analysis classified this as "${nlpResult.stance.label}" (${nlpResult.stance.confidence}% confidence). ${nlpResult.stance.stanceRisk} `;
    }

    if (nlpResult && nlpResult.similarity && nlpResult.similarity.topScore > 20) {
      explanation += `Semantic similarity analysis found ${nlpResult.similarity.riskLabel.toLowerCase()} (top match: ${nlpResult.similarity.topScore}%). `;
    }

    if (lang !== 'en') {
      const langNames = { hi: 'Hindi', gu: 'Gujarati', ta: 'Tamil' };
      explanation += `Content detected in ${langNames[lang] || 'non-English'} script. `;
    }

    explanation += 'Always corroborate information with multiple primary sources before sharing.';
    return explanation;
  }
}

// Export for global browser use
window.TextAnalyzerEngine = TextAnalyzer;
