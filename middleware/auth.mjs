import { db } from "../utils/database.mjs";

export const verifyUser = async (req, res, next) => {
    try {
        const { uid } = req.body;
        if (!uid) {
            return res.status(401).json({ message: "UID no proporcionado" });
        }

        const userDoc = await db.collection("users").doc(uid).get();

        if (!userDoc.exists) {
            return res.status(403).json({ message: "Usuario no autorizado" });
        }
        req.user = {
            id: uid,
            ...userDoc.data()
        };

        next();

    } catch (error) {
        console.error("Error en verifyUser:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};