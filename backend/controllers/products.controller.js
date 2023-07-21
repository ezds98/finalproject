const Product = require("../models/product.model");
const { productSchemaJOI } = require("../helpers/validationSchema");
const Customer = require("../models/customers.model");

module.exports = {
  register: async (req, res) => {
    try {
      req.body["organization_id"] = res.locals.payload.organization;
      if (req.body.stock) {
        req.body.stock = Number(req.body.stock);
      }
      if (req.body.price) {
        req.body.price = Number(req.body.price);
      }
      req.body["user_id"] = res.locals.payload.id;
      const isValidated = await productSchemaJOI.validateAsync(req.body);
      const doesExists = await Product.findOne({
        name: req.body.name,
        user_id: res.locals.payload.id,
        organization_id: res.locals.payload.organization,
        deleted_at: null,
      });
      if (doesExists)
        return res
          .status(400)
          .json({ message: "Name Already Exists", error: true });
      const product = new Product(isValidated);
      const newProduct = await product.save();
      return res.status(201).json(newProduct);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      let rolesMinified = res.locals.payload.roles.map((i) => {
        return i.name;
      });
      let getProduct = await Product.findById(req.params.id);
      if (
        getProduct.user_id.toString() === res.locals.payload.id ||
        rolesMinified.includes("master")
      ) {
        req.body["organization_id"] = res.locals.payload.organization;
        if(parseInt(req.body.stock) <= 0) {
          return res
        .status(400)
        .json({ error: true, message: "Negative Stock Updated" });
        }
        if(parseInt(req.body.price) <= 0) {
          return res
        .status(400)
        .json({ error: true, message: "Negative Price Updated" });
        }
        const product = await Product.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        return res.status(201).json(product);
      }
      return res
        .status(400)
        .json({ error: true, message: "Not enough Permissions" });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      let rolesMinified = res.locals.payload.roles.map((i) => {
        return i.name;
      });
      let getProduct = await Product.findById(req.params.id);
      if (
        getProduct.user_id.toString() === res.locals.payload.id ||
        rolesMinified.includes("master")
      ) {
        req.body["organization_id"] = res.locals.payload.organization;
        const product = await Product.findByIdAndUpdate(req.params.id, {
          $set: { deleted_at: new Date() },
        });
        return res.status(201).json(product);
      }
      return res
        .status(400)
        .json({ error: true, message: "Not enough Permissions" });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  search: async (req, res) => {
    try {
      let search = await Product.find({
        deleted_at: null,
        $or: [
          {
            name: {
              $regex: req.params.search.toString(),
              $options: "i",
            },
          },
          {
            isbn: {
              $regex: req.params.search.toString(),
              $options: "i",
            },
          }
        ]
      }).limit(12);
      return res.status(201).json(search);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  get_all: async (req, res) => {
    try {
      if (typeof req.body !== "object") {
        req.body = {};
      }
      let sortOptions = [
        "category",
        "sub_category",
        "author",
        "is_featured",
        "query",
        "user_id"
      ];
      for (let key in req.body) {
        if (key === "query") {
          req.body["$or"] = [
            {
              name: {
                $regex: req.body["query"].toString(),
                $options: "i",
              },
            },
            {
              isbn: {
                $regex: req.body["query"].toString(),
                $options: "i",
              },
            }
          ];
          delete req.body["query"];
        } else if (
          !req.body[key] ||
          !sortOptions.includes(key) ||
          req.body[key] === "none"
        ) {
          delete req.body[key];
        }
      }
      req.body["deleted_at"] = null;
      let totalItem = await Product.countDocuments(req.body);
      if (totalItem <= 0) {
        return res.status(201).json({
          data: [],
          currentPage: 1,
          totalPage: 1,
        });
      }
      let perPage = 100;
      let skip = perPage * parseInt(req.params.page);
      let totalPage = parseInt(totalItem) / perPage;
      let page =
        totalPage % perPage === 0 ? Number(totalPage) : Number(totalPage + 1);
      if (parseInt(req.params.page) >= Number(page)) {
        return res.status(400).json({ message: "Invalid Page", error: true });
      }
      console.log(req.body)
      let products = await Product.find(req.body)
        .populate({ path: "category", select: "name" })
        .populate({ path: "sub_category", select: "name" })
        .populate({ path: "author", select: "name" })
        .sort({ updated_at: -1 })
        .skip(skip)
        .limit(perPage);
      return res.status(201).json({
        data: products,
        currentPage: Number(req.params.page) + 1,
        totalPage: Number(page),
      });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  get_recomended_products: async (req, res) => {
    try {
      console.log("Prod Here")
      const products = await Product.find({
        purchaseCount: {$gt:0},
        deleted_at: null,
      })
      .populate({ path: "category", select: "name" })
      .populate({ path: "sub_category", select: "name" })
      .sort({ productCount:-1 })
      .limit(12);
      return res.status(201).json({
        data: products});
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  get_by_id: async (req, res) => {
    try {
      const product = await Product.findOne({
        _id: req.params.id,
        deleted_at: null,
      })
        .populate({ path: "category", select: "name" })
        .populate({ path: "sub_category", select: "name" })
        .populate({ path: "author", select: "name" });
      return res.status(201).json(product);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  get_by_recent: async (req, res) => {
    try {
      const products = await Product.find({ deleted_at: null })
        .populate({ path: "category", select: "name" })
        .populate({ path: "sub_category", select: "name" })
        .populate({ path: "author", select: "name" })
        .sort({ updated_at: -1 })
        .limit(8);
      return res.status(201).json(products);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
};
