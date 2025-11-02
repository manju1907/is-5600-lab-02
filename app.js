import { stockContent } from "./data/stocks-complete.js";
import { userContent } from "./data/users.js";

document.addEventListener('DOMContentLoaded', () => {
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);

    const deleteButton = document.querySelector('#btnDelete');
    const saveButton = document.querySelector('#btnSave');

    // Initial render
    generateUserList(userData, stocksData);

    // DELETE button handler
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        const userId = document.querySelector('#userID').value;
        const index = userData.findIndex(user => user.id == userId);
        if (index >= 0) {
            userData.splice(index, 1);
            generateUserList(userData, stocksData);
        }
    });

    // SAVE button handler
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();

        const id = document.querySelector('#userID').value;
        const firstname = document.querySelector('#firstname').value;
        const lastname = document.querySelector('#lastname').value;
        const address = document.querySelector('#address').value;
        const city = document.querySelector('#city').value;
        const email = document.querySelector('#email').value;

        const index = userData.findIndex(user => user.id == id);
        if (index >= 0) {
            userData[index].user.firstname = firstname;
            userData[index].user.lastname = lastname;
            userData[index].user.address = address;
            userData[index].user.city = city;
            userData[index].user.email = email;
            generateUserList(userData, stocksData);
        }
    });

    // user list click handler
    const userList = document.querySelector('.user-list');
    userList.addEventListener('click', (event) => handleUserListClick(event, userData, stocksData));
});


/**
 * Loops through the users and renders a ul with li elements for each user
 * @param {*} users 
 */
function generateUserList(users, stocks) {
    // get the list element and for each user create a list item and append it to the list
    const userList = document.querySelector('.user-list');
    // clear out the list from previous render
    userList.innerHTML = '';

    users.map(({ user, id }) => {
        const listItem = document.createElement('li');
        listItem.innerText = user.lastname + ', ' + user.firstname;
        listItem.setAttribute('id', id);
        userList.appendChild(listItem);
    });

    // register the event listener on the list
    userList.addEventListener('click', (event) => handleUserListClick(event, users));
}



// Handles clicks on user list items
function handleUserListClick(event, users, stocks) {
    const userId = event.target.id;
    const user = users.find(u => u.id == userId);
    if (user) {
        populateForm(user);
        renderPortfolio(user, stocks);
    }
}


function populateForm(data) {
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
}


function renderPortfolio(user, stocks) {
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = '';
    user.portfolio.forEach(({ symbol, owned }) => {
        const symbolEl = document.createElement('p');
        const sharesEl = document.createElement('p');
        const btn = document.createElement('button');

        symbolEl.textContent = symbol;
        sharesEl.textContent = owned;
        btn.textContent = 'View';
        btn.id = symbol;

        portfolioDetails.append(symbolEl, sharesEl, btn);
    });

    // Only handle button clicks
    portfolioDetails.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            viewStock(event.target.id, stocks);
        }
    });
}


function viewStock(symbol, stocks) {
    const stockArea = document.querySelector('.stock-form');
    const stock = stocks.find(s => s.symbol == symbol);
    if (!stock) return;

    document.querySelector('#stockName').textContent = stock.name;
    document.querySelector('#stockSector').textContent = stock.sector;
    document.querySelector('#stockIndustry').textContent = stock.subIndustry;
    document.querySelector('#stockAddress').textContent = stock.address;
    document.querySelector('#logo').src = `logos/${symbol}.svg`;

    stockArea.style.display = 'block';
}
