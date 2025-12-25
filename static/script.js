async function search() {
    const query = document.getElementById("query").value;
    const res = await fetch(`/search?q=${query}`);
    const books = await res.json();

    const results = document.getElementById("results");
    results.innerHTML = '';

    if (books.error) {
        results.innerHTML = `<li>${books.error}</li>`;
        return;
    }

    books.forEach(book => {
        const li = document.createElement("li");
        li.textContent = `${book.title} - ${book.author}`;
        results.appendChild(li);
    });
}

