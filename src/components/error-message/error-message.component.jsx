import { ErrorLabel } from "./error-message.styles";

const ErrorMessage = ({error}) => {
   return ( 
    <ErrorLabel>{error}</ErrorLabel>
   )
}

export default ErrorMessage;

