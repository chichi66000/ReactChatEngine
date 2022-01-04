
export const isLogin = () => {
    if (localStorage.token) {
      return true
    }
    else {return false}
  }