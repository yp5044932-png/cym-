const inviteCard = document.querySelector("#inviteCard");
const dateCard = document.querySelector("#dateCard");
const foodCard = document.querySelector("#foodCard");
const summaryCard = document.querySelector("#summaryCard");
const yesBtn = document.querySelector("#yesBtn");
const noBtn = document.querySelector("#noBtn");
const confirmDateBtn = document.querySelector("#confirmDateBtn");
const confirmFoodBtn = document.querySelector("#confirmFoodBtn");
const restartBtn = document.querySelector("#restartBtn");
const pickedDateText = document.querySelector("#pickedDateText");
const dateOptions = document.querySelector("#dateOptions");
const foodOptions = document.querySelector("#foodOptions");
const summaryDate = document.querySelector("#summaryDate");
const summaryFood = document.querySelector("#summaryFood");

let evadeCount = 0;
let selectedDate = "7月14日 周二";
let selectedFood = "火锅";
let noJumpTimer;
const noWords = ["再想想嘛", "真的不要吗", "不许点这里", "给个机会", "选愿意嘛", "心软一下"];
const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createDateOptions() {
  const fragment = document.createDocumentFragment();

  for (let day = 14; day <= 31; day += 1) {
    const date = new Date(2026, 6, day);
    const week = weekdays[date.getDay()];
    const button = document.createElement("button");
    button.className = `option-btn${day === 14 ? " selected" : ""}`;
    button.type = "button";
    button.dataset.value = `7月${day}日 ${week}`;
    button.innerHTML = `<span>7月${day}日</span><strong>${week}</strong>`;
    fragment.appendChild(button);
  }

  dateOptions.appendChild(fragment);
}

function popTeaseWords(x, y) {
  for (let index = 0; index < 4; index += 1) {
    const word = document.createElement("span");
    word.className = "tease-word";
    word.textContent = noWords[(evadeCount + index) % noWords.length];
    word.style.left = `${x + Math.random() * 90 - 45}px`;
    word.style.top = `${y + Math.random() * 60 - 30}px`;
    word.style.animationDelay = `${index * 80}ms`;
    document.body.appendChild(word);
    word.addEventListener("animationend", () => word.remove());
  }
}

function moveNoButton(event, showWords = true) {
  event?.preventDefault();
  event?.stopPropagation();
  const rect = noBtn.getBoundingClientRect();
  const padding = 18;
  const maxX = window.innerWidth - rect.width - padding;
  const maxY = window.innerHeight - rect.height - padding;
  const originX = event?.clientX ?? rect.left + rect.width / 2;
  const originY = event?.clientY ?? rect.top + rect.height / 2;
  const x = clamp(Math.random() * maxX, padding, maxX);
  const y = clamp(Math.random() * maxY, padding, maxY);

  noBtn.classList.add("evade");
  noBtn.style.animation = "none";
  noBtn.offsetHeight;
  noBtn.style.animation = "";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  evadeCount += 1;
  noBtn.textContent = noWords[evadeCount % noWords.length];
  if (showWords) {
    popTeaseWords(originX, originY);
  }
}

function startNoButtonJump(event) {
  moveNoButton(event);
  if (noJumpTimer) return;

  noJumpTimer = window.setInterval(() => {
    moveNoButton(undefined, evadeCount % 3 === 0);
  }, 650);
}

function stopNoButtonJump() {
  window.clearInterval(noJumpTimer);
  noJumpTimer = undefined;
}

function throwPetals() {
  for (let index = 0; index < 34; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = index % 3 === 0 ? "❤" : "✿";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
    petal.style.animationDelay = `${Math.random() * 0.8}s`;
    petal.style.fontSize = `${Math.random() * 16 + 18}px`;
    document.body.appendChild(petal);
    petal.addEventListener("animationend", () => petal.remove());
  }
}

function showCard(currentCard, nextCard) {
  currentCard.classList.add("exit");
  currentCard.classList.remove("active");
  window.setTimeout(() => {
    currentCard.classList.remove("exit");
    nextCard.classList.add("active");
  }, 220);
}

function acceptInvite() {
  stopNoButtonJump();
  noBtn.classList.remove("evade");
  noBtn.style.left = "";
  noBtn.style.top = "";
  throwPetals();
  showCard(inviteCard, dateCard);
}

function selectOption(group, button) {
  group.querySelectorAll(".option-btn").forEach((option) => option.classList.remove("selected"));
  button.classList.add("selected");
  return button.dataset.value;
}

function confirmDate() {
  pickedDateText.textContent = `${selectedDate} 已锁定，接下来选择甜甜的晚餐。`;
  showCard(dateCard, foodCard);
}

function confirmFood() {
  summaryDate.textContent = selectedDate;
  summaryFood.textContent = selectedFood;
  throwPetals();
  showCard(foodCard, summaryCard);
}

function restartFlow() {
  stopNoButtonJump();
  summaryCard.classList.remove("active");
  inviteCard.classList.add("active");
  noBtn.classList.remove("evade");
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.textContent = "不要 ☝";
  evadeCount = 0;
}

createDateOptions();
yesBtn.addEventListener("click", acceptInvite);
confirmDateBtn.addEventListener("click", confirmDate);
confirmFoodBtn.addEventListener("click", confirmFood);
restartBtn.addEventListener("click", restartFlow);
noBtn.addEventListener("click", startNoButtonJump);

dateOptions.addEventListener("click", (event) => {
  const button = event.target.closest(".option-btn");
  if (!button) return;
  selectedDate = selectOption(dateOptions, button);
});

foodOptions.addEventListener("click", (event) => {
  const button = event.target.closest(".option-btn");
  if (!button) return;
  selectedFood = selectOption(foodOptions, button);
});
