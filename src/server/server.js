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
        console.log(data);

        if (data.type === "identify") {
            ws.userId = data.userId;
            clients.set(ws.userId, ws);
            console.log(`User connected: ${ws.userId}`);
        }

        else {
            console.log(`Received message from user ${ws.userId} to user ${data.receiver_id}: ${data.text}`);
            const targetWs = clients.get(String(data.receiver_id));

            // 生成当前时间戳
            const timestamp = new Date();

            // 存储消息到数据库
            connection.query(
                'INSERT INTO messages (sender_id, receiver_id, message, type, timestamp) VALUES (?, ?, ?, ?, ?)',
                [ws.userId, data.receiver_id, data.message, data.type, timestamp],
                (err, results) => {
                    if (err) {
                        console.error('Error inserting message into MySQL:', err);
                        return;
                    }
                    console.log('Message stored in database');
                }
            );

            if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                console.log(`Sending message to user ${data.receiver_id}`);
                targetWs.send(JSON.stringify({ type: data.type, message: data.message, timestamp: timestamp, sender_id: ws.userId }));
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

// 更新用户名的路由
app.put('/update-username', (req, res) => {
    const { user_id, username } = req.body;
  
    if (!user_id || !username) {
      return res.status(400).json({ success: false, message: 'User ID and username are required' });
    }
  
    // 更新用户名
    connection.query(
      'UPDATE users SET username = ? WHERE user_id = ?',
      [username, user_id],
      (err, results) => {
        if (err) {
          console.error('Error updating username:', err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
  
        if (results.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
  
        res.json({ success: true, message: 'Username updated successfully' });
      }
    );
  });
  

// 删除好友路由
app.delete('/friends/:friendId', (req, res) => {
    const { friendId } = req.params;
    const { userId } = req.body;

    // 获取对应的 user_id 和 friend_id
    connection.query('SELECT user_id, friend_id FROM friends WHERE user_id = ? AND friend_id = ? OR user_id = ? AND friend_id = ?', 
        [userId, friendId, friendId, userId], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            // 删除 friends 表中的记录
            connection.query('DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)', 
                [userId, friendId, friendId, userId], (err, results) => {
                if (err) {
                    console.error('Error deleting friends:', err);
                }
            });

            // 删除 messages 表中的记录
            connection.query('DELETE FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)', 
                [userId, friendId, friendId, userId], (err, results) => {
                if (err) {
                    console.error('Error deleting messages:', err);
                }
            });

            // 删除 friend_requests 表中的记录
            connection.query('DELETE FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)', 
                [userId, friendId, friendId, userId], (err, results) => {
                if (err) {
                    console.error('Error deleting friend requests:', err);
                }
            });

            res.json({ message: 'Friend and related data deleted successfully' });
        } else {
            res.status(404).json({ message: 'Friend not found' });
        }
    });
});

// 获取用户头像
app.get('/avatar/:userId', (req, res) => {
    const { userId } = req.params;
    connection.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error querying MySQL:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      if (results.length > 0 && results[0].avatar_url) {
        res.json({ avatarUrl: results[0].avatar_url, rememberPassword: results[0].remember_password, password: results[0].password, userIp: results[0].lastIp});
      } else {
        res.json({ avatarUrl: 'http://127.0.0.1:9000/image/qq.png' });
      }
    });
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

// 找回密码
app.post('/reset-password', (req, res) => {
    const { email, verificationCode, userId, newPassword } = req.body;

    if (!email || !verificationCode || !userId || !newPassword) {
        return res.status(400).json({ message: 'Email, verification code, user ID, and new password are required' });
    }

    // 验证验证码
    const storedData = verificationCodes[email];
    if (!storedData) {
        return res.status(400).json({ message: 'Verification code not found' });
    }

    const { code, timestamp } = storedData;
    const currentTime = Date.now();
    const timeDifference = (currentTime - timestamp) / 1000 / 60; // 转换为分钟

    if (timeDifference > 5) {
        return res.status(400).json({ message: 'Verification code expired' });
    }

    if (code !== verificationCode) {
        return res.status(400).json({ message: 'Invalid verification code' });
    }

    // 验证用户ID和邮箱是否匹配
    connection.query('SELECT * FROM users WHERE email = ? AND user_id = ?', [email, userId], (err, results) => {
        if (err) {
            console.error('Error querying users:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'User ID and email do not match' });
        }

        // 更新密码
        connection.query('UPDATE users SET password = ? WHERE user_id = ?', [newPassword, userId], (err, results) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.json({ message: 'Password reset successfully' });
        });
    });
});


// 内存存储验证码
const verificationCodes = {};

app.post('/send-code', (req, res) => {
    const { email } = req.body;
    const randomNumber = Math.random().toString().slice(-6); // 生成随机数并截取后六位
    const code = randomNumber.padStart(6, '0');

    // 存储验证码和生成时间
    verificationCodes[email] = { code, timestamp: Date.now() };

    // 发送验证码
    sendVerificationCode(email, code);

    res.status(200).json({ message: 'Verification code sent' });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

// 生成唯一的用户数字ID
const generateUniqueUserId = (callback) => {
    const generateRandomId = () => {
      let userId = Math.random().toString().slice(2, 8);
      while (userId.startsWith('0')) {
        userId = Math.random().toString().slice(2, 8);
      }
      return userId;
    };
  
    const userId = generateRandomId();
    connection.query('SELECT user_id FROM users WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length > 0) {
        // 如果ID已经存在，递归调用以生成一个新的ID
        return generateUniqueUserId(callback);
      }
      // 返回唯一ID
      callback(null, userId);
    });
  };

// 注册路由
app.post('/register', (req, res) => {
    const { username, password, email, verificationCode, avatarUrl } = req.body;
  
    if (!username || !password || !email || !verificationCode) {
      return res.status(400).json({ message: 'Username, password, email, and verification code are required' });
    }
  
    // 验证验证码
    const storedData = verificationCodes[email];
    if (!storedData) {
      return res.status(400).json({ message: 'Verification code not found' });
    }
  
    const { code, timestamp } = storedData;
    const currentTime = Date.now();
    const timeDifference = (currentTime - timestamp) / 1000 / 60; // 转换为分钟
  
    if (timeDifference > 5) {
      return res.status(400).json({ message: 'Verification code expired' });
    }
  
    if (code !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
  
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error querying MySQL:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      generateUniqueUserId((err, userId) => {
        if (err) {
          console.error('Error generating user ID:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        const newUser = { user_id: userId, username, password, email, avatar_url: avatarUrl};
        connection.query('INSERT INTO users SET ?', newUser, (err, results) => {
          if (err) {
            console.error('Error inserting into MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }
  
          res.json({ message: 'User registered successfully', userId });
        });
      });
    });
  });

// 登录路由
app.post('/login', (req, res) => {
    const { userId, password, rememberPassword, userIp } = req.body;
    console.log(userId, password, rememberPassword, userIp);

    connection.query('SELECT * FROM users WHERE user_id = ? AND password = ?', [userId, password], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid user ID or password' });
        }

        const user = results[0];
        const token = jwt.sign({ userId: user.user_id }, SECRET_KEY, { expiresIn: '5h' });

        // 更新remember_password字段和lastIp字段
        connection.query('UPDATE users SET remember_password = ?, lastIp = ? WHERE user_id = ?', [rememberPassword ? 1 : 0, userIp, user.user_id], (updateErr, updateResults) => {
            if (updateErr) {
                console.error('Error updating remember_password:', updateErr);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.json({
                message: 'Login successful',
                token,
                userId: user.user_id,
                username: user.username,
                rememberPassword: rememberPassword ? 1 : 0
            });
        });
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
    const { friendId } = req.query;

    if (!friendId) {
        return res.status(400).json({ message: 'friendId is required' });
    }

    // 查找好友
    connection.query('SELECT * FROM users WHERE user_id = ?', [friendId], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length > 0) {
            const friend = results[0];
            res.json(friend);
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

    // 检查是否已经是好友
    connection.query('SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (friend_id = ? AND user_id = ?)', [senderId, receiverId, receiverId, senderId], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error1' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'You are already friends' });
        }

        // 检查是否已经发送过请求
        connection.query('SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ? AND status = "pending"', [senderId, receiverId], (err, results) => {
            if (err) {
                console.error('Error querying MySQL:', err);
                return res.status(500).json({ message: 'Internal server error2' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'Friend request already sent' });
            }

            // 插入好友请求
            const newRequest = { sender_id: senderId, sender_username: senderUsername, receiver_id: receiverId, receiver_username: receiverUsername };
            connection.query('INSERT INTO friend_requests SET ?', newRequest, (err, results) => {
                if (err) {
                    console.error('Error inserting into MySQL:', err);
                    return res.status(500).json({ message: 'Internal server error3' });
                }

                res.json({ message: 'Friend request sent successfully' });
            });
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

    connection.query('SELECT * FROM friends f JOIN users u ON f.friend_id = u.id WHERE f.user_id = ?', [userId], (err, results) => {
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
    console.log(receiverId, status);

    connection.query('SELECT * FROM friend_requests WHERE receiver_id = ? AND status = ?', [receiverId, status], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log(results);
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
