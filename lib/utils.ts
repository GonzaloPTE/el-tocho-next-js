import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from "slugify"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugifyText(text: string): string {
  return slugify(text, {
    lower: true, // convert to lower case
    strict: true, // strip special characters except replacement
    remove: /[*+~.()'"!:@]/g, // remove characters that match regex, replacement is applied first
    locale: "es", // language-specific replacements
    trim: true, // trim leading and trailing replacement chars
  })
}

// --- Transposition Logic (Spanish Notation) ---
const NOTAS_ESP_SOSTENIDOS: string[] = ['DO', 'DO#', 'RE', 'RE#', 'MI', 'FA', 'FA#', 'SOL', 'SOL#', 'LA', 'LA#', 'SI'];
// NOTAS_ESP_BEMOLES is not strictly needed if normalization to sostenidos is always applied before indexing.
const MAPA_BEMOLES_A_SOSTENIDOS: { [key: string]: string } = {
  'REB': 'DO#',
  'MIB': 'RE#',
  'SOLB': 'FA#',
  'LAB': 'SOL#',
  'SIB': 'LA#'
  // Casos como DOB (SI) o FAB (MI) son menos comunes en cifrados simples y se omiten aquí por simplicidad,
  // pero podrían añadirse si es necesario.
};

// Shared pattern for identifying potential Spanish chord roots and structures
const _INTERNAL_CHORD_PATTERN = /^(DO|RE|MI|FA|SOL|LA|SI)([#bB]?)(.*)$/i;

function normalizarRaizEspanola(raizConAlteracionMayusculas: string): string {
  // Asume que raizConAlteracionMayusculas ya está en mayúsculas.
  // Ejemplo: REb -> DO#, SOLb -> FA#
  if (MAPA_BEMOLES_A_SOSTENIDOS[raizConAlteracionMayusculas]) {
    return MAPA_BEMOLES_A_SOSTENIDOS[raizConAlteracionMayusculas];
  }
  // Manejar el caso de notas sin alteración o ya con sostenido
  // e.g. DO, FA#, MI. Esto también cubre casos como MI# (FA) o SI# (DO) si estuvieran en NOTAS_ESP_SOSTENIDOS.
  // Si la nota es algo como "MI#", y "MI#" está en NOTAS_ESP_SOSTENIDOS, se devolverá "MI#".
  // Si se quisiera normalizar MI# a FA, esa lógica iría aquí o en la lista de mapeo.
  // Por ahora, confiamos en que NOTAS_ESP_SOSTENIDOS contiene la forma canónica preferida.
  return raizConAlteracionMayusculas; 
}

function getIndiceNotaEspanola(raizNormalizadaMayusculas: string): number {
  // raizNormalizadaMayusculas ya debe estar en formato sostenido y mayúsculas.
  return NOTAS_ESP_SOSTENIDOS.indexOf(raizNormalizadaMayusculas);
}

function transponerRaizEspanolaUnica(raizOriginalConAlteracionMayusculas: string, semitonos: number): string {
  const raizNormalizada = normalizarRaizEspanola(raizOriginalConAlteracionMayusculas);
  const indiceActual = getIndiceNotaEspanola(raizNormalizada);

  if (indiceActual === -1) {
    return raizOriginalConAlteracionMayusculas; // No se pudo encontrar la nota, devolver original
  }

  const nuevoIndice = (indiceActual + semitonos + NOTAS_ESP_SOSTENIDOS.length) % NOTAS_ESP_SOSTENIDOS.length;
  return NOTAS_ESP_SOSTENIDOS[nuevoIndice];
}

// Heuristic constants for line type detection
const MIN_CHORD_LIKE_RATIO_FOR_CHORD_LINE = 0.6; 
const MIN_PARTS_FOR_MULTI_SPACE_HEURISTIC = 2; 
const MIN_CHORD_LIKE_RATIO_FOR_MULTI_SPACE_PARTS = 0.5;

function _isLikelyChordToken(token: string): boolean {
  const trimmedToken = token.trim();
  if (trimmedToken === '') return false;
  return _INTERNAL_CHORD_PATTERN.test(trimmedToken);
}

function _detectLineType(line: string): 'chord' | 'lyric' {
  const trimmedLine = line.trim();
  if (trimmedLine === '') return 'lyric';

  const multiSpaceParts = trimmedLine.split(/\s{2,}/);
  if (multiSpaceParts.length >= MIN_PARTS_FOR_MULTI_SPACE_HEURISTIC) {
    const chordLikeMultiSpaceParts = multiSpaceParts.filter(_isLikelyChordToken).length;
    if (chordLikeMultiSpaceParts / multiSpaceParts.length >= MIN_CHORD_LIKE_RATIO_FOR_MULTI_SPACE_PARTS) {
      return 'chord';
    }
  }

  const singleSpaceTokens = trimmedLine.split(/\s+/);
  const nonEmptyTokens = singleSpaceTokens.filter(t => t.trim() !== '');
  if (nonEmptyTokens.length === 0) return 'lyric';

  const chordLikeTokens = nonEmptyTokens.filter(_isLikelyChordToken).length;
  if (nonEmptyTokens.length > 0 && chordLikeTokens / nonEmptyTokens.length >= MIN_CHORD_LIKE_RATIO_FOR_CHORD_LINE) {
    return 'chord';
  }
  
  if (nonEmptyTokens.length > 0 && nonEmptyTokens.length <= 2 && chordLikeTokens === nonEmptyTokens.length) {
      return 'chord';
  }

  return 'lyric';
}

export function transposeChord(originalFullChord: string, semitonos: number, isLikelyChordLine: boolean = false): string {
  if (semitonos === 0) return originalFullChord;

  const match = originalFullChord.match(_INTERNAL_CHORD_PATTERN);
  if (!match) {
    return originalFullChord;
  }

  const raizParseadaConSuCasoOriginal = match[1];
  let alteracionOriginal = match[2];
  const sufijoCualidad = match[3];

  const COMMON_LC_WORDS_AS_NOTES = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];
  if (
    !isLikelyChordLine && // Apply heuristic only if NOT on a likely chord line
    alteracionOriginal === '' &&
    sufijoCualidad === '' &&
    COMMON_LC_WORDS_AS_NOTES.includes(raizParseadaConSuCasoOriginal.toLowerCase()) &&
    raizParseadaConSuCasoOriginal === raizParseadaConSuCasoOriginal.toLowerCase()
  ) {
    return originalFullChord;
  }

  if (alteracionOriginal.toUpperCase() === 'B') {
    alteracionOriginal = 'b';
  }

  const raizEnMayusculasParaTransponer = raizParseadaConSuCasoOriginal.toUpperCase() + alteracionOriginal.toUpperCase();
  const raizEspanolaTranspuestaConAlteracion = transponerRaizEspanolaUnica(raizEnMayusculasParaTransponer, semitonos);

  if (raizEspanolaTranspuestaConAlteracion === raizEnMayusculasParaTransponer) {
    if (semitonos % 12 !== 0) {
      return originalFullChord;
    }
  }

  return raizEspanolaTranspuestaConAlteracion + sufijoCualidad;
}
// --- End Transposition Logic ---

// --- Full Lyrics Transposition Function ---
export function transposeFullLyrics(lyrics: string, semitonos: number): string {
  if (semitonos === 0) return lyrics;

  const lines = lyrics.split('\n');
  const transposedLines = lines.map(line => {
    const lineType = _detectLineType(line);
    const isChordLine = lineType === 'chord';
    const trimmedLine = line.trim(); // For the new condition

    const parts = line.split(/(\s+)/);
    const processedParts = parts.map(part => {
      if (part.match(/^\s+$/) || part === '') {
        return part;
      }
      const contentToProcess = part.trim();
      if (contentToProcess === '') return part;

      let prefix = '';
      let suffix = '';
      let potentialChord = contentToProcess;
      let originalPartBeforeDelimiterStripping = part; // Keep original part for returning if not transposed

      if ((contentToProcess.startsWith('[') && contentToProcess.endsWith(']')) ||
          (contentToProcess.startsWith('(') && contentToProcess.endsWith(')'))) {
        if (contentToProcess.length > 2) {
          prefix = contentToProcess.charAt(0);
          suffix = contentToProcess.charAt(contentToProcess.length - 1);
          potentialChord = contentToProcess.substring(1, contentToProcess.length - 1);
        } else {
          return originalPartBeforeDelimiterStripping; // It's just "[]" or "()"
        }
      }
      
      let transposedCoreChord = potentialChord;
      let shouldAttemptTranspose = false;

      if (isChordLine) {
        shouldAttemptTranspose = true;
      } else {
        // On a lyric line, only attempt to transpose if the *entire trimmed line* is this potential chord
        // (after its own delimiters are stripped).
        if (trimmedLine === (prefix + potentialChord + suffix)) {
          shouldAttemptTranspose = true;
        }
      }

      if (shouldAttemptTranspose) {
        transposedCoreChord = transposeChord(potentialChord, semitonos, isChordLine);
      }

      if (transposedCoreChord === potentialChord) {
        // If no change, return the original part including its surrounding spaces and original delimiters
        return originalPartBeforeDelimiterStripping; 
      }
      // If transposed, reconstruct with original prefix/suffix, but use the (trimmed) part's surrounding spaces implicitly via join('')
      return prefix + transposedCoreChord + suffix;
    });
    return processedParts.join('');
  });
  return transposedLines.join('\n');
}
