import axiosInstance from './AxiosInstance'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const logout = async () => {
  const confirmed = confirm('Are you sure you want to logout?')
  if (confirmed) {
    try {
      const response = await axiosInstance.post('/logout', {})
      console.log('this is response', response)

      if (response.data.success) {
        toast.success(response.data.message)
        localStorage.clear()
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.message)
      return false
    }
  }
}
