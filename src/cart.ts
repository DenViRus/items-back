import pool from './db';
import { ICartItem } from './models/ICartItem.model';

export const getCartItems = async (): Promise<ICartItem[]> => {
  const { rows } = await pool.query<ICartItem>('SELECT * FROM cart');
  return rows;
};

export const addToCart = async (item_id: number, quantity: number): Promise<void> => {
  await pool.query('INSERT INTO cart (item_id, quantity) VALUES ($1, $2)', [item_id, quantity]);
};

export const removeFromCart = async (item_id: number): Promise<void> => {
  await pool.query('DELETE FROM cart WHERE item_id = $1', [item_id]);
};