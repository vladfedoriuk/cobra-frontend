import { GetProfileResponseData, GetUsersResponseData } from '@typings/userApi'
import {
  User as UserType,
  UserProfile as UserProfileType,
} from '@typings/userStore'
import { ArrayElement } from '@typings/utils'

export const convertUserData = (userData: GetProfileResponseData): UserType => {
  const { id, username, email, last_name, first_name } = userData
  return { id, username, email, lastName: last_name, firstName: first_name }
}

export const tranformUserProfileData = (
  userData: ArrayElement<GetUsersResponseData>
): UserProfileType => {
  const { id, username, email, full_name } = userData
  return { id, username, email, fullName: full_name }
}

export const transformUsersData = (
  usersData: GetUsersResponseData
): Array<UserProfileType> => {
  return usersData.map((userData) => tranformUserProfileData(userData))
}
