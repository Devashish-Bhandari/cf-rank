const key='cf-usernames';

// FUNCTION TO ADD THE USERS
async function addUser(user){
    let res= await fetch(`https://codeforces.com/api/user.rating?handle=${user}`);
    let data= await res.json();
    let temp = await data.status;

    if(temp == "FAILED"){
        alert("No user with this name found");
        return;
    } 

    // IF NOT INITIALIZED, WHEN DELETE ON LENGTH = 1=> CLEAR STORAGE AND ADD TO IT THIS USER
    if(localStorage.getItem(key)==null){
        let arr= [];
        arr.push(user);

        localStorage.removeItem(key);

        let strArr = JSON.stringify(arr);
        localStorage.setItem(key,strArr);

        returnUsers();
        return;
    }

    // If the array is not null, go with this 
    let arrayString = localStorage.getItem(key);
    let arr= JSON.parse(arrayString);
    arr.push(user);

    localStorage.removeItem(key);

    let strArr = JSON.stringify(arr);
    localStorage.setItem(key, strArr);

    returnUsers();
}


//Adding Event Listener to Add Button
document.getElementById("add").addEventListener('click', ()=> {
    let inputUsers = document.getElementById("input-field").value;
    addUser(inputUsers);
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

function deleteUser(user){
    console.log(document.getElementById("deleteIt"));
    console.log("deleted "+ user);
    let arrayString = localStorage.getItem(key);
    let arr = JSON.parse(arrayString);

    for(const item of arr){
        if(item == user){
            arr.splice(item,1);
        }
    }

    console.log(arr);

    localStorage.clear();

    let strArr = JSON.stringify(arr);
    localStorage.setItem(key, strArr);

    returnUsers();
}


async function display(usersString){
    
    let res= await fetch("https://codeforces.com/api/user.info?handles="+usersString);
    let temp = await res.json();
    let resultArray = await temp.result;

    document.getElementById("cards-div").innerHTML= "";

    for(const x of resultArray){
        let fullName = x.firstName + " " + x.lastName;
        let imgSrc= "http:"+x.titlePhoto;

        document.getElementById("cards-div").innerHTML += `
        <div class="card">
            <div class="title-section">
                <div class="user-info-section">
                    <div class="user-img-div">
                        <img src=${imgSrc} alt="" class="user-img">
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
                
                <!--<div class="bin-section" >
                    <div class="bin-icon">
                    <button class="delete">
                        <span class="material-icons-outlined">delete</span>

                    </button>
                    </div>
                </div> -->
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

        // document.querySelector(`#${x.handle}`).addEventListener('click', (e) =>{

        //     e.preventDefault();

        //     deleteUser(x.handle);
        // });

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