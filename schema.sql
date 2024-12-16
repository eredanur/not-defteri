CREATE DATABASE IF NOT EXISTS not_defteri;
USE not_defteri;

CREATE TABLE IF NOT EXISTS notlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    baslik VARCHAR(255) NOT NULL,
    not_metni TEXT NOT NULL,
    tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tamamlandi TINYINT(1) DEFAULT 0
);