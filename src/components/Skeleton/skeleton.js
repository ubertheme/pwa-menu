import React from 'react';
import { shape, number, string } from 'prop-types';
import { mergeClasses } from '~veniaUi/lib/classify';
import defaultClasses from './skeleton.css';

const Skeleton = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    classes.root =
        props.parentComponent.toLowerCase() == 'horizontal'
            ? classes.itemDesktop
            : classes.itemMobile;

    return (
        <li className={classes.root}>
            <span
                className={`${classes.title} ${classes[`title-${props.id}`]}`}
            />
        </li>
    );
};

export default Skeleton;

Skeleton.propTypes = {
    id: number,
    parentComponent: string,
    classes: shape({
        root: string
    })
};
