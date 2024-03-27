import express from "express";
import productManager from "./src/productManager.js";

const server = express();
const port = 3000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const ready = () => "server ready on port" + port;
server.listen(port, ready);

// product
server.get("/api/products", async (req, res) => {
  try {
    const all = await productManager.loadProducts();

    if (all.length === 0) {
      return res.json({
        statuscode: 404,
        message: "Products not found",
      });
    }
    return res.json({
      statuscode: 200,
      response: all,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      statuscode: 500,
      message: error.message,
    });
  }
});

server.get("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const one = await productManager.getProductById(pid);

    if (!one) {
      return res.json({
        statuscode: 404,
        message: "Product not found",
      });
    } else {
      return res.json({
        statuscode: 200,
        response: one,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      statuscode: 500,
      message: error.message,
    });
  }
});