# API de Games
Esta API é utilizada para TAl e TAL...
## Endpoints
### GET /games
Esse endpoint é responsável por retornar a listagem de todos os games cadastrados no banco de dados.
#### Parametros
Nenhum
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai recebar a listagem de todos os games.

Exemplo de resposta:
```

[
    {
        "id": 1,
        "title": "Mortal Kombat",
        "year": 2023,
        "price": 120,
        "createdAt": "2024-07-05T12:57:27.000Z",
        "updatedAt": "2024-07-17T14:13:04.000Z"
    },
    {
        "id": 2,
        "title": "The Sims",
        "year": 2008,
        "price": 200,
        "createdAt": "2024-07-05T12:59:17.000Z",
        "updatedAt": "2024-07-09T22:52:17.000Z"
    },
    {
        "id": 4,
        "title": "Warcraft",
        "year": 2008,
        "price": 200,
        "createdAt": "2024-07-09T22:53:32.000Z",
        "updatedAt": "2024-07-09T22:53:32.000Z"
    },
    {
        "id": 5,
        "title": "Star Wars",
        "year": 2024,
        "price": 550,
        "createdAt": "2024-07-09T23:52:00.000Z",
        "updatedAt": "2024-07-09T23:52:00.000Z"
    },
    {
        "id": 13,
        "title": "God of War Ragnarok",
        "year": 2018,
        "price": 150,
        "createdAt": "2024-07-17T14:05:21.000Z",
        "updatedAt": "2024-07-17T14:13:47.000Z"
    }
]

```
##### Falha na autenticação! 401
Caso essa resposta aconteça, isso significa que aconteceu alguma falha durante o processo de autenticação da requisição. Motivos: Token inválido, Token expirado.

Exemplo de resposta:
```
{
    "err": "Token inválido!"
}
```

### POST /auth
Esse endpoint é responsável por retornar fazer o processo de login.
#### Parametros
email: E-mail do usuário cadastrado no sistema.

password: Senha do usuário cadastrado no sistema, com aquele determinado e-mail.

Exemplo:
```
{
"email": "joaob@gmail.com",
"password": "cocoazul"
}
```
#### Respostas
##### OK! 200
Caso essa resposta aconteça você vai receber o token JWT para conseguir acessar endpoints protegidos na API.

Exemplo de resposta:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcyMTQ5MTExNywiZXhwIjoxNzIxNDk0NzE3fQ.YsW4vaMbB5SUdllS3qoeBFV3QyeYPP3Jx7JQ3u1qr7k"
}
```
##### Falha na autenticação! 401
Caso essa resposta aconteça, isso significa que aconteceu alguma falha durante o processo de autenticação da requisição. Motivos: Senha ou e-mail incorretos.

Exemplo de resposta:
```
{
    "error": "An error occurred"
}
```
