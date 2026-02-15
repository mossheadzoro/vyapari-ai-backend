import Store from "../models/Store.js";

export const getMyStores = async (req, res) => {
  const stores = await Store.find({
    $or: [
      { owner: req.userId },
      { operators: req.userId },
    ],
  });

  res.json(stores);
};

export const createStore = async (req, res) => {
  const { name } = req.body;

  const store = await Store.create({
    name,
    owner: req.userId,
    operators: [req.userId],
  });

  res.status(201).json(store);
};
