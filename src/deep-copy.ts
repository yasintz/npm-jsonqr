function deepCopy(node: any) {
  return JSON.parse(JSON.stringify(node));
}

export default deepCopy;
