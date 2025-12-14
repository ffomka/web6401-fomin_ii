// ===== ПРИМЕРЫ РЕАЛИЗАЦИИ BACKEND ENDPOINTS =====

/**
 * Выбери один из примеров в зависимости от технологии,
 * которую используешь (Node.js, Python, PHP и т.д.)
 */

// ============================================
// ВАРИАНТ 1: Node.js + Express
// ============================================

/*
// Установи зависимости:
// npm install express cors body-parser

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Простое хранилище в памяти (используй БД в production)
const submissions = [];

// ===== ENDPOINT: POST /api/submit-feedback =====
app.post('/api/submit-feedback', (req, res) => {
  try {
    const { fullName, email, travelStyle, notes, consent, timestamp } = req.body;

    // Валидация на сервере (всегда проверяй!)
    if (!fullName || !email || !travelStyle || !consent) {
      return res.status(400).json({
        success: false,
        message: 'Все обязательные поля должны быть заполнены',
      });
    }

    // Регулярное выражение для email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный email адрес',
      });
    }

    // Создаём объект отзыва
    const submission = {
      id: submissions.length + 1,
      fullName: fullName.trim(),
      email: email.trim(),
      travelStyle,
      notes: notes || 'Без комментариев',
      consent,
      timestamp: new Date(timestamp),
      receivedAt: new Date(),
    };

    // Сохраняем в хранилище (в production → в БД)
    submissions.push(submission);

    console.log('📨 Получен новый отзыв:', submission);

    // Отправляем ответ клиенту
    res.status(200).json({
      success: true,
      message: 'Спасибо! Ваш отзыв получен.',
      data: submission,
    });
  } catch (error) {
    console.error('❌ Ошибка при обработке отзыва:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: error.message,
    });
  }
});

// ===== ENDPOINT: GET /api/destinations =====
app.get('/api/destinations', (req, res) => {
  try {
    // Данные маршрутов (в production → из БД)
    const destinations = [
      {
        id: 1,
        name: 'Горы Кавказа',
        description: 'Экскурсия по горным вершинам, ледникам и альпийским озёрам',
        image: 'images/caucasus.jpg',
      },
      {
        id: 2,
        name: 'Озеро Байкал',
        description: 'Самое глубокое озеро в мире с кристально чистой водой',
        image: 'images/baikal.jpg',
      },
      {
        id: 3,
        name: 'Алтайские горы',
        description: 'Дикая природа, горные реки и трёхдневные походы',
        image: 'images/altai.jpg',
      },
      {
        id: 4,
        name: 'Крым и Чёрное море',
        description: 'Пляжный отдых, экскурсии по историческим местам',
        image: 'images/crimea.jpg',
      },
      {
        id: 5,
        name: 'Карелия',
        description: 'Озёра, леса и северное сияние',
        image: 'images/karelia.jpg',
      },
      {
        id: 6,
        name: 'Камчатка',
        description: 'Вулканы, гейзеры и дикая природа Дальнего Востока',
        image: 'images/kamchatka.jpg',
      },
    ];

    console.log('📡 Отправляем', destinations.length, 'маршрутов');

    res.status(200).json(destinations);
  } catch (error) {
    console.error('❌ Ошибка при получении маршрутов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке маршрутов',
      error: error.message,
    });
  }
});

// ===== ENDPOINT: GET /api/submissions (для админа) =====
app.get('/api/submissions', (req, res) => {
  // В production: добавь аутентификацию!
  res.status(200).json({
    count: submissions.length,
    data: submissions,
  });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Сервер запущен на http://localhost:${PORT}`);
});
*/

// ============================================
// ВАРИАНТ 2: Python + Flask
// ============================================

/*
# Установи зависимости:
# pip install flask flask-cors

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Простое хранилище в памяти
submissions = []

# ===== ENDPOINT: POST /api/submit-feedback =====
@app.route('/api/submit-feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()

        # Валидация на сервере
        full_name = data.get('fullName', '').strip()
        email = data.get('email', '').strip()
        travel_style = data.get('travelStyle', '').strip()
        notes = data.get('notes', 'Без комментариев')
        consent = data.get('consent', False)

        if not full_name or not email or not travel_style or not consent:
            return jsonify({
                'success': False,
                'message': 'Все обязательные поля должны быть заполнены'
            }), 400

        # Простая валидация email
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'message': 'Некорректный email адрес'
            }), 400

        # Создаём объект отзыва
        submission = {
            'id': len(submissions) + 1,
            'fullName': full_name,
            'email': email,
            'travelStyle': travel_style,
            'notes': notes,
            'consent': consent,
            'timestamp': data.get('timestamp'),
            'receivedAt': datetime.now().isoformat(),
        }

        submissions.append(submission)

        print(f'📨 Получен новый отзыв: {submission}')

        return jsonify({
            'success': True,
            'message': 'Спасибо! Ваш отзыв получен.',
            'data': submission,
        }), 200

    except Exception as e:
        print(f'❌ Ошибка при обработке отзыва: {e}')
        return jsonify({
            'success': False,
            'message': 'Внутренняя ошибка сервера',
            'error': str(e),
        }), 500

# ===== ENDPOINT: GET /api/destinations =====
@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    try:
        destinations = [
            {
                'id': 1,
                'name': 'Горы Кавказа',
                'description': 'Экскурсия по горным вершинам, ледникам и альпийским озёрам',
                'image': 'images/caucasus.jpg'
            },
            {
                'id': 2,
                'name': 'Озеро Байкал',
                'description': 'Самое глубокое озеро в мире с кристально чистой водой',
                'image': 'images/baikal.jpg'
            },
            {
                'id': 3,
                'name': 'Алтайские горы',
                'description': 'Дикая природа, горные реки и трёхдневные походы',
                'image': 'images/altai.jpg'
            },
            {
                'id': 4,
                'name': 'Крым и Чёрное море',
                'description': 'Пляжный отдых, экскурсии по историческим местам',
                'image': 'images/crimea.jpg'
            },
            {
                'id': 5,
                'name': 'Карелия',
                'description': 'Озёра, леса и северное сияние',
                'image': 'images/karelia.jpg'
            },
            {
                'id': 6,
                'name': 'Камчатка',
                'description': 'Вулканы, гейзеры и дикая природа Дальнего Востока',
                'image': 'images/kamchatka.jpg'
            }
        ]

        print(f'📡 Отправляем {len(destinations)} маршрутов')

        return jsonify(destinations), 200

    except Exception as e:
        print(f'❌ Ошибка при получении маршрутов: {e}')
        return jsonify({
            'success': False,
            'message': 'Ошибка при загрузке маршрутов',
            'error': str(e),
        }), 500

# ===== ENDPOINT: GET /api/submissions (для админа) =====
@app.route('/api/submissions', methods=['GET'])
def get_submissions():
    # В production: добавь аутентификацию!
    return jsonify({
        'count': len(submissions),
        'data': submissions,
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=3000)
*/

// ============================================
// ВАРИАНТ 3: PHP
// ============================================

/*
<?php
// Включи CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Простое хранилище в файле (в production → БД)
$submissions_file = 'submissions.json';

// ===== ENDPOINT: POST /api/submit-feedback =====
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'], '/api/submit-feedback') !== false) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        // Валидация на сервере
        $full_name = trim($data['fullName'] ?? '');
        $email = trim($data['email'] ?? '');
        $travel_style = trim($data['travelStyle'] ?? '');
        $notes = $data['notes'] ?? 'Без комментариев';
        $consent = $data['consent'] ?? false;

        if (!$full_name || !$email || !$travel_style || !$consent) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Все обязательные поля должны быть заполнены'
            ]);
            exit();
        }

        // Валидация email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Некорректный email адрес'
            ]);
            exit();
        }

        // Читаем существующие отзывы
        $submissions = file_exists($submissions_file) ? json_decode(file_get_contents($submissions_file), true) : [];

        // Создаём новый отзыв
        $submission = [
            'id' => count($submissions) + 1,
            'fullName' => $full_name,
            'email' => $email,
            'travelStyle' => $travel_style,
            'notes' => $notes,
            'consent' => $consent,
            'timestamp' => $data['timestamp'],
            'receivedAt' => date('c'),
        ];

        $submissions[] = $submission;

        // Сохраняем в файл
        file_put_contents($submissions_file, json_encode($submissions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        error_log('📨 Получен новый отзыв: ' . json_encode($submission));

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Спасибо! Ваш отзыв получен.',
            'data' => $submission,
        ]);

    } catch (Exception $e) {
        error_log('❌ Ошибка при обработке отзыва: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Внутренняя ошибка сервера',
            'error' => $e->getMessage(),
        ]);
    }
    exit();
}

// ===== ENDPOINT: GET /api/destinations =====
if ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($_SERVER['REQUEST_URI'], '/api/destinations') !== false) {
    try {
        $destinations = [
            [
                'id' => 1,
                'name' => 'Горы Кавказа',
                'description' => 'Экскурсия по горным вершинам, ледникам и альпийским озёрам',
                'image' => 'images/caucasus.jpg'
            ],
            [
                'id' => 2,
                'name' => 'Озеро Байкал',
                'description' => 'Самое глубокое озеро в мире с кристально чистой водой',
                'image' => 'images/baikal.jpg'
            ],
            [
                'id' => 3,
                'name' => 'Алтайские горы',
                'description' => 'Дикая природа, горные реки и трёхдневные походы',
                'image' => 'images/altai.jpg'
            ],
            [
                'id' => 4,
                'name' => 'Крым и Чёрное море',
                'description' => 'Пляжный отдых, экскурсии по историческим местам',
                'image' => 'images/crimea.jpg'
            ],
            [
                'id' => 5,
                'name' => 'Карелия',
                'description' => 'Озёра, леса и северное сияние',
                'image' => 'images/karelia.jpg'
            ],
            [
                'id' => 6,
                'name' => 'Камчатка',
                'description' => 'Вулканы, гейзеры и дикая природа Дальнего Востока',
                'image' => 'images/kamchatka.jpg'
            ]
        ];

        error_log('📡 Отправляем ' . count($destinations) . ' маршрутов');

        http_response_code(200);
        echo json_encode($destinations);

    } catch (Exception $e) {
        error_log('❌ Ошибка при получении маршрутов: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Ошибка при загрузке маршрутов',
            'error' => $e->getMessage(),
        ]);
    }
    exit();
}

// ===== ENDPOINT: GET /api/submissions (для админа) =====
if ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($_SERVER['REQUEST_URI'], '/api/submissions') !== false) {
    $submissions = file_exists($submissions_file) ? json_decode(file_get_contents($submissions_file), true) : [];

    http_response_code(200);
    echo json_encode([
        'count' => count($submissions),
        'data' => $submissions,
    ]);
    exit();
}

// 404
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
?>
*/

// ============================================
// ПРИМЕРЫ CURL КОМАНД ДЛЯ ТЕСТИРОВАНИЯ
// ============================================

/*
# Тестирование POST /api/submit-feedback
curl -X POST http://localhost:3000/api/submit-feedback \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Иван Петров",
    "email": "ivan@example.com",
    "travelStyle": "adventure",
    "notes": "Интересует приключенческий туризм",
    "consent": true,
    "timestamp": "2025-12-11T14:45:00Z"
  }'

# Результат успеха:
# {
#   "success": true,
#   "message": "Спасибо! Ваш отзыв получен.",
#   "data": { ... }
# }

# ==========================================

# Тестирование GET /api/destinations
curl http://localhost:3000/api/destinations

# Результат:
# [
#   {
#     "id": 1,
#     "name": "Горы Кавказа",
#     "description": "...",
#     "image": "images/caucasus.jpg"
#   },
#   ...
# ]

# ==========================================

# Тестирование GET /api/submissions (админ)
curl http://localhost:3000/api/submissions

# Результат:
# {
#   "count": 1,
#   "data": [
#     { ... }
#   ]
# }
*/

// ============================================
// SQL: СОЗДАНИЕ ТАБЛИЦ В БД
// ============================================

/*
-- Таблица для отзывов
CREATE TABLE submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  travel_style VARCHAR(100) NOT NULL,
  notes TEXT,
  consent BOOLEAN NOT NULL,
  timestamp DATETIME NOT NULL,
  received_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для маршрутов
CREATE TABLE destinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Вставка примеров маршрутов
INSERT INTO destinations (name, description, image) VALUES
('Горы Кавказа', 'Экскурсия по горным вершинам, ледникам и альпийским озёрам', 'images/caucasus.jpg'),
('Озеро Байкал', 'Самое глубокое озеро в мире с кристально чистой водой', 'images/baikal.jpg'),
('Алтайские горы', 'Дикая природа, горные реки и трёхдневные походы', 'images/altai.jpg'),
('Крым и Чёрное море', 'Пляжный отдых, экскурсии по историческим местам', 'images/crimea.jpg'),
('Карелия', 'Озёра, леса и северное сияние', 'images/karelia.jpg'),
('Камчатка', 'Вулканы, гейзеры и дикая природа Дальнего Востока', 'images/kamchatka.jpg');
*/