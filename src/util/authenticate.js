
export const isLogin = () => {
    if (localStorage.token) {
      console.log("LOgin in");
      return true
    }
    else { 
        console.log("not LOgin in");
        return false}
  }