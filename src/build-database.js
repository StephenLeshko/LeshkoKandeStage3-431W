const sqlite3 = require('sqlite3').verbose()
const {colognes, retailers, customers, 
    locations, reviews, carriers, preferences } = require('./starter-data');

const db = new sqlite3.Database('./cologne.db', (err) =>{
    if(err){
        console.log(`Error opening database: ${err.message}`)
        process.exit(1)
    }
    console.log('Database connected successfully....')
})

const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const formatDate = (date) => {
    return date.toISOString().split('T')[0]
}


const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5)
}

const randomPhoneNumber = () => {
    return `${randomNum(100, 999)}-${randomNum(100, 999)}-${randomNum(1000, 9999)}`
}

//from Stage 2:
const schemaQueries = `
    CREATE TABLE IF NOT EXISTS Fragrances (
        fid INTEGER PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        brand VARCHAR(20) NOT NULL,
        scent_type VARCHAR(10),
        scent_desc VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        bottle_size DECIMAL(10, 1) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS Customers (
        cid INTEGER PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        phone VARCHAR(15),
        pref VARCHAR(100),
        money DECIMAL(10, 2) DEFAULT 0.00
    );
    CREATE TABLE IF NOT EXISTS Retailers (
        ret_id INTEGER PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        location VARCHAR(100)
    );
    CREATE TABLE IF NOT EXISTS Inventory (
        fid INTEGER NOT NULL,
        ret_id INTEGER NOT NULL,
        stock INTEGER DEFAULT 0,
        PRIMARY KEY (fid, ret_id),
        FOREIGN KEY (fid) REFERENCES Fragrances(fid) ON DELETE CASCADE,
        FOREIGN KEY (ret_id) REFERENCES Retailers(ret_id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS Promotions (
        pid INTEGER PRIMARY KEY,
        ret_id INTEGER NOT NULL,
        fid INTEGER NOT NULL,
        dscnt DECIMAL(5, 2) CHECK (dscnt >= 0 AND dscnt <= 100),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        FOREIGN KEY (fid) REFERENCES Fragrances(fid) ON DELETE CASCADE,
        FOREIGN KEY (ret_id) REFERENCES Retailers(ret_id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS Reviews (
        rev_id INTEGER PRIMARY KEY,
        cid INTEGER NOT NULL,
        fid INTEGER NOT NULL,
        rtng INTEGER CHECK (rtng BETWEEN 1 AND 5),
        rev_txt VARCHAR(100),
        date DATE NOT NULL,
        FOREIGN KEY (cid) REFERENCES Customers(cid) ON DELETE CASCADE,
        FOREIGN KEY (fid) REFERENCES Fragrances(fid) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS Orders (
        oid INTEGER PRIMARY KEY,
        ret_id INTEGER NOT NULL,
        cid INTEGER NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (cid) REFERENCES Customers(cid) ON DELETE CASCADE,
        FOREIGN KEY (ret_id) REFERENCES Retailers(ret_id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS Shipping (
        sid INTEGER PRIMARY KEY,
        oid INTEGER NOT NULL,
        carrier VARCHAR(50),
        curr_loc VARCHAR(50),
        est_del DATE,
        FOREIGN KEY (oid) REFERENCES Orders(oid) ON DELETE CASCADE
    );
`

const insertData = () => {
    for(const cologne of colognes){ //Fragrances (1)
        db.run(
            `INSERT INTO Fragrances (name, brand, scent_type, scent_desc, price, bottle_size) VALUES (?, ?, ?, ?, ?, ?)`,
            [cologne.name, cologne.brand, cologne.scent_type, cologne.scent_desc, randomNum(50, 300), randomNum(30, 100) / 10]
        )
    }

    for(const retailer of retailers){ //Retailers (2)
        db.run(`INSERT INTO Retailers (name, location) VALUES (?, ?)`, [retailer, shuffleArray(locations)[0]])
    }

    for(const customer of customers){ //Customers (3)
        db.run(
            `INSERT INTO Customers (name, email, phone, pref, money) VALUES (?, ?, ?, ?, ?)`,
            [customer.name, customer.email, randomPhoneNumber(), shuffleArray(preferences)[0], randomNum(0, 500)]
        )
    }
    
    db.all(`SELECT fid FROM Fragrances`, (err, fragranceIds) => { //Inventory (4)
        if(err){
            console.log(`Error fetching fragrances: ${err.message}`)
            return
        }
        db.all(`SELECT ret_id FROM Retailers`, (err, retailerIds) =>{
            if(err){
                console.log(`Error fetching retailers: ${err.message}`)
                return
            }

            for(const fid of fragranceIds.map(row => row.fid)){
                for(const ret_id of shuffleArray(retailerIds.map(row => row.ret_id)).slice(0, randomNum(2, 20))){
                    db.run(
                        `INSERT INTO Inventory (fid, ret_id, stock) VALUES (?, ?, ?)`,
                        [fid, ret_id, randomNum(2, 100)]
                    )
                }
            }
        })
    })

    
    db.all(`SELECT fid FROM Fragrances`, (err, fragranceIds) => { //Promotions (5)
        if(err){
            console.log(`Error fetching fragrances: ${err.message}`)
            return
        }
        db.all(`SELECT ret_id FROM Retailers`, (err, retailerIds) =>{
            if(err){
                console.log(`Error fetching retailers: ${err.message}`)
                return
            }

            for(let i = 0; i < 10; i++){
                const fid = fragranceIds[randomNum(0, fragranceIds.length - 1)].fid
                const ret_id = retailerIds[randomNum(0, retailerIds.length - 1)].ret_id
                const discount = randomNum(10, 50)
                const startDate = new Date()
                const endDate = new Date()
                endDate.setDate(startDate.getDate() + randomNum(7, 30))
                startDate.setDate(startDate.getDate() - randomNum(0, 365))

                db.run(
                    `INSERT INTO Promotions (ret_id, fid, dscnt, start_date, end_date) VALUES (?, ?, ?, ?, ?)`,
                    [ret_id, fid, discount, formatDate(startDate), formatDate(endDate)]
                )
            }
        })
    })

   
    db.all(`SELECT fid FROM Fragrances`, (err, fragranceIds) => {  //Reviews (6)
        if(err){
            console.log(`Error fetching fragrances: ${err.message}`)
            return
        }
        db.all(`SELECT cid FROM Customers`, (err, customerIds) => {
            if(err){
                console.log(`Error fetching customers: ${err.message}`)
                return
            }

            for(let i = 0; i < 40; i++) {
                const fid = fragranceIds[randomNum(0, fragranceIds.length - 1)].fid
                const cid = customerIds[randomNum(0, customerIds.length - 1)].cid
                const rating = randomNum(1, 5)
                const reviewText = reviews[randomNum(0, reviews.length - 1)]
                const reviewDate = new Date()
                reviewDate.setDate(reviewDate.getDate() - randomNum(0, 365))

                db.run(
                    `INSERT INTO Reviews (cid, fid, rtng, rev_txt, date) VALUES (?, ?, ?, ?, ?)`,
                    [cid, fid, rating, reviewText, formatDate(reviewDate)]
                )
            }
        })
    })
    db.all(`SELECT cid FROM Customers`, (err, customerIds) => { //Orders and Shipping (7,8)
        if(err){
            console.log(`Error fetching customers: ${err.message}`)
            return
        }
        db.all(`SELECT ret_id FROM Retailers`, (err, retailerIds) => {
            if(err){
                console.log(`Error fetching retailers: ${err.message}`)
                return
            }
            for(let i = 0; i < 80; i++){
                const cid = customerIds[randomNum(0, customerIds.length - 1)].cid
                const ret_id = retailerIds[randomNum(0, retailerIds.length - 1)].ret_id
                const orderDate = new Date()
                orderDate.setDate(orderDate.getDate() - randomNum(0, 365))
                const status = ["pending", "shipped", "completed"][randomNum(0, 2)]
                const total_amount = randomNum(50, 500)
                const carrier = carriers[randomNum(0, carriers.length - 1)]
                const currentLocation = `Warehouse ${randomNum(1, 22)}`
                const est_del = new Date()
                est_del.setDate(orderDate.getDate() + randomNum(4, 28))

                db.run(
                    `INSERT INTO Orders (ret_id, cid, date, status, total_amount) VALUES (?, ?, ?, ?, ?)`,
                    [ret_id, cid, formatDate(orderDate), status, total_amount],
                    function (err){
                        if(err){
                            console.log(`Error inserting order: ${err.message}`)
                            return
                        }

                        db.run(
                            `INSERT INTO Shipping (oid, carrier, curr_loc, est_del) VALUES (?, ?, ?, ?)`,
                            [this.lastID, carrier, currentLocation, formatDate(est_del)]
                        )
                    }
                )
            }
        })
    })
}


const setupDatabase = () => {
    db.exec(schemaQueries, (err) =>{
        if(err){
            console.log('Error making schema,', err.message)
            process.exit(1)
        }
        insertData()
        db.close()
    })
}
setupDatabase()
