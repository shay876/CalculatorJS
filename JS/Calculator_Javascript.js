//create object to keep track of values
const Calculator = {
    //display 0 on screen
    Display_Value: '0',
    //this will hold first operand for any expressions, we set to null for now
    First_Operand: null,
    //checks whether or not the second operand has been inputted by user
    Wait_Second_Operand: false,
    //this will hold the operator, we set it to null for now
    operator: null,
};

//this modifies values each time button is clicked
function Input_Digit(digit){
    const {Display_Value, Wait_Second_Operand } = Calculator;
    //this checks if wait second operand is true and sets display value
    //to the key that was clicked on
    if (Wait_Second_Operand === true) {
        Calculator.Display_Value = digit;
        Calculator.Wait_Second_Operand = false;
    }
    else {
        //this overwrites display value if current value is 0
        //otherwise it adds onto it
        Calculator.Display_Value = Display_Value === '0' ? digit : Display_Value = digit;
    }
}

//handles decimal points
function Input_Decimal(dot) {
    //ensures accidental clicking of decimal doesn't cause bugs
    if (Calculator.Wait_Second_Operand === true) return;
    if (!Calculator.Display_Value.includes(dot)){
        Calculator.Display_Value += dot;
    }
}


//handles operators
function Handle_Operator(Next_Operator) {
    const {First_Operand, Display_Value, operator} = Calculator;
    //when an operator key is pressed we convert the current number
    //displayed on screen to a number and then store result in
    //Calculator.First_Operand if it doesn't always exist
    const Value_of_Input = parseFloat(Display_Value);
    //checks if operator already exists and if Wait-Second_operand is true
    //then updates the operator and exits from the function
    if (operator && Calculator.Wait_Second_Operand) {
        Calculator.operator = Next_Operator;
        return;
    }
    if (First_Operand == null) {
        Calculator.First_Operand = Value_of_Input;
    }
    else if (operator) {
        //checks if operator already exists
        const Value_Now = First_Operand || 0;
        //if operator exists, property lookup is performed for the operator
        //in the Perform_Calculation object and the function that matches the
        //operator is exacuted
        let result = Perform_Calculation[operator](Value_Now, Value_of_Input);
        //here we add fixed amt numbers after decimal
        result = Number(result).toFixed (9);
        //this removes trailing zeros
        result = (result *1).toString();
        Calculator.Display_Value = parseFloat(result);
        Calculator.First_Operand = parseFloat(result);
    }
    Calculator.Wait_Second_Operand = true;
    Calculator.operator = Next_Operator;
}

const Perform_Calculation = {
    '/': (First_Operand, Second_Operand) => First_Operand / Second_Operand,
    '*': (First_Operand, Second_Operand) => First_Operand * Second_Operand,
    '+': (First_Operand, Second_Operand) => First_Operand + Second_Operand,
    '-': (First_Operand, Second_Operand) => First_Operand - Second_Operand,
    '=': (First_Operand, Second_Operand) => Second_Operand
};

function Calculator_Reset() {
    Calculator.Display_Value = '0';
    Calculator.First_Operand = null;
    Calculator.Wait_Second_Operand = false;
    Calculator.operator = null;    
}

//this updates calc screen with the contents of display value
function Update_Display() {
    const display = document.querySelector('.calculator-screen');
    display.value = Calculator.Display_Value;
}

Update_Display();
//monitors button clicks
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    //target variable is an object that reps the element clicked
    const { target } = event;
    //if element that was clicked on is not a button exit function
    if (!target.matches('button')) {
        return;
    }
    if (target.classList.contains('operator')) {
        Handle_Operator(target.value);
        Update_Display();
        return;
    }

    if (target.classList.contains('decimal')){
        Input_Decimal(target.value);
        Update_Display();
        return;
    }
    //ensures AC clears all inputs from screen
    if (target.classList.contains('all-clear')) {
        Calculator_Reset();
        Update_Display();
        return;
    }
    Input_Digit(target.value);
    Update_Display();
})