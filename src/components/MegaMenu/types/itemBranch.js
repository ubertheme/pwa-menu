import React from 'react';
import { ChevronRight as ChevronRightIcon } from 'react-feather';
import { func, number, shape, string } from 'prop-types';
import RickText from '~veniaUi/lib/components/RichText';
import { mergeClasses } from '~veniaUi/lib/classify';
import defaultClasses from './itemBranch.css';

import { useItemBranch } from '../../../talons/MegaMenu';

const ItemBranch = props => {
    const { item, setParentMenuItemId, setNavTitle } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    //additional CSS classes adding
    let itemClasses = item.is_group
        ? `${classes.root} ${classes.group}`
        : classes.root;
    if (item.additional_class) {
        const extraClasses = item.additional_class.split(' ');
        for (let i = 0; i < extraClasses.length; i++) {
            itemClasses += classes[extraClasses[i]]
                ? ` ${classes[extraClasses[i]]}`
                : '';
        }
    }

    const talonProps = useItemBranch({
        item,
        setParentMenuItemId,
        setNavTitle
    });
    const { handleClick } = talonProps;

    //if has mega item's settings
    let itemDesc = null;
    let itemRichContent = null;
    if (typeof item.mega_setting != 'undefined') {
        if ( item.mega_setting.visibility
            && (item.mega_setting.visibility.indexOf("mobile") !== -1)) {
            if (item.mega_setting.description) {
                itemDesc = (
                    <div className={classes['item_desc']}>
                        <RickText content={item.mega_setting.description}/>
                    </div>
                );
            }
            if (item.mega_setting.rich_content) {
                itemRichContent = (
                    <div className={classes['item_rich_content']}>
                        <RickText content={item.mega_setting.rich_content}/>
                    </div>
                );
            }
        }
    }

    return (
        <li className={itemClasses}>
            <button
                type="button"
                className={classes.target}
                onClick={handleClick}
            >
                <span className={classes.label}>{item.title}</span>
                <ChevronRightIcon width="14" height="14" />
            </button>
            {itemDesc}
            {itemRichContent}
        </li>
    );
};

export default ItemBranch;

ItemBranch.propTypes = {
    item: shape({
        id: number.isRequired,
        title: string.isRequired,
        link: string.isRequired,
        link_type: string.isRequired
    }).isRequired,
    classes: shape({
        root: string,
        target: string,
        label: string
    }),
    setParentMenuItemId: func,
    setNavTitle: func
};
