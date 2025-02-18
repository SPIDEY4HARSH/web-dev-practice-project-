// Targeting slider and password indicator
const dataLength_slider = document.querySelector('#slide');
const passLength = document.querySelector('.password-lengthNUM');

// Targeting copy button
const data_copy = document.querySelector('[Manage-copy]');
const copyMsg = document.querySelector('[copy-MSG]');

// Targeting password display section
const DisplayPassword = document.querySelector('.passrod-area');

// Targeting checkboxes
const upperCase = document.querySelector('#upperCase');
const lowerCase = document.querySelector('#lowerCase'); // Ensure ID matches HTML
const number = document.querySelector('#Numbers');
const symbol = document.querySelector('#Symbols');

// Targeting all checkboxes
const checkboxes = document.querySelectorAll('input[type=checkbox]');

// Targeting strength indicator
const StrengthIndicator = document.querySelector('.strength-indicator');

// Targeting generate password button
const genPass = document.querySelector('.genPasswordButton');

// Initially setting password length
let passwordLength = 10;
let password = '';
let checkedCount = 0;

// Handling slider value
function handleSlider() {
    dataLength_slider.value = passwordLength;
    passLength.innerText = passwordLength;
}

// Event listener for slider
dataLength_slider.addEventListener('input', function () {
    passwordLength = dataLength_slider.value;
    passLength.innerText = passwordLength;
    console.log("sfsfawef");
});

handleSlider();
setIndicator("#ccc");

//shuffling password using fisher algorithium
function Shufflepassword(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function getRandInteger(min , max)
{
   return Math.floor( Math.random() * (max-min)  + min );
}

function getRandomLowercase (){
    return String.fromCharCode(getRandInteger(97 , 122));
}

function getRandomNumber (){
    return getRandInteger(0,9);
}

function getRandomSymbol (){
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><";
    return symbols.charAt(getRandInteger(1,symbols.length));
}
function getRandomUppercase (){
    return String.fromCharCode(getRandInteger(65,91));
}

function setIndicator(color) {
    StrengthIndicator.style.backgroundColor = color;
    StrengthIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function calcStrength(){
    let hasUpper = false ;
    let hasLower = false ;
    let hasNumber = false ;
    let hasSymbol = false ;
    if (upperCase.checked) hasUpper = true;
    if (lowerCase.checked) hasLower = true ;
    if (number.checked) hasNumber = true ;
    if (symbol.checked) hasSymbol = true ;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
}
async function copyContent() {
    try {
        await navigator.clipboard.writeText(DisplayPassword.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}


function HandleCheckbox(){

    checkedCount= 0;
    checkboxes.forEach((checkbox)=>
    {
        if (checkbox.checked)
        {
            checkedCount++;
        }
    })

    if (passwordLength<checkedCount)
    {
          passwordLength=checkedCount;
          handleSlider();
    }
    
}
checkboxes.forEach( (checkbox) => {
    checkbox.addEventListener('change', HandleCheckbox);
})
data_copy.addEventListener('click',() => {
    if(DisplayPassword.value)
        copyContent();
})

genPass.addEventListener('click',()=>{
    if(checkedCount===0)
    {return;}
    if (passwordLength<checkedCount)
    {
        passwordLength= checkedCount;
        handleSlider();
    }

    let funArr = [];

    //pushing the random functions into the array
    if (upperCase.checked){
        funArr.push(getRandomUppercase);
    }
    if (lowerCase.checked){
        funArr.push(getRandomLowercase);
    }
    if (number.checked){
        funArr.push(getRandomNumber);
    }
    if (symbol.checked){
        funArr.push(getRandomSymbol);
    }
    // genratring the password 
    password = "";
    for (i = 0 ; i<funArr.length ; i++)
    {
        password += funArr[i]();
    }
    // adding the remaining characters 
    for(let i=0; i<passwordLength - funArr.length; i++) {
        let randIndex = getRandInteger(0 , funArr.length);
        console.log("randIndex" + randIndex);
        password += funArr[randIndex]();
    }
    password = Shufflepassword(Array.from(password));
    DisplayPassword.value = password;
    calcStrength();
       

})