const createError = require('http-errors')
const Category = require('../models/category.model')
const SubCategory = require('../models/sub_category.model')
const  {categorySchemaJOI} = require('../helpers/validationSchema')

module.exports = {
    register: async (req,res) =>{
        try{
            req.body["organization_id"] = res.locals.payload.organization
            const isValidated = await categorySchemaJOI.validateAsync(req.body)
            const doesExists = await Category.findOne({ name: req.body.name, organization_id: res.locals.payload.organization, deleted_at:null })
            if (doesExists){
                return res.status(400).json({message: "Name Already Exists"})
            }
            const category = new Category(isValidated)
            const newCategory = await category.save()
            return res.status(201).json(newCategory)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    update: async (req,res)=>{
        try{
            req.body["organization_id"] = res.locals.payload.organization
            const isValidated = await categorySchemaJOI.validateAsync(req.body)
            const category = await Category.findByIdAndUpdate(req.params.id,{"$set":isValidated})
            return res.status(201).json(category)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    delete: async (req,res)=>{
        try{
            const category = await Category.findByIdAndUpdate(req.params.id,{"$set":{deleted_at:new Date()}})
            return res.status(201).json(category)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    get_all: async (req,res)=>{
        try {
            let returnData = []
            const categories = await Category.find({deleted_at:null})
            let catArray = JSON.parse(JSON.stringify(categories))
            for(let category in catArray){
                let subCatData = await SubCategory.find({deleted_at:null,category:catArray[category]._id})
                catArray[category].sub_categories = JSON.parse(JSON.stringify(subCatData))
                returnData.push(catArray[category])
            }
            return res.status(201).json(returnData)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    search: async (req,res)=>{
        try {
            let search = await Category.find({
                deleted_at: null,
                "name": {"$regex": req.params.search, "$options": "i"}
            }).limit(12)
            return res.status(201).json(search)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    },
    get_by_id: async (req,res)=>{
        try {
            const category = await Category.findOne({_id:req.params.id,deleted_at:null})
            return res.status(201).json(category)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({error:true,message: error.message})
        }
    }
}