// Middleware para limitar las solicitudes por usuario
const requestLimit = 10;
const usuarios = {};

// Limpiar el registro de usuarios cada 24 horas
setInterval(() => {
    for (const userId in usuarios) {
        delete usuarios[userId];
    }
}, 86400000);

export const MiddlewarePrompt = async (req, res, next) => {
    const { uid } = req.body;

    if (!uid) {
        return res.status(400).json({ message: "ID de usuario no proporcionado" });
    }

    if (!usuarios[uid]) {
        usuarios[uid] = { intentos: 1 };
    } else {
        if (usuarios[uid].intentos >= requestLimit) {
            return res.status(429).json({ message: "Has alcanzado el límite de peticiones por el día de hoy" });
        } else {
            usuarios[uid].intentos += 1;
        }
    }
    
    next(); // Llamar a next() para continuar con la siguiente función en la cadena
};