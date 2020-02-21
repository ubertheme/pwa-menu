import React, { Fragment } from 'react';
import { bool, func, shape, string } from 'prop-types';
import {
    ArrowLeft as ArrowLeftIcon,
    Menu as MenuIcon,
    X as CloseIcon
} from 'react-feather';
import { mergeClasses } from '~veniaUi/lib/classify';
import Icon from '~veniaUi/lib/components/Icon';
import Trigger from '~veniaUi/lib/components/Trigger';
import defaultClasses from './navHeader.css';
import { useNavigationHeader } from '@magento/peregrine/lib/talons/Navigation/useNavigationHeader';

import { navItemTitles } from '../../../constants/ubMenuConstants';

const NavHeader = props => {
    const { isTopLevel, onBack, onClose, view, navTitle } = props;

    const talonProps = useNavigationHeader({
        isTopLevel,
        onBack,
        onClose,
        view
    });

    const { handleClose, handleBack, isTopLevelMenu } = talonProps;

    const title =
        navItemTitles[view] || navTitle ? navTitle : navItemTitles.MENU;

    const backIcon = isTopLevelMenu ? MenuIcon : ArrowLeftIcon;
    const backButton = !isTopLevelMenu ? (
        <Trigger key="backButton" action={handleBack}>
            <Icon src={backIcon} />
        </Trigger>
    ) : null;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            {backButton}
            <h2 key="title" className={classes.title}>
                <span>{title}</span>
            </h2>
            <Trigger key="closeButton" action={handleClose}>
                <Icon src={CloseIcon} />
            </Trigger>
        </Fragment>
    );
};

export default NavHeader;

NavHeader.propTypes = {
    classes: shape({
        title: string
    }),
    isTopLevel: bool,
    onBack: func.isRequired,
    onClose: func.isRequired,
    view: string.isRequired,
    navTitle: string
};
