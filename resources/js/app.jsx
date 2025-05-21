// resources/js/app.jsx
import ReactDOM from "react-dom/client";
import Index from "./Index";
import { store } from "./apps/store";
import { Provider } from "react-redux";
import { UserProvider } from "./context/userContext";
// const App = () => <h1>Hello from React + Vite!</h1>;

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <Provider store={store}>
        <UserProvider>
            <Index />
        </UserProvider>
    </Provider>
);
