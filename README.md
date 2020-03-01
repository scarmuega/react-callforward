[![npm version](https://img.shields.io/npm/v/react-callforward.svg)](https://www.npmjs.com/package/react-callforward) [![license](https://img.shields.io/npm/l/react-component-pack.svg?color=blue)](./LICENSE)

react-callforward 
=================

We all know about callbacks in react, they provide a way for a parent component to provide the implementation of a function that is triggered by a nested component. What happens when you need the opposite? How do you trigger a command that is implemented in a nested component?

Problem
-------
For example, lets say that you have the following app that displays a video:

```
+----------------------------------------------------+
|Root                                                |
|                                                    |
| +------------+ +---------------------------------+ |
| |Sidebar     | | Content                         | |
| |            | |                                 | |
| |            | |  +---------------------------+  | |
| |  +------+  | |  |                           |  | |
| |  |play  |  | |  |       video player        |  | |
| |  |button|  | |  |                           |  | |
| |  +------+  | |  |                           |  | |
| |            | |  +---------------------------+  | |
| |            | |                                 | |
| +------------+ +---------------------------------+ |
+----------------------------------------------------+
```

The `Sidebar` and the `Content` components are independent, they are oblivious of the existence of each other. The sidebar has a "play" button that needs to trigger the `video.play()` method that exists within the scope of the `Content` component. How would you solve that?

- **alternative #1, using state**: The `Root` component has an `isPlaying` flag in the state, listens to the click callback of the play button and then propagates the state down to the nested `Content` component using props. The `Content` component would compare changes in the props and call the `play()` method accordingly. It works, but you loose the "imperative" nature of just calling a function; and you'll trigger an, otherwise unnecessary, render of the `Root` component.
- **alternative #2, using refs**: The `Content` component bubbles up a ref of the video player onto the `Root` component. The `Root` component creates an `onClick` handler that triggers the `play()` inside the ref and then it passes the handler into the `onClick` callback of the `Sidebar` component. It also works, but bubbling things up goes against the "composite" nature of our react components.

If you're happy with either of the above solutions, close this README and stop procrastinating, your app won't write itself.

Solution
--------

The basic idea of a `callforward`  is to divide a method call into two parts: the _trigger_ and the _placeholder_. The trigger is just a proxy of the actual method call. The placeholder is an empty wrapper that needs to be "implemented" by some other child component.

Take the above video app example, this is how you would solve the problem using a `callforward`:

```jsx
function Root() {
    const [onPlay, doPlay] = useCallForward();

    return (
        <div>
            <Sidebar onClick={onPlay} />
            <Content doPlay={doPlay} />
        </div>
    )
}

function Sidebar({ onClick }) {
    return <button onClick={onClick}>play</button>
}

function Content({ doPlay }) {
    const videoEl = useRef();

    useCallHolder(() => {
        videoEl.current.play();
    }, doPlay);

    return <video ref={videoEl} />
}
```

The above example has been simplified for brevity. To see a running example, check the following codesandbox:

[![Edit call-forward-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/call-forward-example-upqk5?fontsize=14&hidenavigation=1&theme=dark)

Potential
---------
I imagine several use cases where components could be stripped away of opinionated control UI (buttons, inputs, etc), but still provide the "logic" to execute such actions:

- a simple "video" component providing play, pause, scrubbing methods
- any type of "data list" component providing a "refresh" method
- dialogs and popup components providing an imperative "open" / "close" method (thus, hiding the open/close state within the component itself)
- long text components providing "scrolling" (eg: "go to top") methods

Installation
------------

to install the library, do as usual:

```
npm install --save react-callforward
```
