export const splitFullName = (fullName: string): Array<string> =>
  fullName.split(' ')

export const fullNameToInitials = (fullName: string): string => {
  const [firstName, lastName] = splitFullName(fullName)
  return `${firstName[0]}${lastName[0]}`
}
