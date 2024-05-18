<?php
include 'config.php';
include 'functions.php';
session_start();

// Verifica se o usuário está logado e redireciona para a página inicial se estiver
if (isset($_SESSION['usuario'])) {
    header("Location: index.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['email'])) { // Verifica se está na etapa de solicitação de redefinição
        $email = $_POST['email'];

        // Verifica se o email existe no banco de dados
        $sql = "SELECT id FROM usuarios WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $token = gerarToken();

            // Atualiza o token no banco de dados
            $sql = "UPDATE usuarios SET token = ? WHERE email = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss", $token, $email);
            $stmt->execute();

            // Envia o email de redefinição
            enviarEmailRedefinicao($email, $token);

            $success = "Um email com instruções para redefinir sua senha foi enviado.";
        } else {
            $error = "Email não encontrado.";
        }
    } elseif (isset($_POST['token']) && isset($_POST['nova_senha']) && isset($_POST['confirmar_senha'])) { // Verifica se está na etapa de redefinição da senha
        $token = $_POST['token'];
        $novaSenha = $_POST['nova_senha'];
        $confirmarSenha = $_POST['confirmar_senha'];

        // Verifica se as novas senhas coincidem
        if ($novaSenha !== $confirmarSenha) {
            $error = "As novas senhas não coincidem.";
        } else {
            // Verifica se o token é válido
            $sql = "SELECT id FROM usuarios WHERE token = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $token);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows == 1) {
                $row = $result->fetch_assoc();
                $userId = $row['id'];

                // Atualiza a senha do usuário
                $hashedPassword = password_hash($novaSenha, PASSWORD_DEFAULT); // Criptografa a nova senha
                $sql = "UPDATE usuarios SET senha = ?, token = NULL WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("si", $hashedPassword, $userId);
                $stmt->execute();

                $success = "Sua senha foi redefinida com sucesso. Você já pode fazer login com a nova senha.";
            } else {
                $error = "Token inválido ou expirado.";
            }
        }
    }
}

// Verifica se um token foi fornecido na URL
$exibirFormularioRedefinicao = isset($_GET['token']);
?>


<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha | JP Store</title>

    <link rel="shortcut icon" href="assets/img/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/swiper-bundle.min.css">
    <link rel="stylesheet" href="assets/css/reset_password.css">
    <link rel="stylesheet" href="/assets/css/reset_password.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>
<body>
    <div class="reset-container">
        <div class="left-reset">
            <h1>Esqueceu sua senha?</h1>
            <p>Não se preocupe, vamos te ajudar a recuperá-la.</p>
            <img src="assets/img/login.svg" class="left-reset-image" alt="Ilustração de redefinição de senha"> 
        </div>

        <div class="right-reset">
            <?php if ($exibirFormularioRedefinicao): ?>
                <form class="reset-form" method="POST" action="">
                    <input type="hidden" name="token" value="<?php echo $_GET['token']; ?>">

                    <h2 class="reset-title">REDIFINIR SENHA</h2>
                    <?php if (isset($error)): ?>
                        <p class="error-message"><?php echo $error; ?></p>
                    <?php endif; ?>

                    <?php if (isset($success)): ?>
                        <p class="success-message"><?php echo $success; ?></p>
                    <?php endif; ?>

                    <div class="form-group">
                        <label for="nova_senha">Nova Senha</label>
                        <input type="password" id="nova_senha" name="nova_senha" placeholder="Nova senha" required>
                    </div>
                    <div class="form-group">
                        <label for="confirmar_senha">Confirmar Nova Senha</label>
                        <input type="password" id="confirmar_senha" name="confirmar_senha" placeholder="Confirmar nova senha" required>
                    </div>
                    <button type="submit" class="btn-reset">Redefinir Senha</button>
                </form>
            <?php else: ?>
                <form class="reset-form" method="POST" action="">
                    <h2 class="reset-title">REDIFINIR SENHA</h2>
                    <?php if (isset($error)): ?>
                        <p class="error-message"><?php echo $error; ?></p>
                    <?php endif; ?>

                    <?php if (isset($success)): ?>
                        <p class="success-message"><?php echo $success; ?></p>
                    <?php endif; ?>
                    <div class="form-group">
                        <label for="email">Seu Email</label>
                        <input type="email" id="email" name="email" placeholder="exemplo@email.com" required>
                    </div>
                    <button type="submit" class="btn-reset">Enviar</button>
                </form>
            <?php endif; ?>

            <div class="reset-info">
                <p>Lembrou da senha? <a href="login.php">Faça login</a></p>
            </div>
        </div>
    </div>
</body>
</html>
