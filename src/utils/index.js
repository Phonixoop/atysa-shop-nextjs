export function jsonify(value) {
  return JSON.parse(JSON.stringify(value));
}
