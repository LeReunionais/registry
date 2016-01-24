module.exports = {
  validate: (json) => {
    if (json.id === undefined) return { valid:false , message: "no id defined"};
    if (typeof json.method !== "string") return { valid:false , message: "method is nto valid"};
    if (json.jsonrpc !== "2.0") return { valid:false , message: "jsonrpc version MUST be '2.0'"};
    return { valid: true };
  }
}
