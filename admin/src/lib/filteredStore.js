 export const filteredStore = (store) => {
  if (!store || !Array.isArray(store)) {
    return [];
  }    
  return store.map((store => ({
    value: store._id,
    label: store.name,
  })));
}