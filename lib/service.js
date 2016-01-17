module.exports = {
  validate: (service) => {
    if (!service.name || typeof service.name !== "string") return false;
    if (!service.hostname || typeof service.hostname !== "string") return false;
    if (!service.port || typeof service.port !== "number") return false;
    if (!service.protocol || typeof service.protocol !== "string") return false;
    return true;
  },
  format: (service) => {
    return {
      name: service.name,
      hostname: service.hostname,
      port: service.port,
      protocol: service.protocol
    }
  }
}
