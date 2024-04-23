import ReactDOM from "react-dom/client";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;
const store = configureStore({ reducer: rootReducer });

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Container>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </Container>
);
