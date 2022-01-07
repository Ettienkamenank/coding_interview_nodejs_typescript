import Joi from 'joi';

const register = Joi.object({
    firstName: Joi.string().max(30).required().messages({
        'string.base': `firstName should be a type of 'text'`,
        'string.empty': `firstName cannot be an empty field`,
        'string.max': `firstName should have a maximum length of {#limit}`,
        'any.required': `firstName is a required field`,
    }),

    lastName: Joi.string().max(30).required().messages({
        'string.base': `lastName should be a type of 'text'`,
        'string.empty': `lastName cannot be an empty field`,
        'string.max': `lastName should have a maximum length of {#limit}`,
        'any.required': `lastName is a required field`,
    }),

    username: Joi.string().max(15).required().messages({
        'string.empty': `username cannot be an empty field`,
        'string.max': `username should have a maximum length of {#limit}`,
        'any.required': `username is a required field`,
    }),

    email: Joi.string().email().required().messages({
        'string.empty': `email cannot be an empty field`,
        'any.required': `email is a required field`,
    }),

    photo: Joi.string(),

    phoneNumber: Joi.string().required().messages({
        'string.empty': `phoneNumber cannot be an empty field`,
        'any.required': `phoneNumber is a required field`,
    }),

    phoneNumber2: Joi.string(),

    country: Joi.string(),

    city: Joi.string(),

    department: Joi.string(),

    address: Joi.string(),

    postalCode: Joi.string(),

    language: Joi.string(),

    password: Joi.string().min(6).required().messages({
        'string.empty': `password cannot be an empty field`,
        'string.min': `password should have a minimum length of {#limit}`,
        'any.required': `password is a required field`,
    }),
});

const login = Joi.object({
    username: Joi.string().required().messages({
        'string.empty': `username cannot be an empty field`,
        'any.required': `username is a required field`,
    }),

    password: Joi.string().required().messages({
        'string.empty': `password cannot be an empty field`,
        'any.required': `password is a required field`,
    }),
});

export default { register, login };
