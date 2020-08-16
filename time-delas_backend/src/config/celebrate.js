const { celebrate, Segments, Joi } = require('celebrate')


module.exports = {
    

    createProductValidation() {
        return celebrate({
            [Segments.BODY]: Joi.object().keys({
                name: Joi.string().required(),
                description: Joi.string(),
                stock_quantity: Joi.number().required().min(0),
                price: Joi.number().required().min(0),
                size: Joi.string().required(),
                color: Joi.string().required(),
                weight: Joi.number(),
                available: Joi.boolean().required(),
                pictures_path: Joi.string(),
                category: Joi.string().required(),
                // tags: DataTypes.STRING,
                visible: Joi.boolean().required()
            })
        })
    }
}