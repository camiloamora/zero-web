import { setColorSheme } from './utils'

export const handleClick = ({ isChecked, setIsChecked }) => () => {
  setColorSheme({ isDarkMode: !isChecked, setIsChecked })
  //isChecked ? setLightMode({ setIsChecked }) : setDarkMode({ setIsChecked })
}
