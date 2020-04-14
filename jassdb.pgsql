CREATE DATABASE jass;

CREATE TABLE user(
    ID PRIMARY KEY INT NOT NULL,
    Name CHAR(100) NOT NULL UNIQUE
)

CREATE TABLE game(
    ID PRIMARY KEY INT NOT NULL,
    Team1 INT NOT NULL references team(ID),
    Team2 INT NOT NULL references team(ID),
    IsFinished boolean,
    CreatedBy INT NOT NULL references user(ID)
)

CREATE TABLE team(
    ID PRIMARY KEY INT NOT NULL,
    Name CHAR(100) NOT NULL UNIQUE,
    CreatedBy INT NOT NULL references user(ID)
)

CREATE TABLE round(
    ID PRIMARY KEY INT NOT NULL,
    Game INT NOT NULL references game(ID),
    Trumpf INT NOT NULL references trumpf(ID)
)

CREATE TABLE pointsPerTeamPerRound(
    ID PRIMARY KEY INT NOT NULL,
    WiisPoints INT NOT NULL,
    Points INT NOT NULL CHECK(Points < 258),
    Round INT NOT NULL references round(ID),
    Team INT NOT NULL references team(ID)
)

CREATE TABLE trumpf(
    ID PRIMARY KEY INT NOT NULL,
    Name CHAR(20) NOT NULL UNIQUE,
    Multiplier INT NOT NULL
)