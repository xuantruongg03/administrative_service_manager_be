-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: administrative_service_manager_system
-- ------------------------------------------------------
-- Server version	9.1.0

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

--
-- Table structure for table `business_licenses`
--

DROP TABLE IF EXISTS `business_licenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_licenses` (
  `id` varchar(12) NOT NULL,
  `name` varchar(255) NOT NULL,
  `business_id` varchar(12) NOT NULL,
  `license_type_id` varchar(12) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `size` int NOT NULL,
  `issued_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_95e1d5c0267ad59093cab4ab39e` (`business_id`),
  KEY `FK_65acd6eae7c4e71c8fd4ace8cb8` (`license_type_id`),
  CONSTRAINT `FK_65acd6eae7c4e71c8fd4ace8cb8` FOREIGN KEY (`license_type_id`) REFERENCES `license_types` (`id`),
  CONSTRAINT `FK_95e1d5c0267ad59093cab4ab39e` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_licenses`
--

LOCK TABLES `business_licenses` WRITE;
/*!40000 ALTER TABLE `business_licenses` DISABLE KEYS */;
INSERT INTO `business_licenses` VALUES ('0j34aac5h74n','2963420753-Giấy phép kinh doanh-L\'Amor Boutique Hotel Quy Nhơn','a5tg8fmpj2q','102318673847','2963420753-Giay-phep-kinh-doanh-L\'Amor-Boutique-Hotel-Quy-Nhon.pdf',467426,NULL,NULL,'normal','2024-11-30 14:23:49.479434','2024-11-30 14:23:49.479434',NULL),('dcs1x0auz17','2016353775-Giấy phép kinh doanh-Bego Homestay','3otipswzkam','102318673847','2016353775-Giay-phep-kinh-doanh-Bego-Homestay.pdf',34648,NULL,NULL,'normal','2024-11-20 21:13:54.914332','2024-11-20 21:13:54.914332',NULL),('jogq0u3s2pp','p3 - 2016353775-Giấy phép kinh doanh-Bego Homestay','3otipswzkam','102318673847','p3-2016353775-Giay-phep-kinh-doanh-Bego-Homestay.pdf',51237,NULL,NULL,'normal','2024-11-20 21:13:54.983677','2024-11-20 21:13:54.983677',NULL),('vnixl4olops','p4 - 2016353775-Giấy phép kinh doanh-Bego Homestay','3otipswzkam','102318673847','p4-2016353775-Giay-phep-kinh-doanh-Bego-Homestay.png',538213,NULL,NULL,'normal','2024-11-20 21:13:55.054710','2024-11-20 21:13:55.054710',NULL),('wgp3dbipb9m','p2 - 2016353775-Giấy phép kinh doanh-Bego Homestay','3otipswzkam','102318673847','p2-2016353775-Giay-phep-kinh-doanh-Bego-Homestay.jpg',87917,NULL,NULL,'normal','2024-11-20 21:13:54.948905','2024-11-20 21:13:54.948905',NULL),('zbkyj8rrqhf','2016353775-Giấy phép kinh doanh du lịch lữ hành-Bego Homestay','3otipswzkam','102318673853','2016353775-Giay-phep-kinh-doanh-du-lich-lu-hanh-Bego-Homestay.png',538213,NULL,NULL,'normal','2024-11-20 21:13:45.501533','2024-11-20 21:13:45.501533',NULL);
/*!40000 ALTER TABLE `business_licenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `businesses`
--

DROP TABLE IF EXISTS `businesses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `businesses` (
  `id` varchar(12) NOT NULL,
  `code` varchar(12) NOT NULL,
  `name_vietnamese` varchar(255) NOT NULL,
  `name_english` varchar(255) DEFAULT NULL,
  `name_acronym` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `chartered_capital` varchar(255) NOT NULL,
  `type_of_organization` varchar(255) NOT NULL,
  `owner_id` varchar(255) NOT NULL,
  `legal_representative` varchar(255) NOT NULL,
  `latitude` decimal(12,8) NOT NULL,
  `longitude` decimal(12,8) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `citizen_id` varchar(12) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_6c9b65a09431edc42068186ba0` (`code`),
  KEY `FK_d18d4b52ea4c2d70e913d35ef75` (`citizen_id`),
  KEY `FK_a213e694b2546d192f24b4182fa` (`type_of_organization`),
  CONSTRAINT `FK_a213e694b2546d192f24b4182fa` FOREIGN KEY (`type_of_organization`) REFERENCES `type_of_organizations` (`id`),
  CONSTRAINT `FK_d18d4b52ea4c2d70e913d35ef75` FOREIGN KEY (`citizen_id`) REFERENCES `persons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businesses`
--

LOCK TABLES `businesses` WRITE;
/*!40000 ALTER TABLE `businesses` DISABLE KEYS */;
INSERT INTO `businesses` VALUES ('1elfdese1qg','2059402274','Sunrise Hotel','','Sunrise Hotel','26 Lê Thành Phương, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962033917','','','1360000000','345678901236','ua9itvuz7vk','vvm0z9h14lc',13.75802090,109.21475520,'active','2024-10-30 07:00:00.000000','2024-11-16 21:47:54.000000',NULL,NULL),('37kpohso1kl','2575984262','Khách Sạn Căn Hộ Yến Vy','','Khách Sạn Căn Hộ Yến Vy','18/7 Trần Văn Ơn, Phường Nguyễn Văn cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0942071918','','','640000000','345678901236','ou9x6meub0p','ou9x6meub0p',13.75595300,109.21611100,'inactive','2024-10-30 07:00:00.000000','2024-11-20 20:52:44.000000','2024-11-20 20:52:44.000000',NULL),('3otipswzkam','2016353775','Bego Homestay','','Bego Homestay','07 Trần Khánh Dư, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0862071917','','','1420000000','345678901236','ckpzkkwjylt','bt7ht6xq8rv',13.75351360,109.21236040,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:58.274824',NULL,NULL),('3swp0njf9t4','2662081260','FLC Sea Tower Quy Nhon','','FLC Sea Tower Quy Nhon','12 Trần Văn Ơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962033917','','','520000000','345678901236','3v6a7sa9vcd','3v6a7sa9vcd',13.75524690,109.21657870,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:43.265536',NULL,NULL),('6ykg4vk1am','2748178258','Khách sạn Kim Ngân','','Khách sạn Kim Ngân','71 Trần Anh Tông, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0981634833','','','400000000','345678901236','elk26rhsqaw','elk26rhsqaw',13.75218028,109.21241944,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:41.269182',NULL,NULL),('7jyc70fhnfd','2920372254','Sonder Homestay','','Sonder Homestay','61A Ngô Gia Tự, Nguyễn Văn Cừ, thành phố, Bình Định, Việt Nam','','0862071917','','','160000000','345678901236','40fl1pgmqgy','40fl1pgmqgy',13.75462650,109.21190450,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:37.333524',NULL,NULL),('8jdwxbjdq','1031543417','Crane Tea Quy Nhơn','','CF Tea','124 Nguyễn Thị Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0981634833','','','200000000','789012345679','5l5b0jhlnuv','5l5b0jhlnuv',13.75880472,109.21465167,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:34.279030',NULL,NULL),('8rbwb13tzly','2619032761','La Cactus Hotel 2','','La Cactus Hotel 2','03 Trần Văn Ơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0862071917','','','580000000','345678901236','7ibkj6cc8cl','7ibkj6cc8cl',13.75569700,109.21561100,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:44.273603',NULL,NULL),('a5tg8fmpj2q','2963420753','L\'Amor Boutique Hotel Quy Nhơn','','L\'Amor Boutique','111 Nguyễn Thị Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962033917','','','100000000','345678901236','5vb2bd9nbff','5vb2bd9nbff',13.75737400,109.21405812,'active','2024-10-31 00:00:00.000000','2024-11-30 13:09:02.000000',NULL,NULL),('dfhlcga6s6','2489887264','Hotel Thanh Thảo','','Hotel Thanh Thảo','27 Lâm Văn Thạnh, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962071917','','','760000000','345678901236','vcbxuimgbo','vcbxuimgbo',13.75773170,109.21540830,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:47.337480',NULL,NULL),('etbtcs73fkp','2317693268','À Ơi Home','','À Ơi Home','10 Trần Quý Khoáng, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0862071917','','','1000000000','345678901236','vxdi6f0dsw','vxdi6f0dsw',13.75679940,109.21317740,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:51.338816',NULL,NULL),('gzbhdt9eims','2231596270','Nhà Nghỉ VY ANH','','Nhà Nghỉ VY ANH','39/24 Ngô Mây, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0907191923','','','1120000000','345678901236','hek5fr71nfl','hek5fr71nfl',13.76348960,109.21635440,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:53.373684',NULL,NULL),('h6h8eq65jxf','2834275256','Khách Sạn 86','','Khách Sạn 86','86 Trần Khánh Dư, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0907191923','','','280000000','345678901236','eg3xyf5ymo5','eg3xyf5ymo5',13.75366320,109.21263780,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:39.336300',NULL,NULL),('i32cxlm7lt8','4101553417','Công ty TNHH Sen Phúc','','HOMESTAY SEN PHÚC','38 Chương Dương, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962071917','','','500000000','345678901236','0155fpsqk35h','0155fpsqk35h',13.75313062,109.21294720,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:33.490459',NULL,NULL),('jyglhl7tqbq','2877323755','Meria Hotel Quy Nhon','','Meria Hotel','09 Trương Văn Của, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0942071918','','','220000000','345678901236','72wea3bburv','72wea3bburv',13.75487170,109.21327800,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:38.315887',NULL,NULL),('k3h7bzvj4xa','1930256777','Buffet Lẫu & Nướng No Nê Quy Nhơn','','Buffet Lẫu & Nướng No Nê Quy Nhơn','160 Trịnh Công Sơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0907191923','','','1540000000','789012345679','bpo6ei6yn67','bt7ht6xq8rv',13.74910110,109.21355450,'active','2024-10-31 00:00:00.000000','2024-11-16 14:38:00.438479',NULL,NULL),('kgwnxotijv','2403790266','Hotel Kinh Bắc','','Hotel Kinh Bắc','99b Cần Vương, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962037917','','','880000000','345678901236','3y8pg53o12i','3y8pg53o12i',13.75861751,109.21364487,'active','2024-10-31 00:00:00.000000','2024-11-30 13:08:23.000000',NULL,NULL),('mesmeuajpn','1973305276','Khách sạn misa','','Khách sạn misa','102 Tây Sơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0942071918','','','1480000000','345678901236','rg9zoxe6gqo','vvm0z9h14lc',13.74956000,109.21217472,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:59.272846',NULL,NULL),('p7fycbl1xgb','2791226757','Hotel SUSU Quy Nhon','','Hotel SUSU Quy Nhon','30 Trần Anh Tông, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962071917','','','340000000','345678901236','50ged2v2t3x','50ged2v2t3x',13.75115200,109.21209970,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:40.315850',NULL,NULL),('psioprihv7','2188547771','T2 Hotel Quy Nhơn','','T2 Hotel Quy Nhơn','13 Thi Sách, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962071917','','','1180000000','345678901236','k7bao93cjun','bt7ht6xq8rv',13.76103978,109.21448762,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:54.272129',NULL,NULL),('q5osiikad9','4015456419','GoGi House','','GoGi','27 Nguyễn Thị Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962037917','','','40000000','789012345679','q9jml2wk5a','q9jml2wk5a',13.75820716,109.21442395,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:35.289204',NULL,NULL),('qf3fg8ik9h9','2145499272','The Social - Breakfast, Pizza & Pub Food','','The Social - Breakfast, Pizza & Pub Food','360 Nguyễn Thị Minh Khai, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0981634833','','','1240000000','789012345679','788v093fftm','vvm0z9h14lc',13.75953583,109.21224837,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:55.291274',NULL,NULL),('qs2dfn1rrwn','2360741767','Nhà nghỉ Hunle','','Nhà nghỉ Hunle','06/1 Nguyễn Phi Khanh, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962033917','','','940000000','345678901236','qhqgazahwc','qhqgazahwc',13.75707840,109.21348650,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:50.338341',NULL,NULL),('urz8fb5qxk','2705129759','Công Ty Cổ phần Đầu Tư Phát Triển Du Lịch - Dịch Vụ Quy Nhơn','','ANYA HOTEL QUY NHƠN','03 Nguyễn Trung Tín, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962037917','','','460000000','345678901236','qcgpfh1t2fr','qcgpfh1t2fr',13.75438710,109.21503410,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:42.343921',NULL,NULL),('v64g6mj8ay','2274644769','Karaoke Kizz','','Karaoke Kizz','140, Trương Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0942071918','','','1060000000','789012345679','brnhandkipd','brnhandkipd',13.75986200,109.21482500,'active','2024-10-31 00:00:00.000000','2024-11-16 14:37:52.340334',NULL,NULL),('w0yyx4la2mj','2102450773','Massage Khiếm Thị Minh Toàn','','Massage Khiếm Thị Minh Toàn','386 Nguyễn Thị Minh Khai, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0962037917','','','1300000000','345678901234','65tojz5y0c','bt7ht6xq8rv',13.75826371,109.21139707,'active','2024-10-31 00:00:00.000000','2024-11-30 13:11:12.000000',NULL,NULL),('wnf9ai321q','2446838765','Namto House Coffee','','Namto House Coffee','34 Nguyễn Thị Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0981634833','','','820000000','789012345679','309eqin6gtf','309eqin6gtf',13.75766418,109.21410629,'active','2024-10-30 07:00:00.000000','2024-11-30 12:07:40.000000',NULL,NULL),('zorw40mxhsh','2532935763','Biển Xanh Hotel ','','Biển Xanh Hotel ','25 Võ Thị Yến, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','','0907191923','','','700000000','345678901236','ftz40qovjds','ftz40qovjds',13.75632030,109.21523580,'active','2024-10-31 00:00:00.000000','2024-12-04 13:43:50.000000','2024-12-04 13:43:50.000000',NULL);
/*!40000 ALTER TABLE `businesses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` varchar(12) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `business_id` varchar(12) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_d98e1b7ad48e1cf38df91f68b31` (`business_id`),
  CONSTRAINT `FK_d98e1b7ad48e1cf38df91f68b31` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES ('0gvalo2l4qc','122342333123','Nguyễn Văn A','Nhân viên','0981793214','2024-12-24 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.703000','2024-11-17 15:14:02.703000'),('1gab1db7j4c','122342343432','Nguyễn Văn A','Nhân viên','0981793220','2027-12-24 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.730000','2024-11-17 15:14:02.730000'),('2934zsjntx6','122342343123','Nguyễn Văn A','Nhân viên','0981793202','2023-12-24 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.146000','2024-11-17 15:15:12.146000'),('316c1zx66tx','123123123243','Phạm Trần Anh','Nhân viên','0981793215','2025-01-19 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.946000','2024-11-17 10:21:48.946000'),('3r5c4fxvdgd','122342342333','Lê Xuân Trường','Quản lý','0981793210','2027-12-24 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.178000','2024-11-17 15:15:12.178000'),('3wdn6gckole','123123123244','Phạm Trần Anh','Nhân viên','0981793203','2024-01-19 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.904000','2024-11-17 10:21:48.904000'),('43ua5w10wh9','123123123423','Lê Xuân Trường','Quản lý','0981793213','2024-01-19 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.186000','2024-11-17 15:15:12.186000'),('4s56avfqcfp','123123423244','Phạm Trần Anh','Nhân viên','0981793209','2027-01-19 00:00:00','3otipswzkam','2024-11-17 15:12:36.581000','2024-11-17 15:12:36.581000'),('4zxr43uc9t3','123123123123','Lê Xuân Trường','Quản lý','0981793201','2023-01-19 00:00:00','3otipswzkam','2024-11-17 15:12:36.512000','2024-11-17 15:12:36.512000'),('53jctl7rnld','123123123133','Lê Xuân Trường','Quản lý','0981793216','2025-12-24 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.685000','2024-11-17 16:02:11.685000'),('5k69hxyaqpi','122345323444','Nguyễn Văn A','Nhân viên','0981793211','2028-01-19 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.664000','2024-11-17 16:02:11.664000'),('5nfawyfj2ev','123123123423','Lê Xuân Trường','Quản lý','0981793213','2024-01-19 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.936000','2024-11-17 10:21:48.936000'),('6kr3ox3vru','123123123133','Lê Xuân Trường','Quản lý','0981793216','2025-12-24 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.200000','2024-11-17 15:15:12.200000'),('6vt423ul2kj','123442343123','Nguyễn Văn A','Nhân viên','0981793208','2026-12-24 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.163000','2024-11-17 15:15:12.163000'),('8uo94wgh3sc','122342234323','Nguyễn Văn A','Nhân viên','0981793217','2026-01-19 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.204000','2024-11-17 15:15:12.204000'),('96sdtrawf9i','122342343123','Nguyễn Văn A','Nhân viên','0981793202','2023-12-24 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.664000','2024-11-17 15:14:02.664000'),('9amzuiim6pt','123123123243','Phạm Trần Anh','Nhân viên','0981793215','2025-01-19 00:00:00','3otipswzkam','2024-11-17 15:12:36.619000','2024-11-17 15:12:36.619000'),('9qvu5tst96g','123123123133','Lê Xuân Trường','Quản lý','0981793216','2025-12-24 00:00:00','3otipswzkam','2024-11-17 15:12:36.623000','2024-11-17 15:12:36.623000'),('9qxpv42d5fb','123123123123','Lê Xuân Trường','Quản lý','0981793201','2023-01-19 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.651000','2024-11-17 15:14:02.651000'),('amlbx37t8iu','123123122343','Phạm Trần Anh','Nhân viên','0981793218','2026-12-24 00:00:00','3otipswzkam','2024-11-17 15:12:36.634000','2024-11-17 15:12:36.634000'),('anaz0myjo4h','122345323444','Nguyễn Văn A','Nhân viên','0981793211','2028-01-19 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.182000','2024-11-17 15:15:12.182000'),('b923v6shol','123123123243','Phạm Trần Anh','Nhân viên','0981793215','2025-01-19 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.679000','2024-11-17 16:02:11.679000'),('bpbs0oh5cri','123123134323','Lê Xuân Trường','Quản lý','0981793219','2027-01-19 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.213000','2024-11-17 15:15:12.213000'),('bt0pbupvcpw','122342234323','Nguyễn Văn A','Nhân viên','0981793217','2026-01-19 00:00:00','3otipswzkam','2024-11-17 15:12:36.629000','2024-11-17 15:12:36.629000'),('c0at15ssdhw','122342333123','Nguyễn Văn A','Nhân viên','0981793214','2024-12-24 00:00:00','3otipswzkam','2024-11-17 15:12:36.615000','2024-11-17 15:12:36.615000'),('c5huneyxck','122342342333','Lê Xuân Trường','Quản lý','0981793210','2027-12-24 00:00:00','3otipswzkam','2024-11-17 15:12:36.597000','2024-11-17 15:12:36.597000'),('cde7yx52gvt','123442343123','Nguyễn Văn A','Nhân viên','0981793208','2026-12-24 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.648000','2024-11-17 16:02:11.648000'),('cnofwxzky2w','122345323444','Nguyễn Văn A','Nhân viên','0981793211','2028-01-19 00:00:00','3otipswzkam','2024-11-17 15:12:36.601000','2024-11-17 15:12:36.601000'),('cr45qxxekd8','122342343123','Nguyễn Văn A','Nhân viên','0981793202','2023-12-24 00:00:00','3otipswzkam','2024-11-17 15:12:36.526000','2024-11-17 15:12:36.526000'),('dflc7rdbdob','123123134323','Lê Xuân Trường','Quản lý','0981793219','2027-01-19 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.972000','2024-11-17 10:21:48.972000'),('dlcj9qep2qq','123123123424','Phạm Trần Anh','Nhân viên','0981793221','2028-01-19 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.221000','2024-11-17 15:15:12.221000'),('dmduax0upka','123123134323','Lê Xuân Trường','Quản lý','0981793219','2027-01-19 00:00:00','3otipswzkam','2024-11-17 15:12:36.638000','2024-11-17 15:12:36.638000'),('e6an6cn7b2j','122342333123','Nguyễn Văn A','Nhân viên','0981793214','2024-12-24 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.941000','2024-11-17 10:21:48.941000'),('e9oiymyjz66','122345323444','Nguyễn Văn A','Nhân viên','0981793211','2028-01-19 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.692000','2024-11-17 15:14:02.692000'),('faxo1wmaegj','123123123423','Lê Xuân Trường','Quản lý','0981793213','2024-01-19 00:00:00','3otipswzkam','2024-11-17 15:12:36.607000','2024-11-17 15:12:36.607000'),('fccwiatjmof','122342343123','Nguyễn Văn A','Nhân viên','0981793202','2023-12-24 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.628000','2024-11-17 16:02:11.628000'),('fkib34c854i','122342234323','Nguyễn Văn A','Nhân viên','0981793217','2026-01-19 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.958000','2024-11-17 10:21:48.958000'),('fvjf9brzciw','123123123123','Lê Xuân Trường','Quản lý','0981793201','2023-01-19 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.809000','2024-11-17 10:21:48.809000'),('g0y03nfcmn','123123123423','Lê Xuân Trường','Quản lý','0981793213','2024-01-19 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.669000','2024-11-17 16:02:11.669000'),('i3zzpq0wm8c','123123123424','Phạm Trần Anh','Nhân viên','0981793221','2028-01-19 00:00:00','3otipswzkam','2024-11-17 15:12:36.649000','2024-11-17 15:12:36.649000'),('i4wcedq8v6','123123123123','Lê Xuân Trường','Quản lý','0981793201','2023-01-19 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.595000','2024-11-17 16:02:11.595000'),('ia0b6pq1r6p','122342343123','Nguyễn Văn A','Nhân viên','0981793202','2023-12-24 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.894000','2024-11-17 10:21:48.894000'),('imea5h5in1','123123123243','Phạm Trần Anh','Nhân viên','0981793215','2025-01-19 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.706000','2024-11-17 15:14:02.706000'),('jejwhdhs3h','123123123244','Phạm Trần Anh','Nhân viên','0981793203','2024-01-19 00:00:00','3otipswzkam','2024-11-17 15:12:36.541000','2024-11-17 15:12:36.541000'),('jo7g1hu5rfq','123123123243','Phạm Trần Anh','Nhân viên','0981793215','2025-01-19 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.196000','2024-11-17 15:15:12.196000'),('kyqbz5fdzs','123123123423','Lê Xuân Trường','Quản lý','0981793213','2024-01-19 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.699000','2024-11-17 15:14:02.699000'),('lrvybg7e6em','123123122343','Phạm Trần Anh','Nhân viên','0981793218','2026-12-24 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.965000','2024-11-17 10:21:48.965000'),('lvvxns0pitn','123123123133','Lê Xuân Trường','Quản lý','0981793216','2025-12-24 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.952000','2024-11-17 10:21:48.952000'),('lxatj43ft5s','122342343432','Nguyễn Văn A','Nhân viên','0981793220','2027-12-24 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.703000','2024-11-17 16:02:11.703000'),('megi0hu5a8m','123123134323','Lê Xuân Trường','Quản lý','0981793219','2027-01-19 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.699000','2024-11-17 16:02:11.699000'),('mf5htkwjltj','122342234323','Nguyễn Văn A','Nhân viên','0981793217','2026-01-19 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.688000','2024-11-17 16:02:11.688000'),('nf488gt0gl','123123423244','Phạm Trần Anh','Nhân viên','0981793209','2027-01-19 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.652000','2024-11-17 16:02:11.652000'),('nxnpyx7aejp','123123123424','Phạm Trần Anh','Nhân viên','0981793221','2028-01-19 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.734000','2024-11-17 15:14:02.734000'),('ohd3v33cudn','123123122343','Phạm Trần Anh','Nhân viên','0981793218','2026-12-24 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.209000','2024-11-17 15:15:12.209000'),('p7klde1ym6','123442343123','Nguyễn Văn A','Nhân viên','0981793208','2026-12-24 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.679000','2024-11-17 15:14:02.679000'),('pbfft7hkfzd','123442343123','Nguyễn Văn A','Nhân viên','0981793208','2026-12-24 00:00:00','3otipswzkam','2024-11-17 15:12:36.568000','2024-11-17 15:12:36.568000'),('ppv432i5ku','122342343432','Nguyễn Văn A','Nhân viên','0981793220','2027-12-24 00:00:00','3otipswzkam','2024-11-17 15:12:36.643000','2024-11-17 15:12:36.643000'),('qe0behb8rt','122342333123','Nguyễn Văn A','Nhân viên','0981793214','2024-12-24 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.192000','2024-11-17 15:15:12.192000'),('rlfbcxqwyvc','123123423244','Phạm Trần Anh','Nhân viên','0981793209','2027-01-19 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.921000','2024-11-17 10:21:48.921000'),('rt5809qngr','123123423244','Phạm Trần Anh','Nhân viên','0981793209','2027-01-19 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.684000','2024-11-17 15:14:02.684000'),('rxadp4gph9','122342333123','Nguyễn Văn A','Nhân viên','0981793214','2024-12-24 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.673000','2024-11-17 16:02:11.673000'),('tjph36rc99','122342343432','Nguyễn Văn A','Nhân viên','0981793220','2027-12-24 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.217000','2024-11-17 15:15:12.217000'),('u4gp5ly8ez','123123123244','Phạm Trần Anh','Nhân viên','0981793203','2024-01-19 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.669000','2024-11-17 15:14:02.669000'),('ui39n4b7vi9','122342234323','Nguyễn Văn A','Nhân viên','0981793217','2026-01-19 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.717000','2024-11-17 15:14:02.717000'),('vbpu6r7ubc','123123123424','Phạm Trần Anh','Nhân viên','0981793221','2028-01-19 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.706000','2024-11-17 16:02:11.706000'),('ve02adk88','122342342333','Lê Xuân Trường','Quản lý','0981793210','2027-12-24 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.688000','2024-11-17 15:14:02.688000'),('vtdriby1hsj','123123123424','Phạm Trần Anh','Nhân viên','0981793221','2028-01-19 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.983000','2024-11-17 10:21:48.983000'),('w4knr4q6zze','122345323444','Nguyễn Văn A','Nhân viên','0981793211','2028-01-19 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.931000','2024-11-17 10:21:48.931000'),('wh7h3b160qj','122342343432','Nguyễn Văn A','Nhân viên','0981793220','2027-12-24 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.977000','2024-11-17 10:21:48.977000'),('wjru0sl9nla','123123123244','Phạm Trần Anh','Nhân viên','0981793203','2024-01-19 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.152000','2024-11-17 15:15:12.152000'),('wr4dbpys1d','122342342333','Lê Xuân Trường','Quản lý','0981793210','2027-12-24 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.926000','2024-11-17 10:21:48.926000'),('x3a3i3dpzvi','123123134323','Lê Xuân Trường','Quản lý','0981793219','2027-01-19 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.726000','2024-11-17 15:14:02.726000'),('xdrl0970vk','123123122343','Phạm Trần Anh','Nhân viên','0981793218','2026-12-24 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.721000','2024-11-17 15:14:02.721000'),('ybvttem219','123123123133','Lê Xuân Trường','Quản lý','0981793216','2025-12-24 00:00:00','6ykg4vk1am','2024-11-17 15:14:02.713000','2024-11-17 15:14:02.713000'),('ybzsckvxo4','123123122343','Phạm Trần Anh','Nhân viên','0981793218','2026-12-24 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.693000','2024-11-17 16:02:11.693000'),('yp6hyyka0hq','123442343123','Nguyễn Văn A','Nhân viên','0981793208','2026-12-24 00:00:00','zorw40mxhsh','2024-11-17 10:21:48.916000','2024-11-17 10:21:48.916000'),('ytvva3p5p9','123123423244','Phạm Trần Anh','Nhân viên','0981793209','2027-01-19 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.168000','2024-11-17 15:15:12.168000'),('zklhamfr8al','122342342333','Lê Xuân Trường','Quản lý','0981793210','2027-12-24 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.656000','2024-11-17 16:02:11.656000'),('zmpjketwq7l','123123123123','Lê Xuân Trường','Quản lý','0981793201','2023-01-19 00:00:00','8jdwxbjdq','2024-11-17 15:15:12.137000','2024-11-17 15:15:12.137000'),('zoubwitmaco','123123123244','Phạm Trần Anh','Nhân viên','0981793203','2024-01-19 00:00:00','8rbwb13tzly','2024-11-17 16:02:11.635000','2024-11-17 16:02:11.635000');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `license_types`
--

DROP TABLE IF EXISTS `license_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `license_types` (
  `id` varchar(12) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_mandatory` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `license_types`
--

LOCK TABLES `license_types` WRITE;
/*!40000 ALTER TABLE `license_types` DISABLE KEYS */;
INSERT INTO `license_types` VALUES ('102318673847','Giấy phép kinh doanh',1,'2024-11-16 14:29:50.962649','2024-11-16 14:29:50.962649'),('102318673848','Giấy phép ANTT',1,'2024-11-16 14:29:50.970450','2024-11-16 14:29:50.970450'),('102318673849','Giấy phép PCCC',1,'2024-11-16 14:29:50.971854','2024-11-16 14:29:50.971854'),('102318673850','Giấy phép vệ sinh thực phẩm',0,'2024-11-16 14:29:50.973271','2024-11-16 14:29:50.973271'),('102318673851','Giấy phép cung cấp dịch vụ số',0,'2024-11-16 14:29:50.974772','2024-11-16 14:29:50.974772'),('102318673852','Giấy phép kinh doanh vận tải',0,'2024-11-16 14:29:50.975798','2024-11-16 14:29:50.975798'),('102318673853','Giấy phép kinh doanh du lịch lữ hành',0,'2024-11-16 14:29:50.976896','2024-11-16 14:29:50.976896');
/*!40000 ALTER TABLE `license_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persons`
--

DROP TABLE IF EXISTS `persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persons` (
  `id` varchar(12) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `nationality` varchar(255) NOT NULL,
  `religion` varchar(255) NOT NULL,
  `type_of_certificate` varchar(255) NOT NULL,
  `issued_by` varchar(255) NOT NULL,
  `issued_date` date NOT NULL,
  `hometown` varchar(255) NOT NULL,
  `current_address` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_ce37ef639d9c9f7b710b2e28b2` (`citizen_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persons`
--

LOCK TABLES `persons` WRITE;
/*!40000 ALTER TABLE `persons` DISABLE KEYS */;
INSERT INTO `persons` VALUES ('0155fpsqk35h','215595843','Cao Thị Trà My','1991-03-22','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2006-10-31','38 Chương Dương, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','38 Chương Dương, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:19.095445','2024-11-16 14:30:19.095445'),('309eqin6gtf','213827403','Hoàng Ngọc Linh','1996-03-22','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2000-08-21','33 Nguyễn Thị Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','33 Nguyễn Thị Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:34.005415','2024-11-16 16:38:45.000000'),('3v6a7sa9vcd','214444788','Nguyễn Bích Vân','1989-03-20','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2006-10-01','12 Trần Văn Ơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','12 Trần Văn Ơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:28.713744','2024-11-16 14:30:28.713744'),('3y8pg53o12i','213703926','Vũ Thị Lan','1991-03-20','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2009-10-31','99b Cần Vương, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','99b Cần Vương, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:34.995932','2024-11-16 14:30:34.995932'),('40fl1pgmqgy','215185650','Phan Thị trà My','1987-03-20','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2004-10-01','61A Ngô Gia Tự, Nguyễn Văn Cừ, thành phố, Bình Định 55000, Việt Nam','61A Ngô Gia Tự, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:22.997243','2024-11-16 14:30:22.997243'),('50ged2v2t3x','214815219','Nguyễn Thu Trúc','1988-03-20','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2005-10-01','30 Trần Anh Tông, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','30 Trần Anh Tông, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:25.978529','2024-11-16 14:30:25.978529'),('5l5b0jhlnuv','215598634','Nguyễn Văn An','1986-03-20','Nam','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2003-10-01','124 Nguyễn Thị Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','124 Nguyễn Thị Định,Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:19.714307','2024-11-16 14:30:19.714307'),('5vb2bd9nbff','215184250','Nguyễn Cao Vân','1992-03-22','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2007-10-31','1H1 Nguyễn Thị Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','1H1 Nguyễn Thị Định,Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:22.149152','2024-11-16 14:30:22.149152'),('65tojz5y0c','52393439460','Phạm Quang Huy','2004-07-16','Nam','Việt Nam','Kinh','Căn cước công dân','Công an tỉnh Bình Định','2008-10-01','386 Nguyễn Thị Minh Khai, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','386 Nguyễn Thị Minh Khai, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:41.696512','2024-11-16 14:30:41.696512'),('72wea3bburv','215062173','Nguyễn Xuân Phúc','1998-07-16','Nam','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','1999-08-21','09 Trương Văn Của, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','09 Trương Văn Của, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:24.029109','2024-11-16 14:30:24.029109'),('788v093fftm','52298463205','Lê Thảo Nhi','1993-03-20','Nữ','Việt Nam','Kinh','Căn cước công dân','Công an tỉnh Bình Định','2011-10-31','360 Nguyễn Thị Minh Khai, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','360 Nguyễn Thị Minh Khai, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:40.711356','2024-11-16 14:30:40.711356'),('7ibkj6cc8cl','214321311','Trần Thị Mai','2000-07-16','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2001-08-21','03 Trần Văn Ơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','03 Trần Văn Ơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:29.731695','2024-11-16 14:30:29.731695'),('bpo6ei6yn67','52773344480','Đặng Thị Thanh','2000-03-22','Nữ','Việt Nam','Kinh','Căn cước công dân','Công an tỉnh Bình Định','2007-10-01','Đ. Trịnh Công Sơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','Đ. Trịnh Công Sơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:45.929372','2024-11-16 14:30:45.929372'),('brnhandkipd','213333495','Đỗ Khánh Hùng','1992-03-20','Nam','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2010-10-31','Q657+QWP, Trương Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','Q657+QWP, Trương Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:37.924928','2024-11-16 14:30:37.924928'),('bt7ht6xq8rv','522034869505','Trần Minh Khoa','1998-03-22','Nam','Việt Nam','Kinh','Căn cước công dân','Công an tỉnh Bình Định','2002-08-21','13 Thi Sách, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','13 Thi Sách, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:39.711461','2024-11-16 14:30:39.711461'),('ckpzkkwjylt','52583391970','Phan Gia Bảo','1994-03-20','Nam','Việt Nam','Kinh','Căn cước công dân','Công an tỉnh Bình Định','2001-08-21','01B Dã Tượng, 07 Trần Khánh Dư, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','01B Dã Tượng, 07 Trần Khánh Dư, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:43.712824','2024-11-16 14:30:43.712824'),('eg3xyf5ymo5','214938696','Vũ Thị Trà My','1993-03-22','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2008-10-31','86 Trần Khánh Dư, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','86 Trần Khánh Dư, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:24.997127','2024-11-16 14:30:24.997127'),('elk26rhsqaw','214691742','Cao Văn An','1999-07-16','Nam','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2000-08-21','71 Trần Anh Tông, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','71 Trần Anh Tông, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:26.688035','2024-11-16 14:30:26.688035'),('ftz40qovjds','214074357','Lê Anh Tuấn','1990-03-20','Nam','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2007-10-01','25 Võ Thị Yến, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','25 Võ Thị Yến, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:32.033206','2024-11-16 14:30:32.033206'),('hek5fr71nfl','213210018','Nguyễn Thị Kim Chi','2003-07-16','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2007-10-01','39/24 Ngô Mây, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','39/24 Ngô Mây, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:38.979427','2024-11-16 14:30:38.979427'),('k7bao93cjun','52203486950','Trần Minh Khoa','1998-03-22','Nam','Việt Nam','Kinh','Căn cước công dân','Công an tỉnh Bình Định','2002-08-21','13 Thi Sách, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','13 Thi Sách, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:39.726501','2024-11-16 14:30:39.726501'),('ou9x6meub0p','214197834','Phạm Thị Hương','1995-03-22','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2010-10-31','18/7 Trần Văn Ơn, Phường Nguyễn Văn cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','18/7 Trần Văn Ơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:30.695764','2024-11-20 20:48:49.000000'),('q9jml2wk5a','215598643','Lê Thị Bích','1997-07-16','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','1998-08-21','Lô 27 Nguyễn Thị Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','Lô 27 Nguyễn Thị Định, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:20.701244','2024-11-16 14:30:20.701244'),('qcgpfh1t2fr','214568265','Lê Khôi Nguyên','1994-03-22','Nam','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2009-10-31','03 Nguyễn Trung Tín, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','03 Nguyễn Trung Tín, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:28.015846','2024-11-16 14:30:28.015846'),('qhqgazahwc','213580449','Đặng Hữu Duy','2002-07-16','Nam','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2006-10-01','06/1 Nguyễn Phi Khanh, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','06/1 Nguyễn Phi Khanh,Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:35.976274','2024-11-16 14:30:35.976274'),('rg9zoxe6gqo','52678368225','Vũ Hồng Sơn','2005-07-16','Nữ','Việt Nam','Kinh','Căn cước công dân','Công an tỉnh Bình Định','2010-10-31','102 Tây Sơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','102 Tây Sơn, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:44.696137','2024-11-16 14:30:44.696137'),('ua9itvuz7vk','524884157158','Hoàng Thị Thu Hà','1999-03-22','Nữ','Việt Nam','Kinh','Căn cước công dân','Công an tỉnh Bình Định','2006-10-01','26 Lê Thành Phương, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','26 Lê Thành Phương, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:43.013265','2024-11-16 21:47:54.000000'),('vcbxuimgbo','213950880','Phan Minh Quang','2001-07-16','Nam','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2005-10-01','27 Lâm Văn Thạnh, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','27 Lâm Văn Thạnh, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:33.080682','2024-11-16 14:30:33.080682'),('vvm0z9h14lc','522984632056','Lê Thảo Nhi','1993-03-20','Nam','Việt Nam','Kinh','Căn cước công dân','Công an tỉnh Bình Định','2011-10-31','360 Nguyễn Thị Minh Khai, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','360 Nguyễn Thị Minh Khai, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:40.696722','2024-11-16 21:47:54.000000'),('vxdi6f0dsw','213456972','Bùi Thị Thảo','1997-03-22','Nữ','Việt Nam','Kinh','Chứng minh nhân dân','Công an tỉnh Bình Định','2001-08-21','10 Trần Quý Khoáng, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','10 Trần Quý Khoáng, Phường Nguyễn Văn Cừ, Thành Phố Quy Nhơn, Tỉnh Bình Định','2024-11-16 14:30:37.030244','2024-11-16 14:30:37.030244');
/*!40000 ALTER TABLE `persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_of_organizations`
--

DROP TABLE IF EXISTS `type_of_organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_of_organizations` (
  `id` varchar(12) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_of_organizations`
--

LOCK TABLES `type_of_organizations` WRITE;
/*!40000 ALTER TABLE `type_of_organizations` DISABLE KEYS */;
INSERT INTO `type_of_organizations` VALUES ('012345678901','Kinh doanh ngành, nghề có sử dụng vật liệu nổ công nghiệp và tiền chất thuốc nổ','2024-11-16 14:29:50.999736','2024-11-16 14:29:50.999736'),('123456789012','Kinh doanh súng bắn sơn','2024-11-16 14:29:50.993582','2024-11-16 14:29:50.993582'),('123456789013','Kinh doanh dịch vụ in','2024-11-16 14:29:51.002050','2024-11-16 14:29:51.002050'),('234567890123','Kinh doanh các loại pháo','2024-11-16 14:29:50.989241','2024-11-16 14:29:50.989241'),('234567890124','Kinh doanh casino','2024-11-16 14:29:50.995407','2024-11-16 14:29:50.995407'),('234567890125','Kinh doanh dịch vụ phẫu thuật thẩm mỹ','2024-11-16 14:29:51.003703','2024-11-16 14:29:51.003703'),('345678901234','Kinh doanh dịch vụ xoa bóp','2024-11-16 14:29:50.991099','2024-11-16 14:29:50.991099'),('345678901235','Kinh doanh khí','2024-11-16 14:29:50.997124','2024-11-16 14:29:50.997124'),('345678901236','Kinh doanh dịch vụ lưu trú','2024-11-16 14:29:51.005374','2024-11-16 14:29:51.005374'),('456789012345','Kinh doanh công cụ hỗ trợ','2024-11-16 14:29:50.988046','2024-11-16 14:29:50.988046'),('456789012346','Kinh doanh tiền chất thuốc nổ','2024-11-16 14:29:50.999038','2024-11-16 14:29:50.999038'),('567890123456','Kinh doanh dịch vụ bảo vệ','2024-11-16 14:29:50.992784','2024-11-16 14:29:50.992784'),('567890123457','Kinh doanh dịch vụ nổ mìn','2024-11-16 14:29:51.000791','2024-11-16 14:29:51.000791'),('678901234567','Kinh doanh trò chơi điện tử có thưởng dành cho người nước ngoài','2024-11-16 14:29:50.994393','2024-11-16 14:29:50.994393'),('678901234568','Kinh doanh các thiết bị gây nhiễu, phá sóng thông tin di động','2024-11-16 14:29:51.002941','2024-11-16 14:29:51.002941'),('783901245612','Sản xuất con dấu','2024-11-16 14:29:50.986676','2024-11-16 14:29:50.986676'),('789012345678','Kinh doanh dịch vụ đặt cược','2024-11-16 14:29:50.996292','2024-11-16 14:29:50.996292'),('789012345679','Kinh doanh dịch vụ karaoke, vũ trường','2024-11-16 14:29:51.004396','2024-11-16 14:29:51.004396'),('890123456789','Kinh doanh dịch vụ cầm đồ','2024-11-16 14:29:50.990189','2024-11-16 14:29:50.990189'),('901234567890','Kinh doanh thiết bị phát tín hiệu của xe được quyền ưu tiên','2024-11-16 14:29:50.991891','2024-11-16 14:29:50.991891'),('901234567891','Kinh doanh vật liệu nổ công nghiệp','2024-11-16 14:29:50.998213','2024-11-16 14:29:50.998213'),('901234567892','Kinh doanh quân trang, quân dụng cho lực lượng vũ trang, vũ khí quân dụng, trang thiết bị kỹ thuật, khí tài, phương tiện chuyên dùng cho quân sự, công an','2024-11-16 14:29:51.006127','2024-11-16 14:29:51.006127');
/*!40000 ALTER TABLE `type_of_organizations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-10 22:48:49
