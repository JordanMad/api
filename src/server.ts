import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import fs from 'fs';
import { randomUUID } from "crypto";

const filePath = './mocks.json';

const defaultContent = {
  products: [],
}

type Product = {
  type: string;
  name: string;
  calories: string;
  nutritionalHighlight: string;
  price: number;
  id: string
}

const getProducts = (req: Express.Request, res: Express.Response) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json(data);
}

const addProduct = (req: Express.Request, res: Express.Response) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const { body } = req;

  const productExists = data.products.find((product: Product) => product.type === body.type &&
  product.name === body.name &&
  product.calories === body.calories &&
  product.nutritionalHighlight === body.nutritionalHighlight && product.price === body.price)

  if (productExists) {
    res.status(400).json({error:'Product exists'})
    return;
  }

  const updatedData = {
    products: [...data.products, {...req.body, id: randomUUID()}]
  }

  fs.writeFileSync(filePath, JSON.stringify(updatedData))

  return res.json(updatedData);
}

const getProduct = (req: Express.Request, res: Express.Response) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const foundProduct = data.products.find((product) => product.id === req.params.id );

  if (!foundProduct) {
    res.status(401).json({error:'Not found'})
  }

  return res.status(200).json(foundProduct);
}

const deleteProduct = (req: Express.Request, res: Express.Response) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const foundProduct = data.products.find((product: Product) => product.id === req.params.id );

  if (!foundProduct) {
    res.status(401).json({error:'Not found'})
  }

  const updatedData = {
    products: data.products.filter((product: Product) => product.id !== req.params.id)
  }

  fs.writeFileSync(filePath, JSON.stringify(updatedData))

  return res.status(200).json(updatedData);
}

const editProduct = (req: Express.Request, res: Express.Response) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const foundProduct = data.products.find((product: Product) => product.id === req.params.id );
  if (!foundProduct) {
    res.status(401).json({error:'Not found'})
    return;
  }

  const updatedData = {
    products: data.products.map((product: Product) => {
      if (product.id === req.params.id) {
        return {
          ...product,
          ...req.body,
          id: product.id
        }
      }

      return product
    })
  }

  fs.writeFileSync(filePath, JSON.stringify(updatedData))

  return res.status(200).json(updatedData);
}

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use((req, res, next) => {
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        // If the file does not exist, create it with some default content
        fs.writeFileSync(filePath, JSON.stringify(defaultContent), 'utf8');
      }
      next()
    })
    .get("/products", getProducts)
    .get("/products/:id", getProduct)
    .delete("/products/:id", deleteProduct)
    .post("/products/add", addProduct)
    .put("/products/:id", editProduct)
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    });

  return app;
};
