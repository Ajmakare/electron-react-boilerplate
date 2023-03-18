import React from 'react';
import { GrNext, GrPrevious, GrPause } from "react-icons/gr";
import '../renderer/App.css';

// https://react-icons.github.io/react-icons/icons?name=gr

interface Props{
    name: string;
}

const size = '75px'


const Controls: React.FC<Props> = ({ name }) => {
    return (
        <div id = "controlsContainer">
            <GrPrevious size = {size}/>
            <GrPause size = {size}/>
            <GrNext size = {size}/>
        </div>
    );
}

export default Controls;