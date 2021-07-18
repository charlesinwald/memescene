import React from "react";

function SelectedMeme(props: { selectedMeme: any, reset: () => void }) {
    return <div>
        <img src={props.selectedMeme.url} alt={props.selectedMeme.name} className={"selected-meme-image"}/>
        <form className="text-form">
            <label>Top Text</label>
            <input type="text"/>
            <br/>
            <label>Bottom Text</label>
            <input type="text"/>
        </form>
        <button onClick={props.reset}>Reset</button>
    </div>;
}

export default SelectedMeme;
