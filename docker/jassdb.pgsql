CREATE TABLE jassuser(
    ID SERIAL PRIMARY KEY,
    Name CHAR(100) NOT NULL UNIQUE
);

CREATE TABLE team(
    ID SERIAL PRIMARY KEY,
    Name CHAR(100) NOT NULL UNIQUE,
    CreatedBy INT NOT NULL references jassuser(ID)
);

CREATE TABLE trumpf(
    ID SERIAL PRIMARY KEY,
    Name CHAR(20) NOT NULL UNIQUE,
    Multiplier INT NOT NULL
);

CREATE TABLE game(
    ID SERIAL PRIMARY KEY,
    Team1 INT NOT NULL references team(ID),
    Team2 INT NOT NULL references team(ID),
    IsFinished boolean,
    CreatedBy INT NOT NULL references jassuser(ID)
);

CREATE TABLE round(
    ID SERIAL PRIMARY KEY,
    Game INT NOT NULL references game(ID),
    Trumpf INT NOT NULL references trumpf(ID)
);

CREATE TABLE pointsPerTeamPerRound(
    ID SERIAL PRIMARY KEY,
    WiisPoints INT NOT NULL,
    Points INT NOT NULL CHECK(Points < 258),
    Round INT NOT NULL references round(ID),
    Team INT NOT NULL references team(ID)
);