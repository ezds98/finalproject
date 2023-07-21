const createError = require("http-errors");
const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const { userSchemaJOI } = require("../helpers/validationSchema");
const { OAuth2Client } = require("google-auth-library");
const Organization = require("../models/organization.model.js");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = {
  register: async (req, res) => {
    try {
      let StaffRole = await Role.findOne({ name: "staff" });
      let org = await Organization.findOne({ name: "ecom" });
      req.body["organization_id"] = org._id.toString();
      req.body["roles"] = [StaffRole._id.toString()];
      console.log(req.body);
      const isValidated = await userSchemaJOI.validateAsync(req.body);
      console.log(isValidated);
      const doesExists = await User.findOne({
        email: req.body.email,
        organization_id: org._id.toString(),
        deleted_at: null,
      });
      if (doesExists) {
        if (!doesExists.facialId && req.body.facialId) {
          let update = await User.findByIdAndUpdate(doesExists._id, {
            $set: { facial_login_enrolled: true, facialId: req.body.facialId },
          });
          return res.status(201).json({ update });
        } else {
          return res.status(400).json({error:true, message: "Account Already Exists" });
        }
      }
      const user = new User(isValidated);
      const newUser = await user.save();
      return res.status(201).json({ ...newUser });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({error:true, message: error.message });
    }
  },
  register_continue_with_google: async (req, res) => {
    try {
      const ticket = await client.verifyIdToken({
        idToken: req.body.idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      let findUser = await User.countDocuments({
        email: req.body.email,
        deleted_at: null,
      });
      if (findUser === 0) {
        return res
          .status(201)
          .json({
            accountAlreadyExists: false,
            user: payload,
            id_token: req.body.idToken,
            external_type: "google",
          });
      } else {
        let userDetails = await User.findOne({
          email: req.body.email,
          deleted_at: null,
        });
        return res
          .status(201)
          .json({ accountAlreadyExists: true, user: userDetails });
      }
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({error:true, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      req.body["organization_id"] = res.locals.payload.organization;
      delete req.body["password"];
      const isValidated = await userSchemaJOI.validateAsync(req.body);
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: isValidated,
      });
      return res.status(201).json(user);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({error:true, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: { deleted_at: new Date() },
      });
      return res.status(201).json(user);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({error:true, message: error.message });
    }
  },
  get_all: async (req, res) => {
    try {
      let users = await User.find({
        organization_id: { $eq: res.locals.payload.organization },
        deleted_at: null,
      },{password:0,roles:0,organization_id:0})
      return res.status(201).json(users);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({error:true, message: error.message });
    }
  },
  get_by_id: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id, deleted_at: null });
      return res.status(201).json(user);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      return res.status(400).json({error:true, message: error.message });
    }
  },
};
