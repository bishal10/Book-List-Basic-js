// Book Class: Represents a book

class USER {
  constructor(user, password, mobile, email) {
    this.user = user;
    this.password = password;
    this.mobile = mobile;
    this.email = email;
  }
}

// UI class: Handle ui tasks

class UI {
  static displayUsers() {
    const users = Store.getUsers();
    users.forEach(user => UI.addUserToList(user));
  }
  static addUserToList(user) {
    const list = document.querySelector("#user-list");
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.user}</td>
      <td>${user.mobile}</td>
      <td>${user.email}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;

    list.appendChild(row);
  }

  static deleteUser(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className, divId) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const form = document.querySelector("#user-form");
    const messageDiv = document.querySelector(divId);
    form.insertBefore(div, messageDiv);

    // Disapear Aler Message in 3 second
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#user").value = "";
    document.querySelector("#password").value = "";
    document.querySelector("#confirmpassword").value = "";
    document.querySelector("#mobile").value = "";
    document.querySelector("#email").value = "";
  }
}

// store class handles Storage
class Store {
  static getUsers(user) {
    let users;
    localStorage.getItem("users") === null;
    if (localStorage.getItem("users") === null) {
      users = [];
    } else {
      users = JSON.parse(localStorage.getItem("users"));
    }
    return users;
  }

  static addUser(user) {
    const users = Store.getUsers();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  static removeUser(mobile) {
    const users = Store.getUsers();
    users.forEach((user, index) => {
      if (typeof user.mobile === mobile) {
        users.splice(index, 1);
      }
    });

    localStorage.setItem("users", JSON.stringify(users));
  }
}

// // Event : Display book

document.addEventListener("DOMContentLoaded", UI.displayUsers);

// Event : Add a book

document.querySelector("#user-form").addEventListener("submit", e => {
  // prevent actual submit
  e.preventDefault();

  // Get form values
  const user = document.querySelector("#user").value;
  const password = document.querySelector("#password").value;
  const confirmpassword = document.querySelector("#confirmpassword").value;
  const mobile = document.querySelector("#mobile").value;
  const email = document.querySelector("#email").value;

  // Validating the form elements

  if (user === "") {
    UI.showAlert(
      "*** Please fill the username field",
      "danger",
      "#password-div"
    );
  } else if (user.length < 3 || user.length > 20 || !isNaN(user)) {
    UI.showAlert(
      "*** User cannont be number and character should be inbetween 2 and 20",
      "danger",
      "#password-div"
    );
  } else if (password === "") {
    UI.showAlert(
      "*** Please fill the password field",
      "danger",
      "#confirmpassword-div"
    );
  } else if (confirmpassword === "") {
    UI.showAlert("*** Please enter password again", "danger", "#mobile-div");
  } else if (confirmpassword != password) {
    UI.showAlert("*** Password didnot match", "danger", "#mobile-div");
  } else if (isNaN(mobile) || mobile === "" || mobile.length > 15) {
    UI.showAlert(
      "*** Please fill the mobile number field with only numbers",
      "danger",
      "#email-div"
    );
  } else if (
    email === "" ||
    email.indexOf("@") <= 0 ||
    email.charAt(email.length - 4) != "."
  ) {
    UI.showAlert("*** Invalid email address", "danger", "#submit-div");
  } else {
    // Instantiate book
    const userName = new USER(user, password, mobile, email);

    // // Add book to UI
    UI.addUserToList(userName);

    // Add book to local store
    Store.addUser(userName);

    // Book added sucess message
    UI.showAlert("User Successfully Added", "success", "#user-div");

    // To clear fields after submiting form
    UI.clearFields();
  }
});

// Event : Remove a book

document.querySelector("#user-list").addEventListener("click", e => {
  // Remove book from UI
  UI.deleteUser(e.target);

  // Remove book form local storage
  Store.removeUser(
    e.target.parentElement.previousElementSibling.previousElementSibling
      .textContent
  );

  // Book remove sucess message
  UI.showAlert("User Successfully Removed", "success", "#user-div");
});
