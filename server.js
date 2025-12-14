const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/submit-feedback', (req, res) => {
  console.log('Получены данные:', req.body);
  res.json({
    success: true,
    message: 'Спасибо! Данные получены!'
  });
});

app.listen(3000, () => {
  console.log('Backend запущен на http://localhost:3000');
});
