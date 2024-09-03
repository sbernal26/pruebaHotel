// server.js
const express = require('express');
const app = express();
const { obtenerDisponibilidad } = require('./logi');

app.get('/disponibilidad', (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;

    obtenerDisponibilidad(fecha_inicio, fecha_fin, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Agrupar resultados por hotel
        const hoteles = {};
        results.forEach(row => {
            if (!hoteles[row.hotel_id]) {
                hoteles[row.hotel_id] = {
                    hotel_nombre: row.hotel_nombre,
                    habitaciones: []
                };
            }

            hoteles[row.hotel_id].habitaciones.push({
                habitacion_id: row.habitacion_id,
                numero: row.habitacion_numero,
                tipo_habitacion: row.tipo_habitacion,
                precio: row.precio
            });
        });

        if (Object.keys(hoteles).length > 0) {
            // Hay disponibilidad
            res.json({
                message: "Hay disponibilidad en los siguientes hoteles2.",
                hoteles: Object.values(hoteles)
            });
            console.log("¡Hay disponibilidad!");
        } else {
            // No hay disponibilidad
            res.json({
                message: "No hay disponibilidad en las fechas seleccionadas."
            });
            console.log("No hay disponibilidad.");
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor en puerto 3000');
});
