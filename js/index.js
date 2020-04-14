/*
1)  ПЕРЕПИСАТЬ НАШЕ ПРИЛОЖЕНИЕ В ООП СТИЛЕ, СОЗДАТЬ КЛАСС (В СТАРОМ ФОРМАТЕ ИСПОЛЬЗОВАТЬ ES6 НЕ НУЖНО)
*/
'use strict';

let сalculationBtn = document.querySelector('#start'),
  userQuit = document.getElementById('cancel'),
  btnPlus = document.getElementsByTagName('button'),
  plusInc = btnPlus[0],
  plusExp = btnPlus[1],
  additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
  checkBox = document.querySelector('#deposit-check'),
  budgetDayValue = document.querySelector('.budget_day-value'),
  budgetMonthValue = document.querySelector('.budget_month-value'),
  expensesMonthValue = document.querySelector('.expenses_month-value'),
  additionalIncomeValue = document.querySelector('.additional_income-value'),
  additionalExpensesValue = document.querySelector('.additional_expenses-value'),
  incomePeriodValue = document.querySelector('.income_period-value'),
  targetMonthValue = document.querySelector('.target_month-value'),
  salaryAmount = document.querySelector('.salary-amount'),
  //incomeTitle = document.querySelector('.income-title'),
  incomeItems = document.querySelectorAll('.income-items'),
  //expensesTitle = document.querySelector('.expenses-title'),
  expensesItems = document.querySelectorAll('.expenses-items'),
  additionalExpensesItem = document.querySelector('.additional_expenses-item'),
  targetAmount = document.querySelector('.target-amount'),
  rangePeriod = document.querySelector('.period-select'),
  periodAmount = document.querySelector('.period-amount'),
  //--------------------------------------------------------//
  leftInputField = document.querySelector('.data'),
  rightInputField = document.querySelector('.result'),
  inputFields = leftInputField.querySelectorAll("input[type=text]");

const appData = function () {
  this.budget = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  this.expensesMonth = 0;
  this.income = {};
  this.incomeMonth = 0;
  this.addIncome = [];
  this.expenses = {};
  this.addExpenses = [];
  this.deposit = false;
};
appData.prototype.сalculationBtn = function () {

  if (isNaN(salaryAmount.value) || salaryAmount.value.trim() === '') {
    сalculationBtn.readOnly = true;
    return;
  }

  this.budget = +salaryAmount.value;
  this.getExpenses();
  this.getIncome();
  this.getExpensesMonth();
  this.getAddExpenses();
  this.getAddIncome();
  this.getBudget();

  this.actionBlock();
  this.showResult();

};

appData.prototype.showResult = function () {
  budgetMonthValue.value = this.budgetMonth;
  budgetDayValue.value = Math.floor(this.budgetDay);
  expensesMonthValue.value = this.expensesMonth;
  additionalExpensesValue.value = this.addExpenses.join(', ');
  additionalIncomeValue.value = this.addIncome.join(', ');
  targetMonthValue.value = Math.ceil(this.getTargetMonth());
  incomePeriodValue.value = this.calcPeriod();
  rangePeriod.addEventListener( /*'click'*/ 'mousemove', this.getIncomePeriodValue);
};

appData.prototype.addExpensesBlock = function () {
  let cloneExpensesItem = expensesItems[0].cloneNode(true),
    cloneTitle = cloneExpensesItem.querySelector('.expenses-title'),
    cloneAmount = cloneExpensesItem.querySelector('.expenses-amount');
  cloneTitle.value = '';
  cloneAmount.value = '';
  expensesItems[0].parentNode.insertBefore(cloneExpensesItem, plusExp);
  expensesItems = document.querySelectorAll('.expenses-items');

  if (expensesItems.length === 3) {
    plusExp.style.display = 'none';
  }
};

appData.prototype.addIncomeBlock = function () {
  let cloneIncomeItem = incomeItems[0].cloneNode(true),
    cloneTitle = cloneIncomeItem.querySelector('.income-title'),
    cloneAmount = cloneIncomeItem.querySelector('.income-amount');
  cloneTitle.value = '';
  cloneAmount.value = '';
  incomeItems[0].parentNode.insertBefore(cloneIncomeItem, plusInc);
  incomeItems = document.querySelectorAll('.income-items');

  if (incomeItems.length === 3) {
    plusInc.style.display = 'none';
  }
};

appData.prototype.getIncome = function () {
  incomeItems.forEach(function (item) {
    let itemIncome = item.querySelector('.income-title').value;
    let cashIncome = item.querySelector('.income-amount').value;
    if (itemIncome !== '' && cashIncome !== '') {
      this.income[itemIncome] = +cashIncome;
    }
  }, this);

  for (let key in this.income) {
    this.incomeMonth += this.income[key];
  }
};

appData.prototype.getAddIncome = function () {
  additionalIncomeItem.forEach(function (item) {
    let itemValue = item.value.trim();
    if (itemValue !== '') {
      this.addIncome.push(itemValue);
    }
  }, this);
};

appData.prototype.getExpenses = function () {
  expensesItems.forEach(function (item) {
    let itemExpenses = item.querySelector('.expenses-title').value;
    let cashExpenses = item.querySelector('.expenses-amount').value;
    if (itemExpenses !== '' && cashExpenses !== '') {
      this.expenses[itemExpenses] = +cashExpenses;
    }
  }, this);
};

appData.prototype.getAddExpenses = function () {
  let addExpenses = additionalExpensesItem.value.split(',');
  addExpenses.forEach(function (item) {
    item = item.trim();
    item = item.charAt(0).toUpperCase() + item.slice(1);
    if (item !== '') {
      this.addExpenses.push(item);
    }
  }, this);
};

appData.prototype.getExpensesMonth = function () {
  for (let key in this.expenses) {
    this.expensesMonth += this.expenses[key];
  }
};

appData.prototype.getBudget = function () {
  this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
  this.budgetDay = this.budgetMonth / 30;
};

appData.prototype.getTargetMonth = function () {
  return targetAmount.value / this.budgetMonth;
};

appData.prototype.getStatusIncome = function () {
  if (this.budgetDay < 300) {
    return ('Низкий уровыень доходов');
  } else if (this.budgetDay <= 800) {
    return ('Средний уровень доходов');
  } else {
    return ('Высокий уровень дохода');
  }
};

appData.prototype.calcPeriod = function () {
  return this.budgetMonth * rangePeriod.value;
};

appData.prototype.getIncomePeriodValue = function () {
  incomePeriodValue.value = budgetMonthValue.value * rangePeriod.value;
};

appData.prototype.getTargetMonthText = function () {
  if (this.targetMonth < 0) {
    return 'Цель не будет достигнута';
  } else {
    return 'Вы достигните цели за ' +
      Math.floor(this.targetMonth) + ' месяцев';
  }
};

appData.prototype.actionBlock = function () {
  let inputFields = leftInputField.querySelectorAll("input[type=text]");
  inputFields.forEach(function (item, index) {
    item.setAttribute('disabled', '');
  });
  сalculationBtn.style.display = 'none';
  userQuit.style.display = 'inline';
  plusExp.removeEventListener('click', this.addExpensesBlock);
  plusInc.removeEventListener('click', this.addIncomeBlock);
};

appData.prototype.reset = function () {
  inputFields = leftInputField.querySelectorAll("input[type=text]");
  inputFields.forEach(function (item) {
    item.value = '';
    item.disabled = false;
  });

  inputFields = rightInputField.querySelectorAll("input[type=text]");
  inputFields.forEach(function (item) {
    item.value = '';
    item.disabled = false;
  });

  rangePeriod.value = '1';
  periodAmount.innerHTML = '1';
  userQuit.style.display = 'none';
  сalculationBtn.style.display = 'inline';
  plusInc.style.display = 'inline';
  plusExp.style.display = 'inline';
  checkBox.checked = false;

  this.budget = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  this.expensesMonth = 0;
  this.income = {};
  this.incomeMonth = 0;
  this.expenses = {};

  this.addIncome = [];
  this.addExpenses = [];


  plusExp.addEventListener('click', appData.addExpensesBlock);
  plusInc.addEventListener('click', appData.addIncomeBlock);
  rangePeriod.removeEventListener('mousemove', appData.getIncomePeriodValue);

  let elements = document.querySelectorAll('.income-items');
  for (let i = 1; i < elements.length; i++) {
    elements[i].parentNode.removeChild(elements[i]);
  }

  elements = document.querySelectorAll('.expenses-items');
  for (let i = 1; i < elements.length; i++) {
    elements[i].parentNode.removeChild(elements[i]);
  }

};

//2) СОЗДАТЬ НОВЫЙ МЕТОД В КЛАССЕ, НАПРИМЕР EVENTSLISTENERS.
//3) ПЕРЕНЕСТИ ВСЕ ДЕЙСТВИЯ, КОТОРЫЕ ОСТАЛИСЬ ЗА КЛАССОМ ВНУТРЬ НЕГО.

appData.prototype.eventsListeners = function () {

  rangePeriod.addEventListener('input', function () {
    periodAmount.innerHTML = rangePeriod.value;
  });

  сalculationBtn.addEventListener('click', this.сalculationBtn.bind(this));
  userQuit.addEventListener('click', this.reset.bind(this));
  plusExp.addEventListener('click', this.addExpensesBlock.bind(this));
  plusInc.addEventListener('click', this.addIncomeBlock.bind(this));

};

const newAppData = new appData();

newAppData.eventsListeners();