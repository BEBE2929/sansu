'use strict';

// ===== 多言語テキスト =====
const i18n = {
  ja: {
    appTitle:    '算数れんしゅう',
    appSubtitle: 'たし算・ひき算にチャレンジ！',
    selectLevel: 'レベルをえらんでね 🌸',
    easy:        'かんたん',
    normal:      'ふつう',
    hard:        'むずかしい',
    easyDesc:    '1けたのたし算・ひき算',
    normalDesc:  '2けた ＋ 1けた',
    hardDesc:    '2けた ＋ 2けた（くり上がりあり）',
    selectOp:    'けいさんのしゅるい 🌸',
    opBoth:      'まじり',
    opAdd:       'たし算だけ',
    opSub:       'ひき算だけ',
    start:       'スタート！',
    question:    'もんだい',
    correct:     'せいかい',
    answer:      'こたえる',
    result:      'けっか',
    retry:       'もう一度！',
    feedbackCorrect: '⭐ せいかい！',
    feedbackWrong:   '💦 ざんねん…',
    msgPerfect:  '🎉 パーフェクト！すごい！',
    msg18:       '🌸 とってもよくできました！',
    msg15:       '⭐ よくできました！',
    msg10:       '💪 もう少し！がんばろう！',
    msgLow:      '🌷 れんしゅうしよう！',
    wrongTitle:  '💦 まちがえた もんだい',
    noWrong:     '🎉 まちがいなし！ かんぺき！',
    yourAns:     'あなた',
    correctAns:  'こたえ',
  },
  ko: {
    appTitle:    '산수 연습',
    appSubtitle: '덧셈·뺄셈에 도전해요!',
    selectLevel: '레벨을 선택해요 🌸',
    easy:        '쉬움',
    normal:      '보통',
    hard:        '어려움',
    easyDesc:    '한 자리 덧셈·뺄셈',
    normalDesc:  '두 자리 ＋ 한 자리',
    hardDesc:    '두 자리 ＋ 두 자리 (올림 있음)',
    selectOp:    '계산 종류 🌸',
    opBoth:      '섞기',
    opAdd:       '덧셈만',
    opSub:       '뺄셈만',
    start:       '시작！',
    question:    '문제',
    correct:     '정답',
    answer:      '답하기',
    result:      '결과',
    retry:       '다시 하기！',
    feedbackCorrect: '⭐ 정답！',
    feedbackWrong:   '💦 아쉬워요…',
    msgPerfect:  '🎉 퍼펙트！대단해요！',
    msg18:       '🌸 정말 잘했어요！',
    msg15:       '⭐ 잘했어요！',
    msg10:       '💪 조금만 더！힘내요！',
    msgLow:      '🌷 연습해봐요！',
    wrongTitle:  '💦 틀린 문제',
    noWrong:     '🎉 틀린 문제 없어요！ 완벽！',
    yourAns:     '내 답',
    correctAns:  '정답',
  },
};

// ===== 状態 =====
let lang = 'ja';
let difficulty = 'easy';
let opType = 'both';
let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let currentAnswer = '';
let wrongAnswers = [];

const TOTAL = 20;

// ===== 言語切り替え =====
function setLang(l) {
  lang = l;
  document.getElementById('btn-ja').classList.toggle('active', l === 'ja');
  document.getElementById('btn-ko').classList.toggle('active', l === 'ko');
  document.documentElement.lang = l === 'ko' ? 'ko' : 'ja';
  applyI18n();
  updateDiffDesc();
}

function t(key) {
  return (i18n[lang] && i18n[lang][key]) || key;
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
}

// ===== 難易度 =====
function selectDifficulty(diff) {
  difficulty = diff;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector(`.diff-btn[data-diff="${diff}"]`).classList.add('selected');
  updateDiffDesc();
}

// ===== 計算種類 =====
function selectOp(op) {
  opType = op;
  document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector(`.op-btn[data-op="${op}"]`).classList.add('selected');
}

function updateDiffDesc() {
  const desc = { easy: t('easyDesc'), normal: t('normalDesc'), hard: t('hardDesc') };
  document.getElementById('diff-desc').textContent = desc[difficulty] || '';
}

// ===== 問題生成 =====
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  let a, b, op;
  if (difficulty === 'easy') {
    a = rand(1, 9);
    b = rand(1, 9);
  } else if (difficulty === 'normal') {
    a = rand(10, 99);
    b = rand(1, 9);
  } else {
    a = rand(10, 99);
    b = rand(10, 99);
  }
  if (opType === 'add') op = '+';
  else if (opType === 'sub') op = '-';
  else op = Math.random() < 0.5 ? '+' : '-';
  if (op === '-' && a < b) [a, b] = [b, a];
  const answer = op === '+' ? a + b : a - b;
  return { a, b, op, answer };
}

function generateAllQuestions() {
  questions = Array.from({ length: TOTAL }, generateQuestion);
}

// ===== 画面遷移 =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ===== ゲーム開始 =====
function startGame() {
  generateAllQuestions();
  currentIndex = 0;
  score = 0;
  wrongAnswers = [];
  showScreen('screen-game');
  showQuestion();
}

function updateAnswerDisplay() {
  document.getElementById('answer-input').textContent = currentAnswer === '' ? '?' : currentAnswer;
}

function showQuestion() {
  answered = false;
  currentAnswer = '';
  const q = questions[currentIndex];
  document.getElementById('num1').textContent = q.a;
  document.getElementById('operator').textContent = q.op === '+' ? '＋' : '－';
  document.getElementById('num2').textContent = q.b;
  document.getElementById('current-q').textContent = currentIndex + 1;
  document.getElementById('total-q').textContent = TOTAL;
  document.getElementById('score-display').textContent = score;
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  updateAnswerDisplay();

  const pct = (currentIndex / TOTAL) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
}

// ===== 回答 =====
function submitAnswer() {
  if (answered) return;
  const val = currentAnswer.trim();
  if (val === '') return;

  answered = true;
  const q = questions[currentIndex];
  const userAnswer = parseInt(val, 10);
  const fb = document.getElementById('feedback');

  if (userAnswer === q.answer) {
    score++;
    fb.textContent = t('feedbackCorrect');
    fb.className = 'feedback correct pop';
  } else {
    fb.textContent = `${t('feedbackWrong')}  (${q.answer})`;
    fb.className = 'feedback wrong pop';
    wrongAnswers.push({ a: q.a, b: q.b, op: q.op, correct: q.answer, yours: userAnswer });
  }

  document.getElementById('score-display').textContent = score;

  setTimeout(() => {
    currentIndex++;
    if (currentIndex >= TOTAL) {
      showResult();
    } else {
      showQuestion();
    }
  }, 900);
}

// ===== 数字パッド =====
function appendNum(n) {
  if (currentAnswer.length < 4) {
    currentAnswer += n;
    updateAnswerDisplay();
  }
}

function deleteNum() {
  currentAnswer = currentAnswer.slice(0, -1);
  updateAnswerDisplay();
}

// ===== 結果 =====
function showResult() {
  document.getElementById('progress-bar').style.width = '100%';
  showScreen('screen-result');

  document.getElementById('result-correct').textContent = score;
  document.getElementById('result-total').textContent = TOTAL;

  let emoji, msg;
  if (score === TOTAL) {
    emoji = '🎉'; msg = t('msgPerfect');
  } else if (score >= 18) {
    emoji = '🌸'; msg = t('msg18');
  } else if (score >= 15) {
    emoji = '⭐'; msg = t('msg15');
  } else if (score >= 10) {
    emoji = '💪'; msg = t('msg10');
  } else {
    emoji = '🌷'; msg = t('msgLow');
  }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-message').textContent = msg;

  const starFull  = Math.round((score / TOTAL) * 5);
  const stars = '★'.repeat(starFull) + '☆'.repeat(5 - starFull);
  document.getElementById('result-stars').textContent = stars;

  const wrongSection = document.getElementById('wrong-section');
  const wrongList = document.getElementById('wrong-list');
  wrongList.innerHTML = '';

  if (wrongAnswers.length === 0) {
    wrongList.innerHTML = `<div class="no-wrong">${t('noWrong')}</div>`;
  } else {
    wrongAnswers.forEach(w => {
      const opSymbol = w.op === '+' ? '＋' : '－';
      const item = document.createElement('div');
      item.className = 'wrong-item';
      item.innerHTML =
        `<span class="wrong-expr">${w.a} ${opSymbol} ${w.b} ＝</span>` +
        `<span class="wrong-yours">${w.yours}</span>` +
        `<span class="wrong-arrow">→</span>` +
        `<span class="wrong-correct">✓ ${w.correct}</span>`;
      wrongList.appendChild(item);
    });
  }
  wrongSection.style.display = 'flex';
}

function backToTop() {
  document.getElementById('wrong-section').style.display = 'none';
  showScreen('screen-top');
  applyI18n();
  updateDiffDesc();
}

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  applyI18n();
  selectDifficulty('easy');
  selectOp('both');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
});
