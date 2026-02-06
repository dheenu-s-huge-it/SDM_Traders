// Context Imports
import { VerticalNavProvider } from "../../@menu/contexts/verticalNavContext";
import { SettingsProvider } from "../../@core/contexts/settingsContext";
import ThemeProvider from "../components/theme";
// import ReduxProvider from '@/redux-store/ReduxProvider'

// Styled Component Imports
import AppReactToastify from "../../libs/styles/AppReactToastify";

// Util Imports
import {
  getMode,
  getSettingsFromCookie,
  getSystemMode,
} from "../../@core/utils/serverHelpers";
import { AuthContextProvider } from "../DataProviders";

const Providers = async (props) => {
  // Props
  const { children } = props;
  // Vars
  const mode = await getMode();
  const settingsCookie = await getSettingsFromCookie();
  const systemMode = await getSystemMode();

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <ThemeProvider systemMode={systemMode}>
          <AuthContextProvider>
            {children}
            <AppReactToastify hideProgressBar />
          </AuthContextProvider>
        </ThemeProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  );
};

export default Providers;
