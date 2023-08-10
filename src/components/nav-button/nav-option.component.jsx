import { NavOptionStyle } from "./nav-option.styles";

const NavOption = ({ value, promt, ...otherProps }) => {
   return (
      <NavOptionStyle value={value} {...otherProps}>
         {promt}
      </NavOptionStyle>
   );
};

export default NavOption;
