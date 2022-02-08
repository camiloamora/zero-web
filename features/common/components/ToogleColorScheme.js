import { useState, useEffect } from 'react';
import { Check, Heading } from '@camiloamora/components'

const setDarkMode = ({ setIsChecked }) => {
  document.querySelector('body').dataset.colorSheme = 'dark'
  window.localStorage.setItem('prefers-color-scheme', 'dark')
  setIsChecked(true)
}

const setLightMode = ({ setIsChecked }) => {
  document.querySelector('body').dataset.colorSheme = 'light'
  window.localStorage.setItem('prefers-color-scheme', 'light')
  setIsChecked(false)
}

const initialColorSheme = ({ setIsChecked }) => {
  const localStorageColorScheme = window.localStorage.getItem('prefers-color-scheme')

  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme:dark)')
  if(localStorageColorScheme != null) {
    localStorageColorScheme === 'dark'
    ? setDarkMode({ setIsChecked })
    : setLightMode({ setIsChecked })
  } else {
    // TODO: move to a function
    // Load from media query
    const isDarkMode = darkModeMediaQuery?.matches
    isDarkMode ? setDarkMode({ setIsChecked }) : setLightMode({ setIsChecked })
  }

  // TODO: move to a function
  // Listen media query changes
  darkModeMediaQuery.addListener((event) => {
    event.matches
      ? setDarkMode({ setIsChecked })
      : setLightMode({ setIsChecked })
  })
}

const handleClick = ({ isChecked, setIsChecked }) => () => {
  if(isChecked) {
    setLightMode({ setIsChecked })
  } else  {
    setDarkMode({ setIsChecked })
  }
}

const ToogleColorScheme = () => {

  const [isChecked, setIsChecked] = useState(false);

  useEffect(()=> {
    initialColorSheme({ setIsChecked })
  }, [])

  return (
    <div
      style={{ display:'flex', alignItems: 'center', cursor: 'pointer' }}
     onClick={handleClick({ isChecked, setIsChecked })}
     >
      <Check isChecked={isChecked}/>
      <Heading>Dark Mode</Heading>
    </div>
  );
}

export default ToogleColorScheme;
