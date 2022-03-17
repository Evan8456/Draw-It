import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'RobotoSlab';
        font-style: normal;
        font-weight: 400;
        src: url('../assets/RobotoSlab-VariableFont_wght.ttf') format('ttf');
      }
      `}
  />
)

export default Fonts