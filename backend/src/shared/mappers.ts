// A simple helper to map snake_case from DB to camelCase in domain
// e.g., route_id -> routeId
export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/([-_][a-z])/ig, ($1) =>
        $1.toUpperCase().replace('-', '').replace('_', '')
      );
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as { [key: string]: any }); // <-- THIS IS THE FIX
  }
  return obj;
}