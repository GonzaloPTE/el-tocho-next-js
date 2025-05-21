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
// Regex to identify a single complete chord iteratively. Uses a lookahead to correctly segment.
// Captures: 1:Root, 2:Accidental, 3:Suffix. The whole match is match[0].
const ITERATIVE_CHORD_REGEX = /^(DO|RE|MI|FA|SOL|LA|SI)([#bB]?)(.*?)(?=(?:DO|RE|MI|FA|SOL|LA|SI)(?:[#bB]?)|\/|$|\s|[\[(])/i;

export function transposeFullLyrics(lyrics: string, semitonos: number): string {
  if (semitonos === 0) return lyrics;

  const lines = lyrics.split('\n');
  const transposedLines = lines.map(line => {
    const lineType = _detectLineType(line);
    const isChordLine = lineType === 'chord';
    const trimmedLineOriginal = line.trim(); // For the lyric line condition

    if (isChordLine) {
      let currentLineContent = line; // Process the whole line, including leading/trailing spaces initially handled by loop
      let resultLine = '';
      while (currentLineContent.length > 0) {
        const match = ITERATIVE_CHORD_REGEX.exec(currentLineContent);
        if (match && match.index === 0) { // Ensure match is at the beginning
          const matchedChord = match[0];
          const transposed = transposeChord(matchedChord, semitonos, true);
          resultLine += transposed;
          currentLineContent = currentLineContent.substring(matchedChord.length);
        } else {
          // Not a chord at the beginning, or no match. Append the first character and continue.
          resultLine += currentLineContent.charAt(0);
          currentLineContent = currentLineContent.substring(1);
        }
      }
      return resultLine;
    } else {
      // Existing logic for lyric lines (splitting by space, handling [] () delimiters etc.)
      const parts = line.split(/(\s+)/); // Split by whitespace, keeping spaces as parts
      const processedParts = parts.map(part => {
        if (part.match(/^\s+$/) || part === '') {
          return part; // Preserve whitespace parts
        }
        // For non-whitespace parts, attempt to process as a potential chord with delimiters
        const contentToProcess = part; // No trim here, keep original part from split
        
        let prefix = '';
        let suffix = '';
        let potentialChord = contentToProcess;
        let originalPartForReturn = part; // Use this to return if not transposed

        if ((contentToProcess.startsWith('[') && contentToProcess.endsWith(']')) ||
            (contentToProcess.startsWith('(') && contentToProcess.endsWith(')'))) {
          if (contentToProcess.length > 2) {
            prefix = contentToProcess.charAt(0);
            suffix = contentToProcess.charAt(contentToProcess.length - 1);
            potentialChord = contentToProcess.substring(1, contentToProcess.length - 1);
          } else {
            return originalPartForReturn; // It's just "[]" or "()"
          }
        }
        
        let transposedCoreChord = potentialChord;
        let shouldAttemptTranspose = false;

        // On a lyric line, only attempt to transpose if the *entire trimmed original line* 
        // is this specific part (after its own delimiters are stripped and re-added for comparison).
        // This prevents transposing words within lyrics unless the line *only* contains that word/chord.
        if (trimmedLineOriginal === (prefix + potentialChord + suffix)) {
          shouldAttemptTranspose = true;
        }

        if (shouldAttemptTranspose) {
          // For lyric lines, isLikelyChordLine is false for transposeChord's heuristic
          transposedCoreChord = transposeChord(potentialChord, semitonos, false);
        }

        if (transposedCoreChord === potentialChord) {
          return originalPartForReturn; 
        }
        return prefix + transposedCoreChord + suffix;
      });
      return processedParts.join('');
    }
  });
  return transposedLines.join('\n');
}
