import './styles.css'
import { appMeta, blockPatterns, effectAudio, learningVideos, numberCards, releaseChecklist } from './data'

const app = document.querySelector('#app')
const speechAudio = new Audio()
const fxAudio = new Audio()
const fxOverlayAudio = new Audio()
let pendingAutoSpeechTimer = null

speechAudio.preload = 'auto'
fxAudio.preload = 'auto'
fxOverlayAudio.preload = 'auto'

const storageKeys = {
  language: 'numberWebLanguage',
  bestScore: 'numberWebBestScore',
  hotspotDrafts: 'numberWebHotspotDrafts'
}

const allowHotspotEditing = false

function loadHotspotDrafts() {
  try {
    const raw = localStorage.getItem(storageKeys.hotspotDrafts)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function cloneHotspots(hotspots) {
  return hotspots.map((hotspot) => ({ ...hotspot }))
}

const state = {
  route: getRoute(),
  selectedLanguage: localStorage.getItem(storageKeys.language) || 'zh',
  playingType: '',
  modal: null,
  quiz: createQuizState(),
  editMode: false,
  hotspotDrafts: loadHotspotDrafts(),
  draggingHotspot: null,
  builderSessions: {}
}

speechAudio.addEventListener('ended', () => {
  state.playingType = ''
  render()
})

speechAudio.addEventListener('pause', () => {
  state.playingType = ''
  render()
})

function getRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/'
  const segments = hash.split('/').filter(Boolean)
  return {
    page: segments[0] || 'home',
    id: segments[1] ? Number(segments[1]) : null
  }
}

function navigate(path) {
  window.location.hash = path
}

function persistLanguage(language) {
  state.selectedLanguage = language
  localStorage.setItem(storageKeys.language, language)
}

const builderPalette = [
  { id: 'sun', labelZh: '阳光黄', labelEn: 'Sun Yellow', color: '#ffcb66' },
  { id: 'sky', labelZh: '天空蓝', labelEn: 'Sky Blue', color: '#67b7ff' },
  { id: 'mint', labelZh: '薄荷绿', labelEn: 'Mint Green', color: '#7ad7ad' }
]

const englishCardCopy = {
  1: { label: 'Number 1', tip: 'Find the number 1 in the picture and say it aloud.', mnemonic: '1 is like a paintbrush drawing.' },
  2: { label: 'Number 2', tip: 'Look for the number 2 in the picture and tap it.', mnemonic: '2 is like a duck swimming.' },
  3: { label: 'Number 3', tip: 'Find the number 3 and then open the learning tip.', mnemonic: '3 is like an ear listening.' },
  4: { label: 'Number 4', tip: 'Count together and find the number 4.', mnemonic: '4 is like a flag in the wind.' },
  5: { label: 'Number 5', tip: 'Tap the hotspots to learn the number 5.', mnemonic: '5 is like a hook on a scale.' },
  6: { label: 'Number 6', tip: 'Read number 6 first, then tap the audio button.', mnemonic: '6 is like a whistle making a sound.' },
  7: { label: 'Number 7', tip: 'Find the number 7 hidden in the picture.', mnemonic: '7 is like a sickle cutting grass.' },
  8: { label: 'Number 8', tip: 'Observe the picture and learn number 8.', mnemonic: '8 is like a twisted braid.' },
  9: { label: 'Number 9', tip: 'Tap the hotspots to explore number 9.', mnemonic: '9 is like a tadpole finding its mother.' },
  10: { label: 'Number 10', tip: 'Meet number 10 and finish one full round of practice.', mnemonic: '10 is one and zero holding hands.' }
}

const messages = {
  zh: {
    appName: appMeta.appName,
    navHome: '首页',
    navVideos: '看动画',
    navBuild: '积木',
    navQuiz: '闯关',
    navAbout: '关于',
    audioUnavailable: '音频不可用',
    speechError: '当前发音文件无法播放，请检查资源是否存在。',
    mnemonicError: '当前数字口诀音频无法播放，请检查资源是否存在。',
    openFailed: '打开失败',
    popupBlocked: '浏览器拦截了新窗口，请允许弹窗后再试。',
    copyHotspotsTitle: '热点坐标已复制',
    copyHotspotsText: '当前卡片的热点 JSON 已复制到剪贴板。',
    modalOk: '我知道了',
    homeBadge: 'Web 调试版',
    homeTitle: '和喜欢车车的小朋友一起学数字',
    homeDesc: '这一版可以直接在浏览器调试，保留数字卡片、图片热点、中英发音、鸣笛音效和闯关玩法。',
    homeStatImages: '张数字图片',
    homeStatLanguages: '种语言发音',
    homeStatEffects: '种互动音效',
    startQuiz: '开始闯关',
    goBuild: '去拼积木',
    releaseNotes: '查看发布说明',
    chooseNumber: '选择一个数字开始',
    chooseNumberDesc: '先看图，再听中英文发音，然后进入闯关模式。',
    startLearning: '开始学习',
    learnBadge: '双语学习',
    learnDesc: '支持数字口诀、中英发音、数字学习动画和积木拼数字玩法，也支持点击小汽车热点播放鸣笛音效。',
    chinese: '中文',
    english: 'English',
    guideTitle: '推荐玩法',
    guideText: '先点图片里的数字听口诀，再点中文和英文听读音，然后看看学习动画，最后去拼积木和闯关。',
    disableEdit: '关闭拖拽调试',
    enableEdit: '开启拖拽调试',
    copyHotspots: '复制当前热点 JSON',
    resetHotspots: '重置当前卡片热点',
    editTip: '拖动图片上的热点即可调整位置，松手后会自动保存在当前浏览器。',
    hotspotSpeech: '数字发音',
    hotspotHorn: '汽车鸣笛',
    hotspotHint: '橙色热点会播放当前数字发音，蓝色小汽车热点会播放鸣笛声音。',
    mnemonicBadge: '数字口诀',
    mnemonicHint: '点击图片里的数字也会直接播放这句口诀。',
    playMnemonic: '播放数字口诀',
    stopMnemonic: '停止数字口诀',
    playChineseAudio: '播放中文发音',
    stopChineseAudio: '停止中文发音',
    playEnglishAudio: '播放英文发音',
    stopEnglishAudio: '停止英文发音',
    videoBadge: '数字学习动画',
    videoTitle: '边看动画边学数字',
    videoPageDesc: '把学习动画单独放在这里，方便专门看视频，不打断当前数字学习。',
    videoItemTitle: (index) => `数字学习动画 ${index}`,
    videoItemSummary: (video) => video.summary,
    openVideo: '打开动画',
    currentCard: '当前学习卡片',
    previous: '上一个',
    next: '下一个',
    currentNumber: '当前数字',
    hotspotCount: '热点数量',
    playbackMode: '发音模式',
    editMode: '拖拽调试',
    enabled: '已开启',
    disabled: '未开启',
    sideNote: '建议先听口诀，再听中英发音，然后看动画，最后通过积木拼出对应数字。',
    buildNumber: (value) => `去拼 ${value} 号积木数字`,
    interactionTip: '互动提示',
    playHorn: '播放鸣笛',
    previewImage: '查看大图',
    watchVideosAction: '边看动画边学数字',
    buildWithBlocks: '积木拼数字',
    goQuizAction: '去做闯关题',
    buildBadge: '积木拼数字',
    buildTitle: (label) => `用积木拼出 ${label}`,
    buildDesc: '先选择颜色，再点亮带小车图案的格子，把数字拼出来。每点一下都会鸣笛，拼好后还会鼓掌。',
    resetBuild: '重新拼一遍',
    playCurrentMnemonic: '播放当前数字口诀',
    backToLearn: '返回学习页',
    builderCellHint: '点击小车积木，播放汽车鸣笛',
    currentTarget: '当前目标',
    number: '数字',
    cells: '格子数',
    status: '状态',
    completed: '完成',
    building: '拼搭中',
    buildGoalHint: '把所有浅色轮廓格子都拼满，就完成这个数字啦。',
    buildSuccess: '拼好啦，真棒。',
    buildIdle: '继续点亮积木块，把数字完整拼出来。',
    quizDone: '闯关完成',
    quizTitle: '数字闯关',
    quizScore: (score, total) => `得分 ${score} / ${total}`,
    quizStreak: (value) => `连续答对 ${value} 题`,
    quizQuestion: (value) => `第 ${value} 题`,
    quizDesc: '看图片，选出正确的数字。',
    listenChinese: '中文听题',
    hintsLeft: '剩余提示',
    currentStreak: '当前连对',
    bestStreak: '最佳连对',
    quizGuideTitle: '答题提示',
    quizGuideText: '先听题目音频，再看图片，最后从下面选项里找出正确数字。',
    useHint: (count) => `使用提示道具（剩余 ${count} 次）`,
    questionPrompt: '这张图里对应的是哪个数字？',
    playQuestion: '播放题目音频',
    stopQuestion: '停止题目音频',
    correct: '答对了',
    wrong: '这题答错了',
    correctFeedback: (value, streak) => `真棒，这张图片对应的是 ${value}。当前连续答对 ${streak} 题。`,
    wrongFeedback: (value) => `正确答案是 ${value}，再看一眼图片会更容易记住。`,
    nextQuestion: '下一题',
    viewResult: '查看成绩',
    resultScore: (score, total) => `本次得分 ${score} / ${total}`,
    bestScore: (score) => `历史最高 ${score} 分`,
    roundBestStreak: (value) => `本轮最高连对 ${value} 题`,
    retry: '再来一轮',
    backHome: '返回首页',
    resultPerfect: '全部答对了，太厉害了。',
    resultGreat: '答得很棒，再练几次会更熟。',
    resultGood: '已经认识不少数字了，继续加油。',
    resultKeepGoing: '先从图片和音频一起练习，下一轮会更好。',
    badgeChampion: '数字小冠军',
    badgeExpert: '数字小达人',
    badgeLearner: '数字练习生',
    badgeKeepGoing: '继续加油',
    aboutBadge: '发布准备',
    aboutMeta: (version, stage) => `版本 ${version} | 阶段 ${stage}`,
    aboutStatus: '当前状态',
    aboutStatusValue: '可继续提测',
    aboutNextStep: '建议下一步',
    aboutNextStepValue: '真机或浏览器核对热点和音频',
    aboutProjectTitle: '当前项目说明',
    aboutProjectText: '这个版本已经包含数字学习、双语发音、汽车鸣笛、闯关答题和奖励反馈，适合继续打磨后提交体验版。',
    aboutPrivacyTitle: '隐私与数据',
    aboutPrivacyText: '当前 Web 调试版不依赖登录、不上传个人数据，只在浏览器本地缓存历史最高分和语言选择。',
    aboutChecklistTitle: '上线前必改项',
    aboutContactTitle: '联系占位',
    releaseStageLabel: appMeta.releaseStageLabel,
    releaseChecklist
  },
  en: {
    appName: 'Number Explorer',
    navHome: 'Home',
    navVideos: 'Videos',
    navBuild: 'Blocks',
    navQuiz: 'Quiz',
    navAbout: 'About',
    audioUnavailable: 'Audio unavailable',
    speechError: 'The selected pronunciation audio could not be played. Please check the asset files.',
    mnemonicError: 'The mnemonic audio could not be played. Please check the asset files.',
    openFailed: 'Open failed',
    popupBlocked: 'The browser blocked the new tab. Please allow pop-ups and try again.',
    copyHotspotsTitle: 'Hotspots copied',
    copyHotspotsText: 'The current card hotspot JSON has been copied to the clipboard.',
    modalOk: 'Got it',
    homeBadge: 'Web Edition',
    homeTitle: 'Learn numbers with fun little cars',
    homeDesc: 'This browser version keeps number cards, image hotspots, bilingual audio, horn sounds, and quiz play.',
    homeStatImages: 'number images',
    homeStatLanguages: 'audio languages',
    homeStatEffects: 'interactive sounds',
    startQuiz: 'Start Quiz',
    goBuild: 'Build With Blocks',
    releaseNotes: 'Release Notes',
    chooseNumber: 'Pick a number to begin',
    chooseNumberDesc: 'Look at the picture, listen to the Chinese and English audio, then try the quiz.',
    startLearning: 'Start Learning',
    learnBadge: 'Bilingual Learning',
    learnDesc: 'This page includes number mnemonics, Chinese and English audio, learning videos, block building, and car horn hotspots.',
    chinese: 'Chinese',
    english: 'English',
    guideTitle: 'Suggested Flow',
    guideText: 'Tap the number in the picture to hear the mnemonic, then listen to Chinese and English audio, watch a video, and build the number before trying the quiz.',
    disableEdit: 'Turn Off Drag Mode',
    enableEdit: 'Turn On Drag Mode',
    copyHotspots: 'Copy Hotspot JSON',
    resetHotspots: 'Reset Current Hotspots',
    editTip: 'Drag hotspots on the image to adjust their positions. Changes are saved in this browser when you release the pointer.',
    hotspotSpeech: 'Number Audio',
    hotspotHorn: 'Horn',
    hotspotHint: 'Orange hotspots play the current number audio. Blue car hotspots play the horn sound.',
    mnemonicBadge: 'Number Mnemonic',
    mnemonicHint: 'Tapping the number inside the picture will also play this mnemonic.',
    playMnemonic: 'Play Mnemonic',
    stopMnemonic: 'Stop Mnemonic',
    playChineseAudio: 'Play Chinese Audio',
    stopChineseAudio: 'Stop Chinese Audio',
    playEnglishAudio: 'Play English Audio',
    stopEnglishAudio: 'Stop English Audio',
    videoBadge: 'Learning Videos',
    videoTitle: 'Learn numbers with short videos',
    videoPageDesc: 'Videos are placed on a separate page so watching animations does not interrupt the current number lesson.',
    videoItemTitle: (index) => `Number Learning Video ${index}`,
    videoItemSummary: () => 'Open this Bilibili video in a new tab to continue learning number shapes and pronunciation.',
    openVideo: 'Open Video',
    currentCard: 'Current Card',
    previous: 'Previous',
    next: 'Next',
    currentNumber: 'Current Number',
    hotspotCount: 'Hotspots',
    playbackMode: 'Playback Mode',
    editMode: 'Drag Mode',
    enabled: 'On',
    disabled: 'Off',
    sideNote: 'Try the mnemonic first, then the Chinese and English audio, watch a video, and finally build the number with blocks.',
    buildNumber: (value) => `Build Number ${value}`,
    interactionTip: 'Learning Tip',
    playHorn: 'Play Horn',
    previewImage: 'Preview Image',
    watchVideosAction: 'Watch Learning Videos',
    buildWithBlocks: 'Build With Blocks',
    goQuizAction: 'Go To Quiz',
    buildBadge: 'Block Builder',
    buildTitle: (label) => `Build ${label} with blocks`,
    buildDesc: 'Choose a color, then tap the car tiles to build the number. Every tap honks, and finishing the puzzle adds applause.',
    resetBuild: 'Start Over',
    playCurrentMnemonic: 'Play Current Mnemonic',
    backToLearn: 'Back To Learn',
    builderCellHint: 'Tap the car tile to play the horn',
    currentTarget: 'Current Target',
    number: 'Number',
    cells: 'Cells',
    status: 'Status',
    completed: 'Completed',
    building: 'Building',
    buildGoalHint: 'Fill every highlighted cell to complete the number.',
    buildSuccess: 'Great job, you built it.',
    buildIdle: 'Keep filling the highlighted cells to complete the number.',
    quizDone: 'Quiz Complete',
    quizTitle: 'Number Quiz',
    quizScore: (score, total) => `Score ${score} / ${total}`,
    quizStreak: (value) => `Correct in a row: ${value}`,
    quizQuestion: (value) => `Question ${value}`,
    quizDesc: 'Look at the picture and choose the correct number.',
    listenChinese: 'Chinese Prompt',
    hintsLeft: 'Hints Left',
    currentStreak: 'Current Streak',
    bestStreak: 'Best Streak',
    quizGuideTitle: 'Quiz Tip',
    quizGuideText: 'Listen to the prompt, look at the picture, and choose the correct number below.',
    useHint: (count) => `Use a hint (${count} left)`,
    questionPrompt: 'Which number matches this picture?',
    playQuestion: 'Play Question Audio',
    stopQuestion: 'Stop Question Audio',
    correct: 'Correct',
    wrong: 'Not quite',
    correctFeedback: (value, streak) => `Great job. This picture matches ${value}. Current streak: ${streak}.`,
    wrongFeedback: (value) => `The correct answer is ${value}. Take another look at the picture and try again.`,
    nextQuestion: 'Next',
    viewResult: 'See Results',
    resultScore: (score, total) => `Score ${score} / ${total}`,
    bestScore: (score) => `Best score: ${score}`,
    roundBestStreak: (value) => `Best streak this round: ${value}`,
    retry: 'Try Again',
    backHome: 'Back Home',
    resultPerfect: 'Perfect score. Amazing work.',
    resultGreat: 'Great job. A little more practice will make it even stronger.',
    resultGood: 'You already know many numbers. Keep going.',
    resultKeepGoing: 'Keep practicing with pictures and audio, and the next round will go even better.',
    badgeChampion: 'Number Champion',
    badgeExpert: 'Number Expert',
    badgeLearner: 'Number Learner',
    badgeKeepGoing: 'Keep Going',
    aboutBadge: 'Release Ready',
    aboutMeta: (version, stage) => `Version ${version} | Stage ${stage}`,
    aboutStatus: 'Current Status',
    aboutStatusValue: 'Ready for review',
    aboutNextStep: 'Suggested Next Step',
    aboutNextStepValue: 'Check hotspots and audio in a browser or on a device',
    aboutProjectTitle: 'Project Overview',
    aboutProjectText: 'This version already includes number learning, bilingual audio, horn effects, quiz questions, and reward feedback, and it is ready for further polish before release.',
    aboutPrivacyTitle: 'Privacy & Data',
    aboutPrivacyText: 'The web version does not require login and does not upload personal data. Only language preference and best score are stored locally in the browser.',
    aboutChecklistTitle: 'Before Release',
    aboutContactTitle: 'Contact Placeholder',
    releaseStageLabel: 'Beta Prep',
    releaseChecklist: [
      'Replace the tourist AppID in project.config.json with your official AppID.',
      'Create project.private.config.json and add your local debug settings.',
      'Replace the support email with a real contact address.',
      'Verify all audio, hotspots, and page navigation on a device or in the browser.',
      'Prepare icons, app description, category information, and privacy materials.'
    ]
  }
}

function getCopy() {
  return messages[state.selectedLanguage === 'en' ? 'en' : 'zh']
}

function getCardContent(card) {
  if (state.selectedLanguage === 'en') {
    return englishCardCopy[card.value] || { label: `Number ${card.value}`, tip: card.tip, mnemonic: card.mnemonic }
  }
  return {
    label: card.label,
    tip: card.tip,
    mnemonic: card.mnemonic
  }
}

function getHotspotLabel(type) {
  const copy = getCopy()
  return type === 'horn' ? copy.hotspotHorn : copy.hotspotSpeech
}

function getPaletteLabel(palette) {
  return state.selectedLanguage === 'en' ? palette.labelEn : palette.labelZh
}

function playEffect(src, useOverlay = false) {
  if (!src) {
    return
  }
  const player = useOverlay ? fxOverlayAudio : fxAudio
  player.pause()
  player.currentTime = 0
  player.src = src
  player.play().catch(() => {})
}

function playAudioSource(src, type, errorTitle, showErrorModal = true) {
  if (!src) {
    return
  }
  if (state.playingType === type && speechAudio.src.endsWith(src)) {
    speechAudio.pause()
    state.playingType = ''
    render()
    return
  }
  speechAudio.pause()
  speechAudio.currentTime = 0
  speechAudio.src = src
  speechAudio.load()
  state.playingType = type
  speechAudio.play().catch(() => {
    state.playingType = ''
    if (showErrorModal) {
      showModal(getCopy().audioUnavailable, errorTitle)
      return
    }
    render()
  })
  render()
}

function playSpeech(card, language, options = {}) {
  const targetLanguage = language || state.selectedLanguage
  const src = targetLanguage === 'en' ? card.audioEn : card.audioZh
  persistLanguage(targetLanguage)
  playAudioSource(src, targetLanguage, getCopy().speechError, options.showErrorModal ?? true)
}

function playMnemonic(card) {
  playAudioSource(card.mnemonicAudioZh || card.audioZh, 'mnemonic', getCopy().mnemonicError)
}

function playQuestionAudio(question) {
  const targetLanguage = state.selectedLanguage
  const src = targetLanguage === 'en' ? question.audioEn : question.audioZh
  playAudioSource(src, 'question', getCopy().speechError)
}

function playSelectedValueAudio(value) {
  const card = getCardByValue(value)
  if (!card) {
    return
  }
  if (pendingAutoSpeechTimer) {
    window.clearTimeout(pendingAutoSpeechTimer)
  }
  pendingAutoSpeechTimer = window.setTimeout(() => {
    playSpeech(card, state.selectedLanguage, { showErrorModal: false })
    pendingAutoSpeechTimer = null
  }, 180)
}

function playHorn(card) {
  playEffect(card?.hornAudio || effectAudio.horn)
}

function getCardByValue(value) {
  return numberCards.find((item) => item.value === value) || numberCards[0]
}

function getPatternByValue(value) {
  return blockPatterns[value] || blockPatterns[1]
}

function getBuilderSession(value) {
  if (!state.builderSessions[value]) {
    state.builderSessions[value] = {
      selectedColor: builderPalette[0].id,
      filledCells: {}
    }
  }
  return state.builderSessions[value]
}

function getBuilderCellKey(rowIndex, columnIndex) {
  return `${rowIndex}-${columnIndex}`
}

function isPatternCellActive(pattern, rowIndex, columnIndex) {
  return pattern[rowIndex][columnIndex] === '1'
}

function setBuilderColor(value, colorId) {
  getBuilderSession(value).selectedColor = colorId
  render()
}

function toggleBuilderCell(value, rowIndex, columnIndex) {
  const pattern = getPatternByValue(value)
  if (!isPatternCellActive(pattern, rowIndex, columnIndex)) {
    return
  }
  const wasComplete = isBuilderComplete(value)
  const session = getBuilderSession(value)
  const key = getBuilderCellKey(rowIndex, columnIndex)
  if (session.filledCells[key]) {
    delete session.filledCells[key]
  } else {
    session.filledCells[key] = session.selectedColor
  }
  const card = getCardByValue(value)
  playHorn(card)
  if (!wasComplete && isBuilderComplete(value)) {
    playEffect(effectAudio.applause, true)
  }
  render()
}

function resetBuilder(value) {
  state.builderSessions[value] = {
    selectedColor: builderPalette[0].id,
    filledCells: {}
  }
  render()
}

function isBuilderComplete(value) {
  const pattern = getPatternByValue(value)
  const session = getBuilderSession(value)
  let targetCount = 0
  for (let rowIndex = 0; rowIndex < pattern.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < pattern[rowIndex].length; columnIndex += 1) {
      if (isPatternCellActive(pattern, rowIndex, columnIndex)) {
        targetCount += 1
        if (!session.filledCells[getBuilderCellKey(rowIndex, columnIndex)]) {
          return false
        }
      }
    }
  }
  return Object.keys(session.filledCells).length === targetCount
}

function getPatternCellCount(pattern) {
  return pattern.reduce(
    (total, row) => total + row.split('').filter((cell) => cell === '1').length,
    0
  )
}

function openLearningVideo(url) {
  const popup = window.open(url, '_blank', 'noopener')
  if (!popup) {
    const copy = getCopy()
    showModal(copy.openFailed, copy.popupBlocked)
  }
}

function getHotspotsForCard(cardValue) {
  const defaults = cloneHotspots(getCardByValue(cardValue).hotspots)
  const draft = state.hotspotDrafts[cardValue]
  if (!draft) {
    return defaults
  }

  const defaultById = new Map(defaults.map((item) => [item.id, item]))
  const seenIds = new Set()
  const merged = draft.map((item) => {
    seenIds.add(item.id)
    return defaultById.has(item.id)
      ? { ...defaultById.get(item.id), ...item }
      : { ...item }
  })

  defaults.forEach((item) => {
    if (!seenIds.has(item.id)) {
      merged.push({ ...item })
    }
  })

  return merged
}

function persistHotspotDrafts() {
  localStorage.setItem(storageKeys.hotspotDrafts, JSON.stringify(state.hotspotDrafts))
}

function ensureHotspotDraft(cardValue) {
  if (!state.hotspotDrafts[cardValue]) {
    state.hotspotDrafts[cardValue] = cloneHotspots(getCardByValue(cardValue).hotspots)
  }
  return state.hotspotDrafts[cardValue]
}

function updateHotspotPosition(cardValue, hotspotId, x, y) {
  const hotspots = ensureHotspotDraft(cardValue)
  const hotspot = hotspots.find((item) => item.id === hotspotId)
  if (!hotspot) {
    return
  }
  hotspot.x = Number(x.toFixed(1))
  hotspot.y = Number(y.toFixed(1))
}

function buildCurrentHotspotExport(cardValue) {
  const card = getCardByValue(cardValue)
  const hotspots = getHotspotsForCard(cardValue)
  const number = hotspots.find((item) => item.type === 'speech')
  const cars = hotspots.filter((item) => item.type === 'horn')
  return JSON.stringify(
    {
      value: card.value,
      label: card.label,
      number: number ? { x: number.x, y: number.y, width: number.width, height: number.height } : null,
      cars: cars.map((item) => ({ x: item.x, y: item.y, width: item.width, height: item.height }))
    },
    null,
    2
  )
}

async function copyCurrentHotspots(cardValue) {
  const text = buildCurrentHotspotExport(cardValue)
  try {
    await navigator.clipboard.writeText(text)
    const copy = getCopy()
    showModal(copy.copyHotspotsTitle, copy.copyHotspotsText)
  } catch {
    showModal(getCopy().copyHotspotsTitle, text)
  }
}

function resetCurrentHotspots(cardValue) {
  delete state.hotspotDrafts[cardValue]
  persistHotspotDrafts()
  render()
}

function toggleEditMode() {
  if (!allowHotspotEditing) {
    return
  }
  state.editMode = !state.editMode
  state.draggingHotspot = null
  render()
}

function syncHotspotDrag(event) {
  if (!state.draggingHotspot) {
    return
  }
  const wrap = document.querySelector('.web-image-wrap')
  if (!wrap) {
    return
  }
  const rect = wrap.getBoundingClientRect()
  const x = Math.min(95, Math.max(5, ((event.clientX - rect.left) / rect.width) * 100))
  const y = Math.min(95, Math.max(5, ((event.clientY - rect.top) / rect.height) * 100))
  updateHotspotPosition(state.draggingHotspot.cardValue, state.draggingHotspot.hotspotId, x, y)
  state.draggingHotspot.target.style.left = `${x}%`
  state.draggingHotspot.target.style.top = `${y}%`
}

function stopHotspotDrag() {
  if (!state.draggingHotspot) {
    return
  }
  persistHotspotDrafts()
  state.draggingHotspot = null
  render()
}

function showModal(title, content, type = 'text') {
  state.modal = { title, content, type }
  render()
}

function closeModal() {
  state.modal = null
  render()
}

function createQuizState() {
  const questions = buildQuestions()
  return {
    questions,
    currentIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    hintCount: 2,
    answered: false,
    selectedValue: null,
    feedbackTitle: '',
    feedbackText: '',
    feedbackType: '',
    finished: false,
    resultText: '',
    resultBadge: '',
    resultStars: [],
    bestScore: Number(localStorage.getItem(storageKeys.bestScore) || 0),
    celebrate: false
  }
}

function shuffle(list) {
  const result = list.slice()
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

function buildQuestions() {
  return shuffle(numberCards).map((card, index) => {
    const optionPool = shuffle(numberCards.filter((item) => item.value !== card.value)).slice(0, 3)
    const options = shuffle([card, ...optionPool]).map((item) => ({
      value: item.value,
      label: String(item.value)
    }))
    return {
      id: `${card.value}-${index}`,
      correctValue: card.value,
      image: card.image,
      audioZh: card.audioZh,
      audioEn: card.audioEn,
      audioTextZh: card.audioTextZh,
      audioTextEn: card.audioTextEn,
      options,
      hiddenOptionValues: []
    }
  })
}

function getCurrentQuestion() {
  return state.quiz.questions[state.quiz.currentIndex] || null
}

function getResultText(score, total) {
  const copy = getCopy()
  if (score === total) return copy.resultPerfect
  if (score >= total * 0.8) return copy.resultGreat
  if (score >= total * 0.5) return copy.resultGood
  return copy.resultKeepGoing
}

function getStarCount(score, total) {
  if (!total) return 0
  if (score === total) return 3
  if (score >= total * 0.7) return 2
  if (score >= total * 0.4) return 1
  return 0
}

function getBadgeText(score, total) {
  const copy = getCopy()
  const starCount = getStarCount(score, total)
  if (starCount === 3) return copy.badgeChampion
  if (starCount === 2) return copy.badgeExpert
  if (starCount === 1) return copy.badgeLearner
  return copy.badgeKeepGoing
}

function restartQuiz() {
  state.quiz = createQuizState()
  render()
}

function chooseOption(value) {
  const quiz = state.quiz
  const question = getCurrentQuestion()
  if (!question || quiz.answered) {
    return
  }

  const copy = getCopy()
  const isCorrect = value === question.correctValue
  const nextScore = isCorrect ? quiz.score + 1 : quiz.score
  const nextStreak = isCorrect ? quiz.streak + 1 : 0

  quiz.answered = true
  quiz.selectedValue = value
  quiz.score = nextScore
  quiz.streak = nextStreak
  quiz.bestStreak = Math.max(quiz.bestStreak, nextStreak)
  quiz.feedbackType = isCorrect ? 'correct' : 'wrong'
  quiz.feedbackTitle = isCorrect ? copy.correct : copy.wrong
  quiz.feedbackText = isCorrect
    ? copy.correctFeedback(question.correctValue, nextStreak)
    : copy.wrongFeedback(question.correctValue)
  quiz.celebrate = isCorrect

  playEffect(isCorrect ? effectAudio.correct : effectAudio.wrong)
  playSelectedValueAudio(value)
  render()
}

function nextQuestion() {
  const quiz = state.quiz
  if (!quiz.answered) {
    return
  }

  if (quiz.currentIndex >= quiz.questions.length - 1) {
    quiz.finished = true
    quiz.resultText = getResultText(quiz.score, quiz.questions.length)
    quiz.resultBadge = getBadgeText(quiz.score, quiz.questions.length)
    quiz.resultStars = Array.from(
      { length: getStarCount(quiz.score, quiz.questions.length) },
      (_, index) => index
    )
    quiz.bestScore = Math.max(quiz.bestScore, quiz.score)
    localStorage.setItem(storageKeys.bestScore, String(quiz.bestScore))
    playEffect(effectAudio.complete)
    render()
    return
  }

  quiz.currentIndex += 1
  quiz.answered = false
  quiz.selectedValue = null
  quiz.feedbackTitle = ''
  quiz.feedbackText = ''
  quiz.feedbackType = ''
  quiz.celebrate = false
  render()
}

function useHint() {
  const quiz = state.quiz
  const question = getCurrentQuestion()
  if (!question || quiz.answered || quiz.hintCount <= 0) {
    return
  }

  const wrongOptions = question.options.filter(
    (option) => option.value !== question.correctValue && !question.hiddenOptionValues.includes(option.value)
  )
  if (!wrongOptions.length) {
    return
  }

  question.hiddenOptionValues = [...question.hiddenOptionValues, wrongOptions[0].value]
  quiz.hintCount -= 1
  render()
}

function getNavPage() {
  if (state.route.page === 'learn') {
    return 'home'
  }
  return state.route.page
}

function renderNav() {
  const copy = getCopy()
  const navPage = getNavPage()

  return `
    <header class="topbar">
      <div class="topbar__brand">${copy.appName} Web</div>
      <nav class="topbar__nav">
        <button class="${navPage === 'home' ? 'chip chip--active' : 'chip'}" data-nav="/">${copy.navHome}</button>
        <button class="${navPage === 'videos' ? 'chip chip--active' : 'chip'}" data-nav="/videos/1">${copy.navVideos}</button>
        <button class="${navPage === 'build' ? 'chip chip--active' : 'chip'}" data-nav="/build/${state.route.id || 1}">${copy.navBuild}</button>
        <button class="${navPage === 'quiz' ? 'chip chip--active' : 'chip'}" data-nav="/quiz">${copy.navQuiz}</button>
        <button class="${navPage === 'about' ? 'chip chip--active' : 'chip'}" data-nav="/about">${copy.navAbout}</button>
      </nav>
    </header>
  `
}

function renderHome() {
  const copy = getCopy()

  return `
    <main class="page-shell">
      <section class="hero panel">
        <span class="hero__badge">${copy.homeBadge}</span>
        <h1>${copy.homeTitle}</h1>
        <p>${copy.homeDesc}</p>
        <div class="hero__actions">
          <button class="primary-btn" data-nav="/quiz">${copy.startQuiz}</button>
          <button class="accent-btn" data-nav="/build/1">${copy.goBuild}</button>
        </div>
      </section>

      <section class="section-head">
        <h2>${copy.chooseNumber}</h2>
        <p>${copy.chooseNumberDesc}</p>
      </section>

      <section class="cards-grid">
        ${numberCards
          .map((card) => `
            <button class="panel number-card number-card--compact" data-nav="/learn/${card.value}" aria-label="${copy.startLearning} ${card.value}">
              <span class="number-card__value">${card.value}</span>
            </button>
          `)
          .join('')}
      </section>
    </main>
  `
}

function renderHotspots(card) {
  return getHotspotsForCard(card.value)
    .map((hotspot) => {
      const typeClass = hotspot.type === 'horn' ? ' hotspot--horn' : ''
      const editableClass = allowHotspotEditing && state.editMode ? ' hotspot--editable' : ''
      const width = hotspot.width ? `width:${hotspot.width}px;` : ''
      const height = hotspot.height ? `height:${hotspot.height}px;` : ''
      return `
        <button
          class="hotspot${typeClass}${editableClass}"
          style="left:${hotspot.x}%;top:${hotspot.y}%;${width}${height}"
          data-hotspot-id="${hotspot.id}"
          data-hotspot-type="${hotspot.type}"
          data-card-value="${card.value}"
          title="${getHotspotLabel(hotspot.type)}"
          aria-label="${getHotspotLabel(hotspot.type)}"
        ></button>
      `
    })
    .join('')
}

function renderLearn() {
  const copy = getCopy()
  const card = getCardByValue(state.route.id || 1)
  const content = getCardContent(card)
  const currentIndex = numberCards.findIndex((item) => item.value === card.value)
  const previousCard = numberCards[currentIndex - 1]
  const nextCard = numberCards[currentIndex + 1]

  return `
    <main class="page-shell">
      <section class="learn-banner panel">
        <span class="learn-banner__badge">${copy.learnBadge}</span>
        <h1>${content.label}</h1>
        <p>${content.tip}</p>
        <div class="lang-switch">
          <button class="chip ${state.selectedLanguage === 'zh' ? 'chip--active' : ''}" data-language="zh">${copy.chinese}</button>
          <button class="chip ${state.selectedLanguage === 'en' ? 'chip--active' : ''}" data-language="en">${copy.english}</button>
        </div>
      </section>

      <section class="learn-layout">
        <div>
          <section class="panel learn-image">
            <div class="web-image-wrap ${allowHotspotEditing && state.editMode ? 'web-image-wrap--editing' : ''}">
              <img src="${card.image}" alt="${content.label}" />
              ${renderHotspots(card)}
            </div>
          </section>

          <section class="panel mnemonic-card">
            <span class="mnemonic-card__badge">${copy.mnemonicBadge}</span>
            <h3>${content.mnemonic}</h3>
            <div class="hero__actions">
              <button class="primary-btn" data-action="play-mnemonic" data-card-value="${card.value}">${state.playingType === 'mnemonic' ? copy.stopMnemonic : copy.playMnemonic}</button>
              <button class="soft-btn" data-action="play-zh" data-card-value="${card.value}">${state.playingType === 'zh' ? copy.stopChineseAudio : copy.playChineseAudio}</button>
              <button class="soft-btn" data-action="play-en" data-card-value="${card.value}">${state.playingType === 'en' ? copy.stopEnglishAudio : copy.playEnglishAudio}</button>
            </div>
          </section>
        </div>

        <aside class="panel learn-side">
          <h3>${copy.interactionTip}</h3>
          <p>${content.tip}</p>

          <div class="learn-side__meta">
            <span>${copy.currentNumber}</span>
            <strong>${card.value}</strong>
          </div>
          <div class="learn-side__meta">
            <span>${copy.playbackMode}</span>
            <strong>${state.selectedLanguage === 'en' ? copy.english : copy.chinese}</strong>
          </div>

          <div class="actions-grid">
            <button class="soft-btn" ${previousCard ? `data-nav="/learn/${previousCard.value}"` : 'disabled'}>${copy.previous}</button>
            <button class="soft-btn" ${nextCard ? `data-nav="/learn/${nextCard.value}"` : 'disabled'}>${copy.next}</button>
            <button class="soft-btn" data-action="preview-image" data-image="${card.image}" data-title="${content.label}">${copy.previewImage}</button>
          </div>

          <button class="soft-btn learn-side__stack-btn" data-nav="/videos/${card.value}">${copy.watchVideosAction}</button>
          <button class="accent-btn learn-side__build-btn" data-nav="/build/${card.value}">${copy.buildNumber(card.value)}</button>
          <button class="soft-btn learn-side__stack-btn" data-nav="/quiz">${copy.goQuizAction}</button>
        </aside>
      </section>
    </main>
  `
}

function renderVideos() {
  const copy = getCopy()
  const card = getCardByValue(state.route.id || 1)
  const content = getCardContent(card)

  return `
    <main class="page-shell">
      <section class="learn-banner panel">
        <span class="learn-banner__badge">${copy.videoBadge}</span>
        <h1>${copy.videoTitle}</h1>
        <p>${content.label} · ${copy.videoPageDesc}</p>
      </section>

      <section class="panel video-section">
        <div class="video-grid">
          ${learningVideos
            .map(
              (video, index) => `
                <article class="video-card">
                  <strong>${copy.videoItemTitle(index + 1)}</strong>
                  <p>${copy.videoItemSummary(video)}</p>
                  <button class="soft-btn" data-action="open-video" data-url="${video.url}">${copy.openVideo}</button>
                </article>
              `
            )
            .join('')}
        </div>
        <div class="hero__actions">
          <button class="soft-btn" data-nav="/learn/${card.value}">${copy.backToLearn}</button>
        </div>
      </section>
    </main>
  `
}

function renderBuild() {
  const copy = getCopy()
  const card = getCardByValue(state.route.id || 1)
  const content = getCardContent(card)
  const pattern = getPatternByValue(card.value)
  const session = getBuilderSession(card.value)
  const cellCount = getPatternCellCount(pattern)
  const complete = isBuilderComplete(card.value)

  return `
    <main class="page-shell">
      <section class="learn-banner panel">
        <span class="learn-banner__badge">${copy.buildBadge}</span>
        <h1>${copy.buildTitle(content.label)}</h1>
        <p>${copy.buildDesc}</p>
      </section>

      <section class="panel builder-controls">
        <div class="builder-selector">
          ${numberCards
            .map(
              (item) => `
                <button class="chip ${item.value === card.value ? 'chip--active' : ''}" data-nav="/build/${item.value}">${item.value}</button>
              `
            )
            .join('')}
        </div>

        <div class="builder-palette">
          ${builderPalette
            .map(
              (palette) => `
                <button class="builder-color ${session.selectedColor === palette.id ? 'builder-color--active' : ''}" data-action="builder-color" data-card-value="${card.value}" data-color-id="${palette.id}">
                  <span class="builder-color__swatch builder-color__swatch--${palette.id}"></span>
                  <span>${getPaletteLabel(palette)}</span>
                </button>
              `
            )
            .join('')}
        </div>
      </section>

      <section class="builder-layout">
        <section class="panel builder-board">
          <div class="builder-grid" style="grid-template-columns: repeat(${pattern[0].length}, minmax(0, 1fr));">
            ${pattern
              .map((row, rowIndex) =>
                row
                  .split('')
                  .map((cell, columnIndex) => {
                    const key = getBuilderCellKey(rowIndex, columnIndex)
                    const filledColor = session.filledCells[key]
                    if (cell !== '1') {
                      return '<button class="builder-cell builder-cell--void" disabled></button>'
                    }
                    const colorClass = filledColor ? ` builder-cell--${filledColor}` : ' builder-cell--target'
                    return `
                      <button class="builder-cell${colorClass}" data-action="builder-cell" data-card-value="${card.value}" data-row="${rowIndex}" data-column="${columnIndex}" title="${copy.builderCellHint}" aria-label="${copy.builderCellHint}"></button>
                    `
                  })
                  .join('')
              )
              .join('')}
          </div>
        </section>

        <aside class="panel builder-side">
          <h3>${copy.currentTarget}</h3>
          <p>${content.mnemonic}</p>

          <div class="learn-side__meta">
            <span>${copy.number}</span>
            <strong>${card.value}</strong>
          </div>
          <div class="learn-side__meta">
            <span>${copy.cells}</span>
            <strong>${cellCount}</strong>
          </div>
          <div class="learn-side__meta">
            <span>${copy.status}</span>
            <strong>${complete ? copy.completed : copy.building}</strong>
          </div>

          <div class="actions-grid">
            <button class="soft-btn" data-action="reset-build" data-card-value="${card.value}">${copy.resetBuild}</button>
            <button class="soft-btn" data-action="play-mnemonic" data-card-value="${card.value}">${copy.playCurrentMnemonic}</button>
            <button class="soft-btn" data-nav="/learn/${card.value}">${copy.backToLearn}</button>
          </div>

          <div class="builder-success ${complete ? '' : 'builder-success--idle'}">
            ${complete ? copy.buildSuccess : copy.buildIdle}
          </div>
          <p>${copy.buildGoalHint}</p>
        </aside>
      </section>
    </main>
  `
}

function renderQuiz() {
  const copy = getCopy()
  const quiz = state.quiz

  if (quiz.finished) {
    return `
      <main class="page-shell">
        <section class="panel result">
          <span class="result__badge">${quiz.resultBadge || copy.quizDone}</span>
          <h1>${copy.quizDone}</h1>
          <p>${quiz.resultText}</p>
          <div class="result__stars">${quiz.resultStars.map(() => '★').join('')}</div>
          <div class="quiz-summary">
            <div class="quiz-summary__card">
              <strong>${quiz.score}</strong>
              <span>${copy.resultScore(quiz.score, quiz.questions.length)}</span>
            </div>
            <div class="quiz-summary__card">
              <strong>${quiz.bestScore}</strong>
              <span>${copy.bestScore(quiz.bestScore)}</span>
            </div>
            <div class="quiz-summary__card">
              <strong>${quiz.bestStreak}</strong>
              <span>${copy.roundBestStreak(quiz.bestStreak)}</span>
            </div>
          </div>
          <div class="hero__actions">
            <button class="primary-btn" data-action="restart-quiz">${copy.retry}</button>
            <button class="soft-btn" data-nav="/">${copy.backHome}</button>
          </div>
        </section>
      </main>
    `
  }

  const question = getCurrentQuestion()
  if (!question) {
    return ''
  }

  const visibleOptions = question.options.filter(
    (option) => !question.hiddenOptionValues.includes(option.value)
  )

  return `
    <main class="page-shell">
      <section class="quiz-head panel">
        <span class="badge">${copy.quizQuestion(quiz.currentIndex + 1)}</span>
        <h1>${copy.quizTitle}</h1>
        <p>${copy.quizDesc}</p>
        <div class="quiz-summary">
          <div class="quiz-summary__card">
            <strong>${quiz.score}</strong>
            <span>${copy.quizScore(quiz.score, quiz.questions.length)}</span>
          </div>
          <div class="quiz-summary__card">
            <strong>${quiz.hintCount}</strong>
            <span>${copy.hintsLeft}</span>
          </div>
          <div class="quiz-summary__card">
            <strong>${quiz.bestStreak}</strong>
            <span>${copy.bestStreak}</span>
          </div>
        </div>
      </section>

      <section class="panel quiz-tip">
        <h3>${copy.quizGuideTitle}</h3>
        <p>${copy.quizGuideText}</p>
      </section>

      <section class="panel question">
        <img class="question__image" src="${question.image}" alt="${copy.questionPrompt}" />
        <p>${copy.questionPrompt}</p>
        <div class="hero__actions">
          <button class="soft-btn" data-action="play-question">${state.playingType === 'question' ? copy.stopQuestion : copy.playQuestion}</button>
          <button class="soft-btn" data-action="use-hint">${copy.useHint(quiz.hintCount)}</button>
          <button class="soft-btn" data-action="preview-image" data-image="${question.image}" data-title="${copy.questionPrompt}">${copy.previewImage}</button>
        </div>

        <div class="options-grid">
          ${visibleOptions
            .map((option) => {
              let stateClass = ''
              if (quiz.answered && option.value === question.correctValue) {
                stateClass = ' option-card--correct'
              } else if (quiz.answered && option.value === quiz.selectedValue && option.value !== question.correctValue) {
                stateClass = ' option-card--wrong'
              }
              return `
                <button class="panel option-card${stateClass}" data-action="quiz-option" data-value="${option.value}">${option.label}</button>
              `
            })
            .join('')}
        </div>

        ${quiz.feedbackTitle ? `
          <div class="panel feedback feedback--${quiz.feedbackType}">
            <h3>${quiz.feedbackTitle}</h3>
            <p>${quiz.feedbackText}</p>
          </div>
        ` : ''}

        ${quiz.answered ? `
          <div class="hero__actions">
            <button class="primary-btn" data-action="next-question">${quiz.currentIndex === quiz.questions.length - 1 ? copy.viewResult : copy.nextQuestion}</button>
          </div>
        ` : ''}
      </section>
    </main>
  `
}

function renderAbout() {
  const copy = getCopy()

  return `
    <main class="page-shell">
      <section class="about-hero panel">
        <span class="about-hero__badge">${copy.aboutBadge}</span>
        <h1>${copy.appName}</h1>
        <p>${copy.aboutMeta(appMeta.version, copy.releaseStageLabel)}</p>
      </section>

      <section class="about-summary panel">
        <div>
          <div class="about-summary__label">${copy.aboutStatus}</div>
          <div class="about-summary__value">${copy.aboutStatusValue}</div>
        </div>
        <div>
          <div class="about-summary__label">${copy.aboutNextStep}</div>
          <div class="about-summary__value">${copy.aboutNextStepValue}</div>
        </div>
        <div>
          <div class="about-summary__label">Version</div>
          <div class="about-summary__value">${appMeta.version}</div>
        </div>
      </section>

      <section class="about-section panel">
        <h3>${copy.aboutProjectTitle}</h3>
        <p>${copy.aboutProjectText}</p>
      </section>

      <section class="about-section panel">
        <h3>${copy.aboutPrivacyTitle}</h3>
        <p>${copy.aboutPrivacyText}</p>
      </section>

      <section class="release panel">
        <h3 class="release__title">${copy.aboutChecklistTitle}</h3>
        <div class="checklist">
          ${copy.releaseChecklist.map((item) => `<div>${item}</div>`).join('')}
        </div>
      </section>

      <section class="about-section panel">
        <h3>${copy.aboutContactTitle}</h3>
        <p>${appMeta.supportEmail}</p>
      </section>

      <p class="about-footer">${copy.guideText}</p>
    </main>
  `
}

function renderModal() {
  if (!state.modal) {
    return ''
  }

  const copy = getCopy()
  const body =
    state.modal.type === 'image'
      ? `<img class="modal__image" src="${state.modal.content}" alt="${state.modal.title}" />`
      : `<pre>${state.modal.content}</pre>`

  return `
    <div class="modal-mask" data-action="close-modal">
      <div class="panel modal" data-modal-panel="true">
        <h3>${state.modal.title}</h3>
        ${body}
        <div class="hero__actions">
          <button class="primary-btn" data-action="close-modal">${copy.modalOk}</button>
        </div>
      </div>
    </div>
  `
}

function renderPage() {
  switch (state.route.page) {
    case 'learn':
      return renderLearn()
    case 'videos':
      return renderVideos()
    case 'build':
      return renderBuild()
    case 'quiz':
      return renderQuiz()
    case 'about':
      return renderAbout()
    case 'home':
    default:
      return renderHome()
  }
}

function render() {
  app.innerHTML = `
    <div class="shell">
      ${renderNav()}
      ${renderPage()}
      ${renderModal()}
    </div>
  `
}

app.addEventListener('click', (event) => {
  if (event.target.matches('.modal-mask')) {
    closeModal()
    return
  }

  if (state.modal && event.target.closest('[data-modal-panel="true"]') && !event.target.closest('[data-action="close-modal"]')) {
    return
  }

  const target = event.target.closest('button, [data-action], [data-nav], [data-language]')
  if (!target) {
    return
  }

  const nav = target.dataset.nav
  if (nav) {
    navigate(nav)
    return
  }

  const language = target.dataset.language
  if (language) {
    persistLanguage(language)
    render()
    return
  }

  const hotspotId = target.dataset.hotspotId
  if (hotspotId) {
    if (state.editMode) {
      return
    }
    const card = getCardByValue(Number(target.dataset.cardValue))
    if (target.dataset.hotspotType === 'horn') {
      playHorn(card)
    } else {
      playSpeech(card, state.selectedLanguage)
    }
    return
  }

  const action = target.dataset.action
  if (!action) {
    return
  }

  switch (action) {
    case 'toggle-edit':
      toggleEditMode()
      break
    case 'copy-hotspots':
      copyCurrentHotspots(Number(target.dataset.cardValue))
      break
    case 'reset-hotspots':
      resetCurrentHotspots(Number(target.dataset.cardValue))
      break
    case 'play-mnemonic':
      playMnemonic(getCardByValue(Number(target.dataset.cardValue)))
      break
    case 'play-zh':
      playSpeech(getCardByValue(Number(target.dataset.cardValue)), 'zh')
      break
    case 'play-en':
      playSpeech(getCardByValue(Number(target.dataset.cardValue)), 'en')
      break
    case 'play-horn':
      playHorn()
      break
    case 'preview-image':
      showModal(target.dataset.title || getCopy().previewImage, target.dataset.image, 'image')
      break
    case 'open-video':
      openLearningVideo(target.dataset.url)
      break
    case 'builder-color':
      setBuilderColor(Number(target.dataset.cardValue), target.dataset.colorId)
      break
    case 'builder-cell':
      toggleBuilderCell(Number(target.dataset.cardValue), Number(target.dataset.row), Number(target.dataset.column))
      break
    case 'reset-build':
      resetBuilder(Number(target.dataset.cardValue))
      break
    case 'play-question': {
      const question = getCurrentQuestion()
      if (question) {
        playQuestionAudio(question)
      }
      break
    }
    case 'use-hint':
      useHint()
      break
    case 'quiz-option':
      chooseOption(Number(target.dataset.value))
      break
    case 'next-question':
      nextQuestion()
      break
    case 'restart-quiz':
      restartQuiz()
      break
    case 'close-modal':
      closeModal()
      break
    default:
      break
  }
})

app.addEventListener('pointerdown', (event) => {
  if (!allowHotspotEditing || !state.editMode) {
    return
  }
  const hotspot = event.target.closest('.hotspot--editable')
  if (!hotspot) {
    return
  }
  event.preventDefault()
  state.draggingHotspot = {
    hotspotId: hotspot.dataset.hotspotId,
    cardValue: Number(hotspot.dataset.cardValue),
    target: hotspot
  }
})

window.addEventListener('pointermove', syncHotspotDrag)
window.addEventListener('pointerup', stopHotspotDrag)
window.addEventListener('pointercancel', stopHotspotDrag)

window.addEventListener('hashchange', () => {
  state.route = getRoute()
  render()
})

render()
