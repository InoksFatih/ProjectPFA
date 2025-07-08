import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Footer from './components/footer/footer'; // make sure path is correct
import Register from './components/register/Register';

function App() {
  return (
    <div className="page-wrapper">
      <main className="main-content">
        <Register />
      </main>
      <Footer />
    </div>
  );
}

export default App;
