import React, { ErrorInfo, ReactNode, useState } from "react";
import { connect } from "react-redux";
import { Location } from "history";
import styled from "@emotion/styled";

import ScrollToTop from "metabase/hoc/ScrollToTop";
import {
  Archived,
  GenericError,
  NotFound,
  Unauthorized,
} from "metabase/containers/ErrorPages";
import UndoListing from "metabase/containers/UndoListing";

import {
  getErrorPage,
  getIsAdminApp,
  getIsAppBarVisible,
  getIsNavBarEnabled,
} from "metabase/selectors/app";
import { setErrorPage } from "metabase/redux/app";
import { useOnMount } from "metabase/hooks/use-on-mount";
import { initializeIframeResizer } from "metabase/lib/dom";
import AppBanner from "metabase/components/AppBanner";
import AppBar from "metabase/nav/containers/AppBar";
import Navbar from "metabase/nav/containers/Navbar";
import StatusListing from "metabase/status/containers/StatusListing";
import { ContentViewportContext } from "metabase/core/context/ContentViewportContext";
import { AppErrorDescriptor, State } from "metabase-types/store";
import { AppContainer, AppContent, AppContentContainer } from "./App.styled";
import { alpha, color, colors } from "./lib/colors";
import LogoIcon from "./components/LogoIcon";
import { SidebarIcon } from "./nav/components/AppBar/AppBarToggle.styled";

const getErrorComponent = ({ status, data, context }: AppErrorDescriptor) => {
  if (status === 403 || data?.error_code === "unauthorized") {
    return <Unauthorized />;
  }
  if (status === 404 || data?.error_code === "not-found") {
    return <NotFound />;
  }
  if (data?.error_code === "archived" && context === "dashboard") {
    return <Archived entityName="dashboard" linkTo="/dashboards/archive" />;
  }
  if (data?.error_code === "archived" && context === "query-builder") {
    return <Archived entityName="question" linkTo="/questions/archive" />;
  }
  return <GenericError details={data?.message} />;
};

interface AppStateProps {
  errorPage: AppErrorDescriptor | null;
  isAdminApp: boolean;
  bannerMessageDescriptor?: string;
  isAppBarVisible: boolean;
  isNavBarEnabled: boolean;
}

interface AppDispatchProps {
  onError: (error: unknown) => void;
}

interface AppRouterOwnProps {
  location: Location;
  children: ReactNode;
}

type AppProps = AppStateProps & AppDispatchProps & AppRouterOwnProps;

const mapStateToProps = (
  state: State,
  props: AppRouterOwnProps,
): AppStateProps => ({
  errorPage: getErrorPage(state),
  isAdminApp: getIsAdminApp(state, props),
  isAppBarVisible: getIsAppBarVisible(state, props),
  isNavBarEnabled: getIsNavBarEnabled(state, props),
});

const mapDispatchToProps: AppDispatchProps = {
  onError: setErrorPage,
};

class ErrorBoundary extends React.Component<{
  onError: (errorInfo: ErrorInfo) => void;
}> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError(errorInfo);
  }

  render() {
    return this.props.children;
  }
}

const MainNavRoot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  flex-direction: column;
  justify-content: space-between;
  background: ${colors.black};
  width: 60px;
  height: 100vh;
  border-right: 1px solid #eeecec;
`;

const NavUl = styled.ul`
  color: ${colors.white};
  display: flex;
  flex-direction: column;
`;

const NavLi = styled.li`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border-radius: 0;
    border-left: 2px solid;
    padding-right: 2px;
    background-color: ${alpha("brand", 0)};
    color: ${color("brand")};
  }
`;

function MainAppNavs() {
  return (
    <MainNavRoot>
      <NavUl>
        <NavLi>
          <LogoIcon dark height={32} />
        </NavLi>
        <NavLi>
          <SidebarIcon
            name="home"
            width={20}
            onClick={() => window.open("/", "_self")}
          />
        </NavLi>
        <NavLi>
          <SidebarIcon
            name="folder"
            width={20}
            onClick={() => window.open("/collection/root", "_self")}
          />
        </NavLi>
        <NavLi>
          <SidebarIcon
            name="database"
            width={20}
            onClick={() => window.open("/browse", "_self")}
          />
        </NavLi>
      </NavUl>
    </MainNavRoot>
  );
}

function App({
  errorPage,
  isAdminApp,
  isAppBarVisible,
  isNavBarEnabled,
  children,
  onError,
}: AppProps) {
  const [viewportElement, setViewportElement] = useState<HTMLElement | null>();

  useOnMount(() => {
    initializeIframeResizer();
  });

  return (
    <ErrorBoundary onError={onError}>
      <ScrollToTop>
        <AppContainer className="spread">
          {isAppBarVisible && <MainAppNavs />}
          <AppBanner />
          {isAppBarVisible && <AppBar />}
          <AppContentContainer isAdminApp={isAdminApp}>
            {isNavBarEnabled && <Navbar />}
            <AppContent ref={setViewportElement}>
              <ContentViewportContext.Provider value={viewportElement ?? null}>
                {errorPage ? getErrorComponent(errorPage) : children}
              </ContentViewportContext.Provider>
            </AppContent>
            <UndoListing />
            <StatusListing />
          </AppContentContainer>
        </AppContainer>
      </ScrollToTop>
    </ErrorBoundary>
  );
}

export default connect<AppStateProps, unknown, AppRouterOwnProps, State>(
  mapStateToProps,
  mapDispatchToProps,
)(App);
