
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

populateCategories();

const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
if (lastSelectedCategory) {
  selectCategory.value = lastSelectedCategory;
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

