import React, {useState, useRef, Suspense, createContext} from 'react';
import useActiveData from '../hooks/useActiveData';
import useBudgetList from '../hooks/useBudgetList';
import useVisiblity from "../hooks/useVisiblity";

import ShareBudget from '../components/ShareBudgetsModal'
import BudgetCategory from '../components/budgetCategory';
import BudgetExpense from '../components/budgetExpense';
import NewCategory from '../components/NewCategory';
import NewExpense from '../components/NewExpense';
import SelectButton from '../components/SelectBudget';
import NavBar from "../components/NavBar.jsx";
import ChatButton from "../components/ChatButton";
import NewChat from "../components/NewChat";

import ShadowPlane from '../3dobjects/ShadowPlane';
import Wall from '../3dobjects/PhysicsWalls'
import Bucket from '../3dobjects/PolyBucket';
import Coins from '../3dobjects/Coins';
import { Debug, usePlane, Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';

import "../styles/budget.scss";

const percentCalculator = (num, den) => {
  const number1 = num ? Number(num.replace(/[^0-9.-]+/g, "")) : 0.0;
  const number2 = den ? Number(den.replace(/[^0-9.-]+/g, "")) : 0.0;
  return ((number1 / number2) * 100).toFixed(2);
};

//check the percent of real spend (spendArray) and spend limit (category)
const checkSpend = (spendArray, category) => {
  for (const spend of spendArray) {
    if (spend.id === category.category_id) {
      return percentCalculator(spend.sum, category.spend_limit);
    }
  }
}

//Create a React page that renders categories, and expenses by category
export default function Budget1() {
  //Collect Categories, and expenses using a PromiseAll hook
  const { budgetListState, setBudgetListState } = useBudgetList(); 
  // an array of all budget
  const {state,updateCurrentBudget,  deleteExpense, deleteCategory, createNewBudget, createNewCategory, createNewExpense, editCategory, editExpense , setState} = useActiveData();
  // state includes current budget id, categories, expenses 
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [ChatComponent, toggleVisibility] = useVisiblity(<NewChat />, false);

  // toggle the details of a category. 
  const expand = (category_id) => {
    if (activeCategory !== 0) {
      setActiveCategory(0);
    } else {
      setActiveCategory(category_id);
    }
  }

  // add a new budget next month
  const addnewBudget = () => {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const year = dateObj.getUTCFullYear();
    const allMonth = ['January','February','March','April','May','June','July','August','September','October','November','December']

    const budget = {
      user_id: sessionStorage.token - 0,
      name: `${allMonth[month]}-Budget`,
      start_date: `${year}-${month+1}-1`,
      end_date: `${year}-${month+1}-1`,
      active: false
    }
    budgetListState.budgetListData.push(budget)
    createNewBudget(budget)
  }

  //Find a way to store all expenses and push those
  const getExpensesByCategory = (expenseArray, categoryId) => {
    const expensesArray = [];
    for (const expense of expenseArray) {
      if (expense.category_id === categoryId && expense.category_id === activeCategory) {
        expensesArray.push(
          <BudgetExpense 
            key={expense.expense_id} 
            payee={expense.payee} 
            name={expense.expense_name} 
            amount_paid={expense.amount_paid}
            cost={expense.cost} 
            onDelete={() => deleteExpense(expense.expense_id)}
            onEdit={editExpense}
            categoryId={expense.category_id}
          />);
      }
    }
    //Push a new category Component here
    if (categoryId === activeCategory) {
      expensesArray.push(<NewExpense category_id={categoryId} onSave={createNewExpense}/>)
    };
    return expensesArray;
  }
  
  //iterate through categories that belong to the current budget generating a category component for each
  const budgetCategories = state.categories.map(category => {
    // console.log("WHAT IS THIS VALUE ", activeCategory);
    return(
      <BudgetCategory 
      activeCategory={activeCategory}
      getExpensesByCategory={getExpensesByCategory} 
      expenses={state.expenses} 
      category_id={category.category_id} 
      onDelete={() => {deleteCategory(category.category_id)}} 
      spend_limit={category.spend_limit} name={category.category_name} 
      currentValue={checkSpend(state.totalSpendCategories, category)}
      onEdit={editCategory}
      expand={expand}
      />
      )
    })
    
    const Plane = function() {
      const [ref] = usePlane(() => ({ mass: 0, rotation: [-Math.PI / 2, 0, 0], position: [0, -2, 0] }))
      return (
        <mesh ref={ref} />
        )
    }
  
  return (
    <>
    <NavBar />
    <div className='emperor'>
      <div className='r3f-chest'>
        <Canvas shadows camera={{ position: [0, 0.5, 6], far: 500, fov: 60 }}>
          <pointLight castShadow position={[-5, 10, 10]} intensity={1.5} />
          <Physics>
            <Suspense>
              <Wall />
              <Plane position={[0, 45, 0]} />
              <Coins numOfCoins={10} />
              <Bucket scale={7} position={[0, -1.8, 0]} rotation={[0, Math.random() * 5, 0]} />
              <ShadowPlane position={[0, -3, 0]} />
            </Suspense>
          </Physics>
        </Canvas>
      </div>

      <div className="budget-container">
        <h3 className='header'>Categories: </h3>
        <div className="budget-buttons">
          <SelectButton
            state={state}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            currentBudgetId={state.budget_id}
            budgetList={budgetListState.budgetListData}
            updateCurrentBudget={updateCurrentBudget}
          />

          <div className="share-button">
            <ShareBudget budgetId={state.budget_id} className="share-budget-button"/>
          </div>

          <div className="share-button">
            <button budgetId={state.budget_id} className="share-budget-button" 
            onClick={() => addnewBudget()}  >
              NEW
            </button>
          </div>

        </div>

        <div className='category__container'>
          {budgetCategories}
        </div>

        <NewCategory budget_id={state.budget_id} onSave={createNewCategory}/>
      </div>

    </div>

    <ChatButton onClick={toggleVisibility} />
        {ChatComponent}
    </>
  )
}