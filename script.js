let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateSummary() {
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expenses;

    document.getElementById("total-income").innerText = formatCurrency(income);
    document.getElementById("total-expenses").innerText = formatCurrency(expenses);
    document.getElementById("balance").innerText = formatCurrency(balance);

    document.getElementById("balance").style.color = balance >= 0 ? 'var(--secondary-color)' : 'var(--danger-color)';
}

function renderTransactions() {
    const list = document.getElementById("transaction-list");
    list.innerHTML = "";

    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.className = `transaction-item ${transaction.type}`;
        li.innerHTML = `
            <span>${transaction.description}</span>
            <span>${formatCurrency(transaction.amount)}</span>
            <button class="delete-btn" onclick="deleteTransaction(${index})">
                <i class='bx bx-trash'></i>
            </button>
        `;
        list.appendChild(li);
    });
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateLocalStorage();
    renderTransactions();
    updateSummary();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function predictTransactionType(description) {
    description = description.toLowerCase();
    
      const incomeKeywords = [
        'allowance', 'gift', 'pocket money', 'part-time', 'chores',
        'babysitting', 'lawn mowing', 'tutoring', 'summer job', 'side hustle',
        'scholarship', 'award', 'prize', 'commission', 'selling', 
        'resale', 'art sale', 'craft sale', 'streaming', 'gaming',
        'content creation', 'donation', 'crowdfunding', 'competition', 'rental'
    ];
  
    
      const expenseKeywords = [
        'snacks', 'fast food', 'movies', 'gaming', 'subscriptions', 
        'streaming', 'music', 'concert', 'gift', 'shopping', 
        'clothes', 'accessories', 'gadgets', 'school supplies', 
        'books', 'sports', 'toys', 'arcade', 'hobbies', 
        'transport', 'bus fare', 'bike repair', 'mobile recharge',
        'apps', 'in-game purchase', 'donation', 'events', 
        'tickets', 'fun', 'party', 'social outing'
    ];
    
    
    for (let keyword of incomeKeywords) {
        if (description.includes(keyword)) return 'income';
    }
    
    for (let keyword of expenseKeywords) {
        if (description.includes(keyword)) return 'expense';
    }
    
    return null; // if no match found
}

document.getElementById("expense-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (description && !isNaN(amount)) {
        transactions.push({ description, amount, type });
        updateLocalStorage();
        renderTransactions();
        updateSummary();

        document.getElementById("description").value = "";
        document.getElementById("amount").value = "";
    } else {
        alert("Please enter valid data!");
    }
});

document.getElementById("description").addEventListener("input", (e) => {
    const description = e.target.value;
    if (description.length > 3) {
        const suggestedType = predictTransactionType(description);
        if (suggestedType) {
            document.getElementById("type").value = suggestedType;
        }
    }
});

// Initial render
renderTransactions();
updateSummary();

