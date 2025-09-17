export default class FlowNotFount extends Error {
  constructor() {
    super("El flujo que no existe");
  }
}
