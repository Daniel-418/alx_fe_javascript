const quotes = [
  {
    category: "personal",
    text: "Every man is a giant"
  }
]

const button = document.getElementById('newQuote');
button.addEventListener('click', showRandomQuote);

const formButton = document.getElementById('submit');
formButton.addEventListener('click', createAddQuoteForm);

function createAddQuoteForm(event) {
  event.preventDefault();
  const quoteInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  if (quoteInput && quoteCategoryInput) {
    const quote = quoteInput.value;
    const quoteCategory = quoteCategoryInput.value;
    quotes.push({
      category: `${quoteCategory}`,
      text: `${quote}`
    });
    console.log("successful");
  }
}

function showRandomQuote() {
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    const quoteDiv = document.getElementById('quoteDisplay');

    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `"${quote.text}"`;
    const quoteCategory = document.createElement('span');
    quoteCategory.textContent = `Category: ${quote.category}`;

    quoteDiv.appendChild(quoteParagraph);
    quoteDiv.appendChild(quoteCategory);

  }
}

