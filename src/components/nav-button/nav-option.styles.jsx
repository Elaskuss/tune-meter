import styled from "styled-components";

export const NavOptionStyle = styled.button`
    display: flex;
    margin:0.1rem; 
    background-color: teal;
    border:none;

    height: 50px; 
    width: 100%;
    
    color: white;
    
    font-size: auto; 
    justify-content: center;
    align-items:center

    &.selected {
        box-shadow: -1px 13px 9px 1px rgba(0,0,0,0.75);
        -webkit-box-shadow: -1px 13px 9px 1px rgba(0,0,0,0.75);
        -moz-box-shadow: -1px 13px 9px 1px rgba(0,0,0,0.75);
    }
    &:hover {
        cursor: pointer;
    }
`;