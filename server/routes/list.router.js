const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
// Setup a GET route to get all the creatures from the database
router.get("/", (req, res) => {
  // When you fetch all things in these GET routes, strongly encourage ORDER BY
  // so that things always come back in a consistent order
  const sqlText = `SELECT * FROM list ORDER BY name asc`;
  pool
    .query(sqlText)
    .then((result) => {
      console.log(`Got stuff back from the database`, result);
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500); // Good server always responds
    });
});
router.post("/", (req, res) => {
  const newItem = req.body;
  const sqlText = `INSERT INTO "list" ( "name", "quantity", "unit", "markpurchased")
      VALUES ($1, $2, $3, $4);`;
  const queryParams = [
    newItem.name,
    newItem.quantity,
    newItem.unit,
    newItem.markpurchased,
  ];
  pool
    .query(sqlText, queryParams)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("ERROR in server POST route");
      console.log(error);
    });
});
router.put("/:id", (req, res) => {
  // get the ID
  let shoppingListId = req.params.id;
  let markpurchased = req.body.markpurchased;
  console.log("Shopping List ID:", req.body);
  console.log("item marked as purchased", markpurchased);
  // declare query text for UPDATE
  const queryText = `
    UPDATE "list" SET "markpurchased"= true WHERE "id" = $1;
    `;
  // declare queryParams for ID
  const queryParams = [shoppingListId];
  // send UPDATE to DB
  pool
    .query(queryText, queryParams)
    // then send ok status
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("error:", error);
    });
});
router.put("/", (req, res) => {
  // declare query text for UPDATE
  const queryText = `
      UPDATE "list" SET "markpurchased" = false`;
  // send UPDATE to DB
  pool
    .query(queryText)
    // then send ok status
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("error:", error);
    });
});
router.delete("/", (req, res) => {
  const queryText = `DELETE FROM "list"`;
  pool
    .query(queryText)
    .then(() => {
      console.log("Deleted");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error in DELETE query: ", queryText, error);
      res.sendStatus(500);
    });
});
router.delete("/:id", (req, res) => {
  let shoppingListId = req.params.id;
  const queryText = `DELETE FROM "list" WHERE "id"=$1`;
  const queryParams = [shoppingListId];
  pool
    .query(queryText, queryParams)
    .then(() => {
      console.log("Deleted");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error in DELETE query: ", queryText, error);
      res.sendStatus(500);
    });
});
module.exports = router;