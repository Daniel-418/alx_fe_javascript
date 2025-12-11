const quotes = [
  {
    category: "personal",
    text: "Every man is a giant"
  }
]

const button = document.getElementById('newQuote');
button.addEventListener('click', showRandomQuote);

const formButton = document.getElementById('submit');
formButton.addEventListener('click', addQuote);

function addQuote(event) {
  event.preventDefault();
  const quoteInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");
  console.log('event listener runs');

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
    quoteDiv.innerHTML = `
      <p><blockquote>"${quote.text}"</blockquote></p>
      Category: <span>${quote.category}</span>
    `
  }
}

function CreateAddQuoteForm() {

}
