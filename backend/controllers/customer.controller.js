const createError = require("http-errors");
const Customer = require("../models/customers.model");
const { customerSchemaJOI } = require("../helpers/validationSchema");
const Organization = require("../models/organization.model");
const User = require("../models/user.model");
const Sales = require("../models/sales.model");

module.exports = {
  register: async (req, res) => {
    try {
      req.body["organization_id"] = res.locals.payload.organization;
      req.body["user_id"] = res.locals.payload.id;
      let getUser = await User.findOne({
        _id: res.locals.payload.id,
        deleted_at: null,
      });
      if(!getUser) {
        return res.status(400).json({ error: true, message: "User not found" });
      }
      req.body["email"] = getUser.email
      req.body["first_name"] = getUser.full_name
      const isValidated = await customerSchemaJOI.validateAsync(req.body);
      const doesExists = await Customer.findOne({
        email: req.body.email,
        organization_id: res.locals.payload.organization,
        deleted_at: null,
      });
      if (doesExists) {
        const isUpdateValidated = await customerSchemaJOI.validateAsync(
          req.body
        );
        const editCustomer = await Customer.findByIdAndUpdate(doesExists._id, {
          $set: isUpdateValidated,
        });
        return res.status(201).json(editCustomer);
      }
      const customer = new Customer(isValidated);
      const newCustomer = await customer.save();
      return res.status(201).json(newCustomer);
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
      let getCustomer = await Customer.findById(req.params.id);
      if (
        getCustomer.user_id.toString() === res.locals.payload.id ||
        rolesMinified.includes("master")
      ) {
        req.body["organization_id"] = res.locals.payload.organization;
        const isValidated = await customerSchemaJOI.validateAsync(req.body);
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
          $set: isValidated,
        });
        return res.status(201).json(customer);
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
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
          $set: { deleted_at: new Date() },
        });
        return res.status(201).json(customer);
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
      const orders = await Sales.find({}).populate('customer_id').populate({
        path: 'products.product',
        match: { user_id: res.locals.payload.id },
      }).exec();
      const customers = orders.filter((order) => order.products.some((product) => product.product !== null));
      let postData = []
      for(let cust of customers) {
        if(postData.findIndex((i)=>{return i._id === cust.customer_id._id}) === -1){
          postData.push(cust.customer_id)
        }
      }
      return res.status(201).json(postData);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  search: async (req, res) => {
    try {
      let queryObject = {
        deleted_at: null,
        name: { $regex: req.params.search, $options: "i" },
      };
      let rolesMinified = res.locals.payload.roles.map((i) => {
        return i.name;
      });
      if (!rolesMinified.includes("master")) {
        queryObject["user_id"] = res.locals.payload.id;
      }
      let search = await Customer.find(queryObject).limit(12);
      return res.status(201).json(search);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
  get_by_id: async (req, res) => {
    try {
      let getSales = await Sales.findById(req.params.id);
      let rolesMinified = res.locals.payload.roles.map((i) => {
        return i.name;
      });
      if (
        getSales.user_id.toString() === res.locals.payload.id ||
        rolesMinified.includes("master")
      ) {
        const customer = await Customer.findOne({
          _id: req.params.id,
          deleted_at: null,
        });
        return res.status(201).json(customer);
      }
      return res
        .status(400)
        .json({ error: true, message: "Not enough Permissions" });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({ error: true, message: error.message });
    }
  },
};
