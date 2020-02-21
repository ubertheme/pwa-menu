import React, { Suspense } from 'react';
import { shape, string } from 'prop-types';
import { mergeClasses } from '~veniaUi/lib/classify';
import AuthBar from '~veniaUi/lib/components/AuthBar';
import defaultClasses from './navigation.css';
import GET_CUSTOMER_QUERY from '~veniaUi/lib/queries/getCustomer.graphql';
import { useNavigation } from '../../talons/Navigation/useNavigation';
import MegaMenu from '../../../components/MegaMenu';
import NavHeader from './navHeader';
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
//added from PWA Studio ver.5.0.0
const AuthModal = React.lazy(() => import('~veniaUi/lib/components/AuthModal'));

const Navigation = props => {
    const {
        parentMenuItemId,
        setParentMenuItemId,
        navTitle,
        setNavTitle,
        setBackMenuItem,
        handleBack,
        handleClose,
        hasModal,
        isOpen,
        isTopLevel,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        showSignIn,
        view
    } = useNavigation({ customerQuery: GET_CUSTOMER_QUERY });

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;
    const modalClassName = hasModal ? classes.modal_open : classes.modal;
    const bodyClassName = hasModal ? classes.body_masked : classes.body;
    const rootHeaderClassName =
        isTopLevel && view === 'MENU' ? classes.isRoot : classes.header;

    const darkMode = false;
    const darkModeClass = darkMode ? classes.dark_mode : classes.light_mode;

    const header = (
        <header className={rootHeaderClassName}>
            <NavHeader
                isTopLevel={isTopLevel}
                onBack={handleBack}
                onClose={handleClose}
                view={view}
                navTitle={navTitle}
            />
        </header>
    );

    const menu =
        view === 'MENU' ? (
            <div className={bodyClassName}>
                <MegaMenu
                    menuType="off-canvas"
                    menuKey="main-menu"
                    onNavigate={handleClose}
                    parentMenuItemId={parentMenuItemId}
                    setParentMenuItemId={setParentMenuItemId}
                    setBackMenuItem={setBackMenuItem}
                    setNavTitle={setNavTitle}
                />
            </div>
        ) : null;

    const footer = !parentMenuItemId ? (
        <div className={classes.footer}>
            <AuthBar
                disabled={hasModal}
                showMyAccount={showMyAccount}
                showSignIn={showSignIn}
            />
        </div>
    ) : null;

    // Lazy load the auth modal because it may not be needed.
    const authModal = hasModal ? (
        <div className={modalClassName}>
            <Suspense fallback={<LoadingIndicator />}>
                <AuthModal
                    closeDrawer={handleClose}
                    showCreateAccount={showCreateAccount}
                    showForgotPassword={showForgotPassword}
                    showMainMenu={showMainMenu}
                    showMyAccount={showMyAccount}
                    showSignIn={showSignIn}
                    view={view}
                />
            </Suspense>
        </div>
    ) : null;

    return (
        <aside className={rootClassName + ' ' + darkModeClass}>
            {header}
            {menu}
            {footer}
            {authModal}
        </aside>
    );
};

export default Navigation;

Navigation.propTypes = {
    classes: shape({
        body: string,
        form_closed: string,
        form_open: string,
        footer: string,
        header: string,
        root: string,
        root_open: string,
        signIn_closed: string,
        signIn_open: string,
        isRoot: string
    })
};
