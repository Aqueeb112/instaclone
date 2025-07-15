import express from "express"
import isAuthenticated from "../middleware/user.auth.js"
import { editProfile, followandUnfollow, getProfile, getSuggestedUser, login, logout, register } from "../controller/user.controller.js"
import upload from "../middleware/multer.js"

const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/profile').get(isAuthenticated,getProfile)
router.route('/profile/edit').post(isAuthenticated,upload.single("profilePhoto"),editProfile)
router.route('/suggested').get(isAuthenticated,getSuggestedUser)
router.route('/followunfollow/:id').get(isAuthenticated,followandUnfollow)

export default router

