# Plan de Implementación: Transposición de Acordes en Español (Directa y Simplificada)

El objetivo es refactorizar la lógica de transposición para manejar acordes en notación española (DO, RE, MI...), **operando directamente con la notación española y asumiendo que la cualidad del acorde (mayor, menor, etc.) es indicada por el sufijo, no por la capitalización de la nota raíz.** La nota raíz transpuesta se representará de forma consistente (ej. mayúsculas).

## 1. Modificaciones en `lib/utils.ts`

Se actualizará la función `transposeChord` y se añadirán funciones auxiliares para manejar la transposición directa en notación española.

### A. Constantes de Escalas en Español:
-   `NOTAS_ESP_SOSTENIDOS`: Array principal para transposición, usando sostenidos.
    ```typescript
    const NOTAS_ESP_SOSTENIDOS: string[] = ['DO', 'DO#', 'RE', 'RE#', 'MI', 'FA', 'FA#', 'SOL', 'SOL#', 'LA', 'LA#', 'SI'];
    ```
-   `NOTAS_ESP_BEMOLES`: Array alternativo con bemoles, para ayudar en el parseo de entrada y normalización si es necesario, aunque la transposición se basará en `NOTAS_ESP_SOSTENIDOS`.
    ```typescript
    const NOTAS_ESP_BEMOLES: string[] = ['DO', 'REb', 'RE', 'MIb', 'MI', 'FA', 'SOLb', 'SOL', 'LAb', 'LA', 'SIb', 'SI'];
    ```
-   `MAPA_BEMOLES_A_SOSTENIDOS`: Para normalizar raíces bemoles a sus equivalentes en sostenidos para la transposición.
    ```typescript
    const MAPA_BEMOLES_A_SOSTENIDOS: { [key: string]: string } = {
      'REb': 'DO#', 'MIb': 'RE#', 'SOLb': 'FA#', 'LAb': 'SOL#', 'SIb': 'LA#'
      // MI y SI no tienen bemol que sea otra nota natural, FA y DO no tienen sostenido que sea otra nota natural
    };
    ```

### B. Funciones Auxiliares (Internas en `lib/utils.ts`):
-   `normalizarRaizEspanola(raizConAlteracion: string): string`:
    *   Toma una raíz española en mayúsculas con su alteración (ej. "DO#", "REb").
    *   Si es un bemol mapeable (ej. "REb"), lo convierte a su sostenido equivalente (ej. "DO#") usando `MAPA_BEMOLES_A_SOSTENIDOS`.
    *   Devuelve la raíz normalizada en formato sostenido y mayúsculas.
-   `getIndiceNotaEspanola(raizNormalizada: string): number`:
    *   Toma una raíz española normalizada y en mayúsculas (ej. "DO#", "FA").
    *   Busca su índice en `NOTAS_ESP_SOSTENIDOS`.
    *   Devuelve el índice, o -1 si no se encuentra.
-   `transponerRaizEspanolaUnica(raizOriginalConAlteracionMayusculas: string, semitonos: number): string`:
    *   Toma la raíz original con su alteración, **ya en mayúsculas** (ej. "DO#", "MI", "REb").
    *   Normaliza la raíz usando `normalizarRaizEspanola` (ej. "REb" -> "DO#").
    *   Obtiene el índice usando `getIndiceNotaEspanola`.
    *   Si el índice es -1, devuelve la raíz original sin cambios.
    *   Calcula el nuevo índice: `(indiceActual + semitonos + NOTAS_ESP_SOSTENIDOS.length) % NOTAS_ESP_SOSTENIDOS.length`.
    *   Devuelve la nueva raíz con alteración desde `NOTAS_ESP_SOSTENIDOS` (ej. "RE#"), siempre en mayúsculas.

### C. Nueva `transposeChord(originalFullChord: string, semitonos: number)` (Exportada):
1.  **No Transposición:** Si `semitonos` es 0, devolver `originalFullChord` inmediatamente.
2.  **Parseo del Acorde Español (Regex):**
    *   Utilizar una expresión regular para capturar las partes del `originalFullChord`.
        ```typescript
        // Regex to capture:
        // 1. Spanish root: (DO, RE, MI, FA, SOL, LA, SI) - case-insensitive for matching
        // 2. Accidental: (# or b) - optional
        // 3. Quality/Suffix: (m, m7, 7, maj7, dim, sus, aug, +, números, etc.) - optional
        const chordPattern = /^(DO|RE|MI|FA|SOL|LA|SI)([#b]?)(.*)$/i;
        const match = originalFullChord.match(chordPattern);
        ```
    *   Si `originalFullChord` no coincide con el patrón, devolverlo sin cambios.
    *   Extraer `raizEspanolaParseadaOriginal = match[1]` (ej. "do", "FA", "Sol").
    *   Extraer `alteracionOriginal = match[2]` (ej. "#", "b", "").
    *   Extraer `sufijoCualidad = match[3]` (ej. "m", "7", "m7", "").
3.  **Preparación de la Raíz para Transposición:**
    *   Convertir la raíz parseada a mayúsculas para la transposición: `raizEnMayusculasParaTransponer = raizEspanolaParseadaOriginal.toUpperCase() + alteracionOriginal;` (ej. "DO#", "FA", "SOLB").
4.  **Transposición de la Raíz Española:**
    *   `raizEspanolaTranspuestaConAlteracion = transponerRaizEspanolaUnica(raizEnMayusculasParaTransponer, semitonos);` (ej. "RE#", "SOL", "FA#"). Esta función devuelve la raíz siempre en mayúsculas.
    *   Si `raizEspanolaTranspuestaConAlteracion` es igual a `raizEnMayusculasParaTransponer` (porque no se pudo transponer o no cambió), devolver `originalFullChord` para preservar el caso original si no hubo transposición efectiva de la raíz.
5.  **Reconstrucción del Acorde Transpuesto:**
    *   Unir: `return raizEspanolaTranspuestaConAlteracion + sufijoCualidad;` (ej. "RE#m", "SOL7", "FA#"). La raíz (`raizEspanolaTranspuestaConAlteracion`) estará en mayúsculas.

## 2. Modificaciones en `components/client/lyrics-viewer-interactive.tsx` (`displayLyrics` Memo)

Esta sección permanece sin cambios significativos respecto al plan anterior. La principal estrategia de dividir la línea en partes y pasar cada parte a `transposeChord` sigue siendo válida. `transposeChord` ahora tiene una lógica interna más simple para la raíz, pero su interfaz y comportamiento (devolver original si no es acorde) es el mismo.

### A. Estrategia de Procesamiento de Letras:
1.  Si `transpose` es 0, devolver `song.lyrics` sin cambios.
2.  Dividir `song.lyrics` en líneas (`song.lyrics.split('\\n')`).
3.  Para cada línea:
    *   Dividir la línea en "partes" o "segmentos" que podrían ser acordes. Una forma es iterar sobre palabras/tokens separados por espacios, o usar una regex más general para identificar posibles acordes directamente en la línea.
        *   **Opción A (Split por espacios y conservar espacios):**
            ```typescript
            const parts = line.split(/(\s+)/); // Divide por grupos de espacios, conservándolos
            const processedParts = parts.map(part => {
              if (part.match(/^\\s+$/) || part === '') return part; // Es espacio o vacío, mantener
              // Para partes no vacías y no solo espacios, intentar transponer.
              // transposeChord debe devolver la parte original si no es un acorde reconocible.
              return transposeChord(part.trim(), transpose); 
            });
            return processedParts.join('');
            ```
        *   **Opción B (Regex para buscar acordes en la línea):** Esto es más complejo de generalizar para todos los formatos de letras, pero podría ser más preciso si los acordes no siempre están separados por espacios claros. Se podría usar `line.replace()` con una regex global que identifique acordes (usando el patrón de `transposeChord` o uno similar) y aplique la transposición a cada coincidencia.
    *   La **Opción A** es más simple de implementar inicialmente y se basa en la robustez de `transposeChord` para ignorar texto que no sea acorde.
4.  Unir las líneas procesadas con `\\n`.

### B. Consideraciones para `displayLyrics`:
-   **Robustez de `transposeChord`:** Fundamental. Debe devolver el texto original si no es un acorde claramente identificable por su patrón interno.
-   **Manejo de Falsos Positivos:** La regex `chordPattern` dentro de `transposeChord` debe ser lo más precisa posible para el formato de acorde español.
-   **Preservación de Formato:** La estrategia de dividir y unir (especialmente con Opción A) busca preservar el espaciado original.
-   **Delimitadores ([], () ):** El plan actual asume que `transposeChord` recibe la cadena *sin* delimitadores como `[]` o `()`. Si las letras contienen acordes como `[DO]` o `(fa)`, `displayLyrics` necesitaría un paso previo para extraer el contenido (ej. "DO", "fa") antes de llamar a `transposeChord`, y luego reinsertar los delimitadores alrededor del resultado transpuesto. Alternativamente, la regex en `transposeChord` podría intentar manejar delimitadores opcionales, pero es más limpio separarlo.
    *   **Actualización para delimitadores:** `displayLyrics` podría usar una regex para encontrar `[acorde]` o `(acorde)`, extraer `acorde`, transponerlo, y luego reconstruir `[transpuesto]` o `(transpuesto)`. Las palabras sueltas se pasarían directamente a `transposeChord`.

## 3. Pruebas:
Permanece igual: usar `lib/data/lyrics-ejemplo.txt` y casos variados.

Este plan simplificado elimina la complejidad de inferir y reaplicar la capitalización de la raíz, asumiendo que los sufijos de los acordes (como "m") son los indicadores primarios de la cualidad mayor/menor. La raíz transpuesta será consistentemente en mayúsculas. 