import express from 'express';
import cors from 'cors';
import * as itemsController from './items';
import * as cartController from './cart';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/items', async (req, res) => {
  const items = await itemsController.getItems();
  res.json(items);
});

app.get('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const item = await itemsController.getItemById(id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

app.get('/cart', async (req, res) => {
  try {
    const cartItems = await cartController.getCartItems();
    res.json(cartItems);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server error');
  }
});

app.post('/items', async (req, res) => {
  try {
    const newItem = await itemsController.addItem(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server error');
  }
});

app.post('/cart', async (req, res) => {
  const { item_id, quantity } = req.body;
  try {
    await cartController.addToCart(item_id, quantity);
    res.status(201).send('Item added to cart');
  } catch (err: unknown) {
    console.error((err as Error).message);
    res.status(500).send('Server error');
  }
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedItem = await itemsController.updateItem(parseInt(id), req.body);
    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).send('Item not found');
    }
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server error');
  }
});


app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await itemsController.deleteItem(parseInt(id));
    res.status(204).send();
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server error');
  }
});

app.delete('/cart/:item_id', async (req, res) => {
  const { item_id } = req.params;
  try {
    await cartController.removeFromCart(parseInt(item_id));
    res.status(204).send(); // No Content
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});