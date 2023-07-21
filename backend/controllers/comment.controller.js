const createError = require('http-errors')
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Comment = require('../models/comment.model.js')
const {commentSchemaJOI} = require('../helpers/validationSchema')

module.exports = {
    register: async (req,res) =>{
        try{
            req.body["organization_id"] = res.locals.payload.organization
            const isValidated = await commentSchemaJOI.validateAsync(req.body)
            const doesExists = await Comment.findOne({ name: req.body.name, organization_id: res.locals.payload.organization, deleted_at:null })
            if (doesExists) return res.status(400).json({message: "Name Already Exists"})
            const comment = new Comment(isValidated)
            const newComment = await comment.save()
            return res.status(201).json(newComment)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    update: async (req,res)=>{
        try{
            let higherRoles = ['master','staff']
            const isHigherRole = res.locals.payload.roles.findIndex(i=>higherRoles.includes(i.name))
            if(res.locals.payload.id===req.body.user_id || isHigherRole>-1){
                req.body["organization_id"] = res.locals.payload.organization
                const isValidated = await commentSchemaJOI.validateAsync(req.body)
                const comment = await Comment.findByIdAndUpdate(req.params.id,{"$set":isValidated})
                return res.status(201).json(comment)
            }
            else{
                return res.status(400).json({message: "Not enough Permissions"})
            }
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    delete: async (req,res)=>{
        try{
            let higherRoles = ['master','staff']
            const isHigherRole = res.locals.payload.roles.findIndex(i=>higherRoles.includes(i.name))
            if(res.locals.payload.id===req.body.user_id || isHigherRole>-1){
                const comment = await Comment.findByIdAndUpdate(req.params.id,{"$set":{deleted_at:new Date()}})
                return res.status(201).json(comment)
            }
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    get_all: async (req,res)=>{
        try {
            const vouchers = await Comment.find({product_id:req.params.id,deleted_at:null})
            return res.status(201).json(vouchers)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    get_rating: async (req,res)=>{
        try {
            let documentCount = Comment.countDocuments({product_id:req.params.id,has_rated:true})
            const comment = Comment.aggregate([
                { $match: { product_id: ObjectId(req.params.id),has_rated:true } },
                { $group: { _id: null, rating: { $sum: "$rating" } } }
            ])
            return res.status(201).json({message:"Have to do testing if it really works"})
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    }
}