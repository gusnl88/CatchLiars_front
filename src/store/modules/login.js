// login.js
const initialState = {
    user: {
        id: sessionStorage.getItem("userId") || null,
        nickName: sessionStorage.getItem("nickName") || null,
        isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
    },
};

export function login(id, name) {
    sessionStorage.setItem("userId", id);
    sessionStorage.setItem("nickName", name);
    sessionStorage.setItem("isAuthenticated", "true");
    return {
        type: "LOGIN",
        payload: { id, name },
    };
}

export function logout() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("nickName");
    sessionStorage.setItem("isAuthenticated", "false");
    return {
        type: "LOGOUT",
    };
}

export function loginReducer(state = initialState, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: {
                    id: action.payload.id,
                    nickName: action.payload.name,
                    isAuthenticated: true,
                },
            };
        case "LOGOUT":
            return {
                ...state,
                user: {
                    id: null,
                    nickName: null,
                    isAuthenticated: false,
                },
            };
        default:
            return state;
    }
}
