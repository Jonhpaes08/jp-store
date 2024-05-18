<?php
include 'config.php';
session_start();

$errors = []; 
$success = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['submit'])) {
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $password = $_POST['password'];
    }


    // Validação dos dados
    $errors = [];
    if (empty($nome) || empty($email) || empty($password)) {
        $errors[] = "Por favor, preencha todos os campos.";
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Por favor, insira um email válido.";
    }

    // Verificar se o email já existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $errors[] = "Email já cadastrado.";
    }

    // Se não houver erros, prosseguir com o cadastro
    if (empty($errors)) {
        // Hash da senha
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Inserir novo usuário
        $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nome, $email, $hashedPassword);
        if ($stmt->execute()) {
            $success = "Cadastro realizado com sucesso!";
        } else {
            $errors[] = "Erro ao cadastrar usuário: " . $stmt->error;
        }
    }
}
?>


<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastre-se | JP Store</title>

    <link rel="shortcut icon" href="assets/img/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/swiper-bundle.min.css">    
    <link rel="stylesheet" href="assets/css/signup.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>
<body>
    <div class="signup-container">
        <div class="left-signup">
            <h1>Seja um de NÓS!</h1>
            <p>Cadastre-se e tenha acesso a nossa loja!</p>
            <img src="assets/img/login.svg" class="left-signup-image" alt="Ilustração de cadastro">
        </div>

        <div class="right-signup">
            <form class="signup-form" method="POST" action="">
                <h2 class="signup-title">CRIAR CONTA</h2>

                <?php if (!empty($errors)): ?>
                    <div class="error-message">
                        <ul>
                            <?php foreach ($errors as $error): ?>
                                <li><?php echo $error; ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>

                <?php if (isset($success)): ?>
                    <p class="success-message"><?php echo $success; ?></p>
                <?php endif; ?>

                <div class="form-group">
                    <label for="name">Nome Completo</label>
                    <input type="text" id="name" name="nome" placeholder="Seu nome" value="<?php echo isset($nome) ? htmlspecialchars($nome) : ''; ?>" required>
                </div>
                <div class="form-group">
                    <label for="email">Seu Email</label>
                    <input type="email" id="email" name="email" placeholder="exemplo@email.com" value="<?php echo isset($email) ? htmlspecialchars($email) : ''; ?>" required>
                </div>
                <div class="form-group">
                    <label for="password">Sua Senha</label>
                    <input type="password" id="password" name="senha" placeholder="Senha" required autocomplete="current-password">
                </div>
                <button type="submit" class="btn-signup" name="submit" style="cursor: pointer;">Cadastrar</button>
            </form>

            <div class="signup-info">
                <p>Já tem uma conta? <a href="login.php">Faça login</a></p>
            </div>
        </div>
    </div>
    <script>
        <?php if (!empty($errors)): ?>
            alert('<?php echo implode("\n", $errors); ?>'); // Exibe todos os erros em um único alerta
        <?php endif; ?>

        <?php if (isset($success)): ?>
            alert('<?php echo $success; ?>'); // Exibe o alerta de sucesso
        <?php endif; ?>
    </script>
</body>
</html>