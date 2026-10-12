'use strict';

// Mantiene sincronizados la especificación (specs/base/), los tests y los pendientes de MEMORY.md.
// Ver "Trazabilidad" en specs/README.md.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { construir } = require('./helpers/trazabilidad');

test('cada requisito de specs/base tiene al menos un test y cada test cita un requisito que existe', () => {
    const { matriz, problemas } = construir();

    assert.ok(matriz.length > 0, 'no se encontraron requisitos en specs/base/');
    assert.deepEqual(problemas, []);
});
