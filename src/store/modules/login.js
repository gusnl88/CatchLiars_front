// login.js
const initialState = {
    user: {
        u_seq:sessionStorage.getItem("u_seq") || null,
        id: sessionStorage.getItem("userId") || null,
        nickName: sessionStorage.getItem("nickName") || null,
        isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
    },
};

export function login(u_seq, id, name) {
    sessionStorage.setItem("u_seq", u_seq);
    sessionStorage.setItem("userId", id);
    sessionStorage.setItem("nickName", name);
    sessionStorage.setItem("isAuthenticated", "true");
    return {
        type: "LOGIN",
        payload: { u_seq, id, name },
    };
}

export function logout() {
    sessionStorage.removeItem("u_seq");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("nickName");
    sessionStorage.removeItem("isAuthenticated");
    return {
        type: "LOGOUT",
    };
}

export function loginReducer(state = initialState, action) {
    console.log(state);
    console.log("action.type", action.type);
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: {
                    u_seq: action.payload.u_seq,
                    id: action.payload.id,
                    nickName: action.payload.name,
                    isAuthenticated: true,
                },
            };
        case "LOGOUT":
            return {
                ...state,
                user: {
                    u_seq:null,
                    id: null,
                    nickName: null,
                    isAuthenticated: false,
                },
            };
        default:
            return state;
    }
}
