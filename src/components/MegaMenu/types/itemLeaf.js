import React from 'react';
import { func, shape, string } from 'prop-types';
import { Link, resourceUrl } from '~veniaUi/lib/drivers';
import { mergeClasses } from '~veniaUi/lib/classify';
import RickText from '~veniaUi/lib/components/RichText';
import defaultClasses from './itemLeaf.css';
import { useItemLeaf } from '../../../talons/MegaMenu';
import { menuLinkTypes } from '../../../constants/ubMenuConstants';

// Todo: will get via API later
const categoryUrlSuffix = '.html';
const cmsPageUrlSuffix = '';

const ItemLeaf = props => {
    const { item, onNavigate } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const { handleClick } = useItemLeaf({ onNavigate });

    const urlSuffix =
        item.link_type == menuLinkTypes.CMS_LINK
            ? cmsPageUrlSuffix
            : item.link_type == menuLinkTypes.CATEGORY_LINK
            ? categoryUrlSuffix
            : '';

    const itemStyle = {};
    let itemClasses = item.is_group
        ? `${classes.root} ${classes.group}`
        : classes.root;
    let linkClasses = classes.link;

    //additional CSS classes adding
    if (item.additional_class) {
        const extraClasses = item.additional_class.split(' ');
        for (let i = 0; i < extraClasses.length; i++) {
            itemClasses += classes[extraClasses[i]]
                ? ` ${classes[extraClasses[i]]}`
                : '';
        }
    }

    //generates menu items children if has
    let itemTitle = null;
    let itemDesc = null;
    let itemRichContent = null;

    //make item's title
    if (item.show_title) {
        const paths = window.location.pathname.split('.');
        if ('/' + item.link === paths[0]) {
            linkClasses += ` ${classes.active}`;
        }
        if (item.link_type != menuLinkTypes.NO_LINK) {
            itemTitle = (
                <Link
                    className={linkClasses}
                    to={resourceUrl(`/${item.link}${urlSuffix}`)}
                    onClick={handleClick}
                >
                    <span>{item.title}</span>
                </Link>
            );
        } else {
            itemTitle = (
                <span className={linkClasses}>
                    <span>{item.title}</span>
                </span>
            );
        }
    }

    //if has mega item's settings
    if (typeof item.mega_setting != 'undefined') {
        if ( item.mega_setting.visibility
            && item.mega_setting.visibility.indexOf("mobile") !== -1 ) {
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
        <li style={itemStyle} className={itemClasses}>
            {itemTitle} {itemDesc} {itemRichContent}
        </li>
    );
};

export default ItemLeaf;

ItemLeaf.propTypes = {
    item: shape({
        title: string.isRequired,
        link: string.isRequired,
        link_type: string.isRequired
    }).isRequired,
    classes: shape({
        root: string
    }),
    onNavigate: func.isRequired
};
