const readline = require('readline')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./cologne.db')
const crypto = require('crypto')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '<LeshkoKandeStage3-431W> '
})

console.log('Welcome to The Cologne Database Management System\nType "help" to see available commands.')
rl.prompt()


const commands = {
    help: 'Displays this help menu.',
    'create-fragrance': 'Create a new fragrance. Format: create-fragrance <name> <brand> <scent_type> <scent_desc> <price> <bottle_size>',
    'delete-fragrance': 'Remove a fragrance from inventory. Format: delete-fragrance <fragrance_name>',
    'add-funds': 'Add funds to a customer account. Format: add-funds <customer_id> <amount>',
    'add-inventory': 'Add inventory for a fragrance. Format: add-inventory <fragrance_id> <retailer_id> <stock>',
    'update-fragrance': 'Update details of a fragrance. Format: update-fragrance <fragrance_id> <field> <new_value>',
    'inventory-report': 'Generate an inventory report sorted by stock.',
    'process-order': 'Process an order transaction. Format: process-order <customer_id> <fragrance_id> <retailer_id>',
    'order-status': 'Check the status of an order. Format: order-status <order_id>',
    'add-review': 'Review a fragrance. Format: add-review <customer_id> <fragrance_id> <rating> <review_text>',
    'lookup-reviews': 'Lookup reviews by brand, fragrance, or customer. Format: lookup-reviews <filter_type> <value>',
    'add-promotion': 'Add a promotion. Format: add-promotion <retailer_id> <fragrance_id> <discount> <start_date> <end_date>',
    'sales-report': 'Generate a sales report. Format: sales-report <start_date> <end_date>',
    stop: 'Stop the application.'
}


//Helpers
const generateId = () => {
    return crypto.randomUUID().split('-')[0]
}



function showHelp(){
    console.log('\nAvailable Commands:')
    for(const [command, description] of Object.entries(commands)){
        console.log(`-${command}: ${description}`)
    }
}


//MAIN FUNCTIONALITY
rl.on('line', async (line) => {
    const input = line.trim()
    const [command, ...args] = input.split(' ') //prolly need something that isn't this since I want somethings to be multiple lines

    switch(command.toLowerCase()){
        case 'help':
            showHelp()
            break;
        case 'create-fragrance':

            break;
        case 'delete-fragrance':
            break;
        case 'add-funds':
            break;
        case 'add-inventory':
            break;
        case 'update-fragrance':
            break;
        case 'inventory-report':
            break;
        case 'process-order':
            break;
        case 'order-status':
            break;
        case 'add-review':
            break;
        case 'lookup-reviews':
            break;
        case 'add-promotion':

            break;
        case 'sales-report':

            break;
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



//potentially put all of this code in a different file???
//1. Creating a New Fragrance (Inserting Data)
async function createFragrance(name, brand, scent_type, scent_desc, price, bottle_size){
}

//2. Remove all Fragrance Product from Inventory by Fragrance Name (Deleting Data)
async function deleteFragrance(fragrance_name){
}

//3. Add Funds to Customer Account (Updating Data)
async function addFunds(customer_id, amount){
}

//4. Add to Cologne Inventory (Inserting Data)
async function addInventory(fragrance_id, retailer_id, stock){

}

//5. Update Fragrance Details (Updating Data)
async function updateFragrance(fragrance_id, field, new_value){

}

//6. Generate Inventory Report, Sorted by Stock Levels (Analytical Report with Sorting)
async function generateInventoryReport(){

}

//7. Process Order Transaction (Transaction with Rollback) (Joins 5 tables)
async function processOrder(customer_id, fragrance_id, retailer_id){

}

//8. Check Order Status and Shipping Information (Querying Data)
async function checkOrderStatus(order_id){

}

//9. Review Fragrance (Inserting Data)
async function addReview(customer_id, fragrance_id, rating, review_text){

}

//10. Lookup Reviews
async function lookupReviews(filter_type, value){

}

//11. Apply Promotion
async function addPromotion(retailer_id, fragrance_id, discount, start_date, end_date){

}

//12. Sales Report (Joins 5 tables Query)
async function generateSalesReport(start_date, end_date){

}
