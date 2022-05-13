"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Event Handler
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();

  if (
    amount > 0 && // no negative amount
    receiverAcc && // username/account should be valid
    currentAccount.balance >= amount && // user should have sufficient amount
    receiverAcc?.username !== currentAccount.username // cannot transfer money to self
  ) {
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  // Clear input field
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    // Revert to original message
    labelWelcome.textContent = "Log in to get started";
  }

  inputCloseUsername.value = inputClosePin.value = "";
  inputClosePin.blur();
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*

//////////////////////////////////////
// Array methods
//////////////////////////////////////

let arr = ["a", "b", "c", "d", "e"];

// Slice method

console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// Splice method

// console.log(arr.splice(2));
console.log(arr.splice(-1));
console.log(arr);
console.log(arr.splice(1, 2));
console.log(arr);

// Reverse method
arr = ["a", "b", "c", "d", "e"];
const arr2 = ["j", "i", "h", "g", "f"];
console.log(arr2.reverse());
console.log(arr2);

// Concat method

const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// Join method

console.log(letters.join(" - "));


//////////////////////////////////////
// At method
//////////////////////////////////////

const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// getting last element array
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log("vaibhav".at(0));
console.log("vaibhav".at(-1));


//////////////////////////////////////
// forEach loop
//////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}.`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}.`);
  }
}

console.log("---- FOREACH ----");

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}.`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}.`);
  }
});


//////////////////////////////////////
// forEach loop(Maps and Sets)
//////////////////////////////////////

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(["USD", "GBP", "USD", "EUR", "EUR"]);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});


//////////////////////////////////////
// map Method
//////////////////////////////////////

const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
  //   return mov * eurToUsd;
  // });
  
  const movementsUSD = movements.map((mov) => mov * eurToUsd);
  
  console.log(movements);
  console.log(movementsUSD);
  
  const movementsUSDFor = [];
  for (let mov of movements) {
    movementsUSDFor.push(mov * eurToUsd);
  }
  
  console.log(movementsUSDFor);
  
  const movementsDescription = movements.map(
    (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? "deposited" : "withdrew"} ${Math.abs(
      mov
      )}.`
      );
      
      console.log(movementsDescription);
      
      
//////////////////////////////////////
// filter Method
//////////////////////////////////////
      
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
        
const deposits = movements.filter((mov) => mov > 0);
const withdrawals = movements.filter((mov) => mov < 0);
console.log(deposits);
console.log(withdrawals);
        
const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) {
    depositsFor.push(mov);
   }
 }
console.log(depositsFor);
        
//////////////////////////////////////
// reduce Method
//////////////////////////////////////

// accumulator => SNOWBALL
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
  
const balance = movements.reduce((acc, cur) => acc + cur, 0);
  
console.log(balance);
  
let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);
  
// Maximum value
  
const max = movements.reduce(
  (acc, cur) => (acc > cur ? acc : cur),
  movements[0]
  );
console.log(max);
    
//////////////////////////////////////
// Magic of Chaining Methods
//////////////////////////////////////

const euroToUsd = 1.1;

// PIPELINE

const totalDepositUSD = movements
.filter((mov) => mov > 0)
.map((mov) => mov * euroToUsd)
.reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositUSD);


//////////////////////////////////////
// find Method
//////////////////////////////////////

const firstWithdrawal = movements.find((mov) => mov < 0);

console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find((acc) => acc.owner === "Jessica Davis");

console.log(account);

// Using for-of loop

const accountNew = function (accounts) {
  for (const acc of accounts) {
    if (acc.owner === "Jessica Davis") {
      return acc;
    }
  }
};

console.log(accountNew(accounts));


//////////////////////////////////////
// some and every Method
//////////////////////////////////////

console.log(movements);

// Equality
console.log(movements.includes(-130));

// SOME: Condition
console.log(movements.some((mov) => mov === -130));

const anyDeposits = movements.some((mov) => mov > 0);
console.log(anyDeposits);

// EVERY
console.log(movements.every((mov) => mov > 0));
console.log(account4.movements.every((mov) => mov > 0));

// Separate callback
const deposit = (mov) => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


//////////////////////////////////////
// flat and flatMap Method
//////////////////////////////////////

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// Practical example
// const accountMovements = accounts.map((acc) => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// Chaining(flat)
const overallBalance = accounts
.map((acc) => acc.movements)
.flat()
.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// Chaining(flatMap)
const overallBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
  console.log(overallBalance2);
  
  
//////////////////////////////////////
// Sorting Arrays
//////////////////////////////////////
  
// Strings
const owners = ["Vaibhav", "Kartik", "Preeti", "Akshay"];
console.log(owners.sort());
console.log(owners);
  
// Numbers
console.log(movements);
  
// Ascending
// return < 0, A, B (keep order)(-1)
// return > 0, B, A (switch order)(1)
  
// movements.sort((a, b) => {
  //   if (a > b) return 1;
  //   if (a < b) return -1;
  // });
  movements.sort((a, b) => a - b);
  console.log(movements);
    
  // Descending
  // return < 0, B, A (switch order)(1)
  // return > 0, A, B (keep order)(-1)
    
  // movements.sort((a, b) => {
    //   if (a > b) return -1;
    //   if (a < b) return 1;
    // });
    movements.sort((a, b) => b - a);
    console.log(movements);
      
*/

////////////////////////////////////////////
// More ways of Creating and Filling Arrays
////////////////////////////////////////////

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Empty arrays + fill method
const x = new Array(7);
console.log(x); // weird behaviour of new Array when only one argument is passed

// console.log(x.map(() => 5)); // does not work
// x.fill(1);
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 4, 6);
console.log(arr);

// Array.from()
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener("click", function () {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent.replace("€", ""))
  );

  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll(".movements__value")]; // have to do mapping separately
});
