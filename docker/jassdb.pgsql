CREATE TABLE jassuser(
    ID SERIAL PRIMARY KEY,
    Name TEXT NOT NULL UNIQUE
);

CREATE TABLE team(
    ID SERIAL PRIMARY KEY,
    Name TEXT NOT NULL UNIQUE,
    CreatedBy INT NOT NULL references jassuser(ID)
);

CREATE TABLE trumpf(
    ID SERIAL PRIMARY KEY,
    Name TEXT NOT NULL UNIQUE,
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

INSERT INTO trumpf(name, Multiplier) VALUES('Eicheln', 1);
INSERT INTO trumpf(name, Multiplier) VALUES('Rosen', 1);
INSERT INTO trumpf(name, Multiplier) VALUES('Schellen', 2);
INSERT INTO trumpf(name, Multiplier) VALUES('Schilten', 2);
INSERT INTO trumpf(name, Multiplier) VALUES('Oben', 3);
INSERT INTO trumpf(name, Multiplier) VALUES('Unten', 3);


INSERT INTO jassuser(name) VALUES('moe');