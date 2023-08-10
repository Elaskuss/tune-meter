import { NavOptionStyle } from "./nav-option.styles";

const NavOption = ({ value, promt, ...otherProps }) => {
   console.log(value);
   return (
      <NavOptionStyle value={value} {...otherProps}>
         {promt}
      </NavOptionStyle>
   );
};

export default NavOption;
