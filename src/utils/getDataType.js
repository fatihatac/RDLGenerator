function getRdlTypeName(value) {
  if (typeof value === "number") return "System.Double";
  if (typeof value === "boolean") return "System.Boolean";

  if (typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
  ) {
    return "System.DateTime";
  }

  return "System.String";
}

export { getRdlTypeName };
