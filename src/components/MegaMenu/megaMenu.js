import React from 'react';
import { func, number, shape, string } from 'prop-types';
import { mergeClasses } from '~veniaUi/lib/classify';
import Horizontal from './types/horizontal';
import OffCanvas from './types/offCanvas';
import defaultClasses from './megaMenu.css';

/**
 * MegaMenu component.
 *
 * This component is a renderer of Menus
 *
 * @typedef MegaMenu
 * @kind functional component
 *
 * @param {Object} props React component props
 *
 * @returns {React.Element} A React component.
 */
const MegaMenu = props => {
    const {
        menuKey,
        menuType,
        onNavigate,
        parentMenuItemId,
        setParentMenuItemId,
        setBackMenuItem,
        setNavTitle
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const rootClass =
        props.classes && props.classes.root
            ? defaultClasses[props.classes.root]
            : classes.root;

    let child;
    if (menuType == 'off-canvas') {
        child = (
            <OffCanvas
                menuKey={menuKey}
                onNavigate={onNavigate}
                parentMenuItemId={parentMenuItemId}
                setParentMenuItemId={setParentMenuItemId}
                setBackMenuItem={setBackMenuItem}
                setNavTitle={setNavTitle}
            />
        );
    } else if (menuType == 'horizontal' || menuType == 'vertical') {
        child = <Horizontal menuKey={menuKey} />;
    } else {
        child = (
            <div className={classes.warning}>
                '{menuType}' menu type is not correct. Please update with
                current available menu types: 'horizontal', 'vertical' or
                'off-canvas'.
            </div>
        );
    }

    return <div className={rootClass}>{child}</div>;
};

/**
 * Props for {@link MegaMenu}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the MegaMenu
 * @property {String} classes.root CSS class for the root container element
 * @property {String} html Content
 */
MegaMenu.propTypes = {
    classes: shape({
        root: string
    }),
    menuKey: string,
    menuType: string,
    onNavigate: func,
    parentMenuItemId: number,
    setParentMenuItemId: func,
    setBackMenuItem: func,
    setNavTitle: func
};

export default MegaMenu;
