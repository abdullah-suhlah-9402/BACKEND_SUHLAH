import { Router } from "express";
import { reqisterUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(reqisterUser);

export default router;
