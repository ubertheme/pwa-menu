import { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

import { navItemTitles } from '../../../constants/ubMenuConstants';

const ancestors = {
    CREATE_ACCOUNT: 'SIGN_IN',
    FORGOT_PASSWORD: 'SIGN_IN',
    MY_ACCOUNT: 'MENU',
    SIGN_IN: 'MENU',
    MENU: null
};

export const useNavigation = props => {
    const { customerQuery } = props;
    // retrieve app state from context
    const [appState, { closeDrawer }] = useAppContext();

    const [, { getUserDetails }] = useUserContext();
    const fetchUserDetails = useAwaitQuery(customerQuery);

    // request data from server
    useEffect(() => {
        getUserDetails({ fetchUserDetails });
    }, [fetchUserDetails, getUserDetails]);

    // extract relevant data from app state
    const { drawer } = appState;
    const isOpen = drawer === 'nav';

    // get local state
    const [view, setView] = useState('MENU');

    // using these vars for next/back event in OffCanvas Menu
    const [parentMenuItemId, setParentMenuItemId] = useState(0);

    const [navTitle, setNavTitle] = useState('');

    const [backMenuItem, setBackMenuItem] = useState({
        id: 0,
        title: navTitle
    });

    const isTopLevel = parentMenuItemId === 0;
    const hasModal = view !== 'MENU';

    // define handlers
    const handleBack = useCallback(() => {
        const parentView = ancestors[view];
        if (parentView) {
            setView(parentView);
            if (navItemTitles[parentView]) {
                setNavTitle(navItemTitles[parentView]);
            }
        } else if (!isTopLevel) {
            setParentMenuItemId(backMenuItem.id);
            setNavTitle(backMenuItem.title);
        } else {
            closeDrawer();
        }
    }, [backMenuItem, closeDrawer, isTopLevel, view]);

    const handleClose = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    // create callbacks for local state
    const showCreateAccount = useCallback(() => {
        setView('CREATE_ACCOUNT');
        setNavTitle(navItemTitles.CREATE_ACCOUNT);
    }, [setView]);
    const showForgotPassword = useCallback(() => {
        setView('FORGOT_PASSWORD');
        setNavTitle(navItemTitles.FORGOT_PASSWORD);
    }, [setView]);
    const showMainMenu = useCallback(() => {
        setView('MENU');
        setNavTitle(navItemTitles.MENU);
    }, [setView]);
    const showMyAccount = useCallback(() => {
        setView('MY_ACCOUNT');
        setNavTitle(navItemTitles.MY_ACCOUNT);
    }, [setView]);
    const showSignIn = useCallback(() => {
        setView('SIGN_IN');
        setNavTitle(navItemTitles.SIGN_IN);
    }, [setView]);

    return {
        handleBack,
        handleClose,
        hasModal,
        isOpen,
        isTopLevel,
        parentMenuItemId,
        setParentMenuItemId,
        navTitle,
        setNavTitle,
        setBackMenuItem,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        showSignIn,
        view
    };
};
