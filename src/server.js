const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2');
const WebSocket = require('ws');
const http = require('http');
const sendVerificationCode = require('./mailer');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'y1245fvgfrfghr1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 配置 MySQL 连接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // 替换为你的 MySQL 用户名
    password: '123456', // 替换为你的 MySQL 密码
    database: 'user' // 替换为你的 MySQL 数据库名
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// 创建 HTTP 服务器并将 Express 应用程序挂载到服务器
const server = http.createServer(app);

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === "identify") {
            ws.userId = data.userId;
            clients.set(ws.userId, ws);
            console.log(`User connected: ${ws.userId}`);
        }

        if (data.type === "message") {
            console.log(`Received message from user ${ws.userId} to user ${data.targetUserId}: ${data.text}`);
            const targetWs = clients.get(String(data.targetUserId));
            
            // 生成当前时间戳
            const timestamp = new Date();

            // 存储消息到数据库
            connection.query(
                'INSERT INTO messages (sender_id, receiver_id, message, timestamp) VALUES (?, ?, ?, ?)', 
                [ws.userId, data.targetUserId, data.text, timestamp], 
                (err, results) => {
                    if (err) {
                        console.error('Error inserting message into MySQL:', err);
                        return;
                    }
                    console.log('Message stored in database');
                }
            );

            if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                console.log(`Sending message to user ${data.targetUserId}`);
                targetWs.send(JSON.stringify({ type: "message", text: data.text, timestamp: timestamp, senderId: ws.userId }));
            }

        }
    });

    ws.on('close', () => {
        console.log(`User disconnected: ${ws.userId}`);
        clients.delete(ws.userId);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// 查询对话记录的路由
app.get('/conversation', (req, res) => {
    const { sender_id, receiver_id } = req.query;

    connection.query(
        'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp',
        [sender_id, receiver_id, receiver_id, sender_id],
        (err, results) => {
            if (err) {
                console.error('Error querying messages from MySQL:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.json(results);
        }
    );
});

app.post('/send-code', (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000); // 生成6位随机验证码
  
    // 发送验证码
    sendVerificationCode(email, code);
  
    res.status(200).json({ message: 'Verification code sent' });
  });
  
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });

// 注册路由
app.get('/register', (req, res) => {
    const { username, password } = req.query;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = { username, password };
        connection.query('INSERT INTO users SET ?', newUser, (err, results) => {
            if (err) {
                console.error('Error inserting into MySQL:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // 获取新用户的ID
            connection.query('SELECT id FROM users WHERE username = ?', [username], (err, results) => {
                if (err) {
                    console.error('Error querying MySQL:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                res.json({ message: 'User registered successfully', userId: results[0].id });
            });
        });
    });
});


// 登录路由
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = results[0];
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '5h' });

        res.json({ message: 'Login successful', token, userId: user.id });
    });
});



// 受保护的路由
app.get('/protected', (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // 获取 Bearer 后面的 token

    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        res.json({ message: 'Welcome to the protected route!', user: decoded });
    });
});


// 使用中间件
app.use(authenticateToken);

// 查找好友路由
app.get('/findFriend', (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    // 查找好友
    connection.query('SELECT * FROM users WHERE username = ?', [name], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length > 0) {
            const friend = results[0];
            res.json({ name: friend.username, id: friend.id });
        } else {
            res.json({ friend: null });
        }
    });
});

// 发送好友请求路由
app.post('/sendFriendRequest', (req, res) => {
    const { senderId, senderUsername, receiverId, receiverUsername } = req.body;
    console.log(senderId, receiverId, senderUsername, receiverUsername);

    if (senderId === receiverId) {
        return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }

    // 检查是否已经发送过请求
    connection.query('SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ? AND status = "pending"', [senderId, receiverId], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        // 插入好友请求
        const newRequest = { sender_id: senderId, sender_username: senderUsername, receiver_id: receiverId, receiver_username: receiverUsername };
        connection.query('INSERT INTO friend_requests SET ?', newRequest, (err, results) => {
            if (err) {
                console.error('Error inserting into MySQL:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.json({ message: 'Friend request sent successfully' });
        });
    });
});

// 处理好友请求路由
app.post('/handleFriendRequest', (req, res) => {
    const { requestId, action } = req.body; // action can be 'accept' or 'reject'

    if (action !== 'accepted' && action !== 'rejected') {
        return res.status(400).json({ message: 'Invalid action' });
    }

    // 更新好友请求状态
    connection.query('UPDATE friend_requests SET status = ? WHERE id = ?', [action, requestId], (err, results) => {
        if (err) {
            console.error('Error updating MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (action === 'accepted') {
            // 查找请求信息
            connection.query('SELECT sender_id, receiver_id FROM friend_requests WHERE id = ?', [requestId], (err, results) => {
                if (err) {
                    console.error('Error querying MySQL:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                const { sender_id, receiver_id } = results[0];

                connection.query('INSERT INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)', [sender_id, receiver_id, receiver_id, sender_id], (err, results) => {
                    if (err) {
                        console.error('Error inserting into MySQL:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    res.json({ message: 'Friend request accepted successfully' });
                });
            });
        } else {
            // 删除好友请求
            connection.query('DELETE FROM friend_requests WHERE id = ?', [requestId], (err, results) => {
                if (err) {
                    console.error('Error deleting MySQL:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                res.json({ message: 'Friend request rejected and deleted' });
            });
        }
    });
});

// 获取好友列表路由
app.get('/friends', (req, res) => {
    const { userId } = req.query;

    connection.query('SELECT u.id, u.username FROM friends f JOIN users u ON f.friend_id = u.id WHERE f.user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.json({ friends: results });
    });
});

// 查询好友请求路由
app.get('/friendRequests', (req, res) => {
    const { receiverId, status } = req.query;

    connection.query('SELECT * FROM friend_requests WHERE receiver_id = ? AND status = ?', [receiverId, status], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.json(results);
    });
});


// 中间件用于验证token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
