const validInfo = (props) => {
    let errors = {};
    if (props.userName.trim() === "") {
        errors.userName = "User name is required";
    } else if (props.userName.length < 2) {
        errors.userName = "User name must be a least 2 Characters";

    }
    if (!props.email) {
        errors.email = "Email is required";
    } else if (props.email) {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!(props.email.match(validRegex))) {
            errors.email = "Not valid email address";
        }
    }

    if (!props.password) {
        errors.password = "Password is required";
    } else if (props.password.length < 6) {
        errors.password = "Password length should be more then 6 Characters"
    } else if (!props.password2) {
        errors.password2 = "Re-password is required";
    } else if (props.password2 !== props.password) {
        errors.password2 = "Passwords must be the same"
    }



    if (props.firstName.trim() === "") {
        errors.firstName = "First name is required"
    } else if (props.firstName.length < 2) {
        errors.firstName = "First name must be a least 2 Characters";

    }
    if (props.lastName.trim() === "") {
        errors.lastName = "Last name is required"
    } else if (props.lastName.length < 2) {
        errors.lastName = "Last name must be a least 2 Characters";

    }
    if (props.gender === -1) {
        errors.gender = "Gender must be selected"
    }
    return errors;
}
export default validInfo