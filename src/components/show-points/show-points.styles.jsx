import { styled } from "styled-components";

export const PointsContainer = styled.div`
    margin-top: 100px;
    display: flex;
    min-height: 150px;
    flex-direction: column;
    width: 100vw;
    align-items: center;
`;

export const Name = styled.p`
    display: inline-block;
    text-align: center;
    font-size: 20px;
    font-weight: 900;

    @media (max-width: 900px) {
        font-size: 16px;
        text-align: left;
    }
`;

export const Point = styled.p`
    display: inline-block;
    text-align: center;
    font-size: 20px;
    font-weight: 900;

    @media (max-width: 900px) {
        font-size: 16px;
        text-align: left;
    }
`;

export const PointsInfo = styled.div`
    position: relative;
    width: 70%;
    display: flex;
    justify-content: space-between;
    @media (min-width: 900px) {
        width: 50%;
    }
`;

export const Round = styled.h2`
    font-size: 20px !important;
    width: 100%;
    position: absolute;
    top: 20px;
    text-align: center;
`;
