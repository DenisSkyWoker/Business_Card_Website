<?php
// Запуск сервера php -S localhost:8000
// Отключение сервера pkill -f "php -S"


// ВАЖНО: Никаких пробелов до <?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json; charset=utf-8');

$logFile = '../logs/error_log.txt'; // 🔐 Перенесено за пределы веб-корня

function logError($message) {
    global $logFile;
    $dir = dirname($logFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents($logFile, date('d-m-Y H:i:s') . " - " . $message . "\n", FILE_APPEND | LOCK_EX);
}

try {
    // 🔧 НАСТРОЙКИ TELEGRAM — ЛУЧШЕ ВЫНЕСТИ В config/ (см. ниже)
    $token = '7842337116:AAHWmi9L93liVBdZxBvVjTMor6s_t4zMz6k';
    $chat_id = '1419736271';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Доступ запрещён']);
        exit;
    }

    // 🔥 ОБРАБОТКА ЗАПРОСА МЕНЕДЖЕРА ИЗ ЧАТА
    if (isset($_POST['action']) && $_POST['action'] === 'manager_request') {
        $phone = isset($_POST['phone']) ? trim($_POST['phone']) : 'Не указан';

        $message = "🔔 *ЗАПРОС БОТ-МЕНЕДЖЕРА ИЗ ЧАТА*\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━\n";
        $message .= "Пользователь хочет связи с менеджером!\n";
        $message .= "📱 *Телефон:* $phone\n";
        $message .= "🕒 Время: " . date('H:i d.m.Y');

        $url = "https://api.telegram.org/bot" . $token . "/sendMessage";
        $data = [
            'chat_id' => $chat_id,
            'text' => $message,
            'parse_mode' => 'Markdown'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);

        logError("✅ Manager Request Sent! Phone: $phone");
        echo json_encode(['status' => 'success']);
        exit;
    }

    // =========================================
    // Обработка формы онлайн-записи
    // =========================================

    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $car = isset($_POST['car']) ? trim($_POST['car']) : '';
    $service = isset($_POST['service']) ? trim($_POST['service']) : '';
    $date = isset($_POST['date']) ? trim($_POST['date']) : '';
    $time = isset($_POST['time']) ? trim($_POST['time']) : '';

    logError("Data: name=$name, phone=$phone, date=$date, time=$time");

    if (empty($name) || empty($phone)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Заполните имя и телефон']);
        exit;
    }

    // ✅ Добавлена базовая валидация телефона
    if (!preg_match('/^[\+]?[0-9\s\-\(\)]{10,}$/u', $phone)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Некорректный формат телефона']);
        exit;
    }

    $message = "🚗 *НОВАЯ ЗАЯВКА*\n";
    $message .= "(Нужно перезвонить!)\n";
    $message .= "━━━━━━━━━━━━━━\n";
    $message .= "👤 *Имя:* $name\n";
    $message .= "📱 *Телефон:* $phone\n";
    if (!empty($car)) $message .= "🚙 *Авто:* $car\n";
    if (!empty($service)) $message .= "🔧 *Услуга:* $service\n";
    if (!empty($date)) $message .= "📅 *Дата:* $date\n";
    if (!empty($time)) $message .= "⏰ *Время:* $time\n";

    // Проверка и загрузка файла
    $photoPath = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileTmpPath = $_FILES['photo']['tmp_name'];
        $fileName = $_FILES['photo']['name'];
        $fileSize = $_FILES['photo']['size'];
        $fileType = $_FILES['photo']['type'];

        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($fileType, $allowedMimeTypes)) {
            throw new Exception('Недопустимый формат файла. Только JPG, PNG, GIF, WEBP.');
        }

        if ($fileSize > 5 * 1024 * 1024) {
            throw new Exception('Файл слишком большой. Максимум 5 МБ.');
        }

        // ✅ Безопасное имя файла
        $newFileName = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9\.\-_]/', '', basename($fileName));
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $photoPath = $destPath;
            logError("File uploaded: $destPath");
        } else {
            throw new Exception('Не удалось сохранить файл');
        }
    }

    // Отправка текстового сообщения
    $url = "https://api.telegram.org/bot" . $token . "/sendMessage";
    $data = [
        'chat_id' => $chat_id,
        'text' => $message,
        'parse_mode' => 'Markdown'
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);

    // Отправка фото (если есть)
    if ($photoPath && file_exists($photoPath)) {
        $urlPhoto = "https://api.telegram.org/bot" . $token . "/sendPhoto";
        $cfile = new CURLFile($photoPath, $_FILES['photo']['type'], basename($_FILES['photo']['name']));

        $dataPhoto = [
            'chat_id' => $chat_id,
            'photo' => $cfile,
            'caption' => "📸 Фото повреждения от клиента: $name"
        ];

        $chPhoto = curl_init();
        curl_setopt($chPhoto, CURLOPT_URL, $urlPhoto);
        curl_setopt($chPhoto, CURLOPT_POST, true);
        curl_setopt($chPhoto, CURLOPT_POSTFIELDS, $dataPhoto);
        curl_setopt($chPhoto, CURLOPT_RETURNTRANSFER, true);
        curl_exec($chPhoto);
        curl_close($chPhoto);
    }

    echo json_encode(['status' => 'success']);
    logError("✅ SUCCESS! Application processed for $name");

} catch (Exception $e) {
    logError("❌ EXCEPTION: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Произошла ошибка. Попробуйте позже.']);
}