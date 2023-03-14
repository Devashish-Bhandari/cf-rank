const key=1;

async function addUser(user){
    let res= await fetch(`https://codeforces.com/api/user.rating?handle=${user}`);
    let data= await res.json();
    let temp = await data.status;

    if(temp == "FAILED") return;

    // IF NOT INITIALIZED AND WHEN DELETE ON LENGTH = 1, CLEAR STORAGE
    if(localStorage.getItem(key)==null){
        let arr= [];
        arr.push(user);

        localStorage.clear();

        let strArr = JSON.stringify(arr);
        localStorage.setItem(key,strArr);

        returnUsers();
        return;
    }

    let arrayString = localStorage.getItem(key);
    let arr= JSON.parse(arrayString);
    arr.push(user);

    localStorage.clear();

    let strArr = JSON.stringify(arr);
    localStorage.setItem(key, strArr);

    returnUsers();
}


//Adding Event Listener to Add Button
document.getElementById("add").addEventListener('click', ()=> {
    let inputUsesr = document.getElementById("input-field").value;
    addUser(inputUsesr);
})

//Creates User string on newly generated array and then call for fetch
async function returnUsers(){

    if(localStorage.getItem(key)==null){
        document.getElementById("cards-div").innerHTML= '';
        return;
    }

    let arrayString = localStorage.getItem(key);
    let arr= JSON.parse(arrayString);

    let usersString = "";

    let userSet= new Set();

    for(const user of arr){
        userSet.add(user);
    }

    for(const user of userSet){
        usersString += user+ ";";
    }

    display(usersString);

}

// DELETE SINGLE ELEMENT
// Adding event listener to the entire div
// This way event listener will be imposed to all the newly added cards
let allItems= document.getElementById('cards-div');
allItems.addEventListener('click', deleteFunction);

function deleteFunction(e){
    console.log(e.target);
    if(e.target.classList.contains('delete')){
        if(confirm('Do you want to delete the item?')){
            console.log("button confirmed");

            // This is done to reach to the super grand parent of the button which was clicked
            let btnParent= e.target.parentElement.parentElement.parentElement.parentElement;
            let user= btnParent.id;

            btnParent.remove();
            let arrString= localStorage.getItem(key);
            let arr= JSON.parse(arrString);
            
            let newArr= [];
            for(const item of arr){
                if(item !== user){
                    newArr.push(item);
                }
            }
            console.log("newarr", newArr);
            let strArr= JSON.stringify(newArr);
            
            console.log("strarr" , strArr);
            localStorage.setItem(key, strArr);
        }

        console.log("clicked");
    }
}



// WILL DISPLAY THE USERS
async function display(usersString){
    
    let res= await fetch("https://codeforces.com/api/user.info?handles="+usersString);
    let temp = await res.json();
    let resultArray = await temp.result;

    document.getElementById("cards-div").innerHTML= "";

    for(const x of resultArray){
        let fullName = x.firstName + " " + x.lastName;

        document.getElementById("cards-div").innerHTML += `
        <div class="card" id=${x.handle}>
            <div class="title-section" >
                <div class="user-info-section">
                    <div class="user-img-div">
                        <img src="${x.titlePhoto}" alt="" class="user-img">
                    </div>
                    <div class="name-section">
                        <div class="name-div">
                            <h3 class="name">${fullName} </h3>
                        </div>
                        <div class="user-name-div">    
                            <h4 class="user-name">@${x.handle}</h4>
                        </div>
                    </div>

                </div>
                
                <!-- To Delete -->
                <div class="bin-section" >
                    <div class="bin-icon">
                        <button class="delete material-icons-outlined">
                            delete
                        </button>
                    </div>
                </div>
            </div>

            <div class="ratings-section">

                <div class="curr-rating rating-div">
                    <h2 class="rating-score">${x.rank}</h2>
                    <p>Current Rank</p>
                </div>
                <div class="old-rating rating-div">
                    <h2 class="rating-score">${x.rating}</h2>
                    <p>Current Rating</p>
                </div>
                <div class="max-rating rating-div">
                    <h2 class="rating-score">${x.maxRating}</h2>
                    <p>Max Rating</p>
                </div>
            </div>
        </div>`;

    }

}


function hotReload(){
    if(localStorage.getItem(key) != null){
        returnUsers();
    }
}

document.getElementById("clrAll").addEventListener('click', () => {
    localStorage.clear();
    returnUsers();
});

hotReload();