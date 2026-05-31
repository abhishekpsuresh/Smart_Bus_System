-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: smart_bus_system
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'e05d5cf6-5295-11f1-9270-0a0027000015:1-1236';

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_code` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  `trip_id` int NOT NULL,
  `seat_number` varchar(50) DEFAULT NULL,
  `passenger_name` varchar(100) NOT NULL,
  `passenger_gender` enum('Male','Female','Other') NOT NULL,
  `passenger_age` int NOT NULL,
  `copassenger_preference` enum('No Preference','Female Only') DEFAULT 'No Preference',
  `booking_status` enum('Booked','Cancelled','Completed') DEFAULT 'Booked',
  `fare` decimal(10,2) NOT NULL,
  `booked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `trip_id` (`trip_id`),
  KEY `seat_id` (`seat_number`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (2,'RSV1780202269126',3,1,'RLW4','Surya','Female',23,'Female Only','Booked',1500.00,'2026-05-31 04:37:52');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_images`
--

DROP TABLE IF EXISTS `bus_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bus_id` int NOT NULL,
  `image_path` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bus_id` (`bus_id`),
  CONSTRAINT `bus_images_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_images`
--

LOCK TABLES `bus_images` WRITE;
/*!40000 ALTER TABLE `bus_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `bus_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bus_name` varchar(100) NOT NULL,
  `bus_number` varchar(50) NOT NULL,
  `bus_type` enum('AC Sleeper','Non-AC Sleeper','Semi Sleeper','Luxury Sleeper') NOT NULL,
  `bus_body_type` varchar(100) NOT NULL,
  `total_seats` int NOT NULL,
  `operator_name` varchar(100) NOT NULL,
  `manufacture_year` year DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `operator_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bus_number` (`bus_number`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES (1,'TEST BUS','KL34D1289','AC Sleeper','Volvo',30,'TEST 1',2025,'2026-05-31 03:58:53','2026-05-31 03:58:53',2),(2,'TEST BUS (2)','KL34D4880','Luxury Sleeper','BharathBenz',36,'TEST 1',2026,'2026-05-31 04:00:13','2026-05-31 04:00:13',2);
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cancelled_bookings`
--

DROP TABLE IF EXISTS `cancelled_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancelled_bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `original_booking_id` int DEFAULT NULL,
  `booking_code` varchar(100) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `trip_id` int DEFAULT NULL,
  `seat_number` varchar(50) DEFAULT NULL,
  `passenger_name` varchar(100) DEFAULT NULL,
  `passenger_gender` varchar(20) DEFAULT NULL,
  `passenger_age` int DEFAULT NULL,
  `copassenger_preference` varchar(50) DEFAULT NULL,
  `fare` decimal(10,2) DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `refund_percentage` int DEFAULT '0',
  `refund_amount` decimal(10,2) DEFAULT '0.00',
  `refund_status` varchar(50) DEFAULT 'Pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancelled_bookings`
--

LOCK TABLES `cancelled_bookings` WRITE;
/*!40000 ALTER TABLE `cancelled_bookings` DISABLE KEYS */;
INSERT INTO `cancelled_bookings` VALUES (1,1,'RSV1780202164467',3,1,'RLA1','Priya','Female',22,'Female Only',1500.00,'2026-05-31 04:36:35',80,1200.00,'Refunded');
/*!40000 ALTER TABLE `cancelled_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operator_requests`
--

DROP TABLE IF EXISTS `operator_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operator_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operator_requests`
--

LOCK TABLES `operator_requests` WRITE;
/*!40000 ALTER TABLE `operator_requests` DISABLE KEYS */;
INSERT INTO `operator_requests` VALUES (1,'TEST 1','test@gmail.com','7561842946','$2b$10$1EyWHR7ejoza.RX4lx2krugkDZvY4LPXyDq9E3zDk5HeLUji2A2ji','approved','2026-05-31 03:55:46');
/*!40000 ALTER TABLE `operator_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservation_request_id` int DEFAULT NULL,
  `booking_code` varchar(50) DEFAULT NULL,
  `user_id` int NOT NULL,
  `trip_id` int NOT NULL,
  `seat_id` text,
  `seat_number` text,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('UPI','Card','NetBanking','Wallet') DEFAULT NULL,
  `payment_status` enum('Pending','Success','Failed') DEFAULT 'Pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_payment_reservation` (`reservation_request_id`),
  CONSTRAINT `fk_payment_reservation` FOREIGN KEY (`reservation_request_id`) REFERENCES `reservation_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'RSV1780202164467',3,1,'2','RLA1',1500.00,'UPI','Success','TXN1780202177071','2026-05-31 04:36:15','2026-05-31 04:36:17'),(2,2,'RSV1780202269126',3,1,'21','RLW4',1500.00,'UPI','Success','TXN1780202272990','2026-05-31 04:37:50','2026-05-31 04:37:52');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation_passengers`
--

DROP TABLE IF EXISTS `reservation_passengers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation_passengers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservation_request_id` int NOT NULL,
  `seat_id` int NOT NULL,
  `seat_number` varchar(50) DEFAULT NULL,
  `passenger_name` varchar(100) NOT NULL,
  `passenger_gender` enum('Male','Female') NOT NULL,
  `passenger_age` int NOT NULL,
  `copassenger_preference` enum('No Preference','Female Only') DEFAULT 'No Preference',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reservation_request_id` (`reservation_request_id`),
  KEY `seat_id` (`seat_id`),
  CONSTRAINT `reservation_passengers_ibfk_1` FOREIGN KEY (`reservation_request_id`) REFERENCES `reservation_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reservation_passengers_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation_passengers`
--

LOCK TABLES `reservation_passengers` WRITE;
/*!40000 ALTER TABLE `reservation_passengers` DISABLE KEYS */;
INSERT INTO `reservation_passengers` VALUES (1,1,2,'RLA1','Priya','Female',22,'Female Only','2026-05-31 04:36:04'),(2,2,21,'RLW4','Surya','Female',23,'Female Only','2026-05-31 04:37:49');
/*!40000 ALTER TABLE `reservation_passengers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation_requests`
--

DROP TABLE IF EXISTS `reservation_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservation_code` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  `trip_id` int NOT NULL,
  `seat_id` text,
  `seat_number` text,
  `total_amount` decimal(10,2) NOT NULL,
  `reservation_status` enum('Pending','Confirmed','Expired','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reservation_expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reservation_code` (`reservation_code`),
  KEY `user_id` (`user_id`),
  KEY `trip_id` (`trip_id`),
  CONSTRAINT `reservation_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reservation_requests_ibfk_2` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation_requests`
--

LOCK TABLES `reservation_requests` WRITE;
/*!40000 ALTER TABLE `reservation_requests` DISABLE KEYS */;
INSERT INTO `reservation_requests` VALUES (1,'RSV1780202164467',3,1,'2','RLA1',1500.00,'Confirmed','2026-05-31 04:36:04','2026-05-31 04:36:17','2026-05-31 10:16:04'),(2,'RSV1780202269126',3,1,'21','RLW4',1500.00,'Confirmed','2026-05-31 04:37:49','2026-05-31 04:37:53','2026-05-31 10:17:49');
/*!40000 ALTER TABLE `reservation_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat_restrictions`
--

DROP TABLE IF EXISTS `seat_restrictions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_restrictions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trip_id` int NOT NULL,
  `restricted_seat_id` int NOT NULL,
  `seat_number` varchar(50) DEFAULT NULL,
  `restriction_type` enum('WomenOnly') NOT NULL DEFAULT 'WomenOnly',
  `created_by_booking_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `trip_id` (`trip_id`),
  KEY `restricted_seat_id` (`restricted_seat_id`),
  KEY `created_by_booking_id` (`created_by_booking_id`),
  CONSTRAINT `seat_restrictions_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
  CONSTRAINT `seat_restrictions_ibfk_2` FOREIGN KEY (`restricted_seat_id`) REFERENCES `seats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `seat_restrictions_ibfk_3` FOREIGN KEY (`created_by_booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_restrictions`
--

LOCK TABLES `seat_restrictions` WRITE;
/*!40000 ALTER TABLE `seat_restrictions` DISABLE KEYS */;
INSERT INTO `seat_restrictions` VALUES (2,1,20,'RLA4','WomenOnly',2,'2026-05-31 04:37:53');
/*!40000 ALTER TABLE `seat_restrictions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bus_id` int NOT NULL,
  `seat_number` varchar(10) NOT NULL,
  `seat_type` enum('Lower','Upper') NOT NULL,
  `layout_side` enum('Left','Right') NOT NULL,
  `seat_position` enum('Single','Window','Aisle') NOT NULL,
  `seat_group_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `seat_status` enum('Available','Locked','Booked','WomenOnly') DEFAULT 'Available',
  `trip_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bus_id` (`bus_id`),
  CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `seats_chk_1` CHECK ((((`layout_side` = _utf8mb4'Left') and (`seat_position` = _utf8mb4'Single')) or ((`layout_side` = _utf8mb4'Right') and (`seat_position` in (_utf8mb4'Window',_utf8mb4'Aisle')))))
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,1,'LL1','Lower','Left','Single',1,'2026-05-31 04:01:04','Available',1),(2,1,'RLA1','Lower','Right','Aisle',1,'2026-05-31 04:01:04','Available',1),(3,1,'RLW1','Lower','Right','Window',1,'2026-05-31 04:01:04','Available',1),(4,1,'LU1','Upper','Left','Single',1,'2026-05-31 04:01:04','Available',1),(5,1,'RUA1','Upper','Right','Aisle',1,'2026-05-31 04:01:04','Available',1),(6,1,'RUW1','Upper','Right','Window',1,'2026-05-31 04:01:04','Available',1),(7,1,'LL2','Lower','Left','Single',2,'2026-05-31 04:01:04','Available',1),(8,1,'RLA2','Lower','Right','Aisle',2,'2026-05-31 04:01:04','Available',1),(9,1,'RLW2','Lower','Right','Window',2,'2026-05-31 04:01:04','Available',1),(10,1,'LU2','Upper','Left','Single',2,'2026-05-31 04:01:04','Available',1),(11,1,'RUA2','Upper','Right','Aisle',2,'2026-05-31 04:01:04','Available',1),(12,1,'RUW2','Upper','Right','Window',2,'2026-05-31 04:01:04','Available',1),(13,1,'LL3','Lower','Left','Single',3,'2026-05-31 04:01:04','Available',1),(14,1,'RLA3','Lower','Right','Aisle',3,'2026-05-31 04:01:04','Available',1),(15,1,'RLW3','Lower','Right','Window',3,'2026-05-31 04:01:04','Available',1),(16,1,'LU3','Upper','Left','Single',3,'2026-05-31 04:01:04','Available',1),(17,1,'RUA3','Upper','Right','Aisle',3,'2026-05-31 04:01:04','Available',1),(18,1,'RUW3','Upper','Right','Window',3,'2026-05-31 04:01:04','Available',1),(19,1,'LL4','Lower','Left','Single',4,'2026-05-31 04:01:04','Available',1),(20,1,'RLA4','Lower','Right','Aisle',4,'2026-05-31 04:01:04','WomenOnly',1),(21,1,'RLW4','Lower','Right','Window',4,'2026-05-31 04:01:04','Booked',1),(22,1,'LU4','Upper','Left','Single',4,'2026-05-31 04:01:04','Available',1),(23,1,'RUA4','Upper','Right','Aisle',4,'2026-05-31 04:01:04','Available',1),(24,1,'RUW4','Upper','Right','Window',4,'2026-05-31 04:01:04','Available',1),(25,1,'LL5','Lower','Left','Single',5,'2026-05-31 04:01:04','Available',1),(26,1,'RLA5','Lower','Right','Aisle',5,'2026-05-31 04:01:04','Available',1),(27,1,'RLW5','Lower','Right','Window',5,'2026-05-31 04:01:04','Available',1),(28,1,'LU5','Upper','Left','Single',5,'2026-05-31 04:01:04','Available',1),(29,1,'RUA5','Upper','Right','Aisle',5,'2026-05-31 04:01:04','Available',1),(30,1,'RUW5','Upper','Right','Window',5,'2026-05-31 04:01:04','Available',1),(31,2,'LL1','Lower','Left','Single',1,'2026-05-31 04:01:54','Available',2),(32,2,'RLA1','Lower','Right','Aisle',1,'2026-05-31 04:01:54','Available',2),(33,2,'RLW1','Lower','Right','Window',1,'2026-05-31 04:01:54','Available',2),(34,2,'LU1','Upper','Left','Single',1,'2026-05-31 04:01:54','Available',2),(35,2,'RUA1','Upper','Right','Aisle',1,'2026-05-31 04:01:54','Available',2),(36,2,'RUW1','Upper','Right','Window',1,'2026-05-31 04:01:54','Available',2),(37,2,'LL2','Lower','Left','Single',2,'2026-05-31 04:01:54','Available',2),(38,2,'RLA2','Lower','Right','Aisle',2,'2026-05-31 04:01:54','Available',2),(39,2,'RLW2','Lower','Right','Window',2,'2026-05-31 04:01:54','Available',2),(40,2,'LU2','Upper','Left','Single',2,'2026-05-31 04:01:54','Available',2),(41,2,'RUA2','Upper','Right','Aisle',2,'2026-05-31 04:01:54','Available',2),(42,2,'RUW2','Upper','Right','Window',2,'2026-05-31 04:01:54','Available',2),(43,2,'LL3','Lower','Left','Single',3,'2026-05-31 04:01:54','Available',2),(44,2,'RLA3','Lower','Right','Aisle',3,'2026-05-31 04:01:54','Available',2),(45,2,'RLW3','Lower','Right','Window',3,'2026-05-31 04:01:54','Available',2),(46,2,'LU3','Upper','Left','Single',3,'2026-05-31 04:01:54','Available',2),(47,2,'RUA3','Upper','Right','Aisle',3,'2026-05-31 04:01:54','Available',2),(48,2,'RUW3','Upper','Right','Window',3,'2026-05-31 04:01:54','Available',2),(49,2,'LL4','Lower','Left','Single',4,'2026-05-31 04:01:54','Available',2),(50,2,'RLA4','Lower','Right','Aisle',4,'2026-05-31 04:01:54','Available',2),(51,2,'RLW4','Lower','Right','Window',4,'2026-05-31 04:01:54','Available',2),(52,2,'LU4','Upper','Left','Single',4,'2026-05-31 04:01:54','Available',2),(53,2,'RUA4','Upper','Right','Aisle',4,'2026-05-31 04:01:54','Available',2),(54,2,'RUW4','Upper','Right','Window',4,'2026-05-31 04:01:54','Available',2),(55,2,'LL5','Lower','Left','Single',5,'2026-05-31 04:01:54','Available',2),(56,2,'RLA5','Lower','Right','Aisle',5,'2026-05-31 04:01:54','Available',2),(57,2,'RLW5','Lower','Right','Window',5,'2026-05-31 04:01:54','Available',2),(58,2,'LU5','Upper','Left','Single',5,'2026-05-31 04:01:54','Available',2),(59,2,'RUA5','Upper','Right','Aisle',5,'2026-05-31 04:01:54','Available',2),(60,2,'RUW5','Upper','Right','Window',5,'2026-05-31 04:01:54','Available',2),(61,2,'LL6','Lower','Left','Single',6,'2026-05-31 04:01:54','Available',2),(62,2,'RLA6','Lower','Right','Aisle',6,'2026-05-31 04:01:54','Available',2),(63,2,'RLW6','Lower','Right','Window',6,'2026-05-31 04:01:54','Available',2),(64,2,'LU6','Upper','Left','Single',6,'2026-05-31 04:01:54','Available',2),(65,2,'RUA6','Upper','Right','Aisle',6,'2026-05-31 04:01:54','Available',2),(66,2,'RUW6','Upper','Right','Window',6,'2026-05-31 04:01:54','Available',2);
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trip_code` varchar(50) NOT NULL,
  `bus_id` int NOT NULL,
  `source_city` varchar(100) NOT NULL,
  `destination_city` varchar(100) NOT NULL,
  `departure_datetime` datetime NOT NULL,
  `arrival_datetime` datetime NOT NULL,
  `trip_status` enum('Scheduled','Running','Completed','Cancelled') DEFAULT 'Scheduled',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `operator_id` int DEFAULT NULL,
  `fare` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `trip_code` (`trip_code`),
  KEY `bus_id` (`bus_id`),
  CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` VALUES (1,'TRIP001',1,'A','B','2026-06-02 04:00:00','2026-06-03 04:00:00','Scheduled','2026-05-31 04:01:04','2026-05-31 04:02:15',2,1500),(2,'TRIP002',2,'A','B','2026-06-02 11:30:00','2026-06-03 11:30:00','Scheduled','2026-05-31 04:01:54','2026-05-31 04:01:54',2,1600);
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('admin','operator','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Abhishek P Suresh','abhishekpsuresh@admin.com','$2b$10$.suChIEeIXtTMnNT0clJceGedu2ponJYwZGY.TSXtXZECNXUs9WH.','9400986753','admin','2026-05-31 03:51:18'),(2,'TEST 1','test@gmail.com','$2b$10$1EyWHR7ejoza.RX4lx2krugkDZvY4LPXyDq9E3zDk5HeLUji2A2ji','7561842946','operator','2026-05-31 03:57:03'),(3,'TEST USER','user@gmail.com','$2b$10$e4NftVOorTn/gn4hGQCvneUJMrN/YfurKOQ9HwfoMJTQ9CAXoh1Hy','9744778544','user','2026-05-31 04:03:28'),(4,'abhi','abhishek@gmail.com','$2b$10$8QUdDYZTP31ztwO2XGGPaeSpr9SBxmrv/tGiHnMC.HhRBo0xiRhZ.','1122334455',NULL,'2026-05-31 04:50:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-31 10:23:45
