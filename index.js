const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sequelize = require("./database");
const Game = require("./models/game");
const User = require("./models/users"); // Importar o modelo de usuário

const JWTsecret = "your_secret_key"; // Chave secreta para o JWT

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function auth(req, res, next) {
  const authToken = req.headers["authorization"];

  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];

    jwt.verify(token, JWTsecret, async (err, decoded) => {
      if (err) {
        res.status(403).json({ err: "Token Inválido" });
      } else {
        try {
          const user = await User.findByPk(decoded.userId);
          if (user) {
            // Adicionando informações do usuário ao objeto decoded
            decoded.name = user.username;
            decoded.email = user.email;
            console.log(decoded);
            next();
          } else {
            res.status(404).json({ err: "User not found" });
          }
        } catch (err) {
          res.status(500).json({ error: "Erro ao buscar usuário" });
        }
      }
    });
  } else {
    res.status(401);
    res.json({ err: "Token inválido" });
  }
}

// Sincroniza o modelo com o banco de dados
sequelize
  .sync()
  .then(() => {
    console.log("Banco de dados sincronizado");
  })
  .catch((err) => {
    console.error("Erro ao sincronizar banco de dados:", err);
  });

// Rota para listar todos os jogos
app.get("/games", auth, async (req, res) => {
  try {
    const games = await Game.findAll();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar jogos" });
  }
});

// Rota para buscar um jogo por ID
app.get("/games/:id", auth, async (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    try {
      const id = parseInt(req.params.id);
      const game = await Game.findByPk(id);
      if (game) {
        res.status(200).json(game);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar jogo" });
    }
  }
});

// Rota para criar um novo jogo
app.post("/games", auth, async (req, res) => {
  const { title, price, year } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'title'." });
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "Invalid or missing 'price'." });
  }

  if (isNaN(year) || year.toString().length !== 4) {
    return res.status(400).json({ error: "Invalid or missing 'year'." });
  }

  try {
    const newGame = await Game.create({ title, price, year });
    res.status(201).json(newGame);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar jogo" });
  }
});

// Rota para deletar um jogo por ID
app.delete("/games/:id", auth, async (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    try {
      const id = parseInt(req.params.id);
      const game = await Game.findByPk(id);
      if (game) {
        await game.destroy();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar jogo" });
    }
  }
});

// Rota para atualizar um jogo por ID
app.put("/games/:id", async (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    try {
      const id = parseInt(req.params.id);
      const game = await Game.findByPk(id);
      if (game) {
        const { title, price, year } = req.body;
        if (title != undefined) game.title = title;
        if (price != undefined) game.price = price;
        if (year != undefined) game.year = year;

        await game.save();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar jogo" });
    }
  }
});

// Rota para autenticar usuário
app.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, JWTsecret, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Rota para listar todos os usuários
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// Rota para criar um novo usuário
app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'username'." });
  }

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'email'." });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'password'." });
  }

  try {
    // Verifica se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Criptografa a senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

app.listen(45678, () => {
  console.log("API RODANDO");
});
