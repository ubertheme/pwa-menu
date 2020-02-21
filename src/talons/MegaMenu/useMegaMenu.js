import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

/**
 * Returns props necessary to render a UB MegaMenu component.
 *
 * @param {object} props
 * @param {object} props.query - graphql query
 * @param {string} props.menuKey - Menu Group Key
 * @param {number} props.parentMenuItemId - Menu Item ID of parent item
 * @param {function} props.setNavTitle - Function to set the title of Menu
 * @param {function} props.setBackMenuItem - Function to set the data of back item.
 * @return {{ menuItems: array, error: object }}
 */
export const useMegaMenu = props => {
    const {
        query,
        menuKey,
        parentMenuItemId,
        setNavTitle,
        setBackMenuItem
    } = props;

    //active menu item ids, using in Horizontal menu
    const [activeIds, setActiveIds] = useState([]);

    const [runQuery, queryResponse] = useLazyQuery(query);
    const { loading, error, data } = queryResponse;

    // Run the query immediately and every time menuKey/parentId changes.
    useEffect(() => {
        runQuery({
            variables: { menuKey: menuKey, parentId: parentMenuItemId }
        });
    }, [menuKey, parentMenuItemId, runQuery]);

    const menuItems = (data && data.menuItems.items) || null;

    // update title of the navigation
    const navTitle = (data && data.menuItems.menu_title) || null;
    if (!parentMenuItemId && navTitle) {
        setNavTitle(navTitle);
    }

    // update the back item data, using this to handle for back action in OffCanvasMenu
    const backItem = (data && data.menuItems.back_item) || null;
    if (backItem) {
        setBackMenuItem(backItem);
    }

    return {
        menuItems: menuItems,
        activeIds,
        setActiveIds,
        error,
        loading
    };
};
