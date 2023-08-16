DROP TABLE IF EXISTS card;
CREATE TABLE card
(
  id          VARCHAR(255) primary key,
  booster     boolean,
  color       VARCHAR(255) not null,
  cost        VARCHAR(255) not null,
  date        DATE not null,
  image_art   VARCHAR(255) not null,
  image_full  VARCHAR(255) not null,
  name        VARCHAR(255) not null,
  rarity      VARCHAR(255) not null,
  set         VARCHAR(255) not null,
  set_type    VARCHAR(255) not null,
  type        VARCHAR(255) not null
);
