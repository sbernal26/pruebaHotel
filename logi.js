// reservasQueries.js
const db = require('./dbconexion');

const obtenerDisponibilidad = (fecha_inicio, fecha_fin, callback) => {
    const sql = `
        SELECT h.id AS hotel_id, h.nombre AS hotel_nombre, ha.id AS habitacion_id, ha.numero AS habitacion_numero, th.nombre AS tipo_habitacion, ha.precio
        FROM Hotel h
        JOIN Habitacion ha ON h.id = ha.hotel_id
        JOIN Tipo_Habitaciones th ON ha.tipo_habitaciones_id = th.id
        WHERE ha.id NOT IN (
            SELECT habitacion_id
            FROM Reservas
            WHERE fecha_inicio_res <= ? AND fecha_fin_res >= ?
        )
        GROUP BY h.id, ha.id;
    `;

    db.query(sql, [fecha_fin, fecha_inicio], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

module.exports = {
    obtenerDisponibilidad
};
