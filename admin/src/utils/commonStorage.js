export const savedTolocalStorage = ({value , key }) => { 

  try {
    if(typeof window === "undefined") return;
    return localStorage.setItem(key, JSON.stringify(value));
  }catch (err) {
    console.error("[AuthStorage] Save failed:", err);
  }

}

export const loadFromlocalStorage = (key) => {  
    try{
        if(typeof window === "undefined") return null;
        return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;   
    }
    catch(err){
        console.error("[AuthStorage] Load failed:", err);
        return null;
    }
}