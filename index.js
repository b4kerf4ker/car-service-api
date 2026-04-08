const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'car_service'
});

db.connect((err) => {
    if (err) {
        console.error('Помилка підключення до БД:', err);
        return;
    }
    console.log('Успішно підключено до бази car_service!');
});


app.get('/clients', (req, res) => {
    db.query('SELECT * FROM clients', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/orders/receipts', (req, res) => {
    db.query('SELECT * FROM vw_order_receipts', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/clients', (req, res) => {
    const { first_name, last_name, phone, email } = req.body;
    db.query('INSERT INTO clients (first_name, last_name, phone, email) VALUES (?, ?, ?, ?)', 
    [first_name, last_name, phone, email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Клієнта успішно додано!', id: results.insertId });
    });
});

app.put('/clients/:id', (req, res) => {
    const { first_name, last_name, phone, email } = req.body;
    const { id } = req.params;
    db.query('UPDATE clients SET first_name=?, last_name=?, phone=?, email=? WHERE client_id=?', 
    [first_name, last_name, phone, email, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Дані клієнта оновлено!' });
    });
});

app.delete('/clients/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM clients WHERE client_id=?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Клієнта видалено!' });
    });
});

app.listen(3000, () => {
    console.log('REST API сервер СТО запущено на порту 3000');
});