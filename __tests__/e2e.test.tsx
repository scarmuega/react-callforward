import React, { useState } from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react'
import { useCallForward, useCallHolder, CallHolder } from '../';

interface SidebarProps {
    onClick: () => void;
}

function Sidebar(props: SidebarProps) {
    return <button onClick={props.onClick}>play</button>
}

interface ContentProps {
    doPlay: CallHolder<()=>void>;
}

function Content(props: ContentProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    useCallHolder(() => {
        setIsPlaying(true);
    }, props.doPlay);

    return isPlaying ? <div>playing video</div> : <div>stopped video</div>;
}

function Root() {
    const [onPlay, doPlay] = useCallForward<()=>void>([]);

    return (
        <>
            <Sidebar onClick={onPlay} />
            <Content doPlay={doPlay} />
        </>
    )
}

test("click on sidebar triggers content play method", async () => {
    const rendered = render(<Root />);
    const button = rendered.getByText("play");
    fireEvent.click(button);
    await waitForElement(() => rendered.getByText("playing video"));
});