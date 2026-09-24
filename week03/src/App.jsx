import Header from './components/Header'
import AboutMe from './components/AboutMe'
import Skills from './components/Skills'
import Fiction from './components/Fiction'
import Music from './components/Music'
import Contact from './components/Contact'
import './App.css'

function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <AboutMe />
        <Skills />
        <Fiction />
        <Music />
        <Contact />
      </main>
      <footer className="footer">
        <p>Built with React · {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App