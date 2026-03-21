<?php
header('Content-Type: text/html; charset=utf-8');
echo '<h1>✅ Проверка PHP</h1>';
echo '<p><strong>Версия PHP:</strong> ' . phpversion() . '</p>';
echo '<p><strong>cURL установлен:</strong> ' . (function_exists('curl_init') ? '✅ Да' : '❌ Нет') . '</p>';
echo '<p><strong>cURL версия:</strong> ' . (function_exists('curl_version') ? curl_version()['version'] : 'N/A') . '</p>';
echo '<p><strong>Директория:</strong> ' . getcwd() . '</p>';
echo '<p><strong>send.php существует:</strong> ' . (file_exists('send.php') ? '✅ Да' : '❌ Нет') . '</p>';
echo '<p><strong>send.php читаем:</strong> ' . (is_readable('send.php') ? '✅ Да' : '❌ Нет') . '</p>';
?>