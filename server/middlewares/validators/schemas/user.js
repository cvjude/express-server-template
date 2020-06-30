import Joi from '@hapi/joi';

export const signUpSchema = Joi.object().keys({
  firstName: Joi.string()
    .regex(/^[A-Za-z]{3,}$/)
    .trim()
    .required(),
  lastName: Joi.string()
    .regex(/^[A-Za-z]{3,}$/)
    .trim()
    .required(),
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string()
    .min(8)
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .message(
      'password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character'
    ),
  userName: Joi.string().lowercase().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().required(),
  password: Joi.string().min(8).required(),
  inviteToken: Joi.string().trim().optional(),
});

export const updateUserSchema = Joi.object().keys({
  firstName: Joi.string()
    .regex(/^[A-Za-z]{3,}$/)
    .trim(),
  lastName: Joi.string()
    .regex(/^[A-Za-z]{3,}$/)
    .trim(),
  userName: Joi.string().lowercase(),
  emailNotify: Joi.boolean(),
  inAppNotify: Joi.boolean(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().trim().required(),
});

export const changePasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  emailToken: Joi.string().length(128).required(),
});
