-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2023 at 02:54 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `users`
--

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE `image` (
  `primary` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `imageType` int(11) NOT NULL,
  `project` int(11) NOT NULL,
  `positionInProject` int(11) NOT NULL,
  `imageUrl` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `image`
--

INSERT INTO `image` (`primary`, `id`, `imageType`, `project`, `positionInProject`, `imageUrl`) VALUES
(1, 1, 0, 0, 0, 'https://storage.googleapis.com/vernissage-2e8f8.appspot.com/1-0-0-0.png.png?GoogleAccessId=firebase-adminsdk-m5upu%40vernissage-2e8f8.iam.gserviceaccount.com&Expires=1742166000&Signature=Wl6u8m%2BYRatM1GSLBuJA%2BlalZCjGaMH1oI8OrBPCPQ4dSfsRpinZGqPMY9I9cqaXXKrPpbXdR7745Q0ughbgy6A8zQ%2FwR3WUGvTSNjcFr8RQ99JoQGW2GMZxdPAk0DSdvOsBkDM4FRkTK%2BqqNZVVKCUioKCY9iRsGE0ogHh%2BlHvhY2M8x47Ib2OqMdjchbzCKQ6XX42%2B6BB6VwUXeGawl8S6jMldI2qBmConcSqsZIb48sfdJWKqf8J2%2BHdHs43o9PQkD8EgDcLG3MCCLIGjLFaFQH3EPsde7O89XhcSlwOD604Yh3ZETsNEJL3MTncf%2BvYrpgTu1fEgYA5r%2BNwVYA%3D%3D'),
(2, 1, 2, 1, 0, 'https://storage.googleapis.com/vernissage-2e8f8.appspot.com/1-2-1-0.png.png?GoogleAccessId=firebase-adminsdk-m5upu%40vernissage-2e8f8.iam.gserviceaccount.com&Expires=1742166000&Signature=1P83wo4R9FOOk1ABo6d9IU19yuVkPvHhEozN5kOGjKjea54XSQZapjBImYYute1AepuDgdlE6U%2FbXNLe06QoOV1zPXljLFbRRirZAV3iO83VmdVoNAEeGWfzZNYW2OkBMrLtBcx20A96Vt2m7OT2LwnL6UAn1G0KZK2cevjALWvCijrmbFOJ5PuxyvIR3EeTXPNLa93ZI%2FmFkoRW7P2Ik9pYG%2BpbUkMWLknUiGelO3AeQ6xe7Ktpq6IRgI59BuT46h11%2Bwm4FCcQvfjFTUgFZ6ujcm0YzFz7dB5hKPzwWLZxsz05bRMyxYJPae1GQUBqT9hVu6agoGhGomQI3yce1Q%3D%3D'),
(3, 1, 2, 1, 1, 'https://storage.googleapis.com/vernissage-2e8f8.appspot.com/1-2-1-1.png.png?GoogleAccessId=firebase-adminsdk-m5upu%40vernissage-2e8f8.iam.gserviceaccount.com&Expires=1742166000&Signature=v7cN%2FPNOTe9kfYICeq9JZMiX3Umzxr0E3UH4OyOtzREE2jVAGiAHrrmTJQR5cO7O1vrdls4iOQz%2Bvxa81cIyByLXuJio5DLI8QacS0e0zTa%2BewkxFgT3P3pSwEMxVVmJa2J3bapCNTiQXwvqFTiceM%2FdGYyTPV7WfOzCgna9vo2OP81tmFJVnSIJRmc63F5m4bge4br%2FNlpo1yNQhuaGwe39AxdWniSabz%2ByLKhgY8htobu0BL7j%2B40zokcDghPP5COycdbqVLnMqoEvs9lnrSS6o8bpKdCr0WSm8K0sTlepjynnAT07TRKI2pAJ2N2COWsPD%2FdrKDF1NVyF4xQg8A%3D%3D'),
(4, 1, 2, 1, 2, 'https://storage.googleapis.com/vernissage-2e8f8.appspot.com/1-2-1-2.png.png?GoogleAccessId=firebase-adminsdk-m5upu%40vernissage-2e8f8.iam.gserviceaccount.com&Expires=1742166000&Signature=JK%2F02%2B0mUo0pSf8nPzv0OrhPXbiCn4515BUqO5URL7fVCbBC%2BFYnSmTCAd9KKnBDGktgAFHXch1jJE5L97K009Jpy7p91AKT65RiXuU7j%2FDRJivesrnC9PnFfNoLhJaH%2BA9mL7SwyxFp9T4pFw21SSO2oBm4PS3ESOwpE9irx9YpkQp2H2jqpqEfXciyHwFcHzoiyOuBhZ1dgOHx3RnjUwi123WjKcrC%2BbnkMZ%2Fa5Yu8rSjcOxeW%2F8sBUnHt7x46IhXAwRg0OqdjTjRsPu1njWVmbmXBnCfsck9QTlKjxStFBm2%2BggYU2eceIi7HiEapF3673QTI9M9AHDsQvX0b9w%3D%3D'),
(5, 1, 2, 1, 3, 'https://storage.googleapis.com/vernissage-2e8f8.appspot.com/1-2-1-3.png.png?GoogleAccessId=firebase-adminsdk-m5upu%40vernissage-2e8f8.iam.gserviceaccount.com&Expires=1742166000&Signature=ltElWDAGpjnIulZO5uxOO%2F8xSb4kbXDIW93KCLM2mZm3%2FMoTvlOe9U2dLtJgS2AdTWAp%2BUel0SZvfun0hHPyD5kHZIVZjeegqqzGep56eqmXDCyCrLVtLN6tAikreYCz4%2BH0JPV8crgD7qAmSHtw2P0xNhGKllyW%2F7SYY%2BFaDQVdLu6ePwq4eVSxhfhtJEhqNugITJewQdSTIVyD8%2BoTkJJyAc8R2slhugOK9t%2F8RfbBtSYdtYDwz6Fr5kDEMmf0aq20ZoLmm8wFtngPNYNx178U%2FiGE4j62hosCBlv4Ye6vz2kIjISllR3Rj6Fy5K6uGtM3F0DgvlymiotdzPRabQ%3D%3D'),
(6, 1, 1, 1, 0, 'https://storage.googleapis.com/vernissage-2e8f8.appspot.com/1-1-1-0.14.png.png?GoogleAccessId=firebase-adminsdk-m5upu%40vernissage-2e8f8.iam.gserviceaccount.com&Expires=1742166000&Signature=PlTI3UfbuaFXR8SEnXnxiqOLFY6E64q%2B1Uu8NGhhhpQadtlhXm8LWvZVwTrdhDLRKn2SYiRn9ImjVWbaFe9PfagRyI3amODM4%2BZeHEIQI8lyQmu9DtM5U7%2BBrUI3W1Y69JQQepdSZ69mRZUiu3M6f%2Bez1AFOgrC5VT6hA2fqM6DkcBKvDwh67r5H0ClkuSxnDVHccDIP7Ihm31nNHanBCsFpg8VtqldSeosK78SaoAgGsGsuLVcYr9NZtTqxSrdBMwkl%2BtCVFrDDbWN%2BFLfadeEQisociXQfnT1%2ByJcQ4mrWoCVSBSsnebqFRQ1Fjnrh%2F8PIcnRwBcfTO3TxlGCTxA%3D%3D');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `projectId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `projectTitle` varchar(255) NOT NULL,
  `projectData` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`projectId`, `userId`, `projectTitle`, `projectData`) VALUES
(1, 1, 'Example project', '{\"descriptions\":[\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\",\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. \",\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. \",\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"],\"titles\":[\"Lorem ipsum\",\"Lorem ipsum\",\"Lorem ipsum\",\"Lorem ipsum\"]}');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `projectsCount` int(11) NOT NULL,
  `studies` varchar(255) NOT NULL,
  `occupation` varchar(255) NOT NULL,
  `workExperience` varchar(255) NOT NULL,
  `aboutMe` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `firstName`, `lastName`, `projectsCount`, `studies`, `occupation`, `workExperience`, `aboutMe`) VALUES
(1, 'email@example.com', '$2b$15$b1kIJXl3xwMTEz.f1UBWgu5vFCL7/RBQzu.2aGW5C170XyvnMM6vS', 'Example', 'John', 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor i');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`primary`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`projectId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `image`
--
ALTER TABLE `image`
  MODIFY `primary` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `projectId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
