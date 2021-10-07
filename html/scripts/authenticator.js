//const $ = require("jquery");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const userStatusObserver = require("./userStatusObserver");
const navBar = require("../navbar/scripts/navbar");
const GitHubActivity = require("../lib/github-activity");
const Toaster = require("../toaster/scripts/toaster");
const GitHubCalendar = require("github-calendar");

const toaster = Toaster();
// config values for firebase site
var config = {
    apiKey: "AIzaSyBMn85CoL3MFsgIAwMQzwqrpcBaLtVO0PY",
    authDomain: "personal-site-3111d.firebaseapp.com",
    databaseURL: "https://personal-site-3111d.firebaseio.com",
    projectId: "personal-site-3111d",
    storageBucket: "personal-site-3111d.appspot.com",
    messagingSenderId: "785882455269"
};

const Authenticator = Object.create(null, {

    "activeUser": {
        value: null,
        enumerable: true,
        writable: true
    },

    "init": {
        value: function() {
            firebase.initializeApp(config);
            // navBar.init();
            $(".admin-container").hide();
            $(".section-container").show();

            // if admin is set-up then show the navbar
            const navbar = require("../navbar/scripts/navbar");
            
            if (navbar.activeAdminRequest()) {
                navbar.populateNavBar();
            } else {
                document.getElementById("mainNav").style.display = "none";
            }
            // init the about controller
            const aboutController = require("../about/scripts/controllers/aboutController");
            aboutController.init();
            
            // init the projects controller
            const projectController = require("../projects/scripts/projects");
            projectController.load();
            
            const contactController = require("../contact/scripts/contact");
            contactController.load();

            const resumeController = require("../resume/scripts/resume");
            resumeController.load();
            // here we will init the different components
            GitHubCalendar(document.querySelector("#feed"), "krysmathis", {summary_text:"GitHub Repo Chart",responsive: true});

            // this will handle the event listeners for the login buton
            const btnLogin = document.querySelector(".login__button-login");
            const btnCreate = document.querySelector(".login__button-create");

            $(btnLogin).on("click", () => {
                const email = $(".login__email").val();
                const password = $(".login__password").val();
                this.login(email, password);
            });

            $(btnCreate).on("click", () => {
                const email = $(".login__username").val();
                const password = $(".login__password").val();
                this.createNewUser(email, password);
            });
            userStatusObserver.init();
        }
    },

    "login": {
        value: function (email, password) {

            // pre-validation
            if (email.length < 1) {
                toaster.makeToast("please enter a valid email or password", 3000);
                toaster.makeToast("Oops...", 2000);
                return;
            } else {
                let user = firebase.auth().currentUser;
                if (user) {
                    toaster.makeToast("already signed in", 3000);
                }
            }

            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                toaster.makeToast(`ERR: ${errorCode}:<br> ${errorMessage}`, 3000);
                return;
                // ...
            });
            this.currentUser = firebase.auth().currentUser;
        }
        //an
    },
    "createNewUser": {
        value: function (username, email) {
            firebase.auth().createUserWithEmailAndPassword(username, email).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                toaster.makeToast(`ERR: ${errorCode}:<br> ${errorMessage}`, 3000);
                return;
                // ...
            });
            this.currentUser = firebase.auth().currentUser;

        }
    },

});

module.exports = Authenticator;