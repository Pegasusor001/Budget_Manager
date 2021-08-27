import React from 'react';
import Popup from 'reactjs-popup';
import '../styles/NewCategory.scss';
import EditIcon from '@material-ui/icons/Edit';

export default function NewCategory(props) {
  const name = React.useRef(null);
  const spending_limit = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const category = {
      category_id: props.categoryId,
      updatedName: name.current.value,
      updatedLimit: parseInt(spending_limit.current.value)
    }
    console.log("IN EDITCATEGORY: ", category)

    props.onEdit(category);
  }
  
  return(
  <Popup open={false}
    trigger={
      <EditIcon />
    }
    modal
    nested
  >
    {close => (
      <div className="modal">
        <button className="close" onClick={close}>
          &times;
        </button>
        <div className="header"> Edit Category: </div>
        <div className="category-form-container">
          {' '}
          <form class="new-category-form" onSubmit={handleSubmit}>
            <input type="text" ref={name} placeholder="   Name" className="modalInput"></input>
            <br></br>
            <input type="text" ref={spending_limit} placeholder="   SpendingLimit" className="modalInput"></input>
            <br></br>
            <button type="submit" className="new-category-button">Submit</button>
            <br></br>
            <button className="new-category-button" onClick={close}>Cancel</button>
          </form>
        </div>
      </div>
    )}
  </Popup>
  );
};

{/* <Popup modal trigger={<button>click me</button>}>
  {close => <content close={close}></content>}
</Popup> */}

// const [budget, setBudget] = useState({
//   name: '',
//   spending_limit: ''
// })
// function updateContent(value, key) {
//   const budgetCopy = {...budget}
//   budgetCopy[key] = value;
//   setbudget(budgetCopy)
// }
// <input onChange={(event) => updateContent(event.target.value, "Name")}></input>