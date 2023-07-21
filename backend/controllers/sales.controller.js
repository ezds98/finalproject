const createError = require("http-errors");
const Sales = require("../models/sales.model.js");
const {
  salesSchemaJOI,
  customerSchemaJOI,
} = require("../helpers/validationSchema");
const Organization = require("../models/organization.model");
const Customer = require("../models/customers.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

module.exports = {
  get_dashboard: async (req, res) => {
    try {
      let rolesMinified = res.locals.payload.roles.map((i) => {
        return i.name;
      });
      if (rolesMinified.includes("master")) {
        let totalCustomer = await Customer.countDocuments({
          organization_id: { $eq: res.locals.payload.organization.toString() },
          deleted_at: null,
        });
        const totalSalesAmount = await Sales.aggregate([
          { $group: { _id: null, total_amount: { $sum: "$total_amount" } } },
        ]);

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const annualSales = await Sales.aggregate([
          { $match: { created_at: { $gte: oneYearAgo } } },
          { $group: { _id: null, total_amount: { $sum: "$total_amount" } } },
        ]);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const monthlySales = await Sales.aggregate([
          { $match: { created_at: { $gte: oneMonthAgo } } },
          { $group: { _id: null, total_amount: { $sum: "$total_amount" } } },
        ]);


        let totalProducts = await Product.countDocuments({
          organization_id: { $eq: res.locals.payload.organization.toString() },
          deleted_at: null,
        });
        return res.status(201).json({
          totalCustomer: totalCustomer,
          totalSales: totalSalesAmount[0].total_amount,
          totalProducts: totalProducts,
          annualSales: annualSales[0].total_amount,
          monthlySales: monthlySales[0].total_amount
        });
      }
      let totalCustomerAgain = await Customer.countDocuments({
        organization_id: { $eq: res.locals.payload.organization.toString() },
        user_id: res.locals.payload.id.toString(),
        deleted_at: null,
      });
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const annualSalesAgain = await Sales.aggregate([
        { $match: { user_id: mongoose.Types.ObjectId(res.locals.payload.id.toString()), created_at: { $gte: oneYearAgo } } },
        { $group: { _id: null, total_amount: { $sum: "$total_amount" } } },
      ]);

      console.log(annualSalesAgain)

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const monthlySalesAgain = await Sales.aggregate([
        { $match: { user_id: mongoose.Types.ObjectId(res.locals.payload.id.toString()), created_at: { $gte: oneMonthAgo } } },
        { $group: { _id: null, total_amount: { $sum: "$total_amount" } } },
      ]);

      console.log(monthlySalesAgain)

      const totalSalesAmountAgain = await Sales.aggregate([
        { $match: { user_id: mongoose.Types.ObjectId(res.locals.payload.id.toString()) } },
        { $group: { _id: null, total_amount: { $sum: "$total_amount" } } },
      ]);

      console.log(totalSalesAmountAgain)

      console.log("Received Sales")
      let totalProductsAgain = await Product.countDocuments({
        organization_id: { $eq: res.locals.payload.organization.toString() },
        user_id: res.locals.payload.id.toString(),
        deleted_at: null,
      });
      console.log(totalProductsAgain)
      console.log("Received Products")
      return res.status(201).json({
        totalCustomer: totalCustomerAgain,
        totalSales: totalSalesAmountAgain && totalSalesAmountAgain.length > 0 && totalSalesAmountAgain[0].total_amount ? totalSalesAmountAgain[0].total_amount : 0,
        totalProducts: totalProductsAgain,
        annualSales: annualSalesAgain && annualSalesAgain.length > 0 && annualSalesAgain[0].total_amount ? annualSalesAgain[0].total_amount : 0,
        monthlySales: monthlySalesAgain && monthlySalesAgain.length > 0 && monthlySalesAgain[0].total_amount ? monthlySalesAgain[0].total_amount : 0,
      });
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) error.status = 422;
      return res
        .status(201)
        .json({ totalCustomer: 0, totalSales: 0, totalProducts: 0 });
    }
  },
  register: async (req, res) => {
    try {
      req.body["organization_id"] = res.locals.payload.organization;
      req.body["user_id"] = res.locals.payload.id;
      const isValidated = await salesSchemaJOI.validateAsync(req.body);
      for (let prod of req.body.products) {
        const getProd = await Product.findById(prod.product);
        if (getProd.stock < parseInt(prod.quantity)) {
          return res.status(400).json({ error: true, message: "No of items not in stock. Please try with lower stock" });
        }
        let count = 0
        if(getProd.purchaseCount){
          count = getProd.purchaseCount
        }
        let updateProduct = await Product.updateOne({ _id: prod.product }, { stock: getProd.stock - parseInt(prod.quantity),purchaseCount:count + parseInt(prod.quantity) })
      }
      const sales = new Sales(isValidated);
      const newSales = await sales.save();
      return res.status(201).json(newSales);
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
      let getSales = await Sales.findById(req.params.id);
      if (
        getSales.user_id.toString() === res.locals.payload.id ||
        rolesMinified.includes("master")
      ) {
        req.body["organization_id"] = res.locals.payload.organization;
        const isValidated = await salesSchemaJOI.validateAsync(req.body);
        const sales = await Sales.findByIdAndUpdate(req.params.id, {
          $set: isValidated,
        });
        return res.status(201).json(sales);
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
      let getSales = await Sales.findById(req.params.id);
      let rolesMinified = res.locals.payload.roles.map((i) => {
        return i.name;
      });
      if (
        getSales.user_id.toString() === res.locals.payload.id ||
        rolesMinified.includes("master")
      ) {
        const sales = await Sales.findByIdAndUpdate(req.params.id, {
          $set: { deleted_at: new Date() },
        });
        return res.status(201).json(sales);
      }
      return res
        .status(400)
        .json({ error: true, message: "Not enough Permissions" });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  get_all: async (req, res) => {
    try {
      let queryObject = {
        organization_id: { $eq: res.locals.payload.organization },
        deleted_at: null,
      };
      let rolesMinified = res.locals.payload.roles.map((i) => {
        return i.name;
      });
      if (!rolesMinified.includes("master")) {
        queryObject["user_id"] = res.locals.payload.id;
      }
      let totalItem = await Sales.countDocuments(queryObject);
      if (totalItem <= 0) {
        return res.status(201).json({
          data: [],
          currentPage: 1,
          totalPage: 1,
        });
      }
      let perPage = 12;
      let skip = perPage * parseInt(req.params.page);
      let totalPage = parseInt(totalItem) / perPage;
      let page =
        totalPage % perPage === 0
          ? parseInt(totalPage)
          : parseInt(totalPage + 1);
      if (parseInt(req.params.page) >= parseInt(page)) {
        return res.status(400).json({ message: "Invalid Page" });
      }
      let users = await Sales.find(queryObject)
        .populate("customer_id")
        .populate("products.product")
        .sort({ updated_at: -1 })
        .skip(skip)
        .limit(perPage);
      return res.status(201).json({
        data: users,
        currentPage: parseInt(req.params.page) + 1,
        totalPage: parseInt(page),
      });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  get_user_orders: async (req, res) => {
    try {
      const orders = await Sales.aggregate([
        {
          $lookup: {
            from: 'customers',
            localField: 'customer_id',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $unwind: '$customer',
        },
        {
          $addFields: {
            'customer.id': '$customer._id',
            'customer._id': '$$REMOVE',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'populatedProducts',
          },
        },
        {
          $unwind: '$products',
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'populatedProduct',
          },
        },
        {
          $unwind: '$populatedProduct',
        },
        {
          $match: {
            'populatedProduct.user_id': mongoose.Types.ObjectId(res.locals.payload.id),
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'products.product',
          },
        },
        {
          $group: {
            _id: '$_id',
            products: { $push: '$products' },
            total_amount: { $first: '$total_amount' },
            customer_id: { $first: '$customer' },
            organization_id: { $first: '$organization_id' },
            invoice_date: { $first: '$invoice_date' },
            payment_type: { $first: '$payment_type' },
            created_at: { $first: '$created_at' },
            updated_at: { $first: '$updated_at' },
            deleted_at: { $first: '$deleted_at' },
          },
        },
      ]).exec();

      // let filtered = orders.filter((order) => order.products.some((product) => product.product !== null));
      return res.status(201).json({ data: orders })
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  get_by_id: async (req, res) => {
    try {
      const sales = await Sales.findOne({
        _id: req.params.id,
        deleted_at: null,
      });
      let rolesMinified = res.locals.payload.roles.map((i) => {
        return i.name;
      });
      if (rolesMinified.includes("master") || sales.user_id.toString() === res.locals.payload.id.toString()) {
        return res.status(201).json(sales);
      }
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
};
