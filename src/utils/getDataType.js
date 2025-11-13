function getRdlTypeName(value) {
  if (typeof value === 'number') return 'System.Double';
  if (typeof value === 'boolean') return 'System.Boolean';
  return 'System.String';
}

export { getRdlTypeName };