const ingredientsField = document.querySelector(".ingredientsField");
const findButton = document.querySelector(".findButton");
const result = document.querySelector(".result");
const loading = document.querySelector(".loadingAnimation");
const main = document.querySelector(".main");
const error_message = document.createElement("p");
const serverUrl = 'http://p-mozil.click/';

const copyContent = async () => {
     let text = result.textContent;
        try {
          await navigator.clipboard.writeText(text);
          alert("Ingredients and directions copied");
          ingredientsField.value="";
          ingredientsField.focus();
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
      }

main.addEventListener("click",function(){
    copyContent();
})

ingredientsField.addEventListener("keypress", function(e) {
    if (e.key === "Enter" && document.querySelector(".findButton")) {
     e.preventDefault();
     findButton.click();
    }
   });

async function getApiKey(serverUrl){
try{
    let response = await fetch(serverUrl);
    let json = await response.json();
    let key = json.key;
    console.log("json",json);
    console.log(key);
    return key;
}catch(err){
console.error("ERRORR =>>>",err);
}
}

findButton.addEventListener("click", function(){
let ingredients = ingredientsField.value;
let prompt = `Dish recipe using only ${ingredients}.Replace Fahrenheit temperature with Celsius. Also give ingredients and directions`;
result.textContent = "";

(async () => {
try{
     if (!ingredients) {
        showError("Please provide at least one ingredient.");
       }else{
loading.style.display = "block";
let key = await getApiKey(serverUrl);
let data = await getDishes(prompt,key);
let dishes = data.choices[0].text.split(/\n/);
    dishes = dishes.filter((el,index,arr)=>{
       return (el.charAt(0) != ",") &&
              (el != "") &&
              (arr[0].charAt(0).toLowerCase() !== el.charAt(0));
                })
                render(dishes);
            }
}catch(err){
    showError("Error fetching dishes. Please try again later.");
}})();
}
)

 async function getDishes(prompt,key){
 const response = await fetch(
        `https://api.openai.com/v1/completions`,
        {
            body: JSON.stringify({
            "model": "text-davinci-002",
            "prompt": prompt,
            "temperature": 0.5,
            "max_tokens": 300}),
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer  ${key}`,
            },
                }
    );
const data = await response.json();
console.log(data);
 return data;
    }

     function render(arr){
     loading.style.display="none";
     findButton.value="Else";
     arr.map((el,i) => {
        let p = document.createElement("p");
        if (i == 0 && el !="Ingredients:"){
             p.classList.add("dish_name");
        }
        if (!(i%2)){
        p.classList.add("collored_line");
        }
        if (el=="Ingredients:" || el =="Directions:" || el =="Instructions:"){
        p.classList.add("ing_dir");
        }
     p.textContent = el;
     result.appendChild(p);
     })
    }

    function showError(msg){
        const error_message = document.createElement("p");
        error_message.className = "error_message";
        error_message.textContent = msg;
        result.append(error_message);
        loading.style.display="none";
    }
    
