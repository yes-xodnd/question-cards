const isMobile = (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  .test(navigator.userAgent)
)

const CARD_TEMPLATES = getCardTemplates(isMobile)

;(function main() {
  const questionManager = createQuestionManager()
  let $card = document.querySelector('.card')
  let $nextCard = document.querySelector('.next-card')

  document.body.style.height = `${window.innerHeight}px`
  document.body.style.overflow = 'hidden'

  $card.innerHTML = CARD_TEMPLATES.initial
  hydrateButton($card)
  addTouchEventListener($card, onTouchmove, onTouchend)

  function onFinish() {
    $card.innerHTML = CARD_TEMPLATES.final

    $card
      .querySelector('button')
      .addEventListener('click', () => {
        questionManager.restart()
        
        $card.innerHTML = CARD_TEMPLATES.initial
        hydrateButton($card)

        $card.parentNode.appendChild($nextCard)
        addTouchEventListener($card, onTouchmove, onTouchend)
    })
  }

  async function showNextCard() {     
    const question = questionManager.next();

    $card.style.transform = 'translateX(100vw)'
    $nextCard.style.transform = 'scale(1)'
    await sleep(500)

    $card.remove()
    $card = $nextCard
    $card.classList.remove('next-card')
    $card.innerHTML = CARD_TEMPLATES.question(question)

    if (question.index < 0) {
      onFinish()
      return
    }

    hydrateButton($card)
    $nextCard = document.createElement('div')
    $nextCard.className = 'card next-card'
    
    await sleep(100)
    $card.parentNode.appendChild($nextCard)
    addTouchEventListener($card, onTouchmove, onTouchend)
  }

  function onTouchmove({ dist }) {
    if (dist.x < 0) return

    const nextCardScale = 0.9 + (dist.x / window.innerWidth * 0.3)
    $card.style.transform = `translateX(${dist.x}px)`

    if (nextCardScale < 1) {
      $nextCard.style.transform = `scale(${ nextCardScale })`
    } else {
      $nextCard.style.transform = `scale(1)`
    }
  }

  function onTouchend({ dist }) {
    if (!dist) return

    if (dist.x < window.innerWidth / 3) {
      $card.style.transform = 'translateX(0)'
      return
    }
    showNextCard()
  }

  function hydrateButton($card) {
    if (!isMobile) {
      $card.querySelector('button').addEventListener('click', showNextCard)
    }
  }
})()

function addTouchEventListener(target, onTouchmove, onTouchend) {
  const options = { passive: true }

  let startPosition = null
  let position = null
  let dist = null
  
  const getPosition = e => {
    const [ touch ] = e.touches
    return { x: touch.clientX, y: touch.clientY }
  }

  const calcDist = (a, b) => {
    return { x: b.x - a.x, y: b.y - a.y }
  }

  const _onTouchstart = e => {
    startPosition = getPosition(e)
  }

  const _onTouchmove = e => {
    position = getPosition(e)
    dist = startPosition !== null 
      ? calcDist(startPosition, position) 
      : { x: 0, y: 0 }

    onTouchmove({ position, dist }, e)
  }
    
  const _onTouchend = e => {
    onTouchend({ position, dist }, e)
  }

  target.addEventListener('touchstart', _onTouchstart, options)
  target.addEventListener('touchmove', _onTouchmove, options)
  target.addEventListener('touchend', _onTouchend, options)
}

function  fillCardContent(target, content) {

  target.innerHTML = (index !== undefined) 
  ? `
      <div class="card-number">${content.index + 1}</div>
      <div class="card-content">${content}</div>
    `
  : `${content}`

}

function createQuestionManager() {
  const questions = getQuestions()
  let randomIndexes = shuffle(range(0, questions.length))
  let i = 0

  const restart = () => {
    i = 0
    randomIndexes = shuffle(range(0, questions.length))
  }

  const next = () => {
    const index = randomIndexes[i]
    const result = i++ < questions.length 
      ? { text: questions[index], index }
      : { index: -1 }

    return result
  }
  
  return { next, restart }
}

function getQuestions() {
  const addNewLine = arr => arr.map(item => item.replace(/\? /g, '? <br />'))
  
  const questions = [
    "강아지와 고양이 중 무엇이 더 좋은가요? 아니면 둘 다 좋아하나요?",
    "아침에 일어나면 가장 먼저 켜는 앱은 무엇인가요? 아침 루틴에 대해 알려주세요.",
    "유명인과 닮았다는 소리를 들어본 적 있나요?",
    "학창 시절 가장 좋아했던 과목은 무엇인가요?",
    "가본 곳 중에서 가장 좋았던 여행지는 어디인가요?",

    "지금 당장 일주일 간 여행을 떠날 수 있다면 어디로 떠나고 싶나요?",
    "시간여행을 할 수 있다면 어느 시대로 떠나보고 싶나요?",
    "죽기 전에 꼭 해보고 싶은 직업이 있나요?",
    "어렸을 때 하던 운동이 있나요? 지금 하는 운동은 없나요?",
    "현재 휴대폰 배경 화면은 무엇인가요? 그 이미지를 선택한 이유는 무엇인가요?",

    "인생 영화는 무엇인가요? 왜 그 영화가 좋은지 말해주세요.",
    "가장 최근에 본 영화는 무엇인가요?",
    "처음으로 가 본 콘서트가 무엇이었나요? 가 봤던 콘서트 중 가장 좋았던 콘서트는 무엇인가요?",
    "로또 1등에 당첨된다면 가장 먼저 무엇을 하고 싶나요? (부동산 금지)",
    "하루에 1시간이 더 주어진다면, 무엇을 할 건가요?",

    "현재 살고 있는 동네에서 가장 좋은 것에 대해 소개해 주세요.",
    "죽기 전 원하는 음식을 먹을 수 있다면 무엇을 먹고 싶나요?",
    "좀비아포칼립스에 대비할 수 있는 24시간이 있다면 무엇을 할 건가요?",
    "최근 즐겨보는 TV 프로그램, 드라마, 유튜브 채널 등이 있다면 소개해 주세요.",
    "다른 나라에서 살아야 한다면 어디를 선택할 건가요?",

    "가장 좋아하는 식당 또는 다른 사람들에게 소개하고 싶은 식당이 있다면 소개해 주세요.",
    "커피를 좋아하나요? 가장 좋아하는 카페는 어디인가요? 커피를 좋아하지 않는다면 왜 좋아하지 않나요?",
    "올해 결심한 것 중에 가장 이루고 싶은 것은 무엇인가요?",
    "일하면서 가장 보람있는/즐거운 순간은 언제인가요?",
    "주말은 보통 어떻게 보내나요? 이번 주말은 어떻게 보낼 예정인지 말해주세요.",

    "남들에게 소개해주고 싶은 앱이 있나요? 아니면 가장 자주 사용하는 앱을 소개해 주세요."
  ]

  return addNewLine(questions)
}

function getCardTemplates(isMobile) {
  return {
    final: `
      <div class="card-header">끝<strong>.</strong></div>
      <div class="final-content description">
        모든 질문 카드를 확인했습니다.<br />
        다시 시작하려면 아래 버튼을 누르세요.
      </div>
      <button>다시 시작</button> 
    `,
    initial: `
    <div class="card-header">시작<strong>.</strong></div>
      <div class="final-content description">
        ${
          isMobile 
            ? '카드를 오른쪽으로 밀어서 <br />새 질문을 뽑아보세요.'
            : '아래 버튼을 눌러 질문을 뽑아보세요.'
        }
      </div>
      ${
        isMobile 
          ? `
            <div class="swipe">
              <div class="icon">
              <div class="chevron-right"></div>
              </div>
            </div>
            ` 
          : '<button>다음</button>'
      }
  
    `,
    question: ({ index, text }) => `
      <div class="card-header">
        <div class="card-number">${index + 1}</div>
      </div>
      <div class="card-content question">${text}</div>
      ${ isMobile ? '' : '<button>다음</button>'}
    `
  }
}


// utils
async function sleep(t = 100) {
  return new Promise(resolve => setTimeout(resolve, t))
}

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5)
}

function pipe(...fns) {
  return arg => fns.reduce((acc, fn) => fn(acc), arg)
}

function range(start, end, step = 1) {
  const result = []
  
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}