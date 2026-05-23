import crypto from 'crypto';

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

/**
 * Generate a cryptographically secure random password.
 *
 * @param {object} [options]
 * @param {number}  [options.length=12]         - Total password length
 * @param {boolean} [options.uppercase=true]    - Include uppercase letters
 * @param {boolean} [options.lowercase=true]    - Include lowercase letters
 * @param {boolean} [options.digits=true]       - Include digits
 * @param {boolean} [options.symbols=false]     - Include special characters
 * @returns {string} Generated password
 */
const generatePassword = ({
  length = 12,
  uppercase = true,
  lowercase = true,
  digits = true,
  symbols = false,
} = {}) => {
  let charset = '';
  const required = [];

  if (uppercase) { charset += CHARSETS.uppercase; required.push(CHARSETS.uppercase); }
  if (lowercase) { charset += CHARSETS.lowercase; required.push(CHARSETS.lowercase); }
  if (digits)    { charset += CHARSETS.digits;    required.push(CHARSETS.digits); }
  if (symbols)   { charset += CHARSETS.symbols;   required.push(CHARSETS.symbols); }

  if (!charset) throw new Error('At least one character set must be enabled.');

  const effectiveLength = Math.max(length, required.length);
  const password = [];

  // Guarantee at least one character from each required set
  required.forEach((set) => {
    password.push(randomChar(set));
  });

  // Fill remaining positions from the full charset
  while (password.length < effectiveLength) {
    password.push(randomChar(charset));
  }

  // Shuffle using Fisher-Yates with crypto randomness
  return shuffleArray(password).join('');
};

/**
 * Generate a memorable password using word-number-symbol pattern.
 * e.g. "Tiger482!Mango"
 *
 * @returns {string}
 */
const generateMemorablePassword = () => {
  const adjectives = ['Swift', 'Brave', 'Calm', 'Dark', 'Epic', 'Fast', 'Gold', 'Iron', 'Jade', 'Kind'];
  const nouns = ['Tiger', 'Eagle', 'Storm', 'Flame', 'Frost', 'River', 'Stone', 'Cloud', 'Spark', 'Blaze'];
  const symbols = ['!', '@', '#', '$', '%'];

  const adj = adjectives[secureRandomInt(adjectives.length)];
  const noun = nouns[secureRandomInt(nouns.length)];
  const num = String(secureRandomInt(900) + 100); // 100-999
  const sym = symbols[secureRandomInt(symbols.length)];

  return `${adj}${num}${sym}${noun}`;
};

// --- Private helpers ---

const randomChar = (charset) => {
  const idx = secureRandomInt(charset.length);
  return charset[idx];
};

const secureRandomInt = (max) => {
  const randomBytes = crypto.randomBytes(4);
  return randomBytes.readUInt32BE(0) % max;
};

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export {
  generatePassword,
  generateMemorablePassword,
};