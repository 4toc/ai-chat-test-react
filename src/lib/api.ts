import axios from 'axios';
import {useAuth} from "@/context/authContext.tsx";
import supabase from "@/supabaseClient.ts";

const getAccessToken = async () => {
  const {data, error} = await supabase.auth.getSession()
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  return data.session?.access_token || null
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.headers['Access-Control-Allow-Origin'] = '*'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance