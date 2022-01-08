import { GetProfileResponseData } from '@typings/userApi'
import { User as UserType } from '@typings/userStore'

export const convertUserData = (userData: GetProfileResponseData): UserType => {
  const { id, username, email, last_name, first_name } = userData
  return { id, username, email, lastName: last_name, firstName: first_name }
}
