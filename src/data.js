function createHotspots(value, label, tip, config) {
  const numberHotspot = {
    id: `hotspot-${value}`,
    label: '数字口诀',
    x: config.number.x,
    y: config.number.y,
    width: config.number.width || 196,
    height: config.number.height || 84,
    type: 'speech',
    title: `${label} 数字口诀`,
    tip
  }

  const carHotspots = (config.cars || []).map((car, index) => ({
    id: `car-${value}-${index + 1}`,
    label: '汽车鸣笛',
    x: car.x,
    y: car.y,
    width: car.width || 152,
    height: car.height || 68,
    type: 'horn',
    title: `${label} 汽车鸣笛`,
    tip: '点击小汽车，播放鸣笛声音。'
  }))

  return [numberHotspot, ...carHotspots]
}

function withBase(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

const hotspotMap = {
  1: createHotspots(1, '数字 1', '找一找图片里的数字 1，并大声读出来。', {
    number: { x: 27.5, y: 50.4 },
    cars: [{ x: 66.0, y: 59.7 }]
  }),
  2: createHotspots(2, '数字 2', '看看数字 2 藏在哪里，点一下试试看。', {
    number: { x: 52.9, y: 50.0 },
    cars: [{ x: 26.9, y: 63.6 }, { x: 73.6, y: 63.6 }]
  }),
  3: createHotspots(3, '数字 3', '找到数字 3 后，可以点开学习提示。', {
    number: { x: 57.9, y: 51.4 },
    cars: [{ x: 21.5, y: 70.2 }, { x: 78.4, y: 55.5 }, { x: 80.2, y: 68.3 }]
  }),
  4: createHotspots(4, '数字 4', '和小朋友一起数一数，看看数字 4。', {
    number: { x: 52.2, y: 60.2 },
    cars: [{ x: 20.5, y: 81.2 }, { x: 33.2, y: 37.9 }, { x: 68.2, y: 53.3 }, { x: 74.7, y: 76.0 }]
  }),
  5: createHotspots(5, '数字 5', '点击图片中的互动点，认识数字 5。', {
    number: { x: 52.2, y: 35.2 },
    cars: [{ x: 19.1, y: 35.8 }, { x: 80.4, y: 36.4 }, { x: 20.6, y: 69.0 }, { x: 50.2, y: 15.5 }, { x: 78.4, y: 70.9 }]
  }),
  6: createHotspots(6, '数字 6', '读一读数字 6，再点音频按钮。', {
    number: { x: 44.7, y: 50.0 },
    cars: [{ x: 50.2, y: 87.9 }, { x: 23.5, y: 26.1 }, { x: 25.2, y: 73.5 }, { x: 50.0, y: 14.6 }, { x: 78.4, y: 21.0 }, { x: 76.4, y: 74.2 }]
  }),
  7: createHotspots(7, '数字 7', '从图片里把数字 7 找出来。', {
    number: { x: 53.3, y: 33.4 },
    cars: [{ x: 15.1, y: 48.6 }, { x: 23.7, y: 24.3 }, { x: 24.4, y: 72.4 }, { x: 50.3, y: 15.1 }, { x: 75.3, y: 24.6 }, { x: 77.3, y: 70.6 }, { x: 86.1, y: 48.7 }]
  }),
  8: createHotspots(8, '数字 8', '观察图片内容，学习数字 8。', {
    number: { x: 50.3, y: 32.1 },
    cars: [{ x: 22.4, y: 23.0 }, { x: 14.0, y: 46.7 }, { x: 22.3, y: 74.4 }, { x: 48.9, y: 11.0 }, { x: 77.3, y: 72.2 }, { x: 76.1, y: 21.0 }, { x: 87.0, y: 47.1 }, { x: 49.3, y: 85.0 }]
  }),
  9: createHotspots(9, '数字 9', '点击热点查看数字 9 的学习提示。', {
    number: { x: 49.3, y: 32.3 },
    cars: [{ x: 29.7, y: 20.3 }, { x: 15.5, y: 38.1 }, { x: 87.6, y: 32.5 }, { x: 15.7, y: 60.4 }, { x: 50.2, y: 8.9 }, { x: 88.1, y: 56.6 }, { x: 26.4, y: 78.5 }, { x: 47.4, y: 81.9 }, { x: 79.0, y: 81.7 }]
  }),
  10: createHotspots(10, '数字 10', '最后认识数字 10，完成一轮练习。', {
    number: { x: 59.8, y: 40.5, width: 228, height: 84 },
    cars: [{ x: 32.1, y: 20.1 }, { x: 71.1, y: 16.6 }, { x: 13.5, y: 48.9 }, { x: 50.7, y: 13.7 }, { x: 82.1, y: 66.2 }, { x: 30.3, y: 82.5 }, { x: 18.2, y: 67.7 }, { x: 69.1, y: 81.2 }, { x: 50.2, y: 82.6 }, { x: 86.8, y: 48.9 }]
  })
}

export const appMeta = {
  appName: '数字启蒙乐园',
  version: '0.1.0',
  releaseStage: 'beta',
  releaseStageLabel: '体验版准备',
  supportEmail: 'replace-with-your-email@example.com'
}

export const releaseChecklist = [
  '将 project.config.json 中的 touristappid 替换为正式 AppID',
  '新建 project.private.config.json 并填写本机私有调试配置',
  '将联系邮箱替换为真实邮箱',
  '真机或浏览器逐项检查所有音频、热点和页面跳转',
  '准备图标、简介、类目、隐私材料和提审说明'
]

export const effectAudio = {
  horn: withBase('/assets/audio/effects/car-horn.wav'),
  applause: withBase('/assets/audio/effects/applause.wav'),
  correct: withBase('/assets/audio/effects/correct.wav'),
  wrong: withBase('/assets/audio/effects/wrong.wav'),
  complete: withBase('/assets/audio/effects-custom/build-complete.mp3'),
  switch: withBase('/assets/audio/effects/switch.wav')
}

export const learningVideos = [
  {
    id: 'video-1',
    title: '数字学习动画 1',
    summary: '点击后打开 B 站数字学习动画，方便跟着视频一起观察数字写法。',
    url: 'https://www.bilibili.com/video/BV1SVQKBbE21/?spm_id_from=333.337.search-card.all.click'
  },
  {
    id: 'video-2',
    title: '数字学习动画 2',
    summary: '补充数字启蒙动画资源，适合边听边看数字形状。',
    url: 'https://www.bilibili.com/video/BV1ngzSBTEws/?spm_id_from=333.337.search-card.all.click'
  },
  {
    id: 'video-3',
    title: '数字学习动画 3',
    summary: '用于数字认读和书写联想训练的动画参考。',
    url: 'https://www.bilibili.com/video/BV1sW4y117ZT/?spm_id_from=333.337.search-card.all.click'
  },
  {
    id: 'video-4',
    title: '数字学习动画 4',
    summary: '继续查看数字动画内容，帮助小朋友强化记忆。',
    url: 'https://www.bilibili.com/video/BV1zNFnz6EzY/?spm_id_from=333.337.search-card.all.click'
  }
]

export const blockPatterns = {
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  6: ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  10: ['001000111', '011001001', '001001001', '001001001', '001001001', '001001001', '011100111']
}

export const numberCards = [
  { value: 1, label: '数字 1', image: withBase('/assets/images/numbers/IMG_18731.jpg'), tip: '找一找图片里的数字 1，并大声读出来。', audioTextZh: '1', audioTextEn: 'one', mnemonic: '1 像画笔去画画', mnemonicAudioZh: withBase('/assets/audio/mnemonic-custom/1.mp3'), audioZh: withBase('/assets/audio/zh-custom/1.mp3'), audioEn: withBase('/assets/audio/en/1.wav') },
  { value: 2, label: '数字 2', image: withBase('/assets/images/numbers/IMG_18732.jpg'), tip: '看看数字 2 藏在哪里，点一下试试看。', audioTextZh: '2', audioTextEn: 'two', mnemonic: '2 像鸭子水中游', mnemonicAudioZh: withBase('/assets/audio/mnemonic-custom/2.mp3'), audioZh: withBase('/assets/audio/zh-custom/2.mp3'), audioEn: withBase('/assets/audio/en/2.wav') },
  { value: 3, label: '数字 3', image: withBase('/assets/images/numbers/IMG_18733.jpg'), tip: '找到数字 3 后，可以点开学习提示。', audioTextZh: '3', audioTextEn: 'three', mnemonic: '3 像耳朵听声音', mnemonicAudioZh: withBase('/assets/audio/mnemonic-custom/3.mp3'), audioZh: withBase('/assets/audio/zh-custom/3.mp3'), audioEn: withBase('/assets/audio/en/3.wav') },
  { value: 4, label: '数字 4', image: withBase('/assets/images/numbers/IMG_18734.jpg'), tip: '和小朋友一起数一数，看看数字 4。', audioTextZh: '4', audioTextEn: 'four', mnemonic: '4 像旗子风中飘', mnemonicAudioZh: withBase('/assets/audio/mnemonic-custom/4.mp3'), audioZh: withBase('/assets/audio/zh-custom/4.mp3'), audioEn: withBase('/assets/audio/en/4.wav') },
  { value: 5, label: '数字 5', image: withBase('/assets/images/numbers/IMG_18735.jpg'), tip: '点击图片中的互动点，认识数字 5。', audioTextZh: '5', audioTextEn: 'five', mnemonic: '5 像秤钩称重量', mnemonicAudioZh: withBase('/assets/audio/mnemonic-custom/5.mp3'), audioZh: withBase('/assets/audio/zh-custom/5.mp3'), audioEn: withBase('/assets/audio/en/5.wav') },
  { value: 6, label: '数字 6', image: withBase('/assets/images/numbers/IMG_18736.jpg'), tip: '读一读数字 6，再点音频按钮。', audioTextZh: '6', audioTextEn: 'six', mnemonic: '6 像哨子吹的响', mnemonicAudioZh: withBase('/assets/audio/mnemonic-custom/6.mp3'), audioZh: withBase('/assets/audio/zh-custom/6.mp3'), audioEn: withBase('/assets/audio/en/6.wav') },
  { value: 7, label: '数字 7', image: withBase('/assets/images/numbers/IMG_18737.jpg'), tip: '从图片里把数字 7 找出来。', audioTextZh: '7', audioTextEn: 'seven', mnemonic: '7 像镰刀挖小草', mnemonicAudioZh: withBase('/assets/audio/mnemonic-custom/7.mp3'), audioZh: withBase('/assets/audio/zh-custom/7.mp3'), audioEn: withBase('/assets/audio/en/7.wav') },
  { value: 8, label: '数字 8', image: withBase('/assets/images/numbers/IMG_18738.jpg'), tip: '观察图片内容，学习数字 8。', audioTextZh: '8', audioTextEn: 'eight', mnemonic: '8 像麻花缠一起', mnemonicAudioZh: withBase('/assets/audio/mnemonic-custom/8.mp3'), audioZh: withBase('/assets/audio/zh-custom/8.mp3'), audioEn: withBase('/assets/audio/en/8.wav') },
  { value: 9, label: '数字 9', image: withBase('/assets/images/numbers/IMG_18739.jpg'), tip: '点击热点查看数字 9 的学习提示。', audioTextZh: '9', audioTextEn: 'nine', mnemonic: '9 像蝌蚪找妈妈', mnemonicAudioZh: withBase('/assets/audio/mnemonic-custom/9.mp3'), audioZh: withBase('/assets/audio/zh-custom/9.mp3'), audioEn: withBase('/assets/audio/en/9.wav') },
  { value: 10, label: '数字 10', image: withBase('/assets/images/numbers/IMG_18740.jpg'), tip: '最后认识数字 10，完成一轮练习。', audioTextZh: '10', audioTextEn: 'ten', mnemonic: '10 是一和零手拉手', mnemonicAudioZh: withBase('/assets/audio/mnemonic-custom/10.mp3'), audioZh: withBase('/assets/audio/zh-custom/10.mp3'), audioEn: withBase('/assets/audio/en/10.wav') }
].map((card) => ({
  ...card,
  hornAudio: effectAudio.horn,
  hotspots: hotspotMap[card.value] || []
}))
