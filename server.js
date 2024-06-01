const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'y1245fvgfrfghr1';

app.use(bodyParser.json());
app.use(cors());

// 模拟的用户数据
const users = [
    {
        id: 1,
        username: 'testuser',
        password: 'password123'
    }
];

// 登录路由
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 查找用户
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // 创建 JWT
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '5h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }

});

// 受保护的路由
app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        res.json({ message: 'Welcome to the protected route!', user: decoded });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
