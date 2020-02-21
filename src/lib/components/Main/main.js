import React from 'react';
import { bool, shape, string } from 'prop-types';
import { useScrollLock } from '@magento/peregrine';

import { mergeClasses } from '~veniaUi/lib/classify';

import Footer from '~veniaUi/lib/components/Footer';
import Header from '~veniaUi/lib/components/Header';

import MegaMenu from '../../../components/MegaMenu';

import defaultClasses from '~veniaUi/lib/components/Main/main.css';

const Main = props => {

    const { children, isMasked } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const rootClass = isMasked ? classes.root_masked : classes.root;
    const pageClass = isMasked ? classes.page_masked : classes.page;

    useScrollLock(isMasked);

    // It loads Horizontal Menu in Tablet/Desktop contexts only
    let topMenu = null;
    if (
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(min-width: 768px)').matches
    ) {
        topMenu = (
            <MegaMenu
                menuType="horizontal"
                menuKey="main-menu"
                classes={{
                    root: 'stickyRoot'
                }}
            />
        );
    }

    return (
        <main className={rootClass}>
            <Header />
            {topMenu}
            <div className={pageClass}>{children}</div>
            <Footer />
        </main>
    );
};

export default Main;

Main.propTypes = {
    classes: shape({
        page: string,
        page_masked: string,
        root: string,
        root_masked: string
    }),
    isMasked: bool
};
