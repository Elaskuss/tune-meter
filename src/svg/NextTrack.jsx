import { FastForward } from "../components/WebPlayback/WebPlayback.styles"
import { useContext } from "react";
import { PlayerContext } from "../context/player.context";

const NextTrack = ({onClick}) => {
const {player} = useContext(PlayerContext);

return (
<FastForward onClick={onClick} className={player.changeSong ? "selected" : ""}>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path style={{ fill: 'currentColor', stroke: 'none' }} d="M43 0.464508C27.4095 3.27545 17.5784 16.3383 13.8951 31C7.54566 56.2741 12 87.0082 12 113L12 425C12 452.252 4.80733 507.06 44 511.816C48.7497 512.392 54.2652 512.382 59 511.7C72.8855 509.699 84.7838 500.756 96 493.025L144 460.025C205.307 417.77 266.443 375.233 328 333.344C353.95 315.685 396.324 296.042 397.961 260C399.724 221.154 363.307 203.887 336 184.576C269.27 137.386 200.729 92.765 134 45.5756C109.717 28.4033 75.3437 -5.367 43 0.464508z" />
        <path style={{ fill: 'currentColor', stroke: 'none' }} d="M453 0.529327C439.625 3.5997 432.85 15.2754 431.286 28C427.708 57.1187 431 88.6474 431 118L431 426C431 456.924 420.056 512 465 512C469.884 512 475.21 512.576 480 511.471C490.345 509.083 498.543 499.458 499.816 489C503.591 457.968 500 424.281 500 393L500 86C500 55.473 512.05 0 468 0C463.113 0 457.793 -0.571045 453 0.529327z" />
      </svg>
</FastForward>
)
}
export default NextTrack