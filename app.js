// All of the modals 
//----------------------------------------------------------------------------------

// Signup Button
var signupbutton = document.querySelector("#signupbutton");
signupbutton.addEventListener('click', (e) => {
    var signUpModal = document.querySelector("#signUpModal");
    // show modal
    signUpModal.classList.add('is-active');
    e.preventDefault();
})
var signUpFormBackground = document.querySelector("#signUpFormBackground");
signUpFormBackground.addEventListener('click', (e) => {
    e.preventDefault();
    signUpModal.classList.remove('is-active');
})
var signUpReset = document.querySelector("#signUpReset");
signUpReset.addEventListener('click', (e) => {
    e.preventDefault();
    signUpForm.reset();
})

//----------------------------------------------------------------------------------

// log In Button
var logInButton = document.querySelector("#logInButton");
logInButton.addEventListener('click', (e) => {
    var logInForm = document.querySelector("#logInForm");
    // show modal
    logInForm.classList.add('is-active');
    e.preventDefault();

})
var logInBackground = document.querySelector("#logInBackground");
logInBackground.addEventListener('click', (e) => {
    e.preventDefault();
    logInForm.classList.remove('is-active');
})
var logInReset = document.querySelector("#logInReset");
logInReset.addEventListener('click', (e) => {
    e.preventDefault();
    logInData.reset();
})


//----------------------------------------------------------------------------------

// Contact Us Button
var contactUsButton = document.querySelector("#contactUsButton");
contactUsButton.addEventListener('click', (e) => {
    var contactusModal = document.querySelector("#contactusModal");
    e.preventDefault();
    // show modal
    contactusModal.classList.add('is-active');
    e.preventDefault(e);
})
var contactUsBackground = document.querySelector("#contactUsBackground");
contactUsBackground.addEventListener('click', (e) => {
    contactusModal.classList.remove('is-active');
})

//----------------------------------------------------------------------------------


// Pet Partner Button
var petButton = document.querySelector("#petButton");
petButton.addEventListener('click', (e) => {
    var petPartnerForm = document.querySelector("#petPartnerForm");
    // show modal
    petPartnerModal.classList.add('is-active');
    e.preventDefault();
})
var PetPartnerCancel = document.querySelector("#PetPartnerCancel");
PetPartnerCancel.addEventListener('click', (e) => {
    e.preventDefault();
    petPartnerModal.classList.remove('is-active');
})
var petPartnerReset = document.querySelector("#petPartnerReset");
petPartnerReset.addEventListener('click', (e) => {
    e.preventDefault();
    petPartnerForm.reset();
})


// end of Modals
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------


// Log tracking data

/* The goal of the following script is to capture the UID of the account followed by adding
the personal information to a firebase store DB */
let signUpForm = document.querySelector('#signUpForm');

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let signUpEmail = document.querySelector('#signUpEmail').value;
    let signUpPassword = document.querySelector('#signUpPassword').value;
    let fName = document.querySelector('#fName').value;
    let lName = document.querySelector('#lName').value;
    let phoneNumber = document.querySelector('#phoneNumber').value;
    let userType = document.querySelector('#userType').value;

    auth.createUserWithEmailAndPassword(signUpEmail, signUpPassword).then(id => {
            return db.collection('users').doc(id.user.uid).set({
                FirstName: fName,
                LastName: lName,
                PhoneNumber: phoneNumber,
                Type: userType
            })
        })
        .then((userCredential) => {
            var user = userCredential.user;
            signUpModal.classList.remove('is-active');

        })
        .catch((error) => {
            var errorMessage = error.message;
            let signUpError = document.querySelector('#signUpError')
            console.log("little issue but we good")

        });
    signUpModal.classList.add('is-active');
    signUpForm.reset();
})

// Let User sign in
let logInData = document.querySelector('#logInData');
logInData.addEventListener('submit', (e) => {
    e.preventDefault();
    let logInEmail = document.querySelector('#logInEmail').value;
    let logInPassword = document.querySelector('#logInPassword').value;

    auth.signInWithEmailAndPassword(logInEmail, logInPassword)
        .then((userCredential) => {
            var user = userCredential.user;
            logInForm.classList.remove('is-active');
            logInData.reset();

        })
        .catch((error) => {
            var errorMessage = error.message;
            let signUpError = document.querySelector('#signUpError')
            signUpError.innerHTML = `<p>${errorMessage}</p>`;
        });

})

//Let User Sign out
let signOutButton = document.querySelector('#signOutButton')
signOutButton.addEventListener(('click'), () => {
    auth.signOut()
        .then((msg) => {

        })
})


// Actions to take if User is signed in. 
let loggedoutlinks = document.querySelectorAll('.notLogged');
let loggedinlinks = document.querySelectorAll('.logged');
let hightLightReel = document.querySelector('#highLightReel')


auth.onAuthStateChanged((user) => {
    if (user) {
        let email = auth.currentUser.email;
        loggedinlinks.forEach((link) => {
            link.classList.remove('is-hidden');
            console.log('User signed in')
        })
        loggedoutlinks.forEach((link) => {
            link.classList.add('is-hidden');
        })

        let apTest = document.querySelector('#apTest')
        let testing = document.querySelector('#testing')
        apTest.addEventListener(('click'), (e) => {
            e.preventDefault();
            db.collection('animalDB').get().then((data) => {
                let Animals = data.docs;
                middleContent.innerHTML = '';
                Animals.forEach((i) => {
                    middleContent.innerHTML +=
                        `
                    <div class="box">

                    <h1 class="title is-size3 has-background-success-light p-2"> Meet ${i.data().name} </h1>
                    <div class="columns">
                        <div class="column is-4">
                        <p><img src="${i.data().url}" </p> </div> 
                            <div class="column">
                    <p>A ${i.data().type} with a ${i.data().demeanor} demeanor.</p>
                    <p>'${i.data().info}'</p>
                    <div class="control">
                        <button class="button is-info-light mt-3" id="contactOwner"><a href = "mailto: ${i.data().email}">Email Owner </a></button>
                        <button class="button is-info-light mt-3" id="contactOwner"><a href = "tel: ${i.data().number}">Call Owner </a></button>
                    </div>

            </div>
        </div>
    </div>
          `
                });
            })

        })


        // Actions to take if user is signed out. 
    } else {
        loggedoutlinks.forEach((link) => {
            link.classList.remove('is-hidden');
            console.log('user is not signed in')
        })
        loggedinlinks.forEach((link) => {
            link.classList.add('is-hidden');
        })
    }
})
let animalSearchButton = document.querySelector('#animalSearchButton');

animalSearchButton.addEventListener('click', (e) => {
    e.preventDefault();

    //grab the content of the input with ID search_box
    let animalSearch = document.querySelector('#animalSearch').value;

    db.collection('animalDB').where('name', '==', animalSearch).get().then((data) => {
        let animalDB = data.docs;
        welcomeUser.innerHTML = '';
        animalDB.forEach((i) => {
            welcomeUser.innerHTML += `
            <div class="box">

            <h1 class="title is-size3 has-background-success-light p-2"> Meet ${i.data().name} </h1>
            <div class="columns">
                <div class="column is-4">
                    <p><img src="${i.data().url}" </p> </div> 
                    <div class="column">
                        <p>A ${i.data().type} with a ${i.data().demeanor} demeanor.</p>
                        <p>'${i.data().info}'</p>
                        <div class="control">
                        <button class="button is-info-light mt-3" id="contactOwner"><a href = "mailto: ${i.data().email}">Contact Owner </a></button>
                        <button class="button is-info-light mt-3" id="contactOwner"><a href = "tel: ${i.data().number}">Call Owner </a></button>
                        </div>
                </div>
                
            </div>
        </div>
        `;

        })

    })


})



//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------


// DB specific Functions

// let animalName = document.querySelector('#animalName option:checked').value;
//how you see radial options

let petPartnerModal = document.querySelector('#petPartnerModal');
// Adding data to firebase animalID DB
petPartnerModal.addEventListener(('submit'), (e) => {
    var petPartnerForm = document.querySelector("#petPartnerForm");
    e.preventDefault();

    let animalName = document.querySelector('#animalName').value;
    let animalType = document.querySelector('#animalType').value;
    let email = auth.currentUser.email;
    let animalInfo = document.querySelector('#animalInfo').value;
    let animalDemeanor = document.querySelector('#animalDemeanor').value;
    let file = document.querySelector('#animalPictures').files[0];
    let image = new Date() + "_" + file.name;
    const task = ref.child(image).put(file);

    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then((url) => {
            db.collection("animalDB").add({
                    name: animalName,
                    type: animalType,
                    info: animalInfo,
                    demeanor: animalDemeanor,
                    url: url,
                    email: email

                })
                .then((x) => {
                    petPartnerForm.reset();
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        })



})