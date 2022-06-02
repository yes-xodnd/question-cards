;(function main() {
  const $button = document.querySelector('.knock-button')
  const $cardNumber = document.querySelector('.card-number')
  const $cardContent = document.querySelector('.card-content')
  const questions = getQuestions()
  
  let isPicking
  $button.addEventListener('click', pick)

  async function pick() {
    if (isPicking) return
  
    isPicking = true
    $button.classList.add('disabled')
    
    const numbers = createRandomNumbers(10, questions.length)

    await spinNumber(numbers)
    $cardContent.textContent = questions[numbers[numbers.length - 1] - 1]

    $button.classList.remove('disabled')
    isPicking = false
  }
  
  async function spinNumber(numbers) {
    for (const number of numbers) {
      $cardNumber.textContent = number
      await sleep(30)
    }
  }
})()

async function sleep(t = 100) {
  return new Promise(resolve => setTimeout(resolve, t))
}

function createRandomNumbers(count = 1, max = 30) {
  const result = []

  while (result.length < count) {
    const number = createRandomNumber(max)
    result.push(number)
  }
  return result
}

function createRandomNumber(max) {
  return Math.round(Math.random() * max)
}

function getQuestions() {
  return [
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
    "좀비 아포칼립스에 대비할 수 있는 24시간이 있다면 무엇을 할 건가요?",
    
    "최근 즐겨보는 TV 프로그램, 드라마, 유튜브 채널 등이 있다면 소개해 주세요.",
    "다른 나라에서 살아야 한다면 어디를 선택할 건가요?",

    "가장 좋아하는 식당 또는 다른 사람들에게 소개하고 싶은 식당이 있다면 소개해 주세요.",
    "커피를 좋아하나요? 가장 좋아하는 카페는 어디인가요?",

    "올해 결심한 것 중에 가장 이루고 싶은 것은 무엇인가요?",
    "일하면서 가장 보람있는/즐거운 순간은 언제인가요?",

    "주말은 보통 어떻게 보내나요? 이번 주말은 어떻게 보낼 예정인지 말해주세요.",
    "남들에게 소개해주고 싶은 앱이 있나요? ."
  ]
}