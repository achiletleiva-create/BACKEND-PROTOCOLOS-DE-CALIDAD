/**
 * Script de limpieza de PDFs rotos de Cloudinary y BD
 * 
 * Uso: node scripts/cleanupPdfs.js
 * 
 * Este script:
 * 1. Busca todos los registros en la BD que tienen pdf_url
 * 2. Intenta verificar si la URL es válida (responde 200)
 * 3. Si la URL es inválida, elimina el recurso de Cloudinary y resetea pdf_url a ""
 * 
 * PRECAUCIÓN: Ejecutar solo después de haber hecho backup de la BD
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('../config/db');

const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

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

const MODELOS = [
  { nombre: 'Protocolo', modelo: Protocolo },
  { nombre: 'Buzon', modelo: Buzon },
  { nombre: 'Conexion', modelo: Conexion },
  { nombre: 'ConexionTramo', modelo: ConexionTramo },
  { nombre: 'Estanquidad', modelo: Estanquidad },
  { nombre: 'Excavacion', modelo: Excavacion },
  { nombre: 'PruebaHidraulica', modelo: PruebaHidraulica },
  { nombre: 'Relleno', modelo: Relleno },
  { nombre: 'Tuberia', modelo: Tuberia },
  { nombre: 'Vereda', modelo: Vereda }
];

/**
 * Extrae el public_id de una URL de Cloudinary
 * Ej: https://res.cloudinary.com/demo/image/upload/v1234/Protocolos_Victor_Larco/PDFs/pdf_abc_123.pdf
 *     → Protocolos_Victor_Larco/PDFs/pdf_abc_123
 */
function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  // Buscar el patrón: /upload/.../Protocolos_Victor_Larco/PDFs/...
  const match = url.match(/\/Protocolos_Victor_Larco\/PDFs\/(.+)\.pdf/i);
  if (match) {
    return `Protocolos_Victor_Larco/PDFs/${match[1]}`;
  }
  
  // También buscar sin extensión
  const match2 = url.match(/\/Protocolos_Victor_Larco\/PDFs\/([^/]+?)(?:\.[a-z]+)?(?:\?.*)?$/i);
  if (match2) {
    return `Protocolos_Victor_Larco/PDFs/${match2[1].replace(/\.[^.]+$/, '')}`;
  }
  
  return null;
}

/**
 * Verifica si una URL responde correctamente (status 200)
 */
async function checkUrl(url) {
  try {
    const https = require('https');
    return new Promise((resolve) => {
      const req = https.get(url, { timeout: 10000 }, (res) => {
        resolve(res.statusCode === 200);
        res.resume();
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
    });
  } catch {
    return false;
  }
}

/**
 * Elimina un recurso de Cloudinary por su public_id
 */
async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    if (result.result === 'ok') {
      console.log(`  ✅ Eliminado de Cloudinary (image): ${publicId}`);
      return true;
    }
    
    // Si falló como image, intentar como raw
    const result2 = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    if (result2.result === 'ok') {
      console.log(`  ✅ Eliminado de Cloudinary (raw): ${publicId}`);
      return true;
    }
    
    console.log(`  ⚠️ No se pudo eliminar de Cloudinary: ${publicId} - ${result2.result}`);
    return false;
  } catch (err) {
    console.log(`  ❌ Error al eliminar de Cloudinary: ${publicId} - ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🧹 Iniciando limpieza de PDFs rotos...\n');
  
  let totalRegistros = 0;
  let totalRotos = 0;
  let totalEliminadosCloudinary = 0;
  let totalReseteadosBD = 0;

  for (const { nombre, modelo } of MODELOS) {
    console.log(`\n📋 Procesando ${nombre}...`);
    
    const registros = await modelo.find({ pdf_url: { $ne: '', $exists: true } }).lean();
    console.log(`   ${registros.length} registros con pdf_url`);
    
    for (const reg of registros) {
      totalRegistros++;
      const url = reg.pdf_url;
      
      if (!url || typeof url !== 'string') {
        console.log(`   ⏭️ [${reg.nro_protocolo || reg._id}] pdf_url vacío, saltando`);
        continue;
      }
      
      // Verificar si la URL es válida
      const esValida = await checkUrl(url);
      
      if (!esValida) {
        totalRotos++;
        console.log(`   🔴 [${reg.nro_protocolo || reg._id}] URL rota: ${url.substring(0, 80)}...`);
        
        // Extraer public_id y eliminar de Cloudinary
        const publicId = extractPublicIdFromUrl(url);
        if (publicId) {
          const eliminado = await deleteFromCloudinary(publicId);
          if (eliminado) totalEliminadosCloudinary++;
        } else {
          console.log(`   ⚠️ No se pudo extraer public_id de la URL`);
        }
        
        // Resetear pdf_url en BD
        await modelo.findByIdAndUpdate(reg._id, { pdf_url: '' });
        totalReseteadosBD++;
        console.log(`   ✅ pdf_url reseteado en BD para ${reg.nro_protocolo || reg._id}`);
      } else {
        console.log(`   🟢 [${reg.nro_protocolo || reg._id}] URL válida`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE LIMPIEZA');
  console.log('='.repeat(60));
  console.log(`Total registros revisados:    ${totalRegistros}`);
  console.log(`URLs rotas encontradas:       ${totalRotos}`);
  console.log(`Eliminados de Cloudinary:     ${totalEliminadosCloudinary}`);
  console.log(`Reseteados en BD:             ${totalReseteadosBD}`);
  console.log('='.repeat(60));
  console.log('\n✅ Limpieza completada.');
  console.log('📝 Ahora puedes volver a subir los PDFs desde la aplicación.');
  
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error en el script:', err);
  process.exit(1);
});
