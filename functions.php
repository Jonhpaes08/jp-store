<?php
// Função para gerar um token aleatório
function gerarToken($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

// Função para enviar o email de redefinição de senha
function enviarEmailRedefinicao($email, $token) {
    $linkRedefinicao = "http://localhost/jp-store/reset_password.php?token=$token";

    $assunto = "Redefinição de senha - JP Store";
    $mensagem = "Olá,\n\nRecebemos uma solicitação para redefinir sua senha.\n\nClique no link abaixo para redefinir sua senha:\n\n$linkRedefinicao\n\nSe você não solicitou a redefinição de senha, ignore este email.\n\nAtenciosamente,\nEquipe JP Store";
    $headers = "From: jonhpaz08@gmail.com"; // Substitua pelo seu email

    mail($email, $assunto, $mensagem, $headers);
}
?>
