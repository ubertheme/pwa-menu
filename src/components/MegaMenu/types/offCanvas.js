import React from 'react';
import { func, number, shape, string } from 'prop-types';
import { mergeClasses } from '~veniaUi/lib/classify';
import defaultClasses from './offCanvas.css';
import offCanvasItemsQuery from '../../../queries/getOffCanvasItems.graphql';
import { useMegaMenu } from '../../../talons/MegaMenu/useMegaMenu';
import ItemLeaf from './itemLeaf';
import ItemBranch from './itemBranch';
import Skeleton from '../../Skeleton';

const OffCanvas = props => {
    const {
        menuKey,
        onNavigate,
        parentMenuItemId,
        setParentMenuItemId,
        setBackMenuItem,
        setNavTitle
    } = props;

    //Load menu items data via graphql
    const talonProps = useMegaMenu({
        query: offCanvasItemsQuery,
        menuKey,
        parentMenuItemId,
        setNavTitle,
        setBackMenuItem
    });
    const { menuItems, error, loading } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

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
                <ul>
                    {[...new Array(5)].map((el, index) => (
                        <Skeleton
                            key={`skeleton-${index}`}
                            id={index}
                            parentComponent="OffCanvas"
                        />
                    ))}
                </ul>
            );
        } else if (menuItems.length === 0) {
            child = (
                <div className={classes.noResults}>No menu items found.</div>
            );
        } else {
            child = (
                <ul>
                    {Array.from(menuItems, menuItem => {
                        const hasChild =
                            menuItem.childs && menuItem.childs.length
                                ? true
                                : false;
                        return hasChild ? (
                            <ItemBranch
                                key={menuItem.id}
                                item={menuItem}
                                setNavTitle={setNavTitle}
                                setParentMenuItemId={setParentMenuItemId}
                            />
                        ) : (
                            <ItemLeaf
                                key={menuItem.id}
                                item={menuItem}
                                onNavigate={onNavigate}
                            />
                        );
                    })}
                </ul>
            );
        }
    }

    return <div className={classes.root}>{child}</div>;
};

export default OffCanvas;

OffCanvas.propTypes = {
    classes: shape({
        root: string
    }),
    menuKey: string.isRequired,
    parentMenuItemId: number.isRequired,
    setParentMenuItemId: func.isRequired,
    setBackMenuItem: func.isRequired,
    setNavTitle: func.isRequired,
    onNavigate: func.isRequired
};
