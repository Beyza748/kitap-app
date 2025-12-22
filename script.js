// Kitap arama
async function searchBooks() {
  const q = document.getElementById("searchInput").value;
  const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`);
  const data = await res.json();

  const listDiv = document.getElementById("resultList");
  listDiv.innerHTML = "";

  data.docs.slice(0, 10).forEach(book => {
    const cover = book.cover_i 
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "https://via.placeholder.com/120x180?text=No+Cover";

    const authorKey = book.author_key && book.author_key[0];

    const html = `
      <div onclick="goToDetail('${book.key}', '${authorKey}')">
        <img src="${cover}">
        <strong>${book.title}</strong><br>
        <small>${book.author_name ? book.author_name.join(", ") : "Bilinmiyor"}</small>
      </div>
    `;
    listDiv.innerHTML += html;
  });
}

function goToDetail(bookKey, authorKey) {
  // Detay sayfasına parametre yolla
  window.location = `detay.html?book=${bookKey}&author=${authorKey}`;
}

// Detay sayfası yüklenince
window.onload = async function() {
  const params = new URLSearchParams(location.search);

  if (params.has("book")) {
    // kitap detayları
    const bookKey = params.get("book");
    const res = await fetch(`https://openlibrary.org${bookKey}.json`);
    const book = await res.json();

    document.getElementById("bookDetail").innerHTML = `
      <div class="detail-card">
        <h2>${book.title}</h2>
        <p><b>Yayın Yılı:</b> ${book.first_publish_date || "-"}</p>
      </div>
    `;
  }

  if (params.has("author")) {
    const authorKey = params.get("author");
    const aRes = await fetch(`https://openlibrary.org/authors/${authorKey}.json`);
    const author = await aRes.json();

    document.getElementById("authorDetail").innerHTML = `
      <div class="detail-card">
        <h3>✍️ ${author.name}</h3>
        <p><b>Doğum:</b> ${author.birth_date || "-"}</p>
        <p><b>Ölüm:</b> ${author.death_date || "-"}</p>
        <p>${author.bio ? author.bio.value || author.bio : "Biyografi yok"}</p>
      </div>
    `;
  }
}

