# My Project

## 项目简介

这是一个示例项目，使用 Node.js 和 MySQL 数据库。此 README 文件提供了有关如何设置和配置数据库的详细说明。

## 数据库设置

本项目使用 MySQL 数据库。请按照以下步骤设置数据库：

### 1. 安装 MySQL

如果你的系统尚未安装 MySQL，请从以下链接下载并安装：
- [MySQL 下载页](https://dev.mysql.com/downloads/)

### 2. 创建数据库

1. 打开命令行窗口（如命令提示符、PowerShell 或终端）。
2. 登录到 MySQL：

    ```bash
    mysql -u root -p
    ```

    系统会提示你输入 MySQL 密码。输入密码并按 Enter 键。

3. 在 MySQL 提示符下创建一个新的数据库：

    ```sql
    CREATE DATABASE user;
    ```

4. 退出 MySQL 提示符：

    ```sql
    EXIT;
    ```

### 3. 导入数据库结构和数据

1. 将 `database_structure_and_data.sql` 文件放在一个易于访问的目录中。
2. 在命令行窗口中运行以下命令，将 SQL 文件中的数据导入到你刚创建的数据库中：

    ```bash
    mysql -u root -p user < path/to/database_structure_and_data.sql
    ```

    请将 `path/to/database_structure_and_data.sql` 替换为 `database_structure_and_data.sql` 文件的实际路径。

### 4. 配置项目

在你的项目中，确保数据库连接配置正确。打开 `server.js` 或项目的其他配置文件，并设置数据库连接信息：

```javascript
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password', // 替换为你的 MySQL 密码
  database: 'user'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});
