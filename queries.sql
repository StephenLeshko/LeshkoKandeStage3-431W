--1. Creating a New Fragrance (Inserting Data)
INSERT INTO Fragrances (fid, name, brand, scent_type, scent_desc, price, bottle_size)
VALUES (1, 'Sauvage', 'Dior', 'musk', 'A fresh and woody scent.', 99.99, 50.0);


--2. Remove all Fragrance Product from Inventory by Fragrance Name (Deleting Data)
DELETE FROM Inventory
WHERE fid = (SELECT fid FROM Fragrances WHERE name = 'Sauvage');


--3. Add Funds to Customer Account (Updating Data)
UPDATE Customers
SET money = money + 100.00
WHERE cid = 1;


--4. Add to Cologne Inventory (Inserting Data)
INSERT INTO Inventory (fid, ret_id, stock)
VALUES (1, 1, 50)
ON DUPLICATE KEY UPDATE stock = stock + 50;


--5. Update Fragrance Details (Updating Data)
UPDATE Fragrances
SET price = 105.00, scent_desc = 'A more intense woody scent.'
WHERE fid = 1;


--6. Generate Inventory Report, Sorted by Stock Levels (Analytical Report with Sorting)
SELECT f.brand, f.name, r.name AS retailer, i.stock
FROM Inventory i
JOIN Fragrances f ON i.fid = f.fid
JOIN Retailers r ON i.ret_id = r.ret_id
ORDER BY i.stock DESC;


--7. Process Order Transaction (Transaction with Rollback) (Joins 5 tables)
START TRANSACTION;

-- Step 1: Check stock availability
SELECT i.stock
FROM Inventory i
WHERE i.fid = 1 AND i.ret_id = 1
FOR UPDATE;

IF (stock < 1) THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Insufficient stock for this fragrance';
END IF;

-- Step 2: Calculate discounted price using Promotions
SELECT f.price * (1 - COALESCE(p.dscnt, 0) / 100) AS discounted_price
FROM Fragrances f
LEFT JOIN Promotions p 
  ON f.fid = p.fid 
  AND p.ret_id = 1
WHERE f.fid = 1;

-- Step 3: Check customer balance
SELECT c.money
FROM Customers c
WHERE c.cid = 1;

IF (money < discounted_price) THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Insufficient funds';
END IF;

-- Step 4: Deduct stock from Inventory
UPDATE Inventory
SET stock = stock - 1
WHERE fid = 1 AND ret_id = 1;

-- Step 5: Deduct customer funds
UPDATE Customers
SET money = money - discounted_price
WHERE cid = 1;

-- Step 6: Insert the order
INSERT INTO Orders (
    oid, ret_id, cid, fid, date, status, total_amount
) VALUES (
    101, 1, 1, 1, CURDATE(), 'Completed', discounted_price
);

-- everything is okay; do the commit.

END TRANSACTION;

--8. Check Order Status and Shipping Information (Querying Data)
SELECT o.status, s.carrier, s.curr_loc, s.est_del
FROM Orders o
LEFT JOIN Shipping s ON o.oid = s.oid
WHERE o.oid = 101;


--9. Review Fragrance (Inserting Data)
INSERT INTO Reviews (rev_id, cid, fid, rtng, rev_txt, date)
VALUES (1, 1, 1, 5, 'Amazing scent!', CURDATE());


--10. Lookup Reviews
SELECT c.name, f.brand, f.name AS fragrance, r.rtng, r.rev_txt, r.date
FROM Reviews r
JOIN Customers c ON r.cid = c.cid
JOIN Fragrances f ON r.fid = f.fid
WHERE f.brand = 'Dior' OR f.name = 'Sauvage' OR c.name = 'John Doe'
ORDER BY r.date DESC;


--11. Apply Promotion
INSERT INTO Promotions (pid, ret_id, fid, dscnt, start_date, end_date)
VALUES (1, 1, 1, 20.0, '2024-01-01', '2024-01-31');


--12. Sales Report (Joins 5 tables Query)
SELECT 
    o.oid AS OrderID,
    c.name AS CustomerName,
    r.name AS RetailerName,
    f.name AS FragranceName,
    f.brand AS Brand,
    p.dscnt AS DiscountPercentage,
    o.total_amount AS FinalAmount,
    o.date AS OrderDate
FROM Orders o
JOIN Customers c ON o.cid = c.cid
JOIN Retailers r ON o.ret_id = r.ret_id
JOIN Fragrances f ON o.oid = f.fid
LEFT JOIN Promotions p ON f.fid = p.fid AND p.ret_id = r.ret_id
WHERE o.date BETWEEN 'Start' AND 1-3 MONTH OF QUERY.


