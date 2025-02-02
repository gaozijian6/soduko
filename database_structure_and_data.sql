-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: user
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `friend_requests`
--

DROP TABLE IF EXISTS `friend_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friend_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `sender_username` varchar(255) DEFAULT NULL,
  `receiver_username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend_requests`
--

LOCK TABLES `friend_requests` WRITE;
/*!40000 ALTER TABLE `friend_requests` DISABLE KEYS */;
INSERT INTO `friend_requests` VALUES (2,2,1,'accepted',NULL,NULL),(3,5,6,'accepted',NULL,NULL),(8,6,1,'accepted',NULL,NULL),(11,1,3,'accepted','admin','wyt'),(12,5,2,'accepted','a','gzj'),(13,5,3,'accepted','a','wyt');
/*!40000 ALTER TABLE `friend_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `friend_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `friend_id` (`friend_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES (1,2,1),(2,1,2),(3,5,6),(4,6,5),(5,6,1),(6,1,6),(7,1,3),(8,3,1),(9,5,2),(10,2,5),(11,5,3),(12,3,5);
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,1,2,'1','2024-06-08 23:59:42'),(2,1,2,'2','2024-06-09 11:05:11'),(3,1,2,'鑷杞?,'2024-06-09 11:05:21'),(4,2,1,'2144325','2024-06-09 11:05:30'),(5,1,2,'浣犲ソ','2024-06-09 11:25:42'),(6,1,2,'钀ㄨ揪','2024-06-09 11:25:54'),(7,1,2,'2','2024-06-09 11:28:14'),(8,1,2,'鎾?,'2024-06-09 11:29:53'),(9,1,2,'鐜嬩紒楣?,'2024-06-09 11:33:09'),(10,1,2,'闃挎柉钂傝姮','2024-06-09 11:33:56'),(11,2,1,'鎾掓墦绠?,'2024-06-09 11:34:55'),(12,2,1,'hello','2024-06-09 11:37:59'),(13,1,2,'123 ','2024-06-09 11:39:26'),(14,2,1,'2 ','2024-06-09 11:42:21'),(15,2,1,'2 ','2024-06-09 11:42:58'),(16,2,1,'鎾掑湴鏂规拻','2024-06-09 11:43:11'),(17,2,1,'123 ','2024-06-09 11:43:24'),(18,2,1,'2132 ','2024-06-09 11:45:43'),(19,2,1,'姘ㄩ吀','2024-06-09 11:46:30'),(20,2,1,'鎯?,'2024-06-09 11:48:29'),(21,2,1,'閮芥槸','2024-06-09 11:48:47'),(22,1,2,'123','2024-06-09 11:51:09'),(23,2,1,'21 ','2024-06-09 11:54:55'),(24,2,1,'琛岄珮','2024-06-09 11:55:09'),(25,2,1,'姘ㄩ吀','2024-06-09 11:55:48'),(26,2,1,'姘ㄩ吀','2024-06-09 11:56:25'),(27,2,1,'姘ㄩ吀','2024-06-09 11:57:10'),(28,2,1,'12 ','2024-06-09 11:57:58'),(29,1,2,'1231 2','2024-06-09 11:58:11'),(30,1,2,'姘ㄩ吀','2024-06-09 12:01:25'),(31,1,2,'闃胯惃寰?,'2024-06-09 12:02:32'),(32,1,2,'鎾掑彂鐨?,'2024-06-09 12:02:42'),(33,1,2,'鐑儹','2024-06-09 12:05:35'),(34,1,2,'鑰?,'2024-06-09 12:05:58'),(35,1,2,'鐢甸キ閿?,'2024-06-09 12:06:20'),(36,2,1,'浣犲ソ','2024-06-09 12:09:06'),(37,2,1,'缁村皵钖?,'2024-06-09 12:09:49'),(38,2,1,'钀ㄨ揪','2024-06-09 12:11:34'),(39,1,2,'璇烽棶','2024-06-09 12:11:48'),(40,1,2,'钀ㄨ揪','2024-06-09 12:11:58'),(41,1,2,'钀ㄨ揪','2024-06-09 12:12:05'),(42,2,1,'浣犲ソ鍛€','2024-06-09 12:14:43'),(43,1,2,'寰堝ソ','2024-06-09 12:14:51'),(44,1,6,'浣犲ソ','2024-06-09 12:18:30'),(45,2,5,'浣犲ソ','2024-06-09 14:45:26'),(46,5,2,'hello','2024-06-09 14:45:40');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','123'),(2,'gzj','123'),(3,'wyt','123456'),(4,'xiaoming','123'),(5,'a','123'),(6,'b','123');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-09 14:59:34
