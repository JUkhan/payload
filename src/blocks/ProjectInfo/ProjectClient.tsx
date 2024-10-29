import React from 'react';

interface ProjectClientProps {
  color?:string// Add props type definitions here
}

const ProjectClient: React.FC<ProjectClientProps> = ({color='#ff9a2d'}) => {
  return (
    <svg width={45} height={45} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
      <path style={{fill:color}} d="M.02687,23.81725V21.18567a3.73417,3.73417,0,0,0,.076-.42084,21.75789,21.75789,0,0,1,.87557-4.72724A22.44014,22.44014,0,1,1,43.59393,30.06467C40.61141,38.12638,34.72209,42.965,26.26459,44.62058c-.81277.1591-1.64344.22686-2.46579.337H21.16722c-.28743-.03388-.57458-.07036-.86233-.10126A22.16,22.16,0,0,1,7.83258,39.5037,21.99236,21.99236,0,0,1,.36173,26.28059C.22159,25.46437.1371,24.6386.02687,23.81725Zm7.52156-13.938c-2.293,2.16926-4.86356,8.482-4.53939,11.165H9.53649c.01532-.18611.03386-.34311.04035-.50061a36.09466,36.09466,0,0,1,1.01625-7.09506c.08971-.36716.33931-.78946.2325-1.08373-.10522-.28984-.5694-.44936-.876-.66614-.08344-.059-.1685-.11587-.24974-.17777Q8.62354,10.70084,7.54843,9.87921ZM7.48984,35.11C8.59876,34.31991,9.66,33.575,10.70152,32.80337a.54871.54871,0,0,0,.09324-.47262,35.06764,35.06764,0,0,1-1.21309-7.944c-.01294-.352-.11094-.47176-.47891-.46828-1.91318.01808-3.82661.00794-5.73995.00951-.12613.0001-.25225.01576-.41428.02658A19.40792,19.40792,0,0,0,7.48984,35.11ZM37.44489,9.88542,34.1004,12.36094a.24129.24129,0,0,0,.00507.0843,35.20816,35.20816,0,0,1,1.28454,8.285c.01193.35091.20088.34921.45562.34853,1.91337-.0051,3.82675-.00234,5.74013-.00374.12763-.00009.25525-.01414.37865-.02144C42.19341,18.14347,39.9245,12.55248,37.44489,9.88542ZM37.44357,35.114c2.41813-2.51534,4.63752-7.9583,4.53193-11.16319-.12323-.00782-.25-.02277-.37689-.02287-1.91327-.00149-3.82664.009-5.73973-.00967-.37311-.00364-.44862.12885-.4782.47187-.124,1.43835-.23214,2.88144-.44678,4.30763-.20121,1.33691-.52928,2.65474-.79926,3.97ZM13.50537,13.74709a27.91772,27.91772,0,0,0-1.04012,7.2942h8.568v-5.486c-1.29665-.2247-2.57431-.38061-3.81746-.67986C15.96175,14.57355,14.742,14.12944,13.50537,13.74709Zm7.53119,10.20413H12.4082a33.48662,33.48662,0,0,0,1.09311,7.39569,22.86934,22.86934,0,0,1,7.53525-1.81973Zm11.51759-2.90273a33.19266,33.19266,0,0,0-1.0904-7.393,22.77351,22.77351,0,0,1-7.53035,1.82085v5.57218Zm-8.61758,2.90094v5.586A22.70966,22.70966,0,0,1,31.46962,31.34a33.1365,33.1365,0,0,0,1.07979-7.39053ZM30.5931,34.1278A16.74346,16.74346,0,0,0,23.932,32.47585v9.44922C27.57507,40.47523,29.145,37.37573,30.5931,34.1278Zm-.01063-23.25046c-.25183-.56478-.4773-1.11814-.74079-1.65276A13.95623,13.95623,0,0,0,26.21292,4.3493a6.02709,6.02709,0,0,0-2.27629-1.20755v9.42132A17.86423,17.86423,0,0,0,30.58247,10.87734Zm-9.54831,1.72279V3.08143c-3.65064,1.44458-5.21511,4.54935-6.67125,7.81569A19.45379,19.45379,0,0,0,21.03416,12.60013ZM14.353,34.10823c.3793.79979.71472,1.57471,1.10669,2.31987A12.62361,12.62361,0,0,0,19.029,40.86294a5.71729,5.71729,0,0,0,1.99334.99567V32.40383A19.48772,19.48772,0,0,0,14.353,34.10823ZM30.576,4.67531l2.642,4.81655,2.18928-1.66767A17.52929,17.52929,0,0,0,30.576,4.67531Zm-.01723,35.67791a19.12735,19.12735,0,0,0,4.87339-3.16077L33.218,35.51138ZM11.74621,9.49036l2.6579-4.83729a18.94647,18.94647,0,0,0-4.86674,3.157Zm-2.212,27.701a19.00658,19.00658,0,0,0,4.86792,3.15583L11.748,35.51224Z"/>
    </svg>
    )
};

export default ProjectClient;

