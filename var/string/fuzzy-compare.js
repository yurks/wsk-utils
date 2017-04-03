var reSp = /\s+/;
var reJunk = /'&/;

function getSimilarityScore(text, input, opts) {
    text = text.toLowerCase();
    input = input.toLowerCase();
    var textWords = text.split(reSp);
    var inputWords = input.split(reSp);
    var wordsScore = getWordsScore(textWords, inputWords);
    var startsWithScore = getStartsWithScore(textWords, inputWords);
    var charsScore = getCharsScore(text, input);
    return (
        wordsScore * opts.wordsScoreFactor +
        startsWithScore * opts.startsWithScoreFactor +
        charsScore * opts.charsScoreFactor
    ) / (opts.wordsScoreFactor + opts.startsWithScoreFactor + opts.charsScoreFactor);
}

function getWordsScore(textWords, inputWords) {
    var sharedWordsCount = 0;
    for (var i = 0; i < inputWords.length; i++) {
        if (textWords.indexOf(inputWords[i]) !== -1) {
            sharedWordsCount++;
        }
    }
    return sharedWordsCount/(inputWords.length + textWords.length - sharedWordsCount);
}

function getStartsWithScore(textWords, inputWords) {
    var sharedWordsStartCount = 0;
    for (var i = 0; i < inputWords.length; i++) {
        for (var j = 0; j < textWords.length; j++) {
            if (textWords[j].indexOf(inputWords[i]) === 0) {
                sharedWordsStartCount++;
            }
        }
    }
    return sharedWordsStartCount/(inputWords.length + textWords.length - sharedWordsStartCount);
}

function getCharsScore(text, input) {
    var sharedCharsCount = 0;
    for(var i = 0; i < text.length; i++) {
        var c = text[i];
        var matchedCharIndex = input.indexOf(c, sharedCharsCount);
        if (matchedCharIndex !== -1) {
            sharedCharsCount++;
        }
    }
    return sharedCharsCount/(input.length + text.length - sharedCharsCount);
}

module.exports = function fuzzyCompare(s1, s2, input, opts) {
    if (!input) {
        return 0;
    }
    input = input.replace(reJunk, '');
    opts.wordsScoreFactor = 'wordsScoreFactor' in opts ? opts.wordsScoreFactor : 1;
    opts.startsWithScoreFactor = 'startsWithScoreFactor' in opts ? opts.startsWithScoreFactor : 1;
    opts.charsScoreFactor = 'charsScoreFactor' in opts ? opts.charsScoreFactor : 1;
    var srS1 = getSimilarityScore(s1.replace(reJunk, ''), input, opts);
    var srS2 = getSimilarityScore(s2.replace(reJunk, ''), input, opts);
    if (srS1 < srS2) {
        return 1;
    }
    if (srS1 > srS2) {
        return -1;
    }
    return 0;
};
