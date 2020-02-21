import { useCallback } from 'react';

/**
 * Returns props necessary to render a ItemBranch menu item component.
 *
 * @param {object} props
 * @param {object} props.item - menu item data
 * @param {function} props.setParentMenuItemId - callback that updates parent menu item id
 * @param {function} props.setNavTitle - callback that updates the title of Navigation
 * @return {{ exclude: boolean, handleClick: function }}
 */
export const useItemBranch = props => {
    const { item, setParentMenuItemId, setNavTitle } = props;

    const handleClick = useCallback(() => {
        setParentMenuItemId(item.id);
        setNavTitle(item.title);
    }, [item.id, item.title, setNavTitle, setParentMenuItemId]);

    return { handleClick };
};
