const createError = require('http-errors')
const SubCategory = require('../models/sub_category.model.js')
const  {subCategorySchemaJOI, categorySchemaJOI} = require('../helpers/validationSchema')

module.exports = {
    register: async (req,res) =>{
        try{
            req.body["organization_id"] = res.locals.payload.organization
            console.log(req.body)
            const isValidated = await subCategorySchemaJOI.validateAsync(req.body)
            const doesExists = await SubCategory.findOne({ name: req.body.name, organization_id: res.locals.payload.organization, deleted_at:null })
            if (doesExists) return res.status(400).json({message: "Name Already Exists"})
            const subCategory = new SubCategory(isValidated)
            const newSubCategory = await subCategory.save()
            return res.status(201).json(newSubCategory)

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    update: async (req,res)=>{
        try{
            console.log(req.body)
            req.body["organization_id"] = res.locals.payload.organization
            const isValidated = await subCategorySchemaJOI.validateAsync(req.body)
            const subCategory = await SubCategory.findByIdAndUpdate(req.params.id,{"$set":isValidated})
            return res.status(201).json(subCategory)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    delete: async (req,res)=>{
        try{
            const subCategory = await SubCategory.findByIdAndUpdate(req.params.id,{"$set":{deleted_at:new Date()}})
            return res.status(201).json(subCategory)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    get_all: async (req,res)=>{
        try {
            const subCategories = await SubCategory.find({deleted_at:null}).populate({path:'category',select:'name'})
            return res.status(201).json(subCategories)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    search: async (req,res)=>{
        try {
            let search = await SubCategory.find({
                deleted_at: null,
                "name": {"$regex": req.params.search, "$options": "i"}
            }).populate({path:'category',select:'name'}).limit(12)
            return res.status(201).json(search)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    get_by_id: async (req,res)=>{
        try {
            const subCategory = await SubCategory.findOne({_id:req.params.id,deleted_at:null})
            return res.status(201).json(subCategory)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    }
}