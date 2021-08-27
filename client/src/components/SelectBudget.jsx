import React, { useEffect, useState, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import axios from 'axios';

export default function SplitButton(props) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const budgetNames = (listOfBudgets) => {
    let container = []
    listOfBudgets.forEach(budget => {
      budget.active ? container.unshift(budget.name) : container.push(budget.name)
    })
    return container
  }


  const handleMenuItemClick = (event, index) => {
    props.setSelectedIndex(index)
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    axios.put(`http://localhost:3002/api/budgets/save/1`, {budgetData: props.budgetList[props.selectedIndex], currentBudgetId: props.currentBudgetId})
    .then((res) => {
      props.updateCurrentBudget()
    })
  }, [props.selectedIndex])


  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
          <Button>{budgetNames(props.budgetList)[props.selectedIndex]}</Button>
          <Button
            color="primary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} style={{zIndex: 1}} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                zIndex: 1
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {budgetNames(props.budgetList).map((option, index) => (

                      <MenuItem
                        key={index}
                        // disabled={index === 0}
                        selected={index === props.selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
}