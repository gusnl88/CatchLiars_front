import React, { useState } from "react";
import axios from "axios";

function RegisterForm() {
    const [formData, setFormData] = useState({
        id: "",
        pw: "",
        nickname: "",
        email: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear errors as the user types
        setErrors({ ...errors, [e.target.name]: "" });
    };

    // Function to check duplicate id or email
    const checkDuplicate = async (field, value) => {
        if (!value) return; // If the field is empty, no need to check
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_SERVER}/users/checkDuplicate`,
                { field, value }
            );
            if (response.data === false) {
                // Assuming the server returns false for duplicates
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [field]: `This ${field} is already taken.`,
                }));
            }
        } catch (error) {
            console.error("Error checking duplicate:", error);
            setServerError("Error checking for duplicates. Please try again later.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check for any existing errors or duplicates before submitting
        if (Object.values(errors).some((error) => error)) {
            alert("Please resolve the errors before submitting.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_SERVER}/users/signup`,
                formData
            );
            if (response.data === true) {
                alert("Registration successful.");
            } else if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                setServerError("Unexpected server response. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setServerError("Server error occurred during registration.");
        }
    };

    return (
        <div>
            <h1>User Signup</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">ID:</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        onBlur={() => checkDuplicate("id", formData.id)}
                        required
                    />
                    {errors.id && <span>{errors.id}</span>}
                </div>
                <div>
                    <label htmlFor="pw">Password:</label>
                    <input
                        type="password"
                        id="pw"
                        name="pw"
                        value={formData.pw}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="nickname">Nickname:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => checkDuplicate("email", formData.email)}
                        required
                    />
                    {errors.email && <span>{errors.email}</span>}
                </div>
                <div>
                    <button type="submit">Sign Up</button>
                </div>
            </form>
            {serverError && <p>{serverError}</p>}
        </div>
    );
}

export default RegisterForm;
