var balance = localStorage.getItem("balance") || 0;
var data = document.getElementById("dataList");
var expenses = JSON.parse(localStorage.getItem("expenses")) || [];
var header = "<tr>" +
    "<td style='width: 70px; color: white;'>" + "<b>" + "Date" + "</b>" + "</td>" +
    "<td style='width: 100px; color: white;'>" + "<b>" + "Category" + "</b>" + "</td>" +
    "<td style='color: white;'>" + "<b>" + "Amount" + "</b>" + "</td>" +
    "<td>" + "</td>" +
    "<td style='color: white;'>" + "<b>" + "Edit" + "</b>" + "</td>" +
    "<td style='color: white;'>" + "<b>" + "Delete" + "</b>" + "</td>" +
    "</tr>"

function Expense(expense, category, dateExp) {
    this.expense = expense;
    this.category = category;
    this.dateExp = dateExp;
}

function addIncome() {
    if (document.getElementById("income").value == "") {
        alert("Enter Your Amount")
    } else {
        balance += parseInt(document.getElementById("income").value)
        document.getElementById("income").value = ""
        showIncome()
    }
    addToLocalStorage()
}

function showIncome() {
    document.getElementById("currentIncome").innerText = balance
    addToLocalStorage()
}

function addExpense() {
    var expense = document.getElementById("expense");
    var category = document.getElementById("category");
    var dateExp = document.getElementById("dateExpense");
    var dateFilter = document.getElementById('dateFilter')

    if (expense.value == "") {
        alert("Enter your expense amount")
    } else if (dateExp.value == "") {
        alert("Please choose your expense date")
    } else if (category.value == "categories") {
        alert("Choose your expense category")
    } else {
        var newExpense = new Expense(parseInt(expense.value), category.value, dateExp.value)
        expenses.push(newExpense)
        balance -= parseInt(expense.value)
        dateFilter.innerHTML += "<option>" + dateExp.value + "</option>"
        showIncome()
        renderItem()
        valueReset()
    }
       addToLocalStorage()
}

function valueReset() {
    document.getElementById("expense").value = ""
    document.getElementById("category").value = "Categories"
    document.getElementById("dateExpense").value = ""
    addToLocalStorage()
}

function renderItem() {
    var item = "";
    for (var i = 0; i < expenses.length; i++) {
        item = "<tr>" + "<td>" + expenses[i].dateExp + "</td>" +
            "<td>" + expenses[i].category + "</td>" +
            "<td>" + expenses[i].expense + "<td/>" +
            "<td>" + "<button onclick = 'editItem(this)'>" + "edit" + "</button>" + "</td>" +
            "<td>" + "<button onclick = 'deleteItem(this)'>" + "delete" + "</button>" + "</td>" + "</tr>"
    }
    data.innerHTML += item
    addToLocalStorage()
}

function showFilterExpense() {
    var dateFilter = document.getElementById('dateFilter').value
    var category = document.getElementById("showExpense").value;

    var item = "";
    for (var i = 0; i < expenses.length; i++) {
        if (category == "Categories" && dateFilter == "Date") {
            item += "<tr>" + "<td>" + expenses[i].dateExp + "</td>" +
                "<td>" + expenses[i].category + "</td>" +
                "<td>" + expenses[i].expense + "<td/>" +
                "<td>" + "<button onclick = 'editItem(this)'>" + "edit" + "</button>" + "</td>" +
                "<td>" + "<button onclick = 'deleteItem(this)'>" + "delete" + "</button>" + "</td>" + "</tr>"
        }

        if (category == expenses[i].category && dateFilter == "Date") {
            item += "<tr>" + "<td>" + expenses[i].dateExp + "</td>" +
                "<td>" + expenses[i].category + "</td>" +
                "<td>" + expenses[i].expense + "<td/>" +
                "<td>" + "<button onclick = 'editItem(this)'>" + "edit" + "</button>" + "</td>" +
                "<td>" + "<button onclick = 'deleteItem(this)'>" + "delete" + "</button>" + "</td>" + "</tr>"
        }

        if (category == expenses[i].category && dateFilter == expenses[i].dateExp) {
            item += "<tr>" + "<td>" + expenses[i].dateExp + "</td>" +
                "<td>" + expenses[i].category + "</td>" +
                "<td>" + expenses[i].expense + "<td/>" +
                "<td>" + "<button onclick = 'editItem(this)'>" + "edit" + "</button>" + "</td>" +
                "<td>" + "<button onclick = 'deleteItem(this)'>" + "delete" + "</button>" + "</td>" + "</tr>"
        }

        if (category == "Categories" && dateFilter == expenses[i].dateExp) {
            item += "<tr>" + "<td>" + expenses[i].dateExp + "</td>" +
                "<td>" + expenses[i].category + "</td>" +
                "<td>" + expenses[i].expense + "<td/>" +
                "<td>" + "<button onclick = 'editItem(this)'>" + "edit" + "</button>" + "</td>" +
                "<td>" + "<button onclick = 'deleteItem(this)'>" + "delete" + "</button>" + "</td>" + "</tr>"
        }
    }
    data.innerHTML = header + item
    addToLocalStorage()
}

function editItem(i) {
    var dateExp = i.parentNode.parentNode.childNodes[0].innerHTML
    var oldValue = i.parentNode.parentNode.childNodes[1].innerHTML
    var oldAmount = i.parentNode.parentNode.childNodes[2].innerHTML
    var newAmount = i.parentNode.parentNode.childNodes[2].innerHTML = +prompt('Enter New Amount', oldAmount)
    var diffAmount = oldAmount - newAmount
    balance = document.getElementById("currentIncome").innerText = balance + diffAmount

    for (var i = 0; i < expenses.length; i++) {
        if (expenses[i].category == oldValue && expenses[i].dateExp == dateExp && expenses[i].expense == oldAmount) {
            expenses[i].expense = newAmount
        }
    }
    addToLocalStorage()
}

function deleteItem(i) {
    var dateExp = i.parentNode.parentNode.childNodes[0].innerHTML
    var oldValue = i.parentNode.parentNode.childNodes[1].innerHTML
    var oldAmount = i.parentNode.parentNode.childNodes[2].innerHTML
    i.parentNode.parentNode.remove()

    for (var j = 0; j < expenses.length; j++) {
        if (expenses[j].category == oldValue && expenses[j].dateExp == dateExp && expenses[j].expense == oldAmount) {
            expenses.splice(j, 1)
            balance = document.getElementById("currentIncome").innerText = parseInt(balance) + parseInt(oldAmount)
        }
    }
    addToLocalStorage()
}
function getSum() {
    const sum = expenses.reduce((acc, i) => {
      const today = moment();
      const eDate = moment(i.dateExp, "YYYY-MM-DD");
      if (today.isSame(eDate, "month")) return acc + i.expense;
      return acc;
    }, 0);
    alert(sum);
    addToLocalStorage()
  }
  
  
  function filterMonthExpenses() {
    const category = document.getElementById("monthExpenseFilterCategory").value;
    const date = document.getElementById("monthExpenseFilterDate").value;
    const data = expenses.filter((i) => {
      const thisMonth = moment(date, "YYYY-MM");
      const eDate = moment(i.dateExp, "YYYY-MM-DD");
      return thisMonth.isSame(eDate, "month") && i.category == category;
    });
    const table = document.getElementById("data2List");
    data.forEach((i) => {
      table.innerHTML +=
        "<tr>" +
        "<td style='width: 100px; color: white;'>" +
        i.category +
        "</td>" +
        "<td style='width: 100px; color: white;'>" +
        i.expense +
        "</td>" +
        "</tr>";
    });
    addToLocalStorage()
  }
  

  function addToLocalStorage() {
    localStorage.setItem("balance", balance);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }
  window.onload = function () {
    showIncome();
    renderItem();
  };