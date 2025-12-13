
let quotes = JSON.parse(localStorage.getItem('quotes'));
if (!quotes) {
  quotes = [
    {
      category: "personal",
      text: "This is a block-level quote"
    }
  ]
}

let displayedQuotes = [...quotes];
let serverQuotes = [];

const button = document.getElementById('newQuote');
button.addEventListener('click', showRandomQuote);

const formButton = document.getElementById('submit');
formButton.addEventListener('click', createAddQuoteForm);

const exportButton = document.getElementById('exportQuotes');
exportButton.addEventListener('click', exportJson);

const file = document.getElementById('importFile');
file.addEventListener('change', importFromJsonFile);

const selectCategory = document.getElementById('categoryFilter');
selectCategory.addEventListener('change', filterQuotes)

const syncButton = document.getElementById('syncQuotes');
syncButton.addEventListener('click', syncQuotes)

populateCategories();

const selectedCategory = localStorage.getItem('lastSelectedCategory');
if (selectedCategory) {
  selectCategory.value = selectedCategory;
  filterQuotes();
}

function filterQuotes() {
  const category = selectCategory.value;
  localStorage.setItem('lastSelectedCategory', category);
  if (category !== "all") {
    displayedQuotes = quotes.filter((quote) => quote.category === category);
  }
  else {
    displayedQuotes = [...quotes];
  }
}

function populateCategories() {
  const duplicateCategories = quotes.map((quote) => quote.category);
  const categories = new Set(duplicateCategories);

  for (const category of categories) {
    option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    selectCategory.appendChild(option);
  }
}
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported Successfully');

    populateCategories();

  };
  fileReader.readAsText(event.target.files[0]);
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function exportJson() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = "my_quotes.json";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

function createAddQuoteForm(event) {
  event.preventDefault();
  const quoteInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");
  const quote = quoteInput.value;
  const quoteCategory = quoteCategoryInput.value;

  if (quote != "" && quoteCategory != "") {

    quotes.push({
      category: `${quoteCategory}`,
      text: `${quote}`
    });
    populateCategories();
    localStorage.setItem('quotes', JSON.stringify(quotes))
    console.log("successful");
  }
}

function showRandomQuote() {
  if (displayedQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * displayedQuotes.length);
    const quote = displayedQuotes[randomIndex];

    const quoteDiv = document.getElementById('quoteDisplay');
    quoteDiv.innerHTML = "";

    const quoteParagraph = document.createElement('blockquote');
    quoteParagraph.textContent = `"${quote.text}"`;
    const quoteCategory = document.createElement('span');
    quoteCategory.textContent = `Category: ${quote.category}`;

    quoteDiv.appendChild(quoteParagraph);
    quoteDiv.appendChild(quoteCategory);

  }
}

async function fetchQuotesFromServer() {
  const url = "https://jsonplaceholder.typicode.com/posts";
  const response = await fetch(url);
  const data = await response.json();

  return data.slice(0, 5).map(item => ({
    category: item.title,
    text: item.body
  }));
}

function showNotification(message) {
  const notification = document.getElementById('syncNotification');
  notification.innerText = message;
  notification.style.display = 'block';
  notification.style.backgroundColor = '#d4edda';
  notification.style.color = '#155724';
}

async function postQuotesToServer() {
  const url = "https://jsonplaceholder.typicode.com/posts";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quotes)
  })

  const data = await response.json();
  console.log(data);
}

async function syncQuotes() {
  try {
    syncButton.innerText = "Syncing...";
    syncButton.disabled = true;

    const serverQuotes = await fetchQuotesFromServer();

    let newQuotesCount = 0;
    let conflictResolved = 0;

    for (const remoteQuote of serverQuotes) {
      const existingQuote = quotes.find(q => q.text === remoteQuote.text);

      if (!existingQuote) {
        // New Quote? Add it.
        quotes.push(remoteQuote);
        newQuotesCount++;
      } else {
        if (existingQuote.category !== remoteQuote.category) {
          existingQuote.category = remoteQuote.category;
          conflictResolved++;
        }
      }
    }

    if (newQuotesCount > 0 || conflictResolved > 0) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification(`Synced: ${newQuotesCount} new, ${conflictResolved} conflicts resolved.`);
    } else {
      showNotification("Sync complete. No new updates.");
    }

  } catch (error) {
    console.error("Sync failed:", error);
    showNotification("Error syncing with server.");
  } finally {
    syncButton.innerText = "Sync Quotes";
    syncButton.disabled = false;
  }
}

setInterval(syncQuotes, 10000);


