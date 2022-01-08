import ProjectStore from '@stores/project'
import SnackBarStore from '@stores/snackbar'
import UserStore from '@stores/user'
import { User as UserType } from '@typings/userStore'
import { Project as ProjectData } from '@typings/projectStore'

export type RootStoreMapKeys = 'user' | 'snackbars' | 'projects'
export type RootStoreMapValues =
  | typeof UserStore
  | typeof SnackBarStore
  | typeof ProjectStore

export type InitialStoresData = Partial<{
  user: { user: UserType | null } | null
  snackbars: Record<string, unknown> | null
  projects: { projects: ProjectData | null } | null
}>

export interface Stores {
  user: UserStore
  snackbars: SnackBarStore
  projects: ProjectStore
}
