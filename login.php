<?php
include 'config.php';
session_start();

$error = ""; // Inicializa a variável de erro como vazia

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validação dos dados (adicione aqui a validação de email e senha)

    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['senha'])) {
            $_SESSION['usuario'] = $row['id'];
            header("Location: index.php"); // Redireciona para a página principal
            exit();
        } else {
            $error = "Email ou senha incorretos";
        }
    } else {
        $error = "Email ou senha incorretos";
    }

    $stmt->close();
}
?>


<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Jp Store</title>

    <link rel="shortcut icon" href="assets/img/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/swiper-bundle.min.css">
    <link rel="stylesheet" href="assets/css/login.css">
    <link rel="stylesheet" href="login.css"> <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>
<body>
    <div class="login-container">
        <div class="left-login">
            <h1>Faça login e acesse nossa loja!</h1>
            <img src="assets/img/login.svg" class="left-login-image" alt="Ilustração de login">
        </div>

        <div class="right-login">
            <form class="login-form" method="POST" action=""> 
                <h2 class="login-title">LOGIN</h2>

                <?php if (!empty($error)): ?>
                    <div class="error-message">
                        <?php echo $error; ?>
                    </div>
                <?php endif; ?>

                <div class="form-group">
                    <label for="email">Seu Email</label>
                    <input type="email" id="email" name="email" placeholder="exemplo@email.com" value="<?php echo isset($email) ? htmlspecialchars($email) : ''; ?>" required>
                </div>
                <div class="form-group">
                    <label for="password">Sua Senha</label>
                    <input type="password" id="password" name="password" placeholder="Senha" required>
                </div>

                <button type="submit" class="btn-login">Logar</button>
            </form>

            <div class="login-info">
                <p>Ainda não tem uma conta? <a href="signup.php">Cadastre-se</a></p>
                <p><a href="reset_password.php">Esqueceu sua senha?</a></p>
            </div>
        </div>
    </div>
    <script>
        <?php if (!empty($error)): ?>
            alert('<?php echo $error; ?>'); // Exibe o alerta de erro
        <?php endif; ?>
    </script>
</body>
</html>
