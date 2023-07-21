const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const UserToken = require("../models/token.model");
const Organization = require("../models/organization.model");
const Role = require("../models/role.model");
const { userSchemaJOI, authSchemaJOI } = require("../helpers/validationSchema");
const {
  getTokenData,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  resetPasswordToken,
  verifyResetPasswordToken,
} = require("../helpers/jwtHelper");
const { not, object } = require("@hapi/joi");

module.exports = {
  verify_access_token: async (req, res) => {
    try {
      const token = req.body.token;
      console.log(token)
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
          return res.status(201).json({ verified: false });
        } else {
          return res.status(201).json({ verified: true });
        }
      });
    } catch (error) {
      return res.status(201).json({ verified: false });
    }
  },
  register: async (req, res, next) => {
    try {
      const result = {
        email: req.body.email,
        password: req.body.password,
        roles: req.body.roles,
        organization: req.body.organization_id,
      };
      const doesExists = await User.findOne({ email: result.email });
      if (doesExists)
        throw createError.Conflict(`${result.email} already registered`);
      const org = await Organization.findOne(
        { username: result.organization },
        (err, roles) => {
          if (err) {
            return res.status(500).json({error:true,message: error.message});
          }
        }
      );
      if (!org) throw createError.Conflict(`Organization does not exist.`);
      result["organization"] = org._id;
      result["roles"] = result["roles"].filter((i) => i !== "master");
      const roles = await Role.find(
        { name: { $in: result.roles } },
        (err, roles) => {
          if (err) {
            return res.status(500).json({error:true,message: error.message});
            return;
          }
        }
      );
      if (!roles) throw createError.Conflict(`Roles does not exist.`);
      result.roles = roles.map((role) => role._id);
      const isValidated = await userSchema.validateAsync(result);
      const user = new User(isValidated);
      user.save();
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await authSchemaJOI.validateAsync(req.body);
      console.log(result);
      let user = null;
      if (result.facialId) {
        user = await User.findOne({ facialId: result.facialId }).populate('roles');
        console.log(user)
        if (!user){
            return res.status(500).send({error:true, message: "Cannot Find a Face" });
        }
      } else {
        user = await User.findOne({ email: result.email }).populate('roles');
        if (!user)
          return res.status(500).send({error:true, message: "Invalid Email Or Password" });
        const isMatch = await user.isValidPassword(result.password);
        if (!isMatch)
          return res.status(500).send({error:true, message: "Invalid Email Or Password" });
      }

      const accessToken = await signAccessToken(user._id.toString());
      const refreshToken = await signRefreshToken(user._id.toString());
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expiresIn: "1d",
        sameSite: "strict",
      });
      req.headers["Authorization"] = `Bearer ${accessToken}`;
      const roleMinified = user.roles.map((i) => {
        return i.name;
      });
      console.log(roleMinified)
      const tokenData = await getTokenData(accessToken);
      const isMaster = roleMinified.includes('master');
      res
        .status(201)
        .json({ accessToken, refreshToken, tokenData, name: user.full_name, id:user._id.toString(), isMaster });
    } catch (error) {
      if (error.isJoi === true) return res.status(400).json({ message: error });
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      let userObj = await User.findById(userId).populate('roles');
      const roleMinified = userObj.roles.map((i) => {
        return i.name;
      });
      console.log(roleMinified)
      const isMaster = roleMinified.includes('master');
      res.send({ accessToken: accessToken, refreshToken: refToken,id:userId,isMaster });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      UserToken.findOneAndDelete({ _id: userId }, (err, doc) => {
        if (err) {
          return createError.InternalServerError();
        }
        res.sendStatus(204);
      });
    } catch (error) {
      next(error);
    }
  },
  login_get: async (req, res) => {
    res.render("login");
  },
  forgot_password_get: async (req, res, next) => {
    res.render("forgot-password");
  },
  forgot_password_post: async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      res.send(createError.NotFound("Invalid Email/ Not registered not found"));
      return;
    }
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        res.send(createError.NotFound("User not registered"));
        return;
      }
      const token = await resetPasswordToken(user);
      const link = `http://localhost:3000/auth/reset-password/${user.id}/${token}`;
      res.send("Reset Password Link sent successfully.");
    } catch (error) {
      next(createError.InternalServerError());
      return;
    }
  },
  reset_password_get: async (req, res, next) => {
    const { id, token } = req.params;
    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        res.send(createError.NotFound("User not found"));
        return;
      }
      await verifyResetPasswordToken(token, user.password);
      res.render("reset-password", { email: user.email });
    } catch (error) {
      next(createError.Unauthorized());
      return;
    }
  },
  reset_password_post: async (req, res, next) => {
    const { id, token } = req.params;
    const { password, password2 } = req.body;
    try {
      if (password !== password2)
        return res.send(createError.BadRequest("Password does not match..."));
      const user = await User.findOne({ _id: id });
      if (!user) {
        res.send(createError.NotFound("User not found"));
        return;
      }
      await verifyResetPasswordToken(token, user.password);
      user.password = password;
      await user.save();
      res.redirect("/auth/login");
    } catch (error) {
      next(createError.InternalServerError());
      return;
    }
  },
};
