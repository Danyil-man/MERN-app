import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Incorrect email address').isEmail(),
    body('password', 'Incorrect password').isLength({min: 5}),
    body('fullName', 'Write your full name').isLength({min: 3}),
    body('avatarUrl', 'Incorect link for avatar').optional().isURL(),
]

export const loginValidation = [
    body('email', 'Incorrect email address').isEmail(),
    body('password', 'Incorrect password').isLength({min: 5}),
]

export const postCreateValidation = [
    body('title', 'Write article title').isLength({min: 3}).isString(),
    body('text', 'Write article text').isLength({min: 10}).isString(),
    body('tags', 'Incorrect tags format').optional().isString(),
    body('imageUrl', 'Incorect link for image').optional().isString(),
]