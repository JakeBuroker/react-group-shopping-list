import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./App.css";

function App() {
  let [shoppingList, setShoppingList] = useState([]);
  // Function to get the creatures from the server/database
  const fetchItems = () => {
    axios
      .get("/api/list")
      .then((response) => {
        // The actual array comes from the data attribute on the response
        // Set data into component state
        setShoppingList(response.data);
      })
      .catch(function (error) {
        console.log("Error on get:", error);
      });
  };
  // Call function so it runs once on component load
  useEffect(() => {
    fetchItems();
  }, []);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(0);
  const [newItemUnit, setNewItemUnit] = useState("");
      // Function to add a new creature to the database
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("/api/list", {
        name: newItemName,
        quantity: newItemQuantity,
        unit: newItemUnit,
        markpurchased: false,
      })
      .then((response) => {
        fetchItems();
        //Clear Inputs & State
        setNewItemName("");
        setNewItemQuantity(0);
        setNewItemUnit("");
      })
      .catch(function (error) {
        console.log("Error on add:", error);
      });
  };
  //this function clears purchase status of items on the list that have been purchased but keeps item on the list
  const clearPurchaseStatus = () => {
    axios
      .put("/api/list")
      .then((response) => {
        fetchItems();
      })
      .catch((error) => {
        console.log("ERROR in PUT to reset list");
        console.log(error);
      });
  };
  // this function clears the entire shopping list
  const clearList = () => {
    axios
      .delete("/api/list")
      .then((response) => {
        setShoppingList([]);
      })
      .catch((error) => {
        console.log("Error in delete", error);
      });
  };
  const removeItem = (itemId) => {
    axios
      .delete(`/api/list/${itemId}`)
      .then((response) => {
        fetchItems(); // Re-fetch items to update the list
      })
      .catch((error) => {
        console.log("Error in delete", error);
      });
  };
  const markpurchased = (itemId) => {
    console.log(itemId);
    axios
      .put(`/api/list/${itemId}`, { markpurchased: true })
      .then((response) => {
        fetchItems(); // Re-fetch items to update the list
      })
      .catch((error) => {
        console.log("Error in PUT", error);
      });
  };
  return (
    <div>
      <Header />
      <h2>Add Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          onChange={(event) => setNewItemName(event.target.value)}
          value={newItemName}
        />
        <label>Quantity: </label>
        <input
          onChange={(event) => setNewItemQuantity(event.target.value)}
          value={newItemQuantity}
        />
        <label>Unit: </label>
        <input
          onChange={(event) => setNewItemUnit(event.target.value)}
          value={newItemUnit}
        />
        <button type="submit">Add new item</button>
      </form>
      <h2>Shopping List</h2>
      <button onClick={clearPurchaseStatus}>Reset</button>
      <button onClick={clearList}>Clear</button>
      <ul>
        {shoppingList.map((item) => (
          <li key={item.id}>
            {item.name} {item.quantity} {item.unit}
            <button
              onClick={() => markpurchased(item.id)}
              disabled={item.markpurchased}
            >
              Buy
            </button>
            <button
              onClick={() => removeItem(item.id)}
              disabled={item.markpurchased}
            >
              Remove
            </button>
            {item.markpurchased ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
