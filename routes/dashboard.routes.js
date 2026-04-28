const express = require('express');
const router = express.Router();

// Importar todos los modelos
const Protocolo = require('../models/protocolo');
const Buzon = require('../models/buzon');
const Conexion = require('../models/conexion');
const ConexionTramo = require('../models/conexionTramo');
const Estanquidad = require('../models/estanquidad');
const Excavacion = require('../models/excavacion');
const PruebaHidraulica = require('../models/pruebaHidraulica');
const Relleno = require('../models/relleno');
const Tuberia = require('../models/tuberia');
const Vereda = require('../models/vereda');

// Mapa de tipos de protocolo con su metadata
const TIPOS_PROTOCOLO = [
  { id: 'concreto',        nombre: 'Vaciado de Concreto',       modelo: Protocolo,        prefijo: 'CONC', icono: '🪣', color: '#6366f1' },
  { id: 'buzon',           nombre: 'Construcción de Buzones',   modelo: Buzon,            prefijo: 'BUZ',  icono: '🏗️', color: '#f59e0b' },
  { id: 'conexion',        nombre: 'Conexiones Domiciliarias',  modelo: Conexion,         prefijo: 'CON',  icono: '🏠', color: '#10b981' },
  { id: 'conexion-tramo',  nombre: 'Conexiones por Tramo',      modelo: ConexionTramo,    prefijo: 'CONT', icono: '🏘️', color: '#8b5cf6' },
  { id: 'estanquidad',     nombre: 'Prueba de Estanquidad',     modelo: Estanquidad,      prefijo: 'EST',  icono: '💧', color: '#06b6d4' },
  { id: 'excavacion',      nombre: 'Excavación de Zanjas',      modelo: Excavacion,       prefijo: 'EXC',  icono: '⛏️', color: '#ef4444' },
  { id: 'prueba-hidraulica', nombre: 'Prueba Hidráulica',       modelo: PruebaHidraulica, prefijo: 'HID',  icono: '🌊', color: '#3b82f6' },
  { id: 'relleno',         nombre: 'Relleno y Compactación',    modelo: Relleno,          prefijo: 'REL',  icono: '🪨', color: '#84cc16' },
  { id: 'tuberia',         nombre: 'Instalación de Tuberías',   modelo: Tuberia,          prefijo: 'TUB',  icono: '🔧', color: '#ec4899' },
  { id: 'vereda',          nombre: 'Reposición de Veredas',     modelo: Vereda,           prefijo: 'VER',  icono: '🧱', color: '#a855f7' }
];

/**
 * GET /api/dashboard
 * Devuelve todos los registros consolidados de todos los tipos de protocolo
 * Query params:
 *   - tipo: filtrar por tipo (ej: 'buzon', 'concreto')
 *   - search: búsqueda por nro_protocolo
 *   - page: número de página (default 1)
 *   - limit: registros por página (default 50)
 */
router.get('/', async (req, res) => {
  try {
    const { tipo, search, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const pageSize = parseInt(limit);

    // Determinar qué tipos consultar
    const tiposAConsultar = tipo
      ? TIPOS_PROTOCOLO.filter(t => t.id === tipo)
      : TIPOS_PROTOCOLO;

    // Consultar todos los modelos en paralelo
    const resultados = await Promise.all(
      tiposAConsultar.map(async (tipoInfo) => {
        let query = {};
        if (search) {
          query.nro_protocolo = { $regex: search, $options: 'i' };
        }
        const docs = await tipoInfo.modelo
          .find(query)
          .select('nro_protocolo fecha pdf_url responsables proyecto')
          .sort({ createdAt: -1 })
          .lean();

        return docs.map(doc => ({
          _id: doc._id,
          tipo: tipoInfo.id,
          tipo_nombre: tipoInfo.nombre,
          tipo_icono: tipoInfo.icono,
          tipo_color: tipoInfo.color,
          nro_protocolo: doc.nro_protocolo,
          fecha: doc.fecha,
          pdf_url: doc.pdf_url || null,
          proyecto: doc.proyecto || '',
          responsable_calidad: doc.responsables?.calidad || '',
          responsable_residente: doc.responsables?.residente || '',
          responsable_supervision: doc.responsables?.supervision || ''
        }));
      })
    );

    // Aplanar y ordenar por fecha descendente
    let todos = resultados.flat();
    todos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Aplicar paginación
    const total = todos.length;
    const paginados = todos.slice(skip, skip + pageSize);

    res.json({
      registros: paginados,
      paginacion: {
        total,
        page: parseInt(page),
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize)
      },
      tipos: TIPOS_PROTOCOLO.map(t => ({
        id: t.id,
        nombre: t.nombre,
        prefijo: t.prefijo,
        icono: t.icono,
        color: t.color
      }))
    });
  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).json({ error: 'Error al obtener datos del dashboard: ' + error.message });
  }
});

/**
 * GET /api/dashboard/tipos
 * Devuelve los tipos de protocolo disponibles con conteos
 */
router.get('/tipos', async (req, res) => {
  try {
    const conteos = await Promise.all(
      TIPOS_PROTOCOLO.map(async (tipoInfo) => {
        const total = await tipoInfo.modelo.countDocuments();
        const conPdf = await tipoInfo.modelo.countDocuments({ pdf_url: { $ne: '', $exists: true } });
        return {
          id: tipoInfo.id,
          nombre: tipoInfo.nombre,
          prefijo: tipoInfo.prefijo,
          icono: tipoInfo.icono,
          color: tipoInfo.color,
          total,
          conPdf
        };
      })
    );
    res.json(conteos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
