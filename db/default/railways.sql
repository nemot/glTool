-- MySQL dump 10.13  Distrib 5.1.49, for debian-linux-gnu (i686)
--
-- Host: localhost    Database: gl2_development
-- ------------------------------------------------------
-- Server version	5.1.49-1ubuntu8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `railways`
--

DROP TABLE IF EXISTS `railways`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `railways` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_id` int(11) NOT NULL DEFAULT '0',
  `code` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `short_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `railways`
--

LOCK TABLES `railways` WRITE;
/*!40000 ALTER TABLE `railways` DISABLE KEYS */;
INSERT INTO `railways` VALUES (1,12,'55','АЗЕРБАЙДЖАНСКАЯ','АЗР'),(2,1,'71','АЛМА-АТИН','КЗХ'),(3,10,'56','АРМЯНСКАЯ','АРМ'),(4,11,'13','БЕЛОРУССКАЯ','БЕЛ'),(5,7,'92','ВОСТОЧНО-СИБИРСКАЯ','ВСБ'),(6,7,'24','ГОРЬКОВСКАЯ','ГОР'),(7,6,'57','ГРУЗИНСКАЯ','ГРЗ'),(8,7,'96','ДАЛЬНЕВОСТОЧНАЯ','ДВС'),(9,8,'48','ДОНЕЦКАЯ','ДОН'),(10,7,'94','ЗАБАЙКАЛЬСКАЯ','ЗАБ'),(11,1,'67','ЗАПАДНО-КАЗАХСТАНСКАЯ','КЗХ'),(12,7,'83','ЗАПАДНО-СИБИРСКАЯ','ЗСБ'),(13,1,'68','КАЗАХСТАНСКИЕ','КЗХ'),(14,7,'10','КАЛИНИНГРАДСКАЯ','КЛГ'),(15,7,'88','КРАСНОЯРСКАЯ','КРС'),(16,7,'63','КУЙБЫШЕВСКАЯ','КБШ'),(17,4,'70','КЫРГЫЗСКАЯ','КРГ'),(18,13,'09','ЛАТВИЙСКАЯ','ЛАТ'),(19,14,'12','ЛИТОВСКАЯ','ЛИТ'),(20,8,'35','ЛЬВОВСКАЯ','ЛЬВ'),(21,9,'39','МОЛДАВСКАЯ','МЛД'),(22,7,'17','МОСКОВСКАЯ','МСК'),(23,7,'100','МПС','МПС'),(24,8,'40','ОДЕССКАЯ','ОДС'),(25,7,'01','ОКТЯБРЬСКАЯ','ОКТ'),(26,7,'61','ПРИВОЛЖСКАЯ','ПРВ'),(27,7,'45','ПРИДНЕПРОВСКАЯ','ПДН'),(28,7,'99','САХАЛИНСКАЯ','САХ'),(29,7,'76','СВЕРДЛОВСКАЯ','СВР'),(30,7,'28','СЕВЕРНАЯ','СЕВ'),(31,7,'51','СЕВЕРО-КАВКАЗСКАЯ','СКВ'),(32,15,'74','ТАДЖИКСКАЯ','ТДЖ'),(33,2,'75','ТУРКМЕНСКАЯ','ТРК'),(34,3,'73','УЗБЕКСКИЕ','УЗБ'),(35,5,'08','ЭСТОНСКАЯ','ЭСТ'),(36,7,'58','ЮГО-ВОСТОЧНАЯ','ЮВС'),(37,8,'32','ЮГО-ЗАПАДНАЯ','ЮЗП'),(38,8,'43','ЮЖНАЯ','ЮЖН'),(39,7,'80','ЮЖНО-УРАЛЬСКАЯ','ЮУР');
/*!40000 ALTER TABLE `railways` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2011-11-23 12:25:06
