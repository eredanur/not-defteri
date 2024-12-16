const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
require('dotenv').config();

const app = express();
// Veritabanı bağlantısı
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL Bağlantısı Başarılı!");
});
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Ana Sayfa
app.get("/", (req, res) => {
    const query = "SELECT * FROM notlar ORDER BY tarih DESC";
    db.query(query, (err, result) => {
        if (err) throw err;
        res.render("index", { notlar: result, notToEdit: null }); // notToEdit default olarak null
    });
});
// Not Kaydet
app.post("/kaydet", (req, res) => {
    const { baslik, not_metni } = req.body;

    if (!baslik || !not_metni || baslik.trim() === "" || not_metni.trim() === "") {
        return res.status(400).send("Başlık ve Not alanları boş bırakılamaz!");
    }

    const query = "INSERT INTO notlar (baslik, not_metni, tarih, tamamlandi) VALUES (?, ?, NOW(), 0)";
    db.query(query, [baslik, not_metni], (err) => {
        if (err) throw err;
        res.redirect("/");
    });
});
// Not Düzenle
app.get("/duzenle/:id", (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM notlar WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        const notToEdit = result.length ? result[0] : null; // Düzenlenecek not
        db.query("SELECT * FROM notlar ORDER BY tarih DESC", (err, notlar) => {
            if (err) throw err;
            res.render("index", { notlar, notToEdit });
        });
    });
});

app.post("/duzenle/:id", (req, res) => {
    const { id } = req.params; // Düzenlenecek notun ID'si
    const { baslik, not_metni } = req.body; // Formdan gelen veriler
    const query = "UPDATE notlar SET baslik = ?, not_metni = ? WHERE id = ?";
    db.query(query, [baslik, not_metni, id], (err) => {
        if (err) throw err;
        res.redirect("/"); // İşlem tamamlandığında ana sayfaya yönlendir
    });
});


// Not Sil
app.post("/sil/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM notlar WHERE id = ?";
    db.query(query, [id], (err) => {
        if (err) throw err;
        res.redirect("/");
    });
});
// Not Tamamlandı
app.post("/tamamla/:id", (req, res) => {
    const { id } = req.params;
    const query = "UPDATE notlar SET tamamlandi = 1 WHERE id = ?";
    db.query(query, [id], (err) => {
        if (err) throw err;
        res.redirect("/");
    });
});
// Sunucu Başlat
app.listen(3001, () => {
    console.log("Sunucu 3001 portunda çalışıyor.");
});
