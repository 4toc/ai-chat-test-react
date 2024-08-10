import  {createContext, useEffect, useState, useContext, useRef, ReactNode} from "react";
import { Session, User } from '@supabase/supabase-js'
import supabase from "@/supabaseClient";
interface AuthContextType {
  user: User | null;
  session?: Session | null;
  logOut: () => Promise<void>
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  logOut: async () => {}
})

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({children}: { children: ReactNode }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const hasMounted = useRef(false)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoading(false);
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const logOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, logOut }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  )
}

export default AuthProvider