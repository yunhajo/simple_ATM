DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS transactions;

CREATE TABLE accounts (
    last_name      VARCHAR(100) NOT NULL,
    first_name     VARCHAR(100) NOT NULL,
    birthdate      DATE NOT NULL,
    card_number    CHAR(16) NOT NULL,
    pin_hash       VARCHAR(280) NOT NULL,
    salt           CHAR(8) NOT NULL,
    balance        INT NOT NULL DEFAULT 0,

    UNIQUE (card_number, pin_hash),
    PRIMARY KEY (card_number)
);

CREATE TABLE transactions (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    card_number     CHAR(16) NOT NULL,
    date            DATETIME NOT NULL,
    balance_before  INT NOT NULL,
    balance_after   INT NOT NULL,

    FOREIGN KEY (card_number) REFERENCES accounts(card_number)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);