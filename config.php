<?php
$servername = "localhost";
$username = "root"; // Seu usuário do MySQL
$password = "#08Jonh2004"; // Sua senha do MySQL
$dbname = "jp_store_db"; // Nome do seu banco de dados

// Criar a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>
