import React from "react";
import classes from "./NavigationItems.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";

const navigationItems = (props) => {
  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/" active={true}>
        Burger Builder
      </NavigationItem>
      <NavigationItem link="/">Check out</NavigationItem>
    </ul>
  );
};

export default navigationItems;
