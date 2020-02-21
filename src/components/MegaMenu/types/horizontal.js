import React from 'react';
import { string, shape } from 'prop-types';
import { mergeClasses } from '~veniaUi/lib/classify';
import defaultClasses from './horizontal.css';
import Item from './item';
import Skeleton from '../../Skeleton';
import menuItemsQuery from '../../../queries/getMenuItems.graphql';
import { useMegaMenu } from '../../../talons/MegaMenu/useMegaMenu';

const Horizontal = props => {
    const { menuKey } = props;

    //Load menu items data via graphql
    const talonProps = useMegaMenu({
        query: menuItemsQuery,
        menuKey
    });
    const { menuItems, activeIds, setActiveIds, error, loading } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = item => {
        setActiveIds(item.path.split('/'));
    };

    let child;
    if (error) {
        child = (
            <div className={classes['fetch_error']}>
                Menu's Data Fetch Error: <pre>{error.message}</pre>
            </div>
        );
    } else {
        if (loading || !menuItems) {
            child = (
                <ul className={classes.level1}>
                    {[...new Array(5)].map((el, index) => (
                        <Skeleton
                            key={`skeleton-${index}`}
                            id={index}
                            parentComponent="Horizontal"
                        />
                    ))}
                </ul>
            );
        } else if (menuItems.length === 0) {
            child = (
                <div className={classes.noResults}>No menu items found.</div>
            );
        } else {
            const parent = null;
            child = (
                <ul className={classes.level1}>
                    {menuItems.map((item, i) => (
                        <Item
                            key={item.id}
                            index={++i}
                            item={item}
                            parent={parent}
                            onClick={handleClick}
                            activeIds={activeIds}
                        />
                    ))}
                </ul>
            );
        }
    }

    return <div className={classes.root}>{child}</div>;
};

Horizontal.propTypes = {
    classes: shape({
        root: string
    }),
    menuKey: string
};

export default Horizontal;
