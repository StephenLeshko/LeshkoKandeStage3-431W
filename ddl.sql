--Fragrances Table
CREATE TABLE Fragrances (
    fid INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    brand VARCHAR(20) NOT NULL,
    scent_type VARCHAR(10),
    scent_desc VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    bottle_size DECIMAL(10, 1) NOT NULL
);

--Customers Table
CREATE TABLE Customers (
    cid INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(15),
    pref VARCHAR(100),
    money DECIMAL(10, 2) DEFAULT 0.00
);

--Retailers Table
CREATE TABLE Retailers (
    ret_id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(100)
);

--Inventory Table
CREATE TABLE Inventory (
    fid INTEGER NOT NULL,
    ret_id INTEGER NOT NULL,
    stock INTEGER DEFAULT 0,
    PRIMARY KEY (fid, ret_id),
    FOREIGN KEY (fid) REFERENCES Fragrances(fid) ON DELETE CASCADE ON UPDATE RESTRICT,
    FOREIGN KEY (ret_id) REFERENCES Retailers(ret_id) ON DELETE CASCADE ON UPDATE RESTRICT
);

--Promotions Table
CREATE TABLE Promotions (
    pid INTEGER PRIMARY KEY,
    ret_id INTEGER NOT NULL,
    fid INTEGER NOT NULL,
    dscnt DECIMAL(5, 2) CHECK (dscnt >= 0 AND dscnt <= 100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (fid) REFERENCES Fragrances(fid) ON DELETE CASCADE ON UPDATE RESTRICT,
    FOREIGN KEY (ret_id) REFERENCES Retailers(ret_id) ON DELETE CASCADE ON UPDATE RESTRICT
);

--Reviews Table
CREATE TABLE Reviews (
    rev_id INTEGER PRIMARY KEY,
    cid INTEGER NOT NULL,
    fid INTEGER NOT NULL,
    rtng INTEGER CHECK (rtng BETWEEN 1 AND 5),
    rev_txt VARCHAR(100),
    date DATE NOT NULL,
    FOREIGN KEY (cid) REFERENCES Customers(cid) ON DELETE CASCADE ON UPDATE RESTRICT,
    FOREIGN KEY (fid) REFERENCES Fragrances(fid) ON DELETE CASCADE ON UPDATE RESTRICT
);

--Orders Table
CREATE TABLE Orders (
    oid INTEGER PRIMARY KEY,
    ret_id INTEGER NOT NULL,
    cid INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cid) REFERENCES Customers(cid) ON DELETE CASCADE ON UPDATE RESTRICT,
    FOREIGN KEY (ret_id) REFERENCES Retailers(ret_id) ON DELETE CASCADE ON UPDATE RESTRICT
);

--Shipping Table
CREATE TABLE Shipping (
    sid INTEGER PRIMARY KEY,
    oid INTEGER NOT NULL,
    carrier VARCHAR(50),
    curr_loc VARCHAR(50),
    est_del DATE,
    FOREIGN KEY (oid) REFERENCES Orders(oid) ON DELETE CASCADE ON UPDATE RESTRICT
);