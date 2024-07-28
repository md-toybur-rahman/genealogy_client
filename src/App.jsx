import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Genealogy from './Components/Genealogy/Genealogy';
import DecisionTree from './Components/DecisionTree/DecissionTree';

function App() {
  const [lan, setLan] = useState(false);
  const [genealogy, setGenealogy] = useState({});
  const [banglaGenealogy, setBanglaGenealogy] = useState({});
  useEffect(() => {
    fetch('genealogy.json')
      .then(res => res.json())
      .then(data => {
        console.log(data.name);
        setGenealogy(data[0]);
      })
  }, [])
  useEffect(() => {
    fetch('genealogy_bangla.json')
      .then(res => res.json())
      .then(data => {
        console.log(data.name);
        setBanglaGenealogy(data[0]);
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 pt-10">
      <div className="flex justify-center">
        <div className="">
          <h1 className='cursor-pointer bg-white w-fit px-2 lg:px-4 py-1 rounded-lg shadow-lg fixed top-3 left-4 lg:top-10 lg:left-20'>Last Update: 17/07/24</h1>
          <h1 onClick={() => { setLan(!lan) }} className='cursor-pointer bg-white w-fit px-2 lg:px-4 py-1 rounded-lg shadow-lg fixed top-3 right-4 lg:top-10 lg:right-20'>{!lan ? 'বাংলা' : 'English'}</h1>
          <div className='flex flex-col items-center gap-5'>
            <Genealogy data={!lan ? genealogy : banglaGenealogy} language={!lan ? 'English' : "Bangla"}></Genealogy>
          </div>
        </div>
      </div>
    </div>

    // <div>
    //   <DecisionTree></DecisionTree>
    // </div>
  )
}

export default App
