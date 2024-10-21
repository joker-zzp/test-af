import { appData } from '../../env'
import { getConfig, setConfig } from '../../util/conf'

export const getSettingList = () => {
  return appData.conf
}

export const getSettingInfo = getConfig

export const setSettingInfo = setConfig
