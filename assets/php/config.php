<?php
$servername = "localhost"; // Endereço do servidor MySQL (geralmente localhost)
$username = "root"; // Nome de usuário do MySQL
$password = ""; // Senha do MySQL
$dbname = "jp_storedb"; // Nome do banco de dados

// Criar a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

echo "Conectado com sucesso!"; // Mensagem de sucesso (opcional)
?>
