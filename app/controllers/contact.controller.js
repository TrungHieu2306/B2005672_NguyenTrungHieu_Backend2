const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");


exports.create = async (req, res, next) => {
    if(!req.body?.name){
        return next(new ApiError(400, "Name can not be empty"));
    }
    try{
        const contactServive = new ContactService(MongoDB.client);
        const documnet = await contactServive.create(req.body);
        return res.send(documnet);
    }catch(error){
        return next( new ApiError(500, "An error occurred while creating the contact"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try{
        const contactServive = new ContactService(MongoDB.client);
        const { name } = req.query;
        if(name){
            documents = await contactServive.findByName(name);
        }else{
            documents = await contactServive.find({});
        }
    }catch (error){
        return next(new ApiError(500, "An error occurred occurred while creating the contact"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const contactServive = new ContactService(MongoDB.client);
        const document = await contactServive.findById(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    }catch (error){
        return next(
            new ApiError(
                500,
                "An error occurred while creating the contact"
            )
        );
    }
};

exports.update = async (req, res, next) =>{
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try{
        const contactServive = new ContactService(MongoDB.client);
        const document = await contactServive.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was updated successfully"});
    }catch(error){
        return next(new ApiError(500, `Error updating contact with id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try{
        const contactServive = new ContactService(MongoDB.client);
        const document = await contactServive.delete(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was delete successfully"});
    }catch (error){
        return next(new ApiError(500, `Can not delete contact with id=${req.params.id}`));
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try{
        const contactServive = new ContactService(MongoDB.client);
        const documents = await contactServive.findAllFavorite();
        return res.send(documents);
    }catch (error){
        return next(new ApiError(500, "An error occurred  while retrieving favorite contacts"));
    }
};

exports.deleteAll = async (req, res, next) => {
    try{
        const contactServive = new ContactService(MongoDB.client);
        const deleteCount = await contactServive.deleteAll();
        return res.send({ message: `${deleteCount} contacts were deleted successfully`})
    }catch(error){
        return next(new ApiError(500, "An error occured while removing all contacts"));
    }
};


