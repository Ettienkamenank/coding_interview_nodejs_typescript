import Joi from 'joi';

const create = Joi.object({
    title: Joi.string().required(),

    content: Joi.string().required(),

    published: Joi.bool().required(),
});

export default { create };
