import React from 'react';
import {
    ChevronDown as ChevronDownIcon,
    ChevronRight as ChevronRightIcon
} from 'react-feather';
import { string, number, shape, func, array } from 'prop-types';
import { Link, resourceUrl } from '~veniaUi/lib/drivers';
import RickText from '~veniaUi/lib/components/RichText';
import { mergeClasses } from '~veniaUi/lib/classify';
import cb from 'classnames';
import defaultClasses from './item.css';
import {
    menuLinkTypes,
    baseWidthTypes
} from '../../../constants/ubMenuConstants';

// Todo: will get via API later
const categoryUrlSuffix = '.html';
const cmsPageUrlSuffix = '';

const Item = props => {
    const { index, item, parent, onClick, activeIds } = props;

    const urlSuffix =
        item.link_type == menuLinkTypes.CMS_LINK
            ? cmsPageUrlSuffix
            : item.link_type == menuLinkTypes.CATEGORY_LINK
            ? categoryUrlSuffix
            : '';

    const classes = mergeClasses(defaultClasses, props.classes);
    const itemStyle = {};
    let linkClasses = classes.link;
    let itemClassNames = cb(classes.root, {
        [classes.group]: item.is_group
    });

    //calculates for columns settings
    if (
        parent &&
        parent.mega_setting &&
        parent.mega_setting.column_number > 1
    ) {
        itemClassNames = cb(itemClassNames, {
            [classes.column]: true,
            [classes[`column${index}`]]: true
        });

        //calculates width of columns
        const columnWSuffix =
            parent.mega_setting.column_width_type == baseWidthTypes.PIXEL
                ? 'px'
                : '%';
        let columnW = parent.mega_setting.column_default_width;
        if (parent.mega_setting.column_width_type == baseWidthTypes.PERCENT) {
            columnW = 100 / parent.mega_setting.column_number;
        }

        //if has specific width for each column
        const colXWidth = JSON.parse(parent.mega_setting.column_x_width);
        if (colXWidth.hasOwnProperty(`col${index}`)) {
            columnW = colXWidth[`col${index}`];
        }

        itemStyle.width = `${columnW}${columnWSuffix}`;
    }

    //additional CSS classes adding
    if (item.additional_class) {
        const extraClasses = item.additional_class.split(' ');
        for (let i = 0; i < extraClasses.length; i++) {
            itemClassNames = cb(itemClassNames, {
                [classes[extraClasses[i]]]: classes[extraClasses[i]]
            });
        }
    }

    //generates menu items children if has
    let itemTitle = null;
    let itemDesc = null;
    let itemRichContent = null;
    let children = null;
    let icon = null;

    //make item's title
    if (item.show_title) {
        const paths = window.location.pathname.split('.');
        if (
            (activeIds && activeIds.indexOf(item.id.toString()) !== -1) ||
            '/' + item.link === paths[0]
        ) {
            linkClasses += ` ${classes.active}`;
        }

        if (item.childs && item.childs.length) {
            if (item.level == 1) {
                icon = <ChevronDownIcon width="14" height="14" />;
            } else {
                icon = <ChevronRightIcon width="14" height="14" />;
            }
        }

        if (item.link_type != menuLinkTypes.NO_LINK) {
            itemTitle = (
                <Link
                    className={linkClasses}
                    to={resourceUrl(`/${item.link}${urlSuffix}`)}
                    onClick={() => onClick(item)}
                >
                    <span>
                        {item.title}
                        {icon}
                    </span>
                </Link>
            );
        } else {
            itemTitle = (
                <span className={linkClasses}>
                    <span>
                        {item.title}
                        {icon}
                    </span>
                </span>
            );
        }
    }

    //if has mega item's settings
    if (typeof item.mega_setting != 'undefined') {
        if ( item.mega_setting.visibility && ( (item.mega_setting.visibility.indexOf("desktop") !== -1)
            || item.mega_setting.visibility.indexOf("tablet") !== -1 ) ) {
            if (item.mega_setting.description) {
                itemDesc = (
                    <div className={classes['item_desc']}>
                        <RickText content={item.mega_setting.description} />
                    </div>
                );
            }
            if (item.mega_setting.rich_content) {
                itemRichContent = (
                    <div className={classes['item_rich_content']}>
                        <RickText content={item.mega_setting.rich_content} />
                    </div>
                );
            }
        }
    }

    //if has children
    if (item.childs && item.childs.length) {
        itemClassNames = cb(itemClassNames, {
            [classes['has_childs']]: true
        });

        //add more class 'columns' when has specific column number > 1
        if (item.mega_setting && item.mega_setting.column_number > 1) {
            const isPixel =
                item.mega_setting.column_width_type == baseWidthTypes.PIXEL;
            const isPercent =
                item.mega_setting.column_width_type == baseWidthTypes.PERCENT;
            itemClassNames = cb(itemClassNames, {
                [classes.columns]: true,
                [classes['fixed_width']]: isPixel,
                [classes['dynamic_width']]: isPercent
            });
        }

        const itemWrapperStyle = {};
        if (item.mega_setting) {
            if (
                item.mega_setting.column_width_type == baseWidthTypes.PIXEL &&
                item.mega_setting.column_wrapper_width
            ) {
                itemWrapperStyle.width = `${
                    item.mega_setting.column_wrapper_width
                }px`;
            }
        }

        children = (
            <ul
                style={itemWrapperStyle}
                className={classes[`level${item.childs[0].level}`]}
            >
                {item.childs.map((childItem, i) => (
                    <Item
                        key={childItem.id}
                        index={++i}
                        item={childItem}
                        parent={item}
                        onClick={onClick}
                        activeIds={activeIds}
                    />
                ))}
            </ul>
        );
    }

    return (
        <li style={itemStyle} className={itemClassNames}>
            {itemTitle} {itemDesc} {itemRichContent} {children}
        </li>
    );
};

Item.propTypes = {
    index: number,
    classes: shape({
        root: string
    }),
    item: shape({
        title: string.isRequired,
        link: string.isRequired,
        link_type: string.isRequired
    }).isRequired,
    parent: shape({
        title: string.isRequired,
        link: string.isRequired,
        link_type: string.isRequired
    }),
    activeIds: array,
    onClick: func.isRequired
};

export default Item;
