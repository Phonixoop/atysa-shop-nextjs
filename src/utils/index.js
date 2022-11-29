export function jsonify(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getPathName(path) {
  return path?.substring(path.lastIndexOf("/") + 1);
}
