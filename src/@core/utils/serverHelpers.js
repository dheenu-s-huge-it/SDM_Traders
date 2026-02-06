// Next Imports
// import { cookies } from 'next/headers'
import cookies from 'js-cookie'

// Third-party Imports
import 'server-only'

// Config Imports
import themeConfig from '../../configs/themeConfig'

export const getSettingsFromCookie = async () => {
  const cookieStore = cookies(); // Move cookies() call outside of async context
  const cookieName = themeConfig.settingsCookieName

  return JSON.parse(cookieStore?.get(cookieName)?.value || '{}')
}

export const getMode = () => {
  return getSettingsFromCookie().then((settingsCookie) => {
    // Get mode from cookie or fallback to theme config
    const _mode = settingsCookie.mode || themeConfig.mode;
    return _mode;
  });
};

export const getSystemMode = () => {
  return getMode().then((mode) => {
    const cookieStore = cookies(); // Move cookies() call outside of async context
    const colorPrefCookie = cookieStore?.get('colorPref')?.value || 'light';
    return (mode === 'system' ? colorPrefCookie : mode) || 'light';
  });
};


// export const getMode = async () => {
//   const settingsCookie = await getSettingsFromCookie()

//   // Get mode from cookie or fallback to theme config
//   const _mode = settingsCookie.mode || themeConfig.mode

//   return _mode
// }

// export const getSystemMode = async () => {
//   const mode = await getMode();
//   const cookieStore = cookies(); // Move cookies() call outside of async context
//   const colorPrefCookie = cookieStore?.get('colorPref')?.value || 'light';

//   return (mode === 'system' ? colorPrefCookie : mode) || 'light';
// }

export const getServerMode = async () => {
  const mode = await getMode()
  const systemMode = await getSystemMode()
  return mode === 'system' ? systemMode : mode
}

export const getSkin = async () => {
  const settingsCookie = await getSettingsFromCookie()

  return settingsCookie.skin || 'default'
}