document.addEventListener("DOMContentLoaded", function () {

const roles = [
"MERN Stack Developer",
"Data Science Explorer",
"Full Stack Engineer",
"AI/ML Enthusiast"
];

let roleIndex = 0;
let charIndex = 0;
const typingElement = document.getElementById("typing");

function typeText() {

if(charIndex < roles[roleIndex].length){
typingElement.textContent += roles[roleIndex].charAt(charIndex);
charIndex++;
setTimeout(typeText, 80);
}

else{
setTimeout(deleteText, 1500);
}

}

function deleteText(){

if(charIndex > 0){
typingElement.textContent = roles[roleIndex].substring(0,charIndex-1);
charIndex--;
setTimeout(deleteText,40);
}

else{
roleIndex = (roleIndex + 1) % roles.length;
setTimeout(typeText,200);
}

}

typeText();


/* CONTACT FORM VALIDATION */

const contactForm = document.getElementById("contactForm");

if(contactForm){

contactForm.addEventListener("submit", function(e) {

e.preventDefault();

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const message = document.getElementById("message").value.trim();
const formMessage = document.getElementById("formMessage");

if (name === "" || email === "" || message === "") {
formMessage.style.color = "red";
formMessage.textContent = "Please fill in all fields.";
return;
}

if (!email.includes("@")) {
formMessage.style.color = "red";
formMessage.textContent = "Please enter a valid email address.";
return;
}

formMessage.style.color = "#00bfff";
formMessage.textContent = "Message sent successfully!";
this.reset();

});

}

});