DROP TABLE IF EXISTS card;
CREATE TABLE card
(
  id          text primary key,
  color        text not null,
  cost        text not null,
  image_art   text not null,
  image_full  text not null,
  name        text not null,
  rarity      text not null,
  set         text not null,
  set_type    text not null,
  type        text not null,
  year        integer not null
);
