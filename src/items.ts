import pool from "./db";
import { IItem } from "./models/IItem.model";

export const getItems = async (): Promise<IItem[]> => {
  const { rows } = await pool.query<IItem>("SELECT * FROM items");
  return rows;
};

export const addItem = async (item: IItem): Promise<IItem> => {
  const { item_name, item_count, item_price, item_desc } = item;
  const { rows } = await pool.query<IItem>(
    "INSERT INTO items (item_name, item_count, item_price, item_desc) VALUES ($1, $2, $3, $4) RETURNING *",
    [item_name, item_count, item_price, item_desc]
  );
  return rows[0];
};

export const updateItem = async (id: number, item: Partial<IItem>): Promise<IItem> => {
  const { item_name, item_count, item_price, item_desc } = item;
  const { rows } = await pool.query<IItem>("UPDATE items SET item_name = $1, item_count = $2, item_price = $3, item_desc = $4 WHERE item_id = $5 RETURNING *", [item_name, item_count, item_price, item_desc, id]);
  return rows[0];
};

export const getItemById = async (id: number): Promise<IItem | null> => {
  const { rows } = await pool.query<IItem>("SELECT * FROM items WHERE item_id = $1", [id]);
  return rows.length ? rows[0] : null;
};

export const deleteItem = async (id: number): Promise<void> => {
  await pool.query("DELETE FROM items WHERE item_id = $1", [id]);
};
