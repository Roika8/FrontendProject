import ReactDOM from 'react-dom';
import App from './Components/App/App';
import { BrowserRouter as Router } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css'
import 'semantic-ui-css/semantic.min.css'
import "react-icons"


ReactDOM.render(
        <Router>
            <App />
        </Router>
    ,
    document.getElementById('root')
);

