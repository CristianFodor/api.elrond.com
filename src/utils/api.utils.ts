export class ApiUtils {
  static mergeObjects(obj1: any, obj2: any) {
    for (const key of Object.keys(obj2)) {
        if (key in obj1) {
            obj1[key] = obj2[key];
        }
    }
  
    return obj1;
  }
  
  static cleanupApiValueRecursively(obj: any) {
    if (Array.isArray(obj)) {
      for (let item of obj) {
        if (item && typeof item === 'object') {
          ApiUtils.cleanupApiValueRecursively(item);
        }
      }
    } else if (obj && typeof obj === 'object') {
      for (let [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' || Array.isArray(value)) {
          ApiUtils.cleanupApiValueRecursively(value);
        }
  
        if (value === null || value === '' || value === undefined) {
          delete obj[key];
        }
  
        //TODO: think about whether this is applicable everywhere
        if (Array.isArray(value) && value.length === 0) {
          delete obj[key];
        }
      }
    }
  
    return obj
  }
  
}