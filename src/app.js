const readline = require('readline')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./cologne.db', (err) => {
    if(err){
        console.log(`Error opening database: ${err.message}`)
        process.exit(1)
    }
    db.run('PRAGMA foreign_keys = ON', (err) => {
        if(err){
            console.log('Error enabling foreign key constraints:', err.message)
            process.exit(1)
        }
    })
})


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '<LeshkoKandeStage3-431W> '
})

console.log('Welcome to The Cologne Database Management System\nType "help" to see available commands.')
rl.prompt()


const commands = {
    help: 'Displays this help menu.',
    'create-fragrance': 'Add a new fragrance (name, brand, price, etc.).',
    'delete-fragrance': 'Remove a fragrance (by name).',
    'add-funds': 'Add funds to a customer (customer ID, amount).',
    'add-inventory': 'Update inventory (fragrance ID, retailer ID, stock).',
    'update-fragrance': 'Edit fragrance details (field, new value).',
    'inventory-report': 'View inventory report (sorted by stock).',
    'process-order': 'Process an order (customer ID, fragrance ID, retailer ID).',
    'order-status': 'Check order status (by order ID).',
    'add-review': 'Add a review (customer ID, fragrance ID, rating).',
    'lookup-reviews': 'Search for reviews (by brand, name, or customer).',
    'add-promotion': 'Add a promotion (retailer ID, fragrance ID, discount).',
    'sales-report': 'Generate a sales report (date range).',
    stop: 'Stop the application.'
}



function showHelp(){
    console.log('\nAvailable Commands:')
    for(const [command, description] of Object.entries(commands)){
        console.log(`-${command}: ${description}`)
    }
}

function isDateStr(dateStr) {
    const date = new Date(dateStr)
    return !isNaN(date.getTime()) && date.toISOString().startsWith(dateStr)
}


async function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim())
        })
    })
}

//MAIN FUNCTIONALITY
rl.on('line', async (line) => {
    const input = line.trim().toLowerCase()

    switch(input){
        case 'help':
            showHelp()
            break
        case 'create-fragrance':
            console.log('Creating a new fragrance...')
            const name = await promptUser('Enter fragrance name: ')
            const brand = await promptUser('Enter brand: ')
            const scentType = await promptUser('Enter scent type: ')
            const scentDesc = await promptUser('Enter scent description: ')
            const price = parseFloat(await promptUser('Enter price: '))
            const bottleSize = parseFloat(await promptUser('Enter bottle size: '))
            await createFragrance(name, brand, scentType, scentDesc, price, bottleSize)
            break
        case 'delete-fragrance':
            const fragranceName = await promptUser('Enter fragrance name to delete: ')
            await deleteFragrance(fragranceName)
            break
        case 'add-funds':
            const customerId = await promptUser('Enter customer ID: ')
            const amount = parseFloat(await promptUser('Enter amount to add: '))
            await addFunds(customerId, amount)
            break
        case 'add-inventory':
            const fragranceId = await promptUser('Enter fragrance ID: ')
            const retailerId = await promptUser('Enter retailer ID: ')
            const stock = parseInt(await promptUser('Enter stock quantity: '), 10)
            await addInventory(fragranceId, retailerId, stock)
            break
        case 'update-fragrance':
            const fragranceToUpdate = await promptUser('Enter fragrance ID to update: ')
            const field = await promptUser('Enter field to update (e.g., price, scent_desc): ')
            const newValue = await promptUser('Enter new value: ')
            await updateFragrance(fragranceToUpdate, field, newValue)
            break
        case 'inventory-report':
            await generateInventoryReport()
            break
        case 'process-order':
            const custId = await promptUser('Enter customer ID: ')
            const fragId = await promptUser('Enter fragrance ID: ')
            const retId = await promptUser('Enter retailer ID: ')
            await processOrder(custId, fragId, retId)
            break
        case 'order-status':
            const orderId = await promptUser('Enter order ID: ')
            await checkOrderStatus(orderId)
            break
        case 'add-review':
            const reviewCustId = await promptUser('Enter customer ID: ')
            const reviewFragId = await promptUser('Enter fragrance ID: ')
            const rating = parseInt(await promptUser('Enter rating (1-5): '), 10)
            const reviewText = await promptUser('Enter review text: ')
            await addReview(reviewCustId, reviewFragId, rating, reviewText)
            break
        case 'lookup-reviews':
            const filterType = await promptUser('Enter filter type (brand, name, customer): ')
            const value = await promptUser('Enter filter value: ')
            await lookupReviews(filterType, value)
            break
        case 'add-promotion':
            const promoRetailerId = await promptUser('Enter retailer ID: ')
            const promoFragId = await promptUser('Enter fragrance ID: ')
            const discount = parseFloat(await promptUser('Enter discount percentage: '))
            const promoStart = await promptUser('Enter promotion start date (YYYY-MM-DD): ')
            const promoEnd = await promptUser('Enter promotion end date (YYYY-MM-DD): ')
            await addPromotion(promoRetailerId, promoFragId, discount, promoStart, promoEnd)
            break
        case 'sales-report':
            const salesStart = await promptUser('Enter report start date (YYYY-MM-DD): ')
            const salesEnd = await promptUser('Enter report end date (YYYY-MM-DD): ')
            await generateSalesReport(salesStart, salesEnd)
            break
        case 'stop':
            console.log('Goodbye!')
            rl.close()
            return
        default:
            console.log('Unknown command. Type "help" to see available commands.')
    }
    rl.prompt()
})

rl.on('close', () => { //cleanup
    console.log('Cologne DBMS stopped.')
    process.exit(0)
})

//MAIN 12 FUNCTIONALITIES

//1. Creating a New Fragrance (Inserting Data)
async function createFragrance(name, brand, scent_type, scent_desc, price, bottle_size) {
    db.run(
        `INSERT INTO Fragrances (name, brand, scent_type, scent_desc, price, bottle_size) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [name, brand, scent_type, scent_desc, price, bottle_size],
        function(err){
            if(err){
                console.log('Error creating fragrance:', err.message)
                return
            }
            console.log(`Fragrance created successfully with ID: ${this.lastID}`)
        }
    )
}

//2. Remove all Fragrance Product from Inventory by Fragrance Name (Deleting Data)
async function deleteFragrance(fragrance_name){
    db.run(
        `DELETE FROM Inventory WHERE fid = (SELECT fid FROM Fragrances WHERE name = ?)`,
        [fragrance_name],
        function(err){
            if(err){
                console.log('Error deleting fragrance:', err.message)
                return
            }
            if(this.changes === 0){
                console.log(`Fragrance (${fragrance_name}) does not exist in inventory (no stock in any stores)`)
            }else{
                console.log(`Fragrance "${fragrance_name}" deleted from inventory.`)
            }
        }
    )    
}


//3. Add Funds to Customer Account (Updating Data)
async function addFunds(customer_id, amount){
    db.get(
        `SELECT cid FROM Customers WHERE cid = ?`,
        [customer_id],
        (err, row) => {
            if(err || !row){
                console.log('Error: Customer ID does not exist.')
                return
            }
            db.run(
                `UPDATE Customers SET money = money + ? WHERE cid = ?`,
                [amount, customer_id],
                function(err){
                    if(err){
                        console.log('Error adding funds to customer:', err.message)
                        return
                    }
                    console.log(`Added $${amount.toFixed(2)} to customer ID: ${customer_id}`)
                }
            )
        }
    )    
}

//4. Add to Cologne Inventory (Inserting Data)
async function addInventory(fragrance_id, retailer_id, stock){
    db.get(
        `SELECT fid FROM Fragrances WHERE fid = ?`,
        [fragrance_id],
        (err, row) => {
            if(err || !row){
                console.log('Error: Fragrance ID does not exist.')
                return
            }
            db.run(
                `INSERT INTO Inventory (fid, ret_id, stock) VALUES (?, ?, ?)
                ON CONFLICT(fid, ret_id) DO UPDATE SET stock = stock + excluded.stock`,
                [fragrance_id, retailer_id, stock],
                function(err){
                    if(err){
                        console.log('Error adding inventory:', err.message)
                        return
                    }
                    console.log(`Inventory updated for fragrance ID: ${fragrance_id}`)
                }
            )
        }
    )    
}

//5. Update Fragrance Details (Updating Data)
async function updateFragrance(fragrance_id, field, new_value){
    const validFields = ['name', 'brand', 'scent_type', 'scent_desc', 'price', 'bottle_size']
    if(!validFields.includes(field)){
        console.log('Invalid field specified for update.')
        return
    }

    const query = `UPDATE Fragrances SET ${field} = ? WHERE fid = ?`
    db.run(query, [new_value, fragrance_id], function(err){
        if(err){
            console.log('Error updating fragrance:', err.message)
            return
        }
        console.log(`Fragrance ID ${fragrance_id} updated: ${field} = ${new_value}`)
    })
}

//6. Generate Inventory Report, Sorted by Stock Levels (Analytical Report with Sorting)
async function generateInventoryReport(){
    db.all(
        `SELECT f.brand, f.name, r.name AS retailer, i.stock
        FROM Inventory i
        JOIN Fragrances f ON i.fid = f.fid
        JOIN Retailers r ON i.ret_id = r.ret_id
        ORDER BY i.stock DESC`,
        [],
        (err, rows) => {
            if(err){
                console.log('Error generating inventory report:', err.message)
                return
            }
            console.table(rows)
        }
    )
}

//7. Process Order Transaction (Transaction with Rollback) (Joins 5 tables)
async function processOrder(customer_id, fragrance_id, retailer_id) {

    db.serialize(() => {
        db.run('BEGIN TRANSACTION')
        
        db.get(
            `SELECT i.stock FROM Inventory i WHERE i.fid = ? AND i.ret_id = ?`,
            [fragrance_id, retailer_id],
            (err, row) => {
                if(err){
                    console.log('Error checking stock:', err.message)
                    db.run('ROLLBACK')
                    return
                }
                if(!row){
                    console.log(`No stock found for Fragrance ID: ${fragrance_id} at Retailer ID: ${retailer_id}`)
                    db.run('ROLLBACK')
                    return
                }
                if(row.stock < 1){
                    console.log('Error: Insufficient stock.')
                    db.run('ROLLBACK')
                    return
                }

                db.get(
                    `SELECT f.price AS base_price, 
                    COALESCE(MAX(p.dscnt), 0) AS max_discount 
                    FROM Fragrances f 
                    LEFT JOIN Promotions p 
                    ON f.fid = p.fid AND p.ret_id = ? 
                    WHERE f.fid = ? AND 
                    (p.start_date IS NULL OR DATE(p.start_date) <= DATE('now')) AND 
                    (p.end_date IS NULL OR DATE(p.end_date) >= DATE('now'))`,
                    [retailer_id, fragrance_id],
                    (err, priceRow) => {
                        if(err || !priceRow){
                            console.log('Error fetching discount information:', err.message)
                            db.run('ROLLBACK')
                            return
                        }
                        const basePrice = parseFloat(priceRow.base_price)
                        const maxDiscount = parseFloat(priceRow.max_discount)
                        const discountedPrice = basePrice * (1 - maxDiscount / 100)

                        db.get(
                            `SELECT money FROM Customers WHERE cid = ?`,
                            [customer_id],
                            (err, customer) => {
                                if(err){
                                    console.log('Error checking customer funds:', err.message)
                                    db.run('ROLLBACK')
                                    return
                                }
                                if(!customer){
                                    console.log(`Error: Customer ID ${customer_id} not found.`)
                                    db.run('ROLLBACK')
                                    return
                                }
                                console.log(`Customer money: $${customer.money}`)

                                if(customer.money < discountedPrice){
                                    console.log(`Error: Insufficient funds. Customer has $${customer.money}, but needs $${discountedPrice}`)
                                    db.run('ROLLBACK')
                                    return
                                }

                                db.run(
                                    `UPDATE Inventory SET stock = stock - 1 WHERE fid = ? AND ret_id = ?`,
                                    [fragrance_id, retailer_id],
                                    function(err){
                                        if(err){
                                            console.log('Error deducting stock:', err.message)
                                            db.run('ROLLBACK')
                                            return
                                        }
                                        console.log('Stock deducted successfully.')
                                    }
                                )

                                db.run(
                                    `UPDATE Customers SET money = money - ? WHERE cid = ?`,
                                    [discountedPrice, customer_id],
                                    function(err){
                                        if(err){
                                            console.log('Error deducting customer funds:', err.message)
                                            db.run('ROLLBACK')
                                            return
                                        }
                                        console.log('Customer funds deducted successfully.')
                                    }
                                )

                                // Step 6: Insert order
                                db.run(
                                    `INSERT INTO Orders (ret_id, cid, date, status, total_amount) 
                                    VALUES (?, ?, DATE('now'), 'Completed', ?)`,
                                    [retailer_id, customer_id, discountedPrice],
                                    function(err){
                                        if(err){
                                            console.log('Error inserting order:', err.message)
                                            db.run('ROLLBACK')
                                            return
                                        }
                                        console.log('Order inserted successfully with ID:', this.lastID)
                                        db.run('COMMIT')
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    })
}



//8. Check Order Status and Shipping Information (Querying Data)
async function checkOrderStatus(order_id){
    db.get(
        `SELECT o.status, s.carrier, s.curr_loc, s.est_del
        FROM Orders o
        LEFT JOIN Shipping s ON o.oid = s.oid
        WHERE o.oid = ?`,
        [order_id],
        (err, row) => {
            if(err || !row){
                console.log('Order not found:', err ? err.message : 'Invalid order ID')
                return
            }
            console.table(row)
        }
    )
}

//9. Review Fragrance (Inserting Data)
async function addReview(customer_id, fragrance_id, rating, review_text){
    db.run(
        `INSERT INTO Reviews (cid, fid, rtng, rev_txt, date) 
        VALUES (?, ?, ?, ?, DATE('now'))`,
        [customer_id, fragrance_id, rating, review_text],
        function(err){
            if(err){
                console.log('Error adding review:', err.message)
                return
            }
            console.log('Review added successfully.')
        }
    )
}

//10. Lookup Reviews
async function lookupReviews(filter_type, value){
    const lookupObj = {
        brand: `SELECT c.name, f.brand, f.name AS fragrance, r.rtng, r.rev_txt, r.date
            FROM Reviews r
            JOIN Customers c ON r.cid = c.cid
            JOIN Fragrances f ON r.fid = f.fid
            WHERE f.brand = ? ORDER BY r.date DESC`,
        name: `SELECT c.name, f.brand, f.name AS fragrance, r.rtng, r.rev_txt, r.date
            FROM Reviews r
            JOIN Customers c ON r.cid = c.cid
            JOIN Fragrances f ON r.fid = f.fid
            WHERE f.name = ? ORDER BY r.date DESC`,
        customer: `SELECT c.name, f.brand, f.name AS fragrance, r.rtng, r.rev_txt, r.date
            FROM Reviews r
            JOIN Customers c ON r.cid = c.cid
            JOIN Fragrances f ON r.fid = f.fid
            WHERE c.name = ? ORDER BY r.date DESC`
    }

    const query = lookupObj[filter_type]
    if(!query){
        console.log('Invalid filter type. Use "brand", "name", or "customer".')
        return
    }

    db.all(query, [value], (err, rows) => {
        if(err){
            console.log('Error looking up reviews:', err.message)
            return
        }
        console.table(rows)
    })
}

//11. Apply Promotion
async function addPromotion(retailer_id, fragrance_id, discount, start_date, end_date){
    if(!isDateStr(start_date) || !isDateStr(end_date)){
        console.log('Error: Dates must be in YYYY-MM-DD format and valid.')
        return
    }

    if(new Date(start_date) > new Date(end_date)) {
        console.log('Error: Start date must be before end date.')
        return
    }
    

    db.run(
        `INSERT INTO Promotions (ret_id, fid, dscnt, start_date, end_date) 
        VALUES (?, ?, ?, ?, ?)`,
        [retailer_id, fragrance_id, discount, start_date, end_date],
        function(err){
            if(err){
                console.log('Error adding promotion:', err.message)
                return
            }
            console.log('Promotion added successfully.')
        }
    )
}

//12. Sales Report (Joins 5 tables Query)
async function generateSalesReport(start_date, end_date) {
    if(!isDateStr(start_date) || !isDateStr(end_date)){
        console.log('Error: Dates must be in YYYY-MM-DD format and valid.')
        return
    }
    if(new Date(start_date) > new Date(end_date)) {
        console.log('Error: Start date must be before end date.')
        return
    }

    db.all(
        `SELECT o.oid AS OrderID, 
        c.name AS CustomerName, 
        r.name AS RetailerName, 
        f.name AS FragranceName, 
        f.brand AS Brand, 
        COALESCE(p.dscnt, 0) AS DiscountPercentage, 
        o.total_amount AS FinalAmount, 
        o.date AS OrderDate
        FROM Orders o
        JOIN Customers c ON o.cid = c.cid
        JOIN Retailers r ON o.ret_id = r.ret_id
        JOIN Fragrances f ON o.oid = f.fid
        LEFT JOIN Promotions p 
        ON f.fid = p.fid 
        AND p.ret_id = o.ret_id 
        AND p.start_date <= o.date 
        AND p.end_date >= o.date
        WHERE o.date BETWEEN ? AND ?
        ORDER BY o.date`,
        [start_date, end_date],
        (err, rows) => {
            if(err){
                console.log('Error generating sales report:', err.message)
                return
            }
            console.table(rows)
        }
    )
}
