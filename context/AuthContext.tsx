import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { User, AuthContextType } from '../types'

//context is used to see 'globally' what the current user is across all pages/components
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({} as any),
  signup: async () => ({} as any),
  logout: async () => {},
})

//check what the context is ^
export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<User | null>(null)
  //prevent the children of the AuthContextProvider component from rendering until the onAuthStateChanged Firebase listener has finished executing. This ensures that the user state variable is correctly initialized before any child components attempt to use it.
  const [loading, setLoading] = useState(true)

  // check the current authentication state (constantly) when the app loads and updates the user object and loading status accordingly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signup = (email: string, password: string): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const login = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async (): Promise<void> => {
    setUser(null)
    //only do this after user is fully null, else signout may bug
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {/* basically if its still loading stuff show nothing, else show children */}
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
