import { MongoClient, ObjectId } from 'mongodb';

// 1. URL del cluster de streaming
const url = "mongodb+srv://Astrid_ayelen:michu@clusterstreamingtpi.bikjfrm.mongodb.net/streaming_tpi?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = 'streaming_tpi';

// --- CREATE (Inserción respetando la regla híbrida del validador) ---
async function registrarVisualizacion(db, datosVisualizacion) {
    const collection = db.collection('visualizaciones');
    
    // Construimos el documento respetando estrictamente el $jsonSchema del validador de negocio
    const visualizacionEstructurada = {
        usuarioId: new ObjectId(datosVisualizacion.usuarioId),
        contenidoId: new ObjectId(datosVisualizacion.contenidoId),
        fecha: new Date(), // Fecha actual de reproducción
        minutosReproducidos: NumberInt(datosVisualizacion.minutos), // Tipo int mandatorio
        dispositivo: datosVisualizacion.dispositivo, // Debe cumplir el enum
        finalizado: datosVisualizacion.finalizado,
        // CAMPO DESNORMALIZADO OBLIGATORIO por el validador $expr del TPI 1
        usuarioSuscripcion: {
            fechaBaja: datosVisualizacion.fechaBaja || null // Date o null según esquema
        }
    };

    const result = await collection.insertOne(visualizacionEstructurada);
    console.log(`[CREATE] Visualización registrada bajo el validador de negocio. ID: ${result.insertedId}`);
    return result;
}

// --- READ (Lectura respetando la Baja Lógica del negocio) ---
async function listarUsuariosActivos(db) {
    const collection = db.collection('usuarios');
    // El filtro { activo: true } cumple con el requerimiento de baja lógica 
    const usuariosActivos = await collection.find({ activo: true }).toArray();
    console.log(`[READ] Usuarios activos listados: ${usuariosActivos.length}`);
    return usuariosActivos;
}

// --- UPDATE (Modificación de campos específicos) ---
async function actualizarPlanUsuario(db, idUsuario, nuevoPrecio) {
    const collection = db.collection('usuarios');
    // Modificamos el precio dentro del objeto embebido plan
    const result = await collection.updateOne(
        { _id: new ObjectId(idUsuario) },
        { $set: { "plan.precio": NumberInt(nuevoPrecio) } }
    );
    console.log(`[UPDATE] Plan de usuario actualizado. Documentos modificados: ${result.modifiedCount}`);
    return result;
}

// --- DELETE (Baja Lógica) ---
async function aplicarBajaLogicaUsuario(db, idUsuario) {
    const collection = db.collection('usuarios');

    const result = await collection.updateOne(
        { _id: new ObjectId(idUsuario) },
        { 
            $set: { 
                activo: false, 
                fechaBaja: new Date() // Setea la fecha de desvinculación actual
            } 
        }
    );
    console.log(`[DELETE] Baja lógica aplicada al usuario con ID: ${idUsuario}`);
    return result;
}

// Helper para castear enteros como lo hace el motor nativo
function NumberInt(value) {
    return parseInt(value);
}

// --- ORQUESTADOR DE PRUEBAS ---
async function ejecutarTPI() {
    try {
        await client.connect();
        const db = client.db(dbName);
        console.log("--- CONECTADO CON ÉXITO A STREAMING_TPI DE ATLAS ---");

        // 1. PRUEBA READ: Traemos un usuario activo real de la base de datos 
        const activos = await listarUsuariosActivos(db);
        if(activos.length > 0) {
            const unUsuario = activos[0];
            
            // 2. PRUEBA UPDATE: Actualizamos el precio de su plan
            await actualizarPlanUsuario(db, unUsuario._id, 5200);

            // 3. PRUEBA CREATE: Simulamos que este usuario ve un contenido (ej: Duna Parte Dos)
            // Usamos un ObjectId ficticio para contenidos solo para la prueba de inserción
            const datosReproduccion = {
                usuarioId: unUsuario._id,
                contenidoId: "6a16123839c7437f50e6b213", // ID de Duna 
                minutos: 45,
                dispositivo: "Smart TV", // Cumple el enum
                finalizado: false,
                fechaBaja: unUsuario.fechaBaja
            };
            await registrarVisualizacion(db, datosReproduccion);

            // 4. PRUEBA DELETE: Aplicamos la baja lógica de prueba sobre el usuario
            // await aplicarBajaLogicaUsuario(db, unUsuario._id);
        }

    } catch (error) {
        console.error("Error de validación de esquema en Atlas:", error);
    } finally {
        await client.close();
        console.log("Conexión cloud cerrada.");
    }
}

ejecutarTPI();