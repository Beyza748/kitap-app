from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/detay')
def detay():
    return render_template('detay.html')

@app.route('/search', methods=['GET'])
def search_books():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "Arama terimi boş olamaz"}), 400

    url = f"https://openlibrary.org/search.json?q={query}"
    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({"error": "API çağrısı başarısız"}), 500

    data = response.json()
    books = [{"title": book.get("title"), "author": book.get("author_name")} 
             for book in data.get("docs", [])[:10]]

    return jsonify(books)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
