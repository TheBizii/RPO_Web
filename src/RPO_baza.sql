DROP TABLE IF EXISTS `user_role`;
DROP TABLE IF EXISTS `used_coupons`;
DROP TABLE IF EXISTS `partner_location_goods`;
DROP TABLE IF EXISTS `partner_location`;
DROP TABLE IF EXISTS `partner`;
DROP TABLE IF EXISTS `ordered_goods`;
DROP TABLE IF EXISTS `order_state`;
DROP TABLE IF EXISTS `order`;
DROP TABLE IF EXISTS `goods_category`;
DROP TABLE IF EXISTS `customer_address`;
DROP TABLE IF EXISTS `coupon`;
DROP TABLE IF EXISTS `goods`;
DROP TABLE IF EXISTS `category`;
DROP TABLE IF EXISTS `address`;
DROP TABLE IF EXISTS `post`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `credentials`;
DROP TABLE IF EXISTS `state`;
DROP TABLE IF EXISTS `role`;
DROP TABLE IF EXISTS `currency`;
DROP TABLE IF EXISTS `country`;


CREATE TABLE `country`
(
 `ID`           integer NOT NULL AUTO_INCREMENT ,
 `name`         varchar(45) NOT NULL ,
 `calling_code` varchar(10) NOT NULL ,
 `alpha3_code`  char(3) NOT NULL ,
 `active`       tinyint NOT NULL ,

PRIMARY KEY (`ID`)
);

CREATE TABLE `currency`
(
 `ID`           integer NOT NULL AUTO_INCREMENT ,
 `name`         varchar(45) NOT NULL ,
 `symbol`       varchar(10) NOT NULL ,
 `abbreviation` varchar(5) NULL ,
 `active`       tinyint NOT NULL ,

PRIMARY KEY (`ID`)
);

CREATE TABLE `role`
(
 `ID`     integer NOT NULL AUTO_INCREMENT ,
 `type`   varchar(45) NOT NULL ,
 `active` tinyint NOT NULL ,

PRIMARY KEY (`ID`)
);

CREATE TABLE `state`
(
 `ID`     integer NOT NULL AUTO_INCREMENT ,
 `title`  varchar(45) NOT NULL ,
 `active` tinyint NOT NULL ,

PRIMARY KEY (`ID`)
);

CREATE TABLE `credentials`
(
 `ID`       integer NOT NULL AUTO_INCREMENT ,
 `username` varchar(255) NOT NULL ,
 `password` char(64) NOT NULL ,
 `salt`     char(32) NOT NULL ,
 `active`   tinyint NOT NULL ,

PRIMARY KEY (`ID`)
);

CREATE TABLE `user`
(
 `ID`             integer NOT NULL AUTO_INCREMENT ,
 `first_name`     varchar(45) NOT NULL ,
 `middle_name`    varchar(45) NULL ,
 `last_name`      varchar(45) NOT NULL ,
 `phone`          varchar(20) NOT NULL ,
 `credentials_id` integer NOT NULL ,
 `active`         tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `usr_ibfk_1` (`credentials_id`),
CONSTRAINT `usr_ibfk_1` FOREIGN KEY (`credentials_id`) REFERENCES `credentials`(`ID`)
);

CREATE TABLE `post`
(
 `ID`         integer NOT NULL AUTO_INCREMENT ,
 `city_name`  varchar(45) NOT NULL ,
 `country_id` integer NOT NULL ,
 `active`     tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_136` (`country_id`),
CONSTRAINT `FK_134` FOREIGN KEY `fkIdx_136` (`country_id`) REFERENCES `country` (`ID`)
);

CREATE TABLE `address`
(
 `address` varchar(45) NOT NULL ,
 `coordinate` POINT,
 `post_id` integer NOT NULL ,
 `ID`      integer NOT NULL AUTO_INCREMENT ,
 `active`     tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_147` (`post_id`),
CONSTRAINT `FK_145` FOREIGN KEY `fkIdx_147` (`post_id`) REFERENCES `post` (`ID`)
);

CREATE TABLE `category`
(
 `title`              varchar(45) NOT NULL ,
 `parent_category_id` integer ,
 `active`             tinyint NOT NULL DEFAULT 1 ,
 `image_url`	      text NOT NULL,
 `ID`                 integer NOT NULL AUTO_INCREMENT ,

PRIMARY KEY (`ID`),
KEY `fkIdx_200` (`parent_category_id`),
CONSTRAINT `FK_198` FOREIGN KEY `fkIdx_200` (`parent_category_id`) REFERENCES `category` (`ID`)
);

CREATE TABLE `goods`
(
 `ID`          integer NOT NULL AUTO_INCREMENT ,
 `name`        varchar(45) NOT NULL ,
 `currency_id` integer NOT NULL ,
 `price`       double NOT NULL ,
 `description` text NOT NULL,
 `image_url`   text NOT NULL,
 `active`      tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_250` (`currency_id`),
CONSTRAINT `FK_248` FOREIGN KEY `fkIdx_250` (`currency_id`) REFERENCES `currency` (`ID`)
);

CREATE TABLE `coupon`
(
 `ID`                   integer NOT NULL AUTO_INCREMENT ,
 `title`                varchar(45) NOT NULL ,
 `affected_category_id` integer NULL ,
 `affected_article_id`  integer NULL ,
 `description`          text NOT NULL ,
 `discount`             double unsigned NOT NULL ,
 `date_added`           datetime NOT NULL ,
 `date_expiration`      datetime NOT NULL ,
 `affects_shipping`     tinyint NOT NULL ,
 `code`                 varchar(10) NOT NULL ,
 `active`               tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_334` (`affected_article_id`),
CONSTRAINT `FK_332` FOREIGN KEY `fkIdx_334` (`affected_article_id`) REFERENCES `goods` (`ID`),
KEY `fkIdx_337` (`affected_category_id`),
CONSTRAINT `FK_335` FOREIGN KEY `fkIdx_337` (`affected_category_id`) REFERENCES `category` (`ID`)
);

CREATE TABLE `customer_address`
(
 `ID`         integer NOT NULL AUTO_INCREMENT ,
 `address_id` integer NOT NULL ,
 `user_id`    integer NOT NULL ,
 `active`     tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_162` (`address_id`),
CONSTRAINT `FK_160` FOREIGN KEY `fkIdx_162` (`address_id`) REFERENCES `address` (`ID`),
KEY `fkIdx_165` (`user_id`),
CONSTRAINT `FK_163` FOREIGN KEY `fkIdx_165` (`user_id`) REFERENCES `user` (`ID`)
);

CREATE TABLE `goods_category`
(
 `ID`          integer NOT NULL AUTO_INCREMENT ,
 `category_id` integer NOT NULL ,
 `goods_id`    integer NOT NULL ,
 `active`      tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_211` (`category_id`),
CONSTRAINT `FK_209` FOREIGN KEY `fkIdx_211` (`category_id`) REFERENCES `category` (`ID`),
KEY `fkIdx_214` (`goods_id`),
CONSTRAINT `FK_212` FOREIGN KEY `fkIdx_214` (`goods_id`) REFERENCES `goods` (`ID`)
);

CREATE TABLE `order`
(
 `ID`                        integer NOT NULL AUTO_INCREMENT ,
 `date`                      datetime NOT NULL ,
 `deliverer_id`              integer NOT NULL ,
 `customer_id`               integer NOT NULL ,
 `total_value`               double NOT NULL ,
 `total_discount_percentage` double NOT NULL ,
 `value_with_discount`       double NOT NULL ,
 `active`                    tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_285` (`customer_id`),
CONSTRAINT `FK_283` FOREIGN KEY `fkIdx_285` (`customer_id`) REFERENCES `user` (`ID`),
KEY `fkIdx_288` (`deliverer_id`),
CONSTRAINT `FK_286` FOREIGN KEY `fkIdx_288` (`deliverer_id`) REFERENCES `user` (`ID`)
);

CREATE TABLE `order_state`
(
 `ID`       integer NOT NULL AUTO_INCREMENT ,
 `order_id` integer NOT NULL ,
 `state_id` integer NOT NULL ,
 `date`     datetime NOT NULL ,
 `active`   tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_313` (`order_id`),
CONSTRAINT `FK_311` FOREIGN KEY `fkIdx_313` (`order_id`) REFERENCES `order` (`ID`),
KEY `fkIdx_316` (`state_id`),
CONSTRAINT `FK_314` FOREIGN KEY `fkIdx_316` (`state_id`) REFERENCES `state` (`ID`)
);

CREATE TABLE `ordered_goods`
(
 `ID`          integer NOT NULL AUTO_INCREMENT ,
 `goods_id`    integer NOT NULL ,
 `order_id`    integer NOT NULL ,
 `unit_price`  double NOT NULL ,
 `total_value` double NOT NULL ,
 `amount`      double NOT NULL ,
 `active`      tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_294` (`goods_id`),
CONSTRAINT `FK_292` FOREIGN KEY `fkIdx_294` (`goods_id`) REFERENCES `goods` (`ID`),
KEY `fkIdx_297` (`order_id`),
CONSTRAINT `FK_295` FOREIGN KEY `fkIdx_297` (`order_id`) REFERENCES `order` (`ID`)
);

CREATE TABLE `partner`
(
 `company_name`      varchar(45) NOT NULL ,
 `office_address_id` integer NOT NULL ,
 `iban`              varchar(40) NOT NULL ,
 `ID`                integer NOT NULL AUTO_INCREMENT ,
 `active`     tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_192` (`office_address_id`),
CONSTRAINT `FK_190` FOREIGN KEY `fkIdx_192` (`office_address_id`) REFERENCES `address` (`ID`)
);

CREATE TABLE `partner_location`
(
 `address_id` integer NOT NULL ,
 `partner_id` integer NOT NULL ,
 `title`      varchar(45) NOT NULL ,
 `ID`         integer NOT NULL AUTO_INCREMENT ,
 `active`     tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_186` (`address_id`),
CONSTRAINT `FK_184` FOREIGN KEY `fkIdx_186` (`address_id`) REFERENCES `address` (`ID`),
KEY `fkIdx_189` (`partner_id`),
CONSTRAINT `FK_187` FOREIGN KEY `fkIdx_189` (`partner_id`) REFERENCES `partner` (`ID`)
);

CREATE TABLE `partner_location_goods`
(
 `ID`                  integer NOT NULL AUTO_INCREMENT ,
 `goods_id`            integer NOT NULL ,
 `partner_location_id` integer NOT NULL ,
 `active`              tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_223` (`goods_id`),
CONSTRAINT `FK_221` FOREIGN KEY `fkIdx_223` (`goods_id`) REFERENCES `goods` (`ID`),
KEY `fkIdx_226` (`partner_location_id`),
CONSTRAINT `FK_224` FOREIGN KEY `fkIdx_226` (`partner_location_id`) REFERENCES `partner_location` (`ID`)
);

CREATE TABLE `used_coupons`
(
 `ID`        integer NOT NULL AUTO_INCREMENT ,
 `coupon_id` integer NOT NULL ,
 `order_id`  integer NOT NULL ,
 `active`    tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_346` (`coupon_id`),
CONSTRAINT `FK_344` FOREIGN KEY `fkIdx_346` (`coupon_id`) REFERENCES `coupon` (`ID`),
KEY `fkIdx_349` (`order_id`),
CONSTRAINT `FK_347` FOREIGN KEY `fkIdx_349` (`order_id`) REFERENCES `order` (`ID`)
);

CREATE TABLE `user_role`
(
 `ID`      integer NOT NULL AUTO_INCREMENT ,
 `role_id` integer NOT NULL ,
 `user_id` integer NOT NULL ,
 `active`  tinyint NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_268` (`role_id`),
CONSTRAINT `FK_266` FOREIGN KEY `fkIdx_268` (`role_id`) REFERENCES `role` (`ID`),
KEY `fkIdx_271` (`user_id`),
CONSTRAINT `FK_269` FOREIGN KEY `fkIdx_271` (`user_id`) REFERENCES `user` (`ID`)
);

INSERT INTO 
	country (name, calling_code, alpha3_code, active) 
VALUES 
	('Slovenia', '+386', 'SVN', 1),
	('Croatia', '+385', 'CRO', 1),
	('Italy', '+39', 'ITA', 1),
	('Hungary', '+36', 'HUN', 1),
	('Austria', '+43', 'AUT', 1),
	('Czech Republic', '+420', 'CZE', 1),
	('Poland', '+48', 'POL', 1),
	('Germany', '+49', 'DEU', 1),
	('Serbia', '+381', 'SRB', 1),
	('Switzerland', '+41', 'CHE', 1);

INSERT INTO
	currency (name, symbol, abbreviation, active)
VALUES
	('European euro', '€', 'EUR', 1),
	('Swiss franc', 'CHF', 'CHF', 1),
	('Croatian kuna', 'kn', 'HRK', 1),
	('Hungarian forint', 'Ft', 'HUF', 1),
	('Czech koruna', 'Kč', 'CZK', 1),
	('Polish złoty', 'zł', 'PLN', 1),
	('Serbian dinar', 'din', 'RSD', 1);

INSERT INTO
	role (type, active)
VALUES
	('customer', 1),
	('admin', 1),
	('store_owner', 1),
	('deliverer', 1);

INSERT INTO
	state (title, active)
VALUES
	('Ordered', 1),
	('Processing', 1),
	('In progress', 1),
	('Delivery', 1),
	('Finished', 1);
	
INSERT INTO
	credentials (username, password, salt, active)
VALUES
	('TheBizii', '9E22C29AD394F8476C2E33F7E83F0CA060B8A5AF130F1470457DB95C635EC445', 'R=g*AksavvrdN9xUoU?-NpofJ7-y@trE', 1),
	('VehoTim', 'D00D7CE634085C7D34BC991F230781C96A83440460DC69E3B8137FA0F537760D', '3ld@js/h@xWoF/v)Ek._?tpLnV.nkOqW', 1),
	('blueflamed', '5D84FFFDF4ED9293BF8CC19489D64F1712BF92B7635F400B317EFE8273A7B951', '80Tv51VW#B70EM!2d3Iz-BvPnIp8/6E)', 1),
	('profek10', 'D6D23BEA598530EEC0FF799FB3C909B6FAB1834BA9FE9540C081739B74287599', 'cZVAplgY.hw5@DY*#.hcak4u41b@Hg:@', 1),
	('judcal', '1D9FD63DBBC2A97D452117AA52CB55E492FB4E655AD316B37B6D7DC9F790BA5C', ')cvXbkn:yMzd*L2QI(3pWZ?Xg6BSXk@F', 1),
	('lorwan', '449A6CDFAF646905F855D699EF8392B6911256D6001FF399A51C529807719CA5', 'jOAQU5AhCtCQcbe9BrBp+51FlyqbY0yT', 1),
	('marbre', 'C18FB58E190617EE1F1270CBEBE7F1ADC9C4D4289D9A59E76302F5FAC40E49FC', 'yxVPux1fg)9mZG!nW4Nyp02v90EF/!:j', 1),
	('tatmer', 'FE2637571A525F13E9B33B36AE86FFEEE31D80456CE5D3AD61E0971A0E388FDF', '#=Pt-Qt*ff9aIsDn(H1Hd)R(cfdA:2Pr', 1);

INSERT INTO
	`user` (first_name, middle_name, last_name, phone, credentials_id, active)
VALUES
	('Tomaž', NULL, 'Bizjak', '+38664123456', 1, 1),
	('Tim', NULL, 'Vehovar', '+38664234567', 2, 1),
	('Marcel', NULL, 'Kumer', '+38664345678', 3, 1),
	('Aleksander', NULL, 'Grobelnik', '+38664456789', 4, 1),
	('Judita', 'Doris', 'Calvin', '+38664000000', 5, 1),
	('Lorena', NULL, 'Wang', '+38664111111', 6, 1),
	('Martin', NULL, 'Bret', '+38664222222', 7, 1),
	('Tatjana', 'Mertens', 'Clayton', '+38664333333', 8, 1);

INSERT INTO
	post (city_name, country_id, active)
VALUES
	('Maribor', 1, 1),
	('Zagreb', 2, 1),
	('Rome', 3, 1),
	('Budapest', 4, 1),
	('Vienna', 5, 1),
	('Prague', 6, 1),
	('Warsaw', 7, 1),
	('Berlin', 8, 1),
	('Belgrade', 9, 1),
	('Bern', 10, 1),
	('Ljubljana', 1, 1),
	('Hrastnik', 1, 1),
	('Celje', 1, 1);

INSERT INTO
	address (address, coordinate, post_id, active)
VALUES
	('Koreno 78', NULL, 1, 1),
	('Kolodvorska ulica 178', NULL, 1, 1),
	('Via Malpaga 2', NULL, 3, 1),
	('Spodnja Velka 22', NULL, 1, 1),
	('Cesta na Stolp 140', NULL, 1, 1),
	('Martinje 2', NULL, 1, 1),
	('Pot na Lavo 22', NULL, 1, 1),
	('Gosposvetska cesta 81', NULL, 1, 1),
	('Dunajska cesta 151', NULL, 11, 1),
	('Poštna ulica 10', NULL, 1, 1),
	('Loška ulica 10', NULL, 1, 1),
	('Ulica Pohorskega bataljona 14', NULL, 1, 1),
	('Tržaška cesta 6', NULL, 1, 1),
	('Pobreška cesta 18', NULL, 1, 1),
	('Ptujska cesta 106', NULL,1, 1),
	('Na polju 24', NULL, 1, 1),
	('Čopova ulica 14', NULL, 11, 1),
	('Log 10', NULL, 12, 1),
	('Petkovškovo nabrežje 65', NULL, 11, 1),
	('Cesta v mestni log 55', NULL, 11, 1),
	('Nazorjeva ulica 4', NULL, 11, 1),
	('Jamova cesta 105', NULL, 11, 1),
	('Ameriška ulica 2', NULL, 11, 1),
	('Prešernova ulica 10', NULL, 13, 1);


INSERT INTO
	category (title, parent_category_id, image_url, active)
VALUES
	('Mediterranean', NULL, 'https://imageproxy.wolt.com/wolt-frontpage-images/categories/64cb29c6-c5b0-11ea-8a94-b2000c51ab5c_a8461650_fb97_4a31_9684_9722055c5fd0.jpg-md', 1),
	('Burger', NULL, 'https://imageproxy.wolt.com/wolt-frontpage-images/categories/a69b5aea-c5a8-11ea-9f48-2e3b484a03e4_0b2c3eb5_ae95_4bff_9144_7f7c93ea74f9.jpg-md', 1),
	('Chinese', NULL, 'https://imageproxy.wolt.com/wolt-frontpage-images/categories/09920a1a-c5b1-11ea-a452-2e3b484a03e4_3dc37de6_e7cb_4536_b554_3a7dabe72122.jpg-md', 1),
	('Mexican', NULL, 'https://imageproxy.wolt.com/wolt-frontpage-images/categories/ddb4ea5c-c5b0-11ea-9f48-2e3b484a03e4_e801b938_c797_4e70_93eb_7290986080c9.jpg-md', 1),
	('Vietnamese', NULL, 'https://imageproxy.wolt.com/wolt-frontpage-images/categories/7d8f9c8e-c5b1-11ea-b203-822e244794a0_d415d803_b259_41d6_b30f_e63d6b2f0b56.jpg-md', 1),
	('Pizza', NULL, 'https://imageproxy.wolt.com/wolt-frontpage-images/categories/53129366-c5a8-11ea-8a78-822e244794a0_52b897cd_ac18_4cb5_9921_2653f1d38650.jpg-md', 1),
	('Zajtrk', NULL, 'https://imageproxy.wolt.com/menu/menu-images/5ed4af4dbaba8638b450efba/29738616-a4ae-11ea-8907-0a5864782015_patricks_pub_product_sps_002__1_.jpeg', 1);

INSERT INTO
	goods (name, currency_id, price, description, image_url, active)
VALUES
	('Big Tasty Bacon', 1, 6.60, 'Velik in sočen zrezek iz mlete govedine, tri rezine ementalca, paradižnik, solata, čebula, posebna omaka in za povrh, seveda, dve zapeljivi rezini hrustljavo popečene slanine. Veliko okusa, veliko užitka, veliko vsega! Ime vse pove.', 'https://imageproxy.wolt.com/menu/menu-images/5fd3235a8cc5674e3cf82168/33f9b70a-dde1-11eb-953f-3a8071bd38cf_tpo_si_2043.jpg', 1),
	('Big Mac', 1, 3.20, 'Prvega je sestavil Jim Delligatti leta 1967: dva zrezka iz 100-odstotne govedine, izvirna omaka, sveža zelena solata, sir, kisle kumarice, čebula in sezamov hlebček. Pol stoletja kasneje njegov recept za Big Mac™ ostaja ... takšen. In še vedno je povsem drugačen od konkurence, ki se mu preprosto ne more približati', 'https://imageproxy.wolt.com/menu/menu-images/5e0b4eac03b53ca07d3bc257/bd3161c6-518c-11eb-ac2d-a6f1e71dcb81_tpo_si_2040.jpg', 1),
	('McChicken', 1, 3.10, 'Panirani zrezek v priljubljenem McChicknu je iz mletega 100 % piščančjega mesa, obdanega z McChicken omako', 'https://imageproxy.wolt.com/menu/menu-images/5e0b4eac03b53ca07d3bc257/bd48311c-518c-11eb-ac2d-a6f1e71dcb81_tpo_si_2050.jpg', 1),
	('English Breakfast', 1, 7.60, 'Pečena slanina, jajce, klobasa, paradižnik, fižol, gobice in toast', 'https://imageproxy.wolt.com/menu/menu-images/5ed4af4dbaba8638b450efba/29738616-a4ae-11ea-8907-0a5864782015_patricks_pub_product_sps_002__1_.jpeg', 1),
	('Ham & Cheese toast', 1, 2.80, 'Toast s šunko in sirom, salsa rosa', 'https://imageproxy.wolt.com/menu/menu-images/5ed4af4dbaba8638b450efba/714d6722-a4ae-11ea-81ab-0a5864775f19_patricks_pub_product_sps_053.jpeg', 1),
	('Spomladanski zavitek z mesom', 1, 2.50, 'Spomladanski zavitek z mesom, Fortune piškotek', 'https://imageproxy.wolt.com/menu/menu-images/5fa282c0823682705373aa30/7a197dba-1e8d-11eb-baab-6612e6b94237_kitajskarestavracijazvezda_product_jurebanfi_037.jpeg', 1),
	('Zelenjavni zavitki', 1, 2.50, 'Zelenjavni zavitki, Fortune piškotek', 'https://imageproxy.wolt.com/menu/menu-images/5fa282c0823682705373aa30/aae66a16-1e8d-11eb-bcf3-1ed10b2330bd_kitajskarestavracijazvezda_product_jurebanfi_031.jpeg', 1),
	('Rakov čips', 1, 1.70, 'Dodatek: Fortune piškotek', 'https://imageproxy.wolt.com/menu/menu-images/5e242dde349fec6a89680853/bc0dbee8-b316-11eb-8baa-763359d6fed5_slika1dfvfdv.jpeg', 1),
	('Kislo-pekoča juha', 1, 2.20, 'Dodatek: Fortune piškotek', 'https://imageproxy.wolt.com/menu/menu-images/5e242dde349fec6a89680853/78abe430-b317-11eb-a769-c6521e96a1d8_slika1v_ydsv_s.jpeg', 1);

INSERT INTO
	coupon (title, affected_category_id, affected_article_id, description, discount, date_added, date_expiration, affects_shipping, code, active)
VALUES
	('Brezplačna poštnina', NULL, NULL, 'Brezplačna poštnina', 100.00, CURDATE(), '2022-12-31 23:59:59', 1, 'FREESHIP', 1);


INSERT INTO
	customer_address (address_id, user_id, active)
VALUES
	(1, 1, 1),
	(2, 2, 1),
	(3, 3, 1),
	(4, 4, 1),
	(5, 5, 1),
	(6, 6, 1),
	(7, 7, 1),
	(8, 8, 1);

INSERT INTO
	goods_category (category_id, goods_id, active)
VALUES
	(2, 1, 1),
	(2, 2, 1),
	(2, 3, 1),
	(7, 4, 1),
	(7, 5, 1),
	(3, 6, 1),
	(3, 7, 1),
	(3, 8, 1),
	(3, 9, 1);

INSERT INTO
	`order` (`date`, deliverer_id, customer_id, total_value, total_discount_percentage, value_with_discount, active)
VALUES
	(curdate(), 7, 1, 9.80, 0.0, 9.8, 1),
	(curdate(), 7, 3, 9.80, 0.0, 9.8, 1);

INSERT INTO
	order_state (order_id, state_id, `date`, active)
VALUES
	(1, 1, '2021-11-23 13:05:13', 1),
	(1, 2, '2021-11-23 13:05:16', 1),
	(1, 3, '2021-11-23 13:05:55', 1),
	(1, 4, '2021-11-23 13:20:13', 1),
	(1, 5, '2021-11-23 13:25:42', 1),
	(2, 1, '2021-11-24 15:23:47', 1),
	(2, 2, '2021-11-24 15:23:50', 1),
	(2, 3, '2021-11-24 15:24:10', 1);

INSERT INTO
	ordered_goods (goods_id, order_id, unit_price, total_value, amount, active)
VALUES
	(1, 1, 6.6, 6.6, 1, 1),
	(2, 1, 3.2, 3.2, 1, 1),
	(4, 2, 7.6, 7.6, 1, 1),
	(9, 2, 2.2, 2.2, 1, 1);

INSERT INTO
	partner (company_name, office_address_id, iban, active)
VALUES
	('ALPE-PANON d.o.o.', 9, 'SI56031001003426009', 1),
	('Patrick\'s Pub', 10, 'SI56031001003426010', 1),
	('Kitajska Restavracija Zvezda', 11, 'SI56031001003426011', 1),
	('Kitajska Restavracija Zlata Srna', 12, 'SI56031001003426012', 1),
	('JEJ, storitve, d.o.o.', 18, 'SI56610000018118880', 1),
	('PALTA d.o.o.', 20, 'SI56031601001033086', 1);

INSERT INTO
	partner_location (address_id, partner_id, title, active)
VALUES
	(13, 1, 'McDonald\'s Swaty', 1),
	(10, 2, 'Patrick\'s Pub', 1),
	(11, 3, 'Kitajska Restavracija Zvezda', 1),
	(12, 4, 'Kitajska Restavracija Zlata Srna', 1),
	(14, 1, 'McDonald\'s Europark', 1),
	(15, 1, 'McDonald\'s Ptujska', 1),
	(16, 1, 'McDonald\'s Petrol', 1),
	(17, 1, 'McDonald\'s Čopova', 1),
	(19, 5, 'Slovenian Dinner Experience', 1),
	(21, 6, 'Hood Burger Center', 1),
	(22, 6, 'Hood Burger Vič', 1),
	(23, 6, 'Hood Burger BTC', 1),
	(24, 6, 'Hood Burger Celje', 1);

INSERT INTO
	partner_location_goods (goods_id, partner_location_id, active)
VALUES
	(1, 1, 1),
	(2, 1, 1),
	(3, 1, 1),
	(4, 2, 1),
	(5, 2, 1),
	(6, 3, 1),
	(7, 3, 1),
	(8, 4, 1),
	(9, 4, 1);

INSERT INTO
	user_role (role_id, user_id, active)
VALUES
	(2, 1, 1),
	(2, 2, 1),
	(2, 3, 1),
	(2, 4, 1),
	(1, 5, 1),
	(1, 6, 1),
	(4, 7, 1),
	(1, 7, 1),
	(3, 8, 1),
	(1, 8, 1);
