'use strict';

// Trazabilidad requisito -> tests.
//
// Lee los requisitos de specs/base/*.md (líneas "- **ID** — texto") y los identificadores
// que citan los tests ("[ID]" en el nombre del test o en su docstring), y los cruza.
// Uso directo: node tests/js/helpers/trazabilidad.js   (o: npm run trace)

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const ID = '[A-Z][A-Z0-9]*-\\d{3}';

function archivos(dir, filtro) {
    return fs.readdirSync(path.join(ROOT, dir))
        .filter(filtro)
        .sort()
        .map(nombre => path.posix.join(dir, nombre));
}

function leerRequisitos() {
    const requisitos = [];
    archivos('specs/base', nombre => nombre.endsWith('.md')).forEach(archivo => {
        fs.readFileSync(path.join(ROOT, archivo), 'utf8').split(/\r?\n/).forEach((linea, i) => {
            const encontrado = linea.match(new RegExp(`^- \\*\\*(${ID})\\*\\* — (.+)$`));
            if (!encontrado) return;
            const pendiente = encontrado[2].match(/⚠ (PEND-\d+)\s*$/);
            requisitos.push({
                id: encontrado[1],
                texto: encontrado[2].replace(/\s*⚠ PEND-\d+\s*$/, ''),
                pendiente: pendiente ? pendiente[1] : null,
                archivo,
                linea: i + 1
            });
        });
    });
    return requisitos;
}

// Tests que citan un requisito: [{ id, archivo, pendiente }]
function leerTests() {
    const citas = [];
    const fuentes = [
        ...archivos('tests/js', nombre => nombre.endsWith('.test.js')),
        ...archivos('tests', nombre => /^test_.*\.py$/.test(nombre))
    ];
    fuentes.forEach(archivo => {
        fs.readFileSync(path.join(ROOT, archivo), 'utf8').split(/\r?\n/).forEach((linea) => {
            // JavaScript: test('[ID] nombre', { todo: 'PEND-NN: motivo' }, ...)   Python: """[ID] descripción"""
            const cita = linea.match(new RegExp(`^(?:test\\(['"\`]|\\s*""")\\[(${ID})\\]`));
            if (!cita) return;
            const pendiente = linea.match(/todo:\s*['"`](PEND-\d+)/);
            citas.push({ id: cita[1], archivo, pendiente: pendiente ? pendiente[1] : null });
        });
    });
    return citas;
}

function construir() {
    const requisitos = leerRequisitos();
    const tests = leerTests();
    const memoria = fs.readFileSync(path.join(ROOT, 'MEMORY.md'), 'utf8');
    const problemas = [];

    const vistos = new Map();
    requisitos.forEach(requisito => {
        if (vistos.has(requisito.id)) {
            problemas.push(`${requisito.id} está duplicado: ${vistos.get(requisito.id)} y ${requisito.archivo}`);
        }
        vistos.set(requisito.id, requisito.archivo);
    });

    const matriz = requisitos.map(requisito => {
        const propios = tests.filter(t => t.id === requisito.id);
        if (propios.length === 0) {
            problemas.push(`${requisito.id} (${requisito.archivo}:${requisito.linea}) no tiene ningún test`);
        }

        const pendientesTest = [...new Set(propios.map(t => t.pendiente).filter(Boolean))];
        if (requisito.pendiente) {
            if (!propios.some(t => t.pendiente === requisito.pendiente)) {
                problemas.push(`${requisito.id} está marcado ${requisito.pendiente} en la spec pero ningún test suyo está en todo con ese pendiente`);
            }
            if (!new RegExp(`\\*\\*${requisito.pendiente}\\b`).test(memoria)) {
                problemas.push(`${requisito.pendiente} (de ${requisito.id}) no está descrito en MEMORY.md`);
            }
        }
        pendientesTest.filter(p => p !== requisito.pendiente).forEach(p => {
            problemas.push(`${requisito.id} tiene un test en todo (${p}) pero la spec no lo marca con ⚠ ${p}`);
        });

        return { ...requisito, tests: propios.length, archivosTest: [...new Set(propios.map(t => t.archivo))] };
    });

    tests.filter(t => !vistos.has(t.id)).forEach(t => {
        problemas.push(`${t.archivo} cita ${t.id}, que no existe en specs/base/`);
    });

    return { matriz, problemas, totalTests: tests.length };
}

if (require.main === module) {
    const { matriz, problemas, totalTests } = construir();
    let actual = '';
    matriz.forEach(requisito => {
        if (requisito.archivo !== actual) {
            actual = requisito.archivo;
            console.log(`\n${actual}`);
        }
        const marca = requisito.pendiente ? ` [${requisito.pendiente}]` : '';
        const texto = requisito.texto.length > 88 ? `${requisito.texto.slice(0, 85)}...` : requisito.texto;
        console.log(`  ${requisito.id.padEnd(9)} ${String(requisito.tests).padStart(2)} test(s)${marca}  ${texto}`);
    });

    const pendientes = matriz.filter(r => r.pendiente);
    console.log(`\n${matriz.length} requisitos, ${totalTests} tests que los citan, ${pendientes.length} requisitos pendientes de cumplir.`);
    if (problemas.length) {
        console.log('\nProblemas de trazabilidad:');
        problemas.forEach(problema => console.log(`  - ${problema}`));
        process.exit(1);
    }
}

module.exports = { construir, leerRequisitos, leerTests };
